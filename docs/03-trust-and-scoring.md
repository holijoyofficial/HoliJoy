# 03 · Trust and Scoring

## One score: the guest rating
- Only guests rate animators. **Hotels do not rate or review animators.**
- Every review is the same: a short form, no login — email, first name, last name, country, rating (1–5), comment
- **No weighting and no verification levels.** Every review counts the same, whether it came through the QR code or the profile page
- One review per email per animator every 30 days
- The animator can reply once to each review

### Score shown on the profile
```
score = average of all visible ratings (1 decimal)
```
Shown as: `4.8 · 23 reviews`. Hidden/removed reviews do not count.

Scores are cached in the `animator_scores` table and recalculated by a database function on every review insert/delete/moderation.

### Hotel animation score
Average rating of the reviews of the hotel's `active` team this season. The "by animation" sort on the hotels page uses this.

## QR code (permanent)
- Each animator gets **one QR code**, created once with the profile and **never refreshed or regenerated**
- It encodes a permanent short link: `https://<domain>/q/<code>`. `code` is a short random ID stored on the animator; it does not change even if the animator renames their slug
- `/q/<code>` redirects to that animator's review form in the browser's language
- The animator can show it full screen on their phone or download it as a PNG to print or share
- Hotels do not print QR codes. No location data is ever collected

## Abuse handling (light by design)
Decided: no IP/device rate limiting and no Turnstile, to keep guest friction at zero. What remains:
- One review per email per animator every 30 days
- Hidden honeypot field on the form (bots fill it, people don't see it)
- **Admin moderation:** every review is visible to admins with the reviewer's email; hide / delete / restore. Animators can report a review
- Admin alert when an animator gets an unusual burst of reviews in a short time (simple count check, no IP tracking)

Known trade-off: without login or captcha, fake reviews are easier. We accept this for the MVP and watch it in the admin panel.

## Search ranking
Default "Recommended":

| Component | Weight |
|---|---|
| Rating (average, only counted from 3 reviews up) | 60% |
| Activity (content in the last 90 days) | 20% |
| Profile completeness and verification | 20% |

Users can also pick "Highest rated", "Most reviewed", "Newest". No sorting by location; there is a region filter. Weights and the minimum review count live in `src/config/app.ts`.

**Boost rules:**
- Never touches the score or organic ranking; a separate **"Featured"** slot above the results
- At most 3 per page, labelled and rotated
- Boost requires a verified email and a complete profile

## Verification matrix

| What | How | Approved by | Badge |
|---|---|---|---|
| Hotel | Corporate email, tax number, authorization document | Admin | Verified hotel |
| Animator | Email verification (mandatory at sign-up) | System + admin | — |
| Employment | Animator declaration + hotel confirmation | Hotel; disputes go to admin | Hotel confirmed |
| Review | None (open form) | Moderated by admin | — |

- No SMS verification; no ID documents from animators.
- Hotel authorization documents are **deleted within 30 days** after approval; only "approved, date, approving admin" is kept.
