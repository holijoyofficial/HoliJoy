# 03 · Trust and Scoring

## Two separate scores

### Guest score
- Any logged-in guest can write one
- Single rating (1–5) + text (optional photo in Phase 2)
- **One review per account per animator every 30 days**
- A review's weight depends on its evidence:

| Evidence | `verification_level` | Weight |
|---|---|---|
| Animator's QR + the animator has a hotel-confirmed active employment record | `full` | **1.0** — "Verified guest" badge |
| Animator's QR, no active employment record | `partial` | **0.6** |
| Unverified | `none` | **0.25** |

- Verified reviews are listed first
- The animator can reply once to each review

### Hotel (professional) score
- Only a hotel with a confirmed employment record; **one evaluation per season**
- Five criteria, each 1–5: punctuality & discipline · stage & performance · guest communication · language skills · teamwork
- Record score = average of the criteria; weight 1.0

### Score formula (Bayesian average)
```
score = (C·m + Σ wᵢ·rᵢ) / (C + Σ wᵢ)
m = platform-wide average for that score type, C = 5
```
Nobody can reach 5.0 with a single 5-star review. Weights and C are starting suggestions and will be tuned with data (kept in config, never hard-coded).

Shown on the profile as: `4.8 · 23 verified reviews (+12 others)`.

Scores are cached in the `animator_scores` table and recalculated by a database function on every review insert/delete/moderation.

### Hotel animation score
Average of the guest scores of the hotel's `active` team this season (weighted by review count). The "by animation" sort on the hotels page uses this.

## QR-verified review flow (animator's QR only)
The QR is **the animator's own tool only.** Hotels do not print QR codes; there are no printed QRs.

Example: after a show, the animator opens their QR on their phone, lets a guest scan it and asks for a rating and review.

1. **The animator opens "My QR"** (animator dashboard, `/dashboard/animator/qr`): a QR linked to their profile appears. QR → `/r/[token]`. The token is bound to the animator, HMAC-signed and **refreshes every 60 seconds** (`qr_tokens` table; the page fetches the new token automatically)
2. **The guest scans it:** lands straight on that animator's rating and review form
3. **Login:** Google or email magic link (the form resumes after login; the token stays valid until login)
4. **Record check:** if the animator has a hotel-confirmed `active` employment record the review is `full`, otherwise `partial`. **No location permission is requested, no location data is ever collected.**
5. **Rating + review:** the weight is calculated on the server, the "Verified guest" badge is automatic

If the animator has no active employment record, the QR still works but the review is at most `partial`.

Anti-abuse measures:
- Because the token refreshes every 60 seconds, a shared screenshot of the QR is useless
- Repeat reviews of the same animator from the same device and IP are blocked
- QR reviews to an animator from freshly created accounts within a short time are flagged to admin
- Rate limit per IP and device + Turnstile
- An abnormal burst of reviews in a short time → admin alert

## Search ranking
Default "Recommended":

| Component | Weight |
|---|---|
| Weighted score (combination of both scores) | 60% |
| Activity (content in the last 90 days, request response speed) | 20% |
| Profile completeness and verification | 20% |

Users can also pick "Highest rated", "Most reviewed", "Newest". No sorting by location; there is a region filter.

**Boost rules:**
- Never touches organic ranking; a separate **"Featured"** slot above the results
- At most 3 per page, labelled and rotated
- Boost requires a verified email and a complete profile

## Verification matrix

| What | How | Approved by | Badge |
|---|---|---|---|
| Hotel | Corporate email, tax number, authorization document | Admin | Verified hotel |
| Animator | Email verification (mandatory at sign-up) | System + admin | — |
| Employment | Animator declaration + hotel confirmation | Hotel; disputes go to admin | Hotel confirmed |
| Guest | Email or Google login | System | — |
| Review | Animator's QR + active employment record | System; moderation by admin | Verified guest |

- **No SMS verification in the MVP** (paid). Added for phone numbers in Phase 2.
- No ID documents are collected from animators; animator verification = email + admin review.
- Hotel authorization documents are **deleted within 30 days** after approval; only "approved, date, approving admin" is kept.
