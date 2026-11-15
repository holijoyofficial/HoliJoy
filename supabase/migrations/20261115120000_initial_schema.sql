-- HoliJoy initial schema (spec v2, docs/06-data-model.md)
-- Guests have no accounts; reviews are submitted through submit_review().
-- RLS is enabled on every table. Private fields (phones, tax number,
-- reviewer email) live in separate *_private tables with stricter policies.

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type public.user_role as enum ('animator', 'hotel_staff', 'moderator', 'super_admin');
create type public.app_locale as enum ('tr', 'en', 'ru');
create type public.verification_status as enum ('unverified', 'pending', 'approved', 'rejected');
create type public.employment_status as enum ('pending', 'active', 'rejected', 'ended');
create type public.content_status as enum ('visible', 'hidden', 'removed');
create type public.media_kind as enum ('photo', 'video');
create type public.branch as enum ('chief', 'mini_club', 'show', 'dance', 'fitness', 'sports', 'dj', 'theatre', 'host', 'tech');

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- Turns "Ayşe Çelik" into "ayse-celik"
create or replace function public.slugify(value text)
returns text language sql immutable as $$
  select coalesce(nullif(trim(both '-' from regexp_replace(
    lower(translate(value, 'ÇĞİIÖŞÜçğıöşüÂâÎîÛû', 'cgiiosucgiosuaaiiuu')),
    '[^a-z0-9]+', '-', 'g')), ''), 'animator');
$$;

-- Short random code for permanent QR links: 10 chars, no look-alikes
create or replace function public.random_code(len int default 10)
returns text language sql volatile as $$
  select string_agg(substr('abcdefghjkmnpqrstuvwxyz23456789', 1 + (get_byte(b, i) % 31), 1), '')
  from (select extensions.gen_random_bytes(len) as b) r, generate_series(0, len - 1) as i;
$$;

-- ---------------------------------------------------------------------------
-- Profiles (animators, hotel staff, admins — never guests)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null default 'animator',
  display_name text not null default '',
  locale public.app_locale not null default 'tr',
  avatar_url text,
  banned_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('moderator', 'super_admin') and banned_at is null
  );
$$;

create or replace function public.is_super_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'super_admin' and banned_at is null
  );
$$;

-- Users may edit their name/locale/avatar but never their role or ban state
create or replace function public.protect_profile_columns()
returns trigger language plpgsql as $$
begin
  if (new.role is distinct from old.role or new.banned_at is distinct from old.banned_at)
     and coalesce(auth.role(), '') <> 'service_role'
     and not public.is_super_admin() then
    raise exception 'Not allowed to change role or ban state';
  end if;
  return new;
end $$;
create trigger profiles_protect before update on public.profiles
  for each row execute function public.protect_profile_columns();

-- ---------------------------------------------------------------------------
-- Regions
-- ---------------------------------------------------------------------------
create table public.regions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_tr text not null,
  name_en text not null,
  name_ru text not null,
  city text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.regions (slug, name_tr, name_en, name_ru, city) values
  ('belek', 'Belek', 'Belek', 'Белек', 'Antalya'),
  ('side', 'Side', 'Side', 'Сиде', 'Antalya'),
  ('kemer', 'Kemer', 'Kemer', 'Кемер', 'Antalya'),
  ('lara', 'Lara', 'Lara', 'Лара', 'Antalya'),
  ('alanya', 'Alanya', 'Alanya', 'Аланья', 'Antalya'),
  ('bodrum', 'Bodrum', 'Bodrum', 'Бодрум', 'Muğla'),
  ('marmaris', 'Marmaris', 'Marmaris', 'Мармарис', 'Muğla'),
  ('fethiye', 'Fethiye', 'Fethiye', 'Фетхие', 'Muğla'),
  ('kusadasi', 'Kuşadası', 'Kusadasi', 'Кушадасы', 'Aydın'),
  ('cesme', 'Çeşme', 'Cesme', 'Чешме', 'İzmir');

