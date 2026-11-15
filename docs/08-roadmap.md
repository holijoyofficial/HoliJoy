# 08 · Roadmap, Scope and Costs

## MVP: live mid-December 2026

The deadline moved up from February 2027 to **mid-December 2026** (decided 15 Nov 2026). That leaves about four weeks, so the plan is weekly milestones with a tight scope.

| Week | Dates | Output |
|---|---|---|
| W1 | 16–22 Nov | Database schema + RLS, animator/hotel sign-up with email verification, animator profile (edit + public page), TR/EN/RU skeleton |
| W2 | 23–29 Nov | Hotel profile, admin verification queue (hotels, animators), animators/hotels listing with search and filters, WhatsApp / call buttons |
| W3 | 30 Nov–6 Dec | Guest review form + permanent QR code, score calculation, employment records (declare/confirm), media upload (R2) |
| W4 | 7–14 Dec | Admin moderation + manual boost activation, pricing page with bank details, legal pages (KVKK), SEO basics, bug fixing, launch |

**In parallel:** the marketing team gets animator and hotel profiles ready before launch (target this week: 20 animators collected by Alper).

### Definition of done for every week
- Features work in TR + EN + RU
- Tested on mobile (375 px) and desktop
- The relevant RLS rules are written and tested
- Approved by Doruk on the preview deployment

## After the MVP
- Region ranking pages (if not done in W4)
- More languages (DE first), automatic translation of bios
- In-app notification bell
- Animator stats panel (views, clicks) in full
- Self-service featured hotel purchase
- Sign in with Apple / Google for animators and hotels
- On-site payments — only when the project has grown significantly

## Deliberately not building
- Guest accounts, following animators
- In-site messaging (WhatsApp / phone instead)
- Hotel reviews of animators, weighted reviews
- Payment gateway (bank transfer instead)
- Explore / feed page
- Contract, salary, social security management (we are not an agency)
- Native mobile app (web is enough until very large scale)
- In-platform booking (we send guests to the hotel's own website)

## Costs

| Service | Free plan limit | When it becomes paid | Approx. |
|---|---|---|---|
| Vercel | Hobby plan is non-commercial only | When we start selling boosts | $20/month |
| Supabase | 500 MB data, 1 GB storage; no automatic backups, pauses when inactive | Launch | $25/month |
| Cloudflare R2 | 10 GB storage, free egress | Above 10 GB of media | Cents per GB |
| Email (own SMTP) | Depends on the provider we pick | To be decided with the SMTP setup | — |
| Sentry, PostHog | 5k errors, 1M events / month | At large scale | — |
| Domain | — | **To be bought (approved), in about 2 months** | $10–15/year |

- Development period: **~$0**. Temporary address until the domain is bought: `holijoy.soluiton.com`
- `*.vercel.app` is blocked by some Turkish ISPs, so the site must always be shared on our own domain
- Recommended after launch: **~$45/month** (Vercel Pro + Supabase Pro)
- Prices and limits are the last known values; confirm before buying.

## Open decisions

| # | Topic | Note |
|---|---|---|
| 1 | ~~Name~~ | **Decided (15 Nov 2026): HoliJoy.** Domain to be bought |
| 2 | ~~Messaging~~ | **Decided (15 Nov 2026): WhatsApp + phone, no in-site messaging** |
| 3 | SMTP provider | Our own SMTP server; to be set up before launch |
| 4 | Prices | Boost and featured hotel prices, company bank details for `/pricing` |
| 5 | Media quotas | Free vs boosted animator media limits |
