# 06 · Data Model

Postgres (Supabase). Every table has `id uuid pk default gen_random_uuid()`, `created_at`, `updated_at` (not repeated below). **RLS is enabled on every table.**

Guests have no accounts: reviews store the guest's details directly.

## Enums
```sql
user_role          : 'animator' | 'hotel_staff' | 'moderator' | 'super_admin'
locale             : 'tr' | 'en' | 'ru'
verification_status: 'unverified' | 'pending' | 'approved' | 'rejected'
employment_status  : 'pending' | 'active' | 'rejected' | 'ended'
content_status     : 'visible' | 'hidden' | 'removed'
media_kind         : 'photo' | 'video'
branch             : 'chief' | 'mini_club' | 'show' | 'dance' | 'fitness' | 'sports' | 'dj' | 'theatre' | 'host' | 'tech'
lang_level         : 'basic' | 'good' | 'fluent'
```

## Tables

### profiles (1–1 with auth.users; animators, hotel staff and admins only)
`user_id (fk auth.users)`, `role user_role`, `display_name`, `locale locale`, `avatar_url`, `banned_at`

### animators
`profile_id (fk, unique)`, `slug (unique)`, `qr_code (unique, short random ID, set once, never changes)`, `bio`, `birth_year`, `city`, `branches branch[]`, `languages jsonb` ([{code, level}]), `experience_years`, `available_from`, `available_to`, `seeking_job bool`, `instagram_url`, `tiktok_url`, `whatsapp_phone` (E.164, e.g. +905…), `boost_until timestamptz`, `showreel_media_id`

### hotels
`slug (unique)`, `name`, `stars`, `concepts text[]`, `region_id (fk regions)`, `address`, `lat`, `lng` (map display only), `website_url`, `booking_url`, `whatsapp_phone`, `program jsonb`, `perks jsonb` (accommodation, meals, insurance), `hiring jsonb` ("we're hiring": [{branch, count, from, to}]), `tax_no`, `verification_status`, `featured_until`

### regions
`slug`, `name_tr`, `name_en`, `name_ru`, `city` — Belek, Side, Kemer, Bodrum, Marmaris, Kuşadası…

### hotel_members
`hotel_id`, `profile_id`, `role ('owner'|'staff')` — unique(hotel_id, profile_id)

### employments
`animator_id`, `hotel_id`, `season (int, e.g. 2027)`, `role branch`, `start_date`, `end_date`, `status employment_status`, `decided_by`, `decided_at`
- Constraint: one `active` per animator (partial unique index)

### reviews (guest reviews only)
`animator_id`, `hotel_id (null; the animator's active hotel at review time)`, `guest_email` (never public), `guest_first_name`, `guest_last_name`, `guest_country` (ISO 3166 alpha-2), `rating smallint (1–5)`, `body text`, `source ('qr'|'profile')` (stats only, no effect on score), `locale`, `status content_status`, `reply_body`, `reply_at`
- Constraint: one review per lower(guest_email) + animator within 30 days (trigger)
- Public reads go through a view that exposes first name, last-name initial and country only

### animator_scores (cache)
`animator_id (pk)`, `rating_avg`, `rating_count`, `ranking_score`, `updated_at` — updated by a reviews trigger

### media
`animator_id`, `kind media_kind`, `r2_key`, `width`, `height`, `duration_s`, `position`, `status ('uploading'|'ready'|'hidden')`

### contact_clicks
`from_profile_id`, `target_type ('animator'|'hotel')`, `target_id`, `channel ('whatsapp'|'call')` — contact stats and north-star metric

### notifications
`profile_id`, `type`, `payload jsonb`, `emailed_at` — log of emails sent

### boosts
`animator_id`, `starts_at`, `ends_at`, `source ('bank_transfer'|'campaign'|'admin')`, `amount`, `currency`, `payment_reference`, `recorded_by (admin profile)`, `note`

### verifications
`subject_type ('hotel'|'animator_account'|'employment_dispute')`, `subject_id`, `files text[]` (private storage paths), `status verification_status`, `reviewed_by`, `reviewed_at`, `reason`, `files_deleted_at`

### reports
`reporter_profile_id`, `target_type`, `target_id`, `reason`, `status ('open'|'resolved')`, `resolved_by`

### audit_log (insert only)
`actor_profile_id`, `action`, `target_type`, `target_id`, `reason`, `meta jsonb`

### outbound_clicks
`hotel_id`, `source ('hotel_page'|'animator_page')`, `session_hash` — booking click report

Removed after the 15 Nov 2026 revisions: `qr_tokens`, `contact_requests`, `messages`, `payments`, `follows` (guests have no accounts), hotel reviews, review weights and verification levels.

## RLS summary

| Table | Read | Write |
|---|---|---|
| animators, hotels (approved), media (ready), public reviews view (visible), animator_scores | Everyone | Owner (animator / hotel member) |
| animators.whatsapp_phone | Approved hotel members (via view/function) | Owner |
| hotels.whatsapp_phone | Logged-in animators (via view/function) | Hotel members |
| employments | Everyone (active/ended), the parties (pending) | Animator creates; only a member of the hotel changes status |
| reviews (full row incl. email) | Admin only | Insert via Server Action (no login); animator writes `reply_*` only |
| contact_clicks, outbound_clicks | Admin; owner sees own stats | Server Action |
| notifications | Owner | Server only |
| verifications, reports, boosts | Owner (own rows), admin | Server Action / admin |
| audit_log | Admin | Insert only (service role) |
| Storage `private-docs` bucket (hotel authorization docs only) | Admin only, via signed URL | Hotel staff uploads |

Admin rights via `profiles.role in ('moderator','super_admin')`; moderators cannot do revenue or ban actions.