-- ---------------------------------------------------------------------------
-- Animators
-- ---------------------------------------------------------------------------
create table public.animators (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles (id) on delete cascade,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  qr_code text not null unique default public.random_code(10),
  bio text check (char_length(bio) <= 1500),
  birth_year int check (birth_year between 1950 and 2015),
  city text,
  branches public.branch[] not null default '{}',
  languages jsonb not null default '[]'::jsonb,
  experience_years int check (experience_years between 0 and 60),
  available_from date,
  available_to date,
  seeking_job boolean not null default false,
  instagram_url text,
  tiktok_url text,
  boost_until timestamptz,
  showreel_media_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger animators_updated_at before update on public.animators
  for each row execute function public.set_updated_at();

-- QR code is permanent; boosts are set by admins only
create or replace function public.protect_animator_columns()
returns trigger language plpgsql as $$
begin
  if new.qr_code is distinct from old.qr_code then
    raise exception 'The QR code of an animator can never change';
  end if;
  if (new.boost_until is distinct from old.boost_until or new.profile_id is distinct from old.profile_id)
     and coalesce(auth.role(), '') <> 'service_role'
     and not public.is_admin() then
    raise exception 'Not allowed to change boost or owner';
  end if;
  return new;
end $$;
create trigger animators_protect before update on public.animators
  for each row execute function public.protect_animator_columns();

-- Contact details: visible to the owner and to members of approved hotels
create table public.animator_private (
  animator_id uuid primary key references public.animators (id) on delete cascade,
  whatsapp_phone text check (whatsapp_phone ~ '^\+[1-9][0-9]{7,14}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger animator_private_updated_at before update on public.animator_private
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Hotels
-- ---------------------------------------------------------------------------
create table public.hotels (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  stars int check (stars between 1 and 5),
  concepts text[] not null default '{}',
  region_id uuid references public.regions (id),
  address text,
  lat double precision,
  lng double precision,
  website_url text,
  booking_url text,
  program jsonb not null default '{}'::jsonb,
  perks jsonb not null default '{}'::jsonb,
  hiring jsonb not null default '[]'::jsonb,
  verification_status public.verification_status not null default 'pending',
  featured_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger hotels_updated_at before update on public.hotels
  for each row execute function public.set_updated_at();

create table public.hotel_private (
  hotel_id uuid primary key references public.hotels (id) on delete cascade,
  whatsapp_phone text check (whatsapp_phone ~ '^\+[1-9][0-9]{7,14}$'),
  tax_no text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger hotel_private_updated_at before update on public.hotel_private
  for each row execute function public.set_updated_at();

create table public.hotel_members (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  role text not null default 'staff' check (role in ('owner', 'staff')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (hotel_id, profile_id)
);

-- Verification and featured state are admin decisions
create or replace function public.protect_hotel_columns()
returns trigger language plpgsql as $$
begin
  if (new.verification_status is distinct from old.verification_status
      or new.featured_until is distinct from old.featured_until)
     and coalesce(auth.role(), '') <> 'service_role'
     and not public.is_admin() then
    raise exception 'Not allowed to change verification or featured state';
  end if;
  return new;
end $$;
create trigger hotels_protect before update on public.hotels
  for each row execute function public.protect_hotel_columns();

create or replace function public.is_hotel_member(target_hotel uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.hotel_members
    where hotel_id = target_hotel and profile_id = auth.uid()
  );
$$;

create or replace function public.is_approved_hotel_staff()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.hotel_members m
    join public.hotels h on h.id = m.hotel_id
    where m.profile_id = auth.uid() and h.verification_status = 'approved'
  );
$$;

create or replace function public.is_animator()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.animators where profile_id = auth.uid());
$$;

-- ---------------------------------------------------------------------------
-- Employments
-- ---------------------------------------------------------------------------
create table public.employments (
  id uuid primary key default gen_random_uuid(),
  animator_id uuid not null references public.animators (id) on delete cascade,
  hotel_id uuid not null references public.hotels (id) on delete cascade,
  season int not null check (season between 2020 and 2100),
  role public.branch not null,
  start_date date,
  end_date date,
  status public.employment_status not null default 'pending',
  decided_by uuid references public.profiles (id),
  decided_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index employments_one_active_per_animator
  on public.employments (animator_id) where status = 'active';
create trigger employments_updated_at before update on public.employments
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Reviews (guests, no login) — submitted only through submit_review()
-- ---------------------------------------------------------------------------
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  animator_id uuid not null references public.animators (id) on delete cascade,
  hotel_id uuid references public.hotels (id) on delete set null,
  guest_first_name text not null check (char_length(guest_first_name) between 1 and 60),
  guest_last_initial text not null check (char_length(guest_last_initial) between 1 and 2),
  guest_country text not null check (guest_country ~ '^[A-Z]{2}$'),
  rating smallint not null check (rating between 1 and 5),
  body text not null default '' check (char_length(body) <= 1000),
  source text not null default 'profile' check (source in ('qr', 'profile')),
  locale public.app_locale not null default 'tr',
  status public.content_status not null default 'visible',
  reply_body text check (char_length(reply_body) <= 1000),
  reply_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index reviews_animator_idx on public.reviews (animator_id, created_at desc);
create trigger reviews_updated_at before update on public.reviews
  for each row execute function public.set_updated_at();

-- Reviewer email and full last name: admins only, never public
create table public.review_private (
  review_id uuid primary key references public.reviews (id) on delete cascade,
  guest_email text not null,
  guest_last_name text not null check (char_length(guest_last_name) between 1 and 60),
  created_at timestamptz not null default now()
);
create index review_private_email_idx on public.review_private (lower(guest_email));

-- Animators may only write their reply; moderation fields are admin-only
create or replace function public.protect_review_columns()
returns trigger language plpgsql as $$
begin
  if coalesce(auth.role(), '') = 'service_role' or public.is_admin() then
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
create trigger reviews_protect before update on public.reviews
  for each row execute function public.protect_review_columns();

-- Cached score per animator (plain average, no weighting)
create table public.animator_scores (
  animator_id uuid primary key references public.animators (id) on delete cascade,
  rating_avg numeric(3, 2),
  rating_count int not null default 0,
  ranking_score numeric(6, 4),
  updated_at timestamptz not null default now()
);

create or replace function public.refresh_animator_score(target uuid)
returns void language sql security definer set search_path = '' as $$
  insert into public.animator_scores (animator_id, rating_avg, rating_count, updated_at)
  select target, avg(rating)::numeric(3, 2), count(*), now()
  from public.reviews where animator_id = target and status = 'visible'
  on conflict (animator_id) do update
    set rating_avg = excluded.rating_avg,
        rating_count = excluded.rating_count,
        updated_at = excluded.updated_at;
$$;

create or replace function public.reviews_refresh_score()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'DELETE' then
    perform public.refresh_animator_score(old.animator_id);
    return old;
  end if;
  perform public.refresh_animator_score(new.animator_id);
  if tg_op = 'UPDATE' and new.animator_id <> old.animator_id then
    perform public.refresh_animator_score(old.animator_id);
  end if;
  return new;
end $$;
create trigger reviews_score after insert or update or delete on public.reviews
  for each row execute function public.reviews_refresh_score();

-- The only way to create a review. Callable by anyone (anon included).
create or replace function public.submit_review(
  p_animator_id uuid,
  p_email text,
  p_first_name text,
  p_last_name text,
  p_country text,
  p_rating int,
  p_body text,
  p_source text default 'profile',
  p_locale public.app_locale default 'tr',
  p_cooldown_days int default 30
)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_email text := lower(trim(p_email));
  v_hotel uuid;
  v_review uuid;
begin
  if v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'invalid_email' using errcode = '22023';
  end if;
  if not exists (select 1 from public.animators where id = p_animator_id) then
    raise exception 'animator_not_found' using errcode = 'P0002';
  end if;
  if exists (
    select 1 from public.reviews r
    join public.review_private p on p.review_id = r.id
    where r.animator_id = p_animator_id
      and lower(p.guest_email) = v_email
      and r.created_at > now() - make_interval(days => greatest(p_cooldown_days, 0))
  ) then
    raise exception 'review_cooldown' using errcode = 'P0001';
  end if;

  select hotel_id into v_hotel from public.employments
  where animator_id = p_animator_id and status = 'active' limit 1;

  insert into public.reviews (animator_id, hotel_id, guest_first_name, guest_last_initial,
                              guest_country, rating, body, source, locale)
  values (p_animator_id, v_hotel, trim(p_first_name), upper(left(trim(p_last_name), 1)),
          upper(p_country), p_rating, coalesce(trim(p_body), ''),
          case when p_source = 'qr' then 'qr' else 'profile' end, p_locale)
  returning id into v_review;

  insert into public.review_private (review_id, guest_email, guest_last_name)
  values (v_review, v_email, trim(p_last_name));
  return v_review;
end $$;

-- ---------------------------------------------------------------------------
-- Media, clicks, notifications, boosts, verifications, reports, audit log
-- ---------------------------------------------------------------------------
create table public.media (
  id uuid primary key default gen_random_uuid(),
  animator_id uuid not null references public.animators (id) on delete cascade,
  kind public.media_kind not null,
  r2_key text not null,
  width int,
  height int,
  duration_s numeric,
  position int not null default 0,
  status text not null default 'uploading' check (status in ('uploading', 'ready', 'hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.animators
  add constraint animators_showreel_fk foreign key (showreel_media_id)
  references public.media (id) on delete set null;
create trigger media_updated_at before update on public.media
  for each row execute function public.set_updated_at();

create table public.contact_clicks (
  id uuid primary key default gen_random_uuid(),
  from_profile_id uuid references public.profiles (id) on delete set null,
  target_type text not null check (target_type in ('animator', 'hotel')),
  target_id uuid not null,
  channel text not null check (channel in ('whatsapp', 'call')),
  created_at timestamptz not null default now()
);

create table public.outbound_clicks (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels (id) on delete cascade,
  source text not null check (source in ('hotel_page', 'animator_page')),
  session_hash text,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  emailed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.boosts (
  id uuid primary key default gen_random_uuid(),
  animator_id uuid not null references public.animators (id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null check (ends_at > starts_at),
  source text not null check (source in ('bank_transfer', 'campaign', 'admin')),
  amount numeric(10, 2),
  currency text default 'TRY',
  payment_reference text,
  recorded_by uuid references public.profiles (id),
  note text,
  created_at timestamptz not null default now()
);

create table public.verifications (
  id uuid primary key default gen_random_uuid(),
  subject_type text not null check (subject_type in ('hotel', 'animator_account', 'employment_dispute')),
  subject_id uuid not null,
  submitted_by uuid references public.profiles (id) on delete set null,
  files text[] not null default '{}',
  status public.verification_status not null default 'pending',
  reviewed_by uuid references public.profiles (id),
  reviewed_at timestamptz,
  reason text,
  files_deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger verifications_updated_at before update on public.verifications
  for each row execute function public.set_updated_at();

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_profile_id uuid references public.profiles (id) on delete set null,
  target_type text not null check (target_type in ('review', 'media', 'animator', 'hotel')),
  target_id uuid not null,
  reason text not null check (char_length(reason) <= 1000),
  status text not null default 'open' check (status in ('open', 'resolved')),
  resolved_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger reports_updated_at before update on public.reports
  for each row execute function public.set_updated_at();

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_profile_id uuid references public.profiles (id) on delete set null,
  action text not null,
  target_type text,
  target_id uuid,
  reason text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- New user → profile (+ animator row). Role comes from sign-up metadata and
-- can only be animator or hotel_staff; admins are promoted manually.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
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
    v_slug := public.slugify(v_name);
    while exists (select 1 from public.animators where slug = v_slug) loop
      v_slug := public.slugify(v_name) || '-' || public.random_code(4);
    end loop;
    insert into public.animators (profile_id, slug) values (new.id, v_slug)
    returning id into v_animator;
    insert into public.animator_private (animator_id) values (v_animator);
    insert into public.animator_scores (animator_id) values (v_animator);
  end if;

  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.regions enable row level security;
alter table public.animators enable row level security;
alter table public.animator_private enable row level security;
alter table public.hotels enable row level security;
alter table public.hotel_private enable row level security;
alter table public.hotel_members enable row level security;
alter table public.employments enable row level security;
alter table public.reviews enable row level security;
alter table public.review_private enable row level security;
alter table public.animator_scores enable row level security;
alter table public.media enable row level security;
alter table public.contact_clicks enable row level security;
alter table public.outbound_clicks enable row level security;
alter table public.notifications enable row level security;
alter table public.boosts enable row level security;
alter table public.verifications enable row level security;
alter table public.reports enable row level security;
alter table public.audit_log enable row level security;

-- profiles: public display data; owner edits own row; admins manage
create policy "profiles are readable" on public.profiles for select using (true);
create policy "owner updates own profile" on public.profiles for update
  using (id = auth.uid()) with check (id = auth.uid());
create policy "admins update profiles" on public.profiles for update using (public.is_admin());

-- regions: read-only reference data
create policy "regions are readable" on public.regions for select using (true);
create policy "admins manage regions" on public.regions for all using (public.is_admin()) with check (public.is_admin());

-- animators: public profiles; owner edits
create policy "animators are readable" on public.animators for select using (true);
create policy "owner updates animator" on public.animators for update
  using (profile_id = auth.uid()) with check (profile_id = auth.uid());
create policy "admins manage animators" on public.animators for all using (public.is_admin()) with check (public.is_admin());

-- animator_private: owner, approved hotels, admins
create policy "owner reads animator contact" on public.animator_private for select using (
  exists (select 1 from public.animators a where a.id = animator_id and a.profile_id = auth.uid())
);
create policy "approved hotels read animator contact" on public.animator_private for select
  using (public.is_approved_hotel_staff());
create policy "owner updates animator contact" on public.animator_private for update using (
  exists (select 1 from public.animators a where a.id = animator_id and a.profile_id = auth.uid())
) with check (
  exists (select 1 from public.animators a where a.id = animator_id and a.profile_id = auth.uid())
);
create policy "admins manage animator contact" on public.animator_private for all
  using (public.is_admin()) with check (public.is_admin());

-- hotels: approved ones are public; members see and edit their own
create policy "approved hotels are readable" on public.hotels for select
  using (verification_status = 'approved' or public.is_hotel_member(id) or public.is_admin());
create policy "members update hotel" on public.hotels for update
  using (public.is_hotel_member(id)) with check (public.is_hotel_member(id));
create policy "admins manage hotels" on public.hotels for all using (public.is_admin()) with check (public.is_admin());

-- hotel_private: members, logged-in animators (phone), admins
create policy "members read hotel private" on public.hotel_private for select
  using (public.is_hotel_member(hotel_id));
create policy "animators read hotel contact" on public.hotel_private for select
  using (public.is_animator() and exists (
    select 1 from public.hotels h where h.id = hotel_id and h.verification_status = 'approved'));
create policy "members update hotel private" on public.hotel_private for update
  using (public.is_hotel_member(hotel_id)) with check (public.is_hotel_member(hotel_id));
create policy "admins manage hotel private" on public.hotel_private for all
  using (public.is_admin()) with check (public.is_admin());

-- hotel_members: members of the same hotel and admins
create policy "members read hotel members" on public.hotel_members for select
  using (public.is_hotel_member(hotel_id) or public.is_admin());
create policy "admins manage hotel members" on public.hotel_members for all
  using (public.is_admin()) with check (public.is_admin());

-- employments: confirmed ones are public; parties see pending
create policy "employments are readable" on public.employments for select using (
  status in ('active', 'ended')
  or public.is_hotel_member(hotel_id)
  or exists (select 1 from public.animators a where a.id = animator_id and a.profile_id = auth.uid())
  or public.is_admin()
);
create policy "animator declares employment" on public.employments for insert with check (
  status = 'pending'
  and exists (select 1 from public.animators a where a.id = animator_id and a.profile_id = auth.uid())
);
create policy "hotel decides employment" on public.employments for update
  using (public.is_hotel_member(hotel_id)) with check (public.is_hotel_member(hotel_id));
create policy "admins manage employments" on public.employments for all
  using (public.is_admin()) with check (public.is_admin());

-- reviews: visible ones are public (no email or full last name stored here); animator replies; admins moderate
create policy "visible reviews are readable" on public.reviews for select
  using (status = 'visible' or public.is_admin()
         or exists (select 1 from public.animators a where a.id = animator_id and a.profile_id = auth.uid()));
create policy "animator replies to review" on public.reviews for update using (
  exists (select 1 from public.animators a where a.id = animator_id and a.profile_id = auth.uid())
) with check (
  exists (select 1 from public.animators a where a.id = animator_id and a.profile_id = auth.uid())
);
create policy "admins manage reviews" on public.reviews for all using (public.is_admin()) with check (public.is_admin());

create policy "admins read reviewer emails" on public.review_private for select using (public.is_admin());

create policy "scores are readable" on public.animator_scores for select using (true);

-- media: ready media is public; owner manages
create policy "ready media is readable" on public.media for select using (
  status = 'ready' or public.is_admin()
  or exists (select 1 from public.animators a where a.id = animator_id and a.profile_id = auth.uid())
);
create policy "owner manages media" on public.media for all using (
  exists (select 1 from public.animators a where a.id = animator_id and a.profile_id = auth.uid())
) with check (
  exists (select 1 from public.animators a where a.id = animator_id and a.profile_id = auth.uid())
);
create policy "admins manage media" on public.media for all using (public.is_admin()) with check (public.is_admin());

-- clicks: written by server actions; readable by admins
create policy "logged-in users log contact clicks" on public.contact_clicks for insert
  with check (from_profile_id = auth.uid());
create policy "admins read contact clicks" on public.contact_clicks for select using (public.is_admin());
create policy "anyone logs booking clicks" on public.outbound_clicks for insert with check (true);
create policy "members and admins read booking clicks" on public.outbound_clicks for select
  using (public.is_hotel_member(hotel_id) or public.is_admin());

create policy "owner reads notifications" on public.notifications for select using (profile_id = auth.uid());

create policy "owner reads boosts" on public.boosts for select using (
  public.is_admin()
  or exists (select 1 from public.animators a where a.id = animator_id and a.profile_id = auth.uid())
);
create policy "super admins manage boosts" on public.boosts for all
  using (public.is_super_admin()) with check (public.is_super_admin());

create policy "submitter reads own verification" on public.verifications for select
  using (submitted_by = auth.uid() or public.is_admin());
create policy "admins manage verifications" on public.verifications for all
  using (public.is_admin()) with check (public.is_admin());

create policy "logged-in users report" on public.reports for insert
  with check (reporter_profile_id = auth.uid());
create policy "admins manage reports" on public.reports for all
  using (public.is_admin()) with check (public.is_admin());

create policy "admins read audit log" on public.audit_log for select using (public.is_admin());
create policy "admins append audit log" on public.audit_log for insert
  with check (public.is_admin() and actor_profile_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Function privileges
-- ---------------------------------------------------------------------------
revoke execute on function public.submit_review from public;
grant execute on function public.submit_review to anon, authenticated;
revoke execute on function public.refresh_animator_score from public, anon, authenticated;
revoke execute on function public.handle_new_user from public, anon, authenticated;
