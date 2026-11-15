# 02 · Pages and Flows

All URLs start with a locale prefix: `/tr/...`, `/en/...` (Turkish is the default). The prefix is omitted below. Route names are always English; the page content is translated.

## Sitemap (MVP: 34 screens)

### Public
| Page | Route | Notes |
|---|---|---|
| Home | `/` | Search box, featured animators/hotels, how-it-works summary |
| Animators | `/animators` | Search + filters + sorting |
| Animator profile | `/animators/[slug]` | SSR, share image (OG) |
| Hotels | `/hotels` | Search + filters; "hotels that are hiring" filter |
| Hotel profile | `/hotels/[slug]` | SSR, animation score, team, "Book now" |
| Region rankings | `/regions/[slug]` | "Best animation teams in Belek" (SEO) |
| How it works | `/how-it-works` | Separate explanation for each of the three audiences |
| Boost and pricing | `/pricing` | |
| QR review page | `/r/[token]` | The animator's QR opens here; mobile-first, review in 30 seconds |
| Login / sign-up | `/login`, `/signup` | Role is chosen at sign-up |
| Legal | `/privacy` (KVKK), `/terms`, `/cookies` | |

### Animator dashboard (`/dashboard/animator/...`)
Edit profile · Media gallery · Work history · Requests and messages · Reviews and replies · Boost and stats · My QR (ask for a review; full screen on the phone, code refreshes every 60 s) · Account settings

### Hotel dashboard (`/dashboard/hotel/...`)
Hotel profile · Team and confirmations · Search and save animators · Requests and messages · Rate animators · Click stats · Featured listing · Users (staff accounts)

### Guest (`/account/...`)
Following · My reviews

### Admin (`/admin/...`)
Verification queues · Moderation · Users · Boosts and payments · Featured listings · Audit log

The notification bell is shared by all roles.

## Animator profile — fields
- **Basics:** name, photo, age range, city, short bio (kept in the language it was written in)
- **Branches (multiple):** chief animator, mini club, stage/show, dance, fitness/aerobics, sports, DJ, theatre, host, sound & light
- **Languages:** language + level (basic / good / fluent)
- **Experience:** years; past hotels (confirmed ones get a badge)
- **Availability:** season, date range, "Looking for a job" toggle
- **Media:** photo + short video gallery; one video can be pinned as the "showreel"
- **Social:** Instagram / TikTok link
- **Scores:** guest score + hotel score (separate, with review counts)
- **Currently:** if there is an active employment record, "Currently: [Hotel], [Region] · hotel confirmed"
- **Privacy:** phone and email are revealed to the other side only after a request is accepted
- **Buttons:** Follow (guest), Send request (hotel)

## Hotel profile — fields
**For guests:** name, stars, concept (family / adults-only / all-inclusive…), region, address and map location, **animation score** (calculated automatically from this season's guest scores of the confirmed team), animation team cards, programme (activities, mini club age range), **"Book now"** button → hotel website (clicks are counted).

**For animators:** "We're hiring" card (branch, headcount, season dates), what's offered (accommodation, meals, insurance — as declared by the hotel), "Verified hotel" badge.

## Matching flow
1. **Find** — filters: branch, language, region, score, availability (on the animator side: hiring hotels, region, concept)
2. **Request** — one-click contact request + short note (role, season)
3. **Accept** — if the other side accepts, contact details and the message box open (declining is possible)
4. **Talk** — in-platform messages or WhatsApp
5. **Deal** — off-platform; then the animator opens an employment record

Rules:
- Daily request limit for free accounts (suggested start: 10/day) — spam brake
- No new request while an open request exists between the same two parties
- Requests unanswered for 14 days become "expired"
- Turnstile on request forms, a report button on every request

## Employment record states
```
pending (declared, shown as "unconfirmed") --hotel confirms--> active --season ends / hotel marks "left"--> ended
pending --hotel rejects--> rejected (removed from profile)
```
- If the hotel is not on the platform, the record stays `pending` and the hotel gets an invitation email (growth channel)
- An animator can only have one `active` record at a time
- A hotel score can only be given for an `active` or `ended` record (once per season)
- Repeatedly rejected declarations raise an admin alert
- `active` records past their end date become `ended` via a scheduled job

## Notifications

| Event | To | Channel |
|---|---|---|
| New request / request accepted | Animator, hotel | Email + in-app |
| New message | Animator, hotel | In-app; email if unread for 1 hour |
| Employment declaration awaiting confirmation | Hotel | Email + in-app |
| New review or hotel score | Animator | In-app |
| A followed animator changed hotels | Guest | Weekly digest email |
| Verification result | Animator, hotel | Email |
| Boost about to expire (3 days left) | Animator | Email |

Resend's free plan is limited to 100 emails a day → guest notifications are bundled into a weekly digest. Web push in Phase 2.
