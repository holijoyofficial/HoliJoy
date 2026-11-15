-- Team decision (16 Nov 2026): hotel staff CAN rate animators again, but only
-- with a rating (1–5) and a comment — no extra criteria questions.
-- Kept as a separate score from the guest score (as in the first spec).
-- Rules: only for an employment the hotel confirmed (active or ended),
-- one review per employment (= one per animator per season at that hotel).

create table public.hotel_reviews (
  id uuid primary key default gen_random_uuid(),
  animator_id uuid not null references public.animators (id) on delete cascade,
  hotel_id uuid not null references public.hotels (id) on delete cascade,
  employment_id uuid not null unique references public.employments (id) on delete cascade,
  author_profile_id uuid references public.profiles (id) on delete set null,
  rating smallint not null check (rating between 1 and 5),
  body text not null default '' check (char_length(body) <= 1000),
  status public.content_status not null default 'visible',
  reply_body text check (char_length(reply_body) <= 1000),
  reply_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index hotel_reviews_animator_idx on public.hotel_reviews (animator_id, created_at desc);
create trigger hotel_reviews_updated_at before update on public.hotel_reviews
  for each row execute function private.set_updated_at();

-- The employment must belong to this hotel and animator and be confirmed
create or replace function private.check_hotel_review()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if not exists (
    select 1 from public.employments e
    where e.id = new.employment_id
      and e.hotel_id = new.hotel_id
      and e.animator_id = new.animator_id
      and e.status in ('active', 'ended')
  ) then
    raise exception 'hotel_review_requires_confirmed_employment' using errcode = 'P0001';
  end if;
  return new;
end $$;
create trigger hotel_reviews_check before insert or update of employment_id, hotel_id, animator_id
  on public.hotel_reviews for each row execute function private.check_hotel_review();

-- Authors may edit rating/body; animators may only reply, once; admins anything
create or replace function private.protect_hotel_review_columns()
returns trigger language plpgsql set search_path = '' as $$
begin
  if coalesce(auth.role(), '') = 'service_role' or private.is_admin() then
    return new;
  end if;
  if new.status is distinct from old.status then
    raise exception 'Only admins can moderate reviews';
  end if;
  if new.reply_body is distinct from old.reply_body then
    if old.reply_body is not null then
      raise exception 'A review can only be replied to once';
    end if;
    new.reply_at = now();
  end if;
  return new;
end $$;
create trigger hotel_reviews_protect before update on public.hotel_reviews
  for each row execute function private.protect_hotel_review_columns();

-- Separate hotel score next to the guest score
alter table public.animator_scores
  add column hotel_rating_avg numeric(3, 2),
  add column hotel_rating_count int not null default 0;

create or replace function private.refresh_hotel_score(target uuid)
returns void language sql security definer set search_path = '' as $$
  insert into public.animator_scores (animator_id, hotel_rating_avg, hotel_rating_count, updated_at)
  select target, avg(rating)::numeric(3, 2), count(*), now()
  from public.hotel_reviews where animator_id = target and status = 'visible'
  on conflict (animator_id) do update
    set hotel_rating_avg = excluded.hotel_rating_avg,
        hotel_rating_count = excluded.hotel_rating_count,
        updated_at = excluded.updated_at;
$$;

create or replace function private.hotel_reviews_refresh_score()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'DELETE' then
    perform private.refresh_hotel_score(old.animator_id);
    return old;
  end if;
  perform private.refresh_hotel_score(new.animator_id);
  if tg_op = 'UPDATE' and new.animator_id <> old.animator_id then
    perform private.refresh_hotel_score(old.animator_id);
  end if;
  return new;
end $$;
create trigger hotel_reviews_score after insert or update or delete on public.hotel_reviews
  for each row execute function private.hotel_reviews_refresh_score();

-- RLS
alter table public.hotel_reviews enable row level security;

create policy "visible hotel reviews are readable" on public.hotel_reviews for select using (
  status = 'visible'
  or private.is_admin()
  or private.is_hotel_member(hotel_id)
  or exists (select 1 from public.animators a where a.id = animator_id and a.profile_id = (select auth.uid()))
);
create policy "hotel members write a review" on public.hotel_reviews for insert with check (
  private.is_hotel_member(hotel_id) and author_profile_id = (select auth.uid()) and status = 'visible'
);
create policy "hotel members edit their review" on public.hotel_reviews for update
  using (private.is_hotel_member(hotel_id)) with check (private.is_hotel_member(hotel_id));
create policy "animator replies to hotel review" on public.hotel_reviews for update using (
  exists (select 1 from public.animators a where a.id = animator_id and a.profile_id = (select auth.uid()))
) with check (
  exists (select 1 from public.animators a where a.id = animator_id and a.profile_id = (select auth.uid()))
);
create policy "admins manage hotel reviews" on public.hotel_reviews for all
  using (private.is_admin()) with check (private.is_admin());

-- Function privileges (same pattern as the hardening migration)
revoke all on function private.check_hotel_review() from public, anon, authenticated;
revoke all on function private.refresh_hotel_score(uuid) from public, anon, authenticated;
revoke all on function private.hotel_reviews_refresh_score() from public, anon, authenticated;
revoke all on function private.protect_hotel_review_columns() from public, anon;
grant execute on function private.protect_hotel_review_columns() to authenticated;
