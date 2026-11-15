# 02 · Pages and Flows

All URLs start with a locale prefix: `/tr/...` (default), `/en/...`, `/ru/...`. The prefix is omitted below. Route names are always English; the page content is translated.

## Sitemap (MVP)

### Public
| Page | Route | Notes |
|---|---|---|
| Home | `/` | Search box, featured animators/hotels, how-it-works summary |
| Animators | `/animators` | Search + filters + sorting |
| Animator profile | `/animators/[slug]` | SSR, share image (OG), reviews, "Leave a review" |
| Leave a review | `/animators/[slug]/review` | The guest review form (no login) |
| Hotels | `/hotels` | Search + filters; "hotels that are hiring" filter |
| Hotel profile | `/hotels/[slug]` | SSR, animation score, team, "Book now" |
| Region rankings | `/regions/[slug]` | "Best animation teams in Belek" (SEO) — after MVP if time is short |
| How it works | `/how-it-works` | Separate explanation for each of the three audiences |
| Boost and pricing | `/pricing` | Prices + company bank transfer details |
| QR entry | `/q/[code]` | Permanent QR target (no locale prefix); redirects to the animator's review form in the browser's language |
| Login / sign-up | `/login`, `/signup` | **Animators and hotels only**; role is chosen at sign-up |
| Legal | `/privacy` (KVKK), `/terms`, `/cookies` | |

### Animator dashboard (`/dashboard/animator/...`)
Edit profile · Media gallery · Work history · Reviews and replies · My QR code (show full screen, download as PNG for printing/sharing) · Boost (how to buy, current status) · Account settings

### Hotel dashboard (`/dashboard/hotel/...`)
Hotel profile · Team and confirmations · Search and save animators · Click stats · Featured listing · Users (staff accounts)

### Admin (`/admin/...`)
Verification queues · Moderation (reviews, media) · Users · Boosts (manual activation after bank transfer) · Featured listings · Audit log

There are no guest accounts in the MVP, so no `/account` area.

## Animator profile — fields
- **Basics:** name, photo, age range, city, short bio (kept in the language it was written in)
- **Branches (multiple):** chief animator, mini club, stage/show, dance, fitness/aerobics, sports, DJ, theatre, host, sound & light
- **Languages:** language + level (basic / good / fluent)
- **Experience:** years; past hotels (confirmed ones get a badge)
- **Availability:** season, date range, "Looking for a job" toggle
- **Media:** photo + short video gallery; one video can be pinned as the "showreel"
- **Social:** Instagram / TikTok link
- **Contact:** WhatsApp number (also used for "Call"); see contact visibility below
- **Score:** average guest rating + number of reviews
- **Currently:** if there is an active employment record, "Currently: [Hotel], [Region] · hotel confirmed"
- **Buttons:** WhatsApp, Call (for logged-in hotels), Leave a review (everyone)

## Hotel profile — fields
**For guests:** name, stars, concept (family / adults-only / all-inclusive…), region, address and map location, **animation score** (average guest rating of the confirmed team this season), animation team cards, programme (activities, mini club age range), **"Book now"** button → hotel website (clicks are counted).

**For animators:** "We're hiring" card (branch, headcount, season dates), what's offered (accommodation, meals, insurance — as declared by the hotel), "Verified hotel" badge, WhatsApp / Call buttons (for logged-in animators).

## Contact flow (no in-site messaging)
1. **Find** — filters: branch, language, region, rating, availability (on the animator side: hiring hotels, region, concept)
2. **Contact** — "WhatsApp" opens `https://wa.me/<number>` with a short prefilled message ("Hi, I found you on HoliJoy…"); "Call" opens `tel:<number>`
3. **Deal** — off-platform; then the animator opens an employment record

Contact visibility: an animator's number is shown only to logged-in, admin-approved hotel accounts; a hotel's number only to logged-in animators. Guests never see phone numbers. Every WhatsApp / Call click is counted (stats + north-star metric).

## Guest review flow
1. The guest opens the form from the animator's profile ("Leave a review") or by scanning the animator's permanent QR code
2. Form fields: **email, first name, last name, country (nationality), rating (1–5), comment**. No login, no sign-up, no captcha
3. Submit → the review is published right away; the admin can hide or delete it at any time
4. Public display: first name + last-name initial + country flag (e.g. "Anna K. 🇩🇪"). **The email is never shown publicly**; only admins see it
5. A short privacy notice (KVKK) with a link sits under the submit button

Rules:
- One review per email per animator every 30 days (config)
- The animator can reply once to each review
- A hidden honeypot field silently drops obvious bots (no friction for real users)

## Employment record states
```
pending (declared, shown as "unconfirmed") --hotel confirms--> active --season ends / hotel marks "left"--> ended
pending --hotel rejects--> rejected (removed from profile)
```
- If the hotel is not on the platform, the record stays `pending` and the hotel gets an invitation email (growth channel)
- An animator can only have one `active` record at a time
- Repeatedly rejected declarations raise an admin alert
- `active` records past their end date become `ended` via a scheduled job

## Notifications (email only in the MVP, via our own SMTP)

| Event | To |
|---|---|
| Employment declaration awaiting confirmation | Hotel |
| New review | Animator |
| Verification result | Animator, hotel |
| Boost activated / about to expire (3 days left) | Animator |

In-app notification bell, guest digests and web push come after the MVP.
