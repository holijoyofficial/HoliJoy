-- Security hardening after the Supabase advisor run on the initial schema.
-- 1. Helper and trigger functions move to a "private" schema that is not
--    exposed through the REST API. Policies and triggers keep working because
--    Postgres references functions by id, not by name.
-- 2. Every function gets a fixed search_path.
-- submit_review stays in public on purpose: guests call it without logging in.

create schema if not exists private;
grant usage on schema private to anon, authenticated, service_role;

alter function public.is_admin() set schema private;
alter function public.is_super_admin() set schema private;
alter function public.is_hotel_member(uuid) set schema private;
alter function public.is_approved_hotel_staff() set schema private;
alter function public.is_animator() set schema private;
alter function public.refresh_animator_score(uuid) set schema private;
alter function public.reviews_refresh_score() set schema private;
alter function public.handle_new_user() set schema private;
alter function public.protect_profile_columns() set schema private;
alter function public.protect_animator_columns() set schema private;
alter function public.protect_hotel_columns() set schema private;
alter function public.protect_review_columns() set schema private;
alter function public.set_updated_at() set schema private;
alter function public.slugify(text) set schema private;
alter function public.random_code(int) set schema private;

-- Bodies that call other helpers by name must point at the new schema
create or replace function private.protect_profile_columns()
returns trigger language plpgsql set search_path = '' as $$
begin
  if (new.role is distinct from old.role or new.banned_at is distinct from old.banned_at)
     and coalesce(auth.role(), '') <> 'service_role'
     and not private.is_super_admin() then
    raise exception 'Not allowed to change role or ban state';
  end if;
  return new;
end $$;

create or replace function private.protect_animator_columns()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.qr_code is distinct from old.qr_code then
    raise exception 'The QR code of an animator can never change';
  end if;
  if (new.boost_until is distinct from old.boost_until or new.profile_id is distinct from old.profile_id)
     and coalesce(auth.role(), '') <> 'service_role'
     and not private.is_admin() then
    raise exception 'Not allowed to change boost or owner';
  end if;
  return new;
end $$;

create or replace function private.protect_hotel_columns()
returns trigger language plpgsql set search_path = '' as $$
begin
  if (new.verification_status is distinct from old.verification_status
      or new.featured_until is distinct from old.featured_until)
     and coalesce(auth.role(), '') <> 'service_role'
     and not private.is_admin() then
    raise exception 'Not allowed to change verification or featured state';
  end if;
  return new;
end $$;

create or replace function private.protect_review_columns()
returns trigger language plpgsql set search_path = '' as $$
begin
  if coalesce(auth.role(), '') = 'service_role' or private.is_admin() then
    return new;
  end if;
  if new.reply_body is distinct from old.reply_body and old.reply_body is not null then
    raise exception 'A review can only be replied to once';
  end if;
  if row(new.animator_id, new.hotel_id, new.guest_first_name, new.guest_last_initial,
         new.guest_country, new.rating, new.body, new.source, new.locale, new.status)
     is distinct from
     row(old.animator_id, old.hotel_id, old.guest_first_name, old.guest_last_initial,
         old.guest_country, old.rating, old.body, old.source, old.locale, old.status) then
    raise exception 'Only the reply can be changed';
  end if;
  new.reply_at = now();
  return new;
end $$;

create or replace function private.reviews_refresh_score()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'DELETE' then
    perform private.refresh_animator_score(old.animator_id);
    return old;
  end if;
  perform private.refresh_animator_score(new.animator_id);
  if tg_op = 'UPDATE' and new.animator_id <> old.animator_id then
    perform private.refresh_animator_score(old.animator_id);
  end if;
  return new;
end $$;

create or replace function private.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  v_role public.user_role;
  v_name text := coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), split_part(new.email, '@', 1));
  v_locale public.app_locale;
  v_slug text;
  v_animator uuid;
begin
  v_role := case when new.raw_user_meta_data ->> 'role' = 'hotel_staff' then 'hotel_staff' else 'animator' end;
  v_locale := case when new.raw_user_meta_data ->> 'locale' in ('tr', 'en', 'ru')
                   then (new.raw_user_meta_data ->> 'locale')::public.app_locale else 'tr' end;

  insert into public.profiles (id, role, display_name, locale)
  values (new.id, v_role, v_name, v_locale);

  if v_role = 'animator' then
    v_slug := private.slugify(v_name);
    while exists (select 1 from public.animators where slug = v_slug) loop
      v_slug := private.slugify(v_name) || '-' || private.random_code(4);
    end loop;
    insert into public.animators (profile_id, slug) values (new.id, v_slug)
    returning id into v_animator;
    insert into public.animator_private (animator_id) values (v_animator);
    insert into public.animator_scores (animator_id) values (v_animator);
  end if;

  return new;
end $$;

alter function private.set_updated_at() set search_path = '';
alter function private.slugify(text) set search_path = '';
alter function private.random_code(int) set search_path = '';

-- animators.qr_code default must use the moved function
alter table public.animators alter column qr_code set default private.random_code(10);

-- Only RLS helpers need to be callable by API roles
revoke all on all functions in schema private from public, anon, authenticated;
grant execute on function private.is_admin() to anon, authenticated;
grant execute on function private.is_super_admin() to anon, authenticated;
grant execute on function private.is_hotel_member(uuid) to anon, authenticated;
grant execute on function private.is_approved_hotel_staff() to anon, authenticated;
grant execute on function private.is_animator() to anon, authenticated;
-- Trigger helpers run inside table writes made by these roles
grant execute on function private.set_updated_at() to anon, authenticated;
grant execute on function private.protect_profile_columns() to authenticated;
grant execute on function private.protect_animator_columns() to authenticated;
grant execute on function private.protect_hotel_columns() to authenticated;
grant execute on function private.protect_review_columns() to authenticated;
grant execute on function private.random_code(int) to authenticated;

-- submit_review referenced the old random_code/refresh paths only indirectly;
-- recreate it with an explicit search_path for clarity.
alter function public.submit_review(uuid, text, text, text, text, int, text, text, public.app_locale, int)
  set search_path = '';
