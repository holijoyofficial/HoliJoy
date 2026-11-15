# 04 · Revenue and Admin

## Products

### Animator Boost — `[₺__]/month`, `[₺__]/season`
- A labelled "Featured" slot in search (see 03, boost rules)
- Premium badge, cover video, larger media quota
- Stats panel: profile views, WhatsApp / call clicks, which hotels looked
- Prerequisite: verified email, complete profile
- Launch idea: 1 month of free boost for the first animators (admin grants it)

### Featured hotel — `[₺__]/month`
- Labelled, at the top of guest search and region rankings
- Booking click report
- Enabled manually by admin (`hotels.featured_until`)

Prices to be set by the team.

## Payments — no on-site payment system
There is **no payment gateway** (no iyzico or similar) and there won't be one until the project grows significantly.

1. `/pricing` and the animator's Boost page show the prices and the **company bank details** (company name, IBAN, bank) plus a payment reference to write in the transfer description (e.g. `HJ-<animator code>`)
2. The animator transfers the money and sends the receipt (WhatsApp / email link on the page)
3. An admin checks the company account, then activates the boost in the admin panel: start date, duration, amount, payment reference
4. The animator gets an email: "Your boost is active until …"

- Every activation is written to the audit log
- Refunds are handled off-platform; the admin ends the boost early
- Invoicing is done manually by the company's accountant

## Admin panel

> **Reminder (team request):** every verification — hotel approval, animator email, employment record — must **also be under admin control**, even when the system or the hotel approves it: admin can see every decision, reverse it and ask for more documents.

| Module | Contents |
|---|---|
| Verification queues | Hotel applications, new animator accounts (review), employment disputes. Approve / reject (reason required) / request more documents |
| Moderation | All guest reviews (with the reviewer's email), reported reviews and media, review-burst alerts; hide / delete / restore |
| Users | Search, suspend, ban, add/remove hotel staff, change role |
| Revenue | Manual boost activation after bank transfer, boost history, featured hotel assignment |
| Metrics | Summary of sign-ups, contact clicks, reviews, boosts; details in PostHog |
| Audit log | Every admin action: who, what, when, why. **Cannot be deleted** (insert only) |

Roles: `super_admin` (everything), `moderator` (queues + moderation; no revenue or bans).

Hotel authorization documents open for admins only through a short-lived (e.g. 5 min) signed link; every view is written to the audit log.
