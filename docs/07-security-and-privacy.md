# 07 · Security and Privacy (KVKK)

KVKK is Turkey's personal data protection law (similar to GDPR).

## Technical measures
- **RLS:** a rule on every table; a hotel cannot see another hotel's data at the database level (see 06)
- **Private storage:** hotel authorization documents live in a closed bucket; only admins open them via a short-lived signed URL, and every view is written to the audit log
- **Guest emails are private:** stored only in `reviews`, readable by admins only; the public view never exposes them
- **Phone numbers:** shown only to logged-in counterpart accounts (see 02), never to guests or search engines
- **No location collected:** no flow ever asks for location permission
- **No custom rate limiting / Turnstile** (team decision, 15 Nov 2026). Supabase Auth's built-in limits on login/sign-up still apply. Review spam is handled by the honeypot field, the 30-day email rule and admin moderation
- **Secret keys** (Supabase service role / secret key, SMTP password) only on the server; never in the client bundle
- **Security headers:** CSP, HSTS, X-Frame-Options; cookies `HttpOnly`, `Secure`, `SameSite=Lax`
- **Upload safety:** file type and size are also checked on the server; SVG is not accepted

## Backups
Supabase's free plan has no automatic backups → nightly `pg_dump` via GitHub Actions, stored encrypted. Moving to Supabase Pro is recommended once real user data comes in (see 08).

## KVKK package (must be ready before launch)
- Privacy notice (TR + EN + RU), linked under the review form: we collect the guest's email, name and country to publish and moderate the review; only first name, last-name initial and country are public
- Hotel authorization documents are **deleted within 30 days** after approval/rejection; only the outcome is kept
- Cookie preference banner (only essential cookies by default; PostHog analytics needs consent)
- Account deletion and data export request (button in the dashboard); guests can ask for their review to be deleted by email
- Reviews are anonymized when deletion is requested (score statistics are kept)

## Legal note
Data will be stored on servers abroad (Supabase / Vercel EU region). KVKK's cross-border transfer requirements **must be confirmed by a lawyer before launch.**
