# 06 · Data Model

Postgres (Supabase). Every table has `id uuid pk default gen_random_uuid()`, `created_at`, `updated_at` (not repeated below). **RLS is enabled on every table.**

## Enums
```sql
user_role         : 'animator' | 'hotel_staff' | 'guest' | 'moderator' | 'super_admin'
verification_status: 'unverified' | 'pending' | 'approved' | 'rejected'
employment_status : 'pending' | 'active' | 'rejected' | 'ended'
review_type       : 'guest' | 'hotel'
review_verification: 'full' | 'partial' | 'none'
content_status    : 'visible' | 'hidden' | 'removed'
request_status    : 'pending' | 'accepted' | 'declined' | 'expired'
media_kind        : 'photo' | 'video'
branch            : 'chief' | 'mini_club' | 'show' | 'dance' | 'fitness' | 'sports' | 'dj' | 'theatre' | 'host' | 'tech'
lang_level        : 'basic' | 'good' | 'fluent'
```

## Tables

### profiles (1–1 with auth.users)
`user_id (fk auth.users)`, `role user_role`, `display_name`, `locale ('tr'|'en')`, `avatar_url`, `banned_at`

### animators
`profile_id (fk, unique)`, `slug (unique)`, `bio`, `birth_year`, `city`, `branches branch[]`, `languages jsonb` ([{code, level}]), `experience_years`, `available_from`, `available_to`, `seeking_job bool`, `instagram_url`, `tiktok_url`, `phone`, `boost_until timestamptz`, `showreel_media_id`

### hotels
`slug (unique)`, `name`, `stars`, `concepts text[]`, `region_id (fk regions)`, `address`, `lat`, `lng` (map display only), `website_url`, `booking_url`, `program jsonb`, `perks jsonb` (accommodation, meals, insurance), `hiring jsonb` ("we're hiring": [{branch, count, from, to}]), `tax_no`, `verification_status`, `featured_until`

### regions
`slug`, `name_tr`, `name_en`, `city` — Belek, Side, Kemer, Bodrum, Marmaris, Kuşadası…

### hotel_members
`hotel_id`, `profile_id`, `role ('owner'|'staff')` — unique(hotel_id, profile_id)

### employments
`animator_id`, `hotel_id`, `season (int, e.g. 2027)`, `role branch`, `start_date`, `end_date`, `status employment_status`, `decided_by`, `decided_at`
- Constraint: one `active` per animator (partial unique index)

### reviews
`type review_type`, `animator_id`, `author_profile_id`, `hotel_id`, `employment_id (nullable)`, `rating numeric(2,1)`, `criteria jsonb` (hotel only: punctuality, performance, communication, language, teamwork), `body text`, `verification review_verification`, `via_qr bool`, `active_employment_ok bool`, `weight numeric`, `status content_status`, `reply_body`, `reply_at`
- Constraint (guest): one review per author + animator within 30 days (trigger)
- Constraint (hotel): unique(employment_id) where type='hotel'

### animator_scores (cache)
`animator_id (pk)`, `guest_score`, `guest_count`, `guest_verified_count`, `hotel_score`, `hotel_count`, `ranking_score`, `updated_at` — updated by a reviews trigger

### qr_tokens
`animator_id`, `token (unique, HMAC-signed)`, `expires_at` (60 s after creation) — the animator's "My QR" screen creates a new one when it expires; old tokens are cleaned up by a scheduled job. Hotels have no QR.

### follows
`follower_profile_id`, `animator_id` — unique pair

### media
`animator_id`, `kind media_kind`, `r2_key`, `width`, `height`, `duration_s`, `position`, `status ('uploading'|'ready'|'hidden')`

### contact_requests
`from_profile_id`, `to_profile_id`, `hotel_id (null)`, `animator_id`, `note`, `status request_status`, `responded_at`
### messages
`request_id`, `sender_profile_id`, `body`, `read_at`

### notifications
`profile_id`, `type`, `payload jsonb`, `read_at`, `emailed_at`

### boosts
`animator_id`, `starts_at`, `ends_at`, `source ('payment'|'campaign'|'admin')`, `payment_id`
### payments
`profile_id`, `product ('boost_month'|'boost_season'|'hotel_featured')`, `amount`, `currency`, `iyzico_payment_id (unique)`, `status`, `raw jsonb`

### verifications
`subject_type ('hotel'|'animator_account'|'employment_dispute')`, `subject_id`, `files text[]` (private storage paths), `status verification_status`, `reviewed_by`, `reviewed_at`, `reason`, `files_deleted_at`

### reports
`reporter_profile_id`, `target_type`, `target_id`, `reason`, `status ('open'|'resolved')`, `resolved_by`

### audit_log (insert only)
`actor_profile_id`, `action`, `target_type`, `target_id`, `reason`, `meta jsonb`

### outbound_clicks
`hotel_id`, `source ('hotel_page'|'animator_page')`, `session_hash` — booking click report

## RLS summary

| Table | Read | Write |
|---|---|---|
| animators, hotels (approved), media (ready), reviews (visible), animator_scores | Everyone | Owner (animator / hotel member) |
| animators.phone, contact fields | Owner + other side of an accepted request (via view/function) | Owner |
| employments | Everyone (active/ended), the parties (pending) | Animator creates; only a member of the hotel changes status |
| reviews | Everyone (visible) | Server Action (weight calculated on the server) |
| contact_requests, messages | The two parties only | The two parties only |
| follows, notifications | Owner | Owner |
| verifications, reports, payments | Owner (own rows), admin | Server Action / admin |
| audit_log | Admin | Insert only (service role) |
| Storage `private-docs` bucket (hotel authorization docs only) | Admin only, via signed URL | Hotel staff uploads |

Admin rights via `profiles.role in ('moderator','super_admin')`; moderators cannot do revenue or ban actions.
