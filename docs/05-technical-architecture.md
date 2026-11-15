# 05 · Technical Architecture

## Overview
```
Browser (mostly mobile)
   │
   ▼
Next.js · Vercel ──► Supabase (Postgres, Auth, private Storage, Cron)
   │  SSR pages        ──► Our own SMTP server (email)
   │  Server Actions   ──► Sentry, PostHog
   │  Route handlers
   │
Browser ──signed URL──► Cloudflare R2 (photos/videos, direct upload)
```
No servers to manage. Videos never pass through Next.js.

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) + TypeScript | SEO via SSR; one language for front and back end |
| UI | Tailwind CSS + shadcn/ui | Fast, consistent, accessible; brand tokens in one place |
| i18n | next-intl | `/tr` (default), `/en`, `/ru` routes; new language = new translation file |
| Forms | React Hook Form + Zod | Same schema in the browser and on the server |
| Database | Supabase Postgres | Relational data; admin dashboard and auto API included |
| Auth | Supabase Auth | Email + password, email verification, magic link, Google |
| Private files | Supabase Storage (private bucket) | Hotel authorization documents |
| Media | Cloudflare R2 | 10 GB free, free egress |
| Email | Our own SMTP server + React Email (via Nodemailer) | Set up later. Supabase's built-in SMTP is too limited for production; our SMTP is also plugged into Supabase Auth |
| Payments | None on-site | Bank transfer to the company account; admin activates boosts manually (see 04) |
| Monitoring | Sentry + PostHog | Error tracking; funnel analytics |
| Maps | Leaflet + OpenStreetMap | No API key / billing (MapTiler etc. if traffic grows) |
| Tests | Vitest (unit), Playwright (end-to-end) | |
| CI | GitHub Actions | Lint, type check, tests, nightly DB backup |

Versions are pinned to the current stable release at setup.

### Why Supabase (vs Firebase and NestJS + Postgres)
- The data is relational (hotel–animator–season–review) → SQL is natural; hard in Firebase
- Authorization lives in the database via RLS; scheduled jobs via Supabase Cron
- Auth, Storage included → low maintenance
- Standard Postgres → can move to another provider if we grow, no rewrite

## Folder structure
```
src/
  app/[locale]/(public)/...         public pages
  app/[locale]/dashboard/animator/...
  app/[locale]/dashboard/hotel/...
  app/[locale]/account/...
  app/[locale]/admin/...
  app/q/[code]/                     permanent QR entry → redirects to the review form
  components/ui/                    shadcn components
  components/...                    domain components
  config/app.ts                     score weights and limits (single source)
  i18n/                             next-intl routing, navigation, request config
  lib/supabase/                     server/browser/proxy clients, types
  lib/r2/                           signed URL generation
  lib/scoring/                      scoring and ranking (weights from config)
  lib/validation/                   Zod schemas
  proxy.ts                          locale redirect + Supabase session refresh
messages/tr.json, en.json           UI translations
supabase/migrations/                SQL migrations (Supabase CLI)
emails/                             React Email templates
tests/                              Vitest + Playwright
```

## Coding rules
- Everything in the repo is English: routes, identifiers, file names, commits, docs. Only the UI's default language is Turkish
- All writes happen in Server Actions or route handlers; the client never writes to tables directly (reads may be open via RLS)
- Every input is validated with Zod
- Database types are generated with `supabase gen types`, never written by hand
- UI text always lives in `messages/*.json`; no hard-coded strings in components
- Score weights and limits (requests/day, media size, …) live in `src/config/app.ts`
- Playwright tests are mandatory for critical flows: sign-up + email verification, guest review (form + QR entry), employment confirmation, admin boost activation

## Scheduled jobs (Supabase Cron — pg_cron; jobs that send email trigger a Supabase Edge Function)
- Daily: mark employment records past their end date `ended`; close expired boosts/featured listings; delete hotel documents 30 days after approval; boost-expiry reminder emails
- Nightly: database dump (GitHub Actions)

## Media rules
- Photos: resized to WebP in the browser (longest edge 1600 px)
- Videos: max 60 s, 50 MB, MP4 (H.264); the player loads on click
- Upload: the server creates a signed R2 PUT URL → the browser uploads directly → the `media` row becomes `ready`
- Quota: free animator [__] items, boosted [__] items
