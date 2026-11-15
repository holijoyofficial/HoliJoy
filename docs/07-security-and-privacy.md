# 07 · Security and Privacy (KVKK)

KVKK is Turkey's personal data protection law (similar to GDPR).

## Technical measures
- **RLS:** a rule on every table; a hotel cannot see another hotel's requests at the database level (see 06)
- **Private storage:** hotel authorization documents live in a closed bucket; only admins open them via a short-lived signed URL, and every view is written to the audit log
- **No location collected:** no flow ever asks for location permission
- **Rate limits:** per IP + account on sign-up, login, requests, messages and reviews; Turnstile
- **Service role key** only on the server; never in the client bundle
- **iyzico:** payment results are always re-verified server-side with the iyzico API; callback is idempotent
- **Security headers:** CSP, HSTS, X-Frame-Options; cookies `HttpOnly`, `Secure`, `SameSite=Lax`
- **Upload safety:** file type and size are also checked on the server; SVG is not accepted

## Backups
Supabase's free plan has no automatic backups → nightly `pg_dump` via GitHub Actions, stored encrypted. Moving to Supabase Pro is recommended once real user data comes in (see 08).

## KVKK package (must be ready before launch)
- Privacy notice (TR + EN)
- Hotel authorization documents are **deleted within 30 days** after approval/rejection; only the outcome is kept
- Cookie preference banner (only essential cookies by default; PostHog analytics needs consent)
- Account deletion and data export request (button in the dashboard)
- Reviews are anonymized when an account is deleted (score statistics are kept)

## Legal note
Data will be stored on servers abroad (Supabase / Vercel EU region). KVKK's cross-border transfer requirements **must be confirmed by a lawyer before launch.**
