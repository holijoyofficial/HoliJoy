# 01 · Product Overview

## In one sentence
A marketplace that makes a hotel animator's reputation visible, and connects hotels and holidaymakers with animators through that reputation.

## Decisions made

| Topic | Decision |
|---|---|
| Platform role | Marketplace only; contracts and salaries stay off-platform |
| Market and language | Animators from Turkey first (foreigners welcome); guests domestic + international; UI **TR (default) + EN** |
| Revenue | Animator boost/premium + paid featured hotel |
| Guests | Browsing is free; following and reviewing require login; bookings happen on the hotel's own website |
| Guest login | Browse freely; login required to follow, rate and review |
| Reviews | Anyone (logged in) can write one; reviews coming through the animator's QR weigh more and are listed first. No location checks |
| QR | The animator's tool only: they open their own QR on their phone and let the guest scan it. Hotels do not print QR codes |
| Scores | Two separate scores: **guest score** and **hotel (professional) score** |
| Matching | Animators page + hotels page; both sides search for and contact each other |
| Content | Animators share photos/videos on their own profile; **no explore/feed page** |
| Employment record | Two-sided confirmation: the animator declares, the hotel confirms |
| Verification | Hotel: admin approval. Animator: **email verification** (SMS in Phase 2; no ID documents collected). All of it is also under admin control |
| Platform | Web only (mobile first). Native app only at very large scale |
| Timeline | MVP live for the hotels' hiring season (6 sprints + beta) |
| Budget | Free tiers; anything paid is chosen by the team. A domain will be bought |

## Roles

### Animator
- Creates a profile and a photo/video portfolio
- Searches hotels, sends contact requests
- Declares "I work at this hotel" (employment record)
- Opens their own QR on their phone and asks guests for a rating and review
- Sees and replies to their reviews
- Buys boosts, sees their stats

### Hotel (multiple staff accounts can be linked to one hotel)
- Creates an admin-approved hotel profile
- Searches, filters and saves animators; sends requests
- Confirms their team's employment declarations, gives a professional score at season end
- Can become a featured hotel (enabled by admin in the MVP)

### Guest (holidaymaker)
- Browses without logging in: profiles, hotels, reviews (also required for SEO)
- **Login required to follow, rate and review** (Google or email)
- Searches hotels by animation score
- "Book now" sends them to the hotel's own website

### Admin
- Super admin: everything
- Moderator: verification queues and moderation (no revenue or ban permissions)

## Success metrics (tracked in PostHog)
- Number of registered and verified animators / hotels
- Number of accepted contact requests (= matches) — **north-star metric**
- Number of confirmed employment records
- Number and share of verified reviews
- Boost conversion rate
- Booking clicks to hotel websites
