# 08 · Roadmap, Scope and Costs

## Sprints (2 weeks each)

| Sprint | Output |
|---|---|
| S0 | Repo, design system, data model, login + email verification, CI |
| S1 | Animator and hotel profiles, media upload (R2), TR/EN |
| S2 | Search and filters, public pages, SEO, follows |
| S3 | Employment records, requests and messages, notifications |
| S4 | Reviews and scores, animator QR, score calculation |
| S5 | Admin panel, hotel approval queue, moderation, boost + iyzico |
| Beta | Closed beta with hotels and animators we know, bug fixing |
| **Launch** | Live for the hotels' hiring season |

**MVP v1 deadline:** to be set by Alper. Site work started the week of 15 November 2026.

**In parallel:** the marketing team gets [__] animator and [__] hotel profiles ready before launch.

### Definition of done for every sprint
- Features work in TR + EN
- Tested on mobile (375 px) and desktop
- The relevant RLS rules are written and tested
- The Playwright test for the critical flow passes
- Approved by Doruk on the preview deployment

## Phase 2 (March–May 2027)
- RU and DE languages, automatic translation
- Phone verification via SMS
- Web push notifications
- Self-service purchase of featured hotel
- Animators rating hotels
- Sign in with Apple (yearly Apple developer fee)
- E-invoice integration

## Deliberately not building
- Explore / feed page
- Contract, salary, social security management (we are not an agency)
- Native mobile app (web is enough until very large scale)
- In-platform booking (we send guests to the hotel's own website)

## Costs

| Service | Free plan limit | When it becomes paid | Approx. |
|---|---|---|---|
| Vercel | Hobby plan is non-commercial only | When we start taking payments | $20/month |
| Supabase | 500 MB data, 1 GB storage; no automatic backups, pauses when inactive | Launch | $25/month |
| Cloudflare R2 | 10 GB storage, free egress | Above 10 GB of media | Cents per GB |
| Resend | 3,000 emails/month, 100/day | Above 100/day | $20/month |
| Sentry, PostHog | 5k errors, 1M events / month | At large scale | — |
| Domain | — | **To be bought (approved)** | $10–15/year |

- Development period: **~$0 + domain**
- The domain points to Vercel: the address is ours, the servers running the site are Vercel's.
- Recommended after launch: **~$45/month** (Vercel Pro + Supabase Pro)
- Prices and limits are the last known values; confirm before buying.

## Open decisions

| # | Topic | Note |
|---|---|---|
| 1 | ~~Name~~ | **Decided (15 Nov 2026): HoliJoy.** Domain to be bought |
| 2 | Messaging | Full in-platform, or WhatsApp after acceptance? **Before S3** |
