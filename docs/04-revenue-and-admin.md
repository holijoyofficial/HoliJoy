# 04 · Revenue and Admin

## Products

### Animator Boost — `[₺__]/month`, `[₺__]/season`
- A labelled "Featured" slot in search (see 03, boost rules)
- Premium badge, cover video, larger media quota
- Stats panel: profile views, which hotels looked, follower growth
- Prerequisite: verified email, complete profile
- Launch idea: 1 month of free boost for animators verified in the first season (campaign code)

### Featured hotel — `[₺__]/month`
- Labelled, at the top of guest search and region rankings
- Booking click report
- **MVP:** enabled manually by admin (`hotels.featured_until`). Self-service purchase in Phase 2.

Prices to be set by the team.

## Payments — iyzico
- Requires a company account (exists / to be set up)
- One-time payment (buying boost time) + subscription (monthly boost)
- Flow: Checkout Form → iyzico callback → server **re-verifies** the payment via the iyzico API → `payments` row → `boosts` period extended
- Webhook/callback must be idempotent (a payment is never processed twice: `iyzico_payment_id` unique)
- Refunds from the admin panel; boost time is revoked
- E-invoice / e-archive integration in Phase 2 (manual accounting until then)

## Admin panel

> **Reminder (team request):** every verification — hotel approval, animator email, employment record — must **also be under admin control**, even when the system or the hotel approves it: admin can see every decision, reverse it and ask for more documents.

| Module | Contents |
|---|---|
| Verification queues | Hotel applications, new animator accounts (review), employment disputes. Approve / reject (reason required) / request more documents |
| Moderation | Reported reviews and media, automatic suspicion flags; hide / delete / restore |
| Users | Search, suspend, ban, add/remove hotel staff, change role |
| Revenue | Boosts and payments, refunds, campaign codes, featured hotel assignment |
| Metrics | Summary of sign-ups, matches, reviews, boost conversion; details in PostHog |
| Audit log | Every admin action: who, what, when, why. **Cannot be deleted** (insert only) |

Roles: `super_admin` (everything), `moderator` (queues + moderation; no revenue or bans).

Hotel authorization documents open for admins only through a short-lived (e.g. 5 min) signed link; every view is written to the audit log.
