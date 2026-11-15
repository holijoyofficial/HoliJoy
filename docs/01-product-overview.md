# 01 · Product Overview

## In one sentence
A marketplace that makes a hotel animator's reputation visible, and connects hotels and holidaymakers with animators through that reputation.

## Decisions made

| Topic | Decision |
|---|---|
| Platform role | Marketplace only; contracts and salaries stay off-platform |
| Market and language | Animators from Turkey first (foreigners welcome); guests domestic + international; UI **TR (main) + EN + RU** at launch, more languages later |
| Revenue | Animator boost/premium + featured hotel. **No on-site payments:** buyers pay by bank transfer to the company account shown on the site; an admin activates the boost manually |
| Guests | **No account needed.** Browse freely; leave a review through a short form (email, first and last name, country, rating, comment). Bookings happen on the hotel's own website |
| Reviews | Only guests review animators. Every review works the same way: one form, no login, **no weighting**. Hotels do not rate animators |
| QR | One **permanent** QR code per animator profile, generated once and never rotated. It opens that animator's review form. Hotels do not print QR codes |
| Score | One score per animator: the plain average of guest ratings + review count |
| Contact | **No in-site messaging.** Hotels and animators contact each other through WhatsApp and phone-call buttons |
| Matching | Animators page + hotels page; both sides search for and contact each other |
| Content | Animators share photos/videos on their own profile; **no explore/feed page** |
| Employment record | Two-sided confirmation: the animator declares, the hotel confirms |
| Verification | Hotel: admin approval. Animator: **email verification** (no ID documents). All of it is also under admin control |
| Email | Our own SMTP server (set up later); no Resend |
| Abuse protection | No IP/device rate limiting and no Turnstile. Admin moderation is the main safeguard |
| Platform | Web only (mobile first). Native app only at very large scale |
| Timeline | **MVP live mid-December 2026** (moved up from February 2027) |
| Budget | Free tiers; anything paid is chosen by the team. A domain will be bought |

## Roles

### Animator (account required)
- Creates a profile and a photo/video portfolio
- Searches hotels, contacts them via WhatsApp / phone
- Declares "I work at this hotel" (employment record)
- Shows or shares their permanent QR code so guests can leave a review
- Sees and replies to their reviews
- Buys a boost by bank transfer; sees their stats

### Hotel (account required; multiple staff accounts can be linked to one hotel)
- Creates an admin-approved hotel profile
- Searches, filters and saves animators; contacts them via WhatsApp / phone
- Confirms their team's employment declarations
- Can become a featured hotel (enabled by admin)
- **Does not rate or review animators**

### Guest (holidaymaker, no account)
- Browses profiles, hotels and reviews (also required for SEO)
- Leaves a rating and review with a short form — no login, no sign-up
- Searches hotels by animation score
- "Book now" sends them to the hotel's own website

### Admin
- Super admin: everything
- Moderator: verification queues and moderation (no revenue or ban permissions)

## Success metrics (tracked in PostHog)
- Number of registered and verified animators / hotels
- Number of WhatsApp / call button clicks between hotels and animators (= contact) — **north-star metric**
- Number of confirmed employment records
- Number of guest reviews (and share coming through the QR code)
- Boost purchases
- Booking clicks to hotel websites
