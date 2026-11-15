# HoliJoy

Web marketplace for hotel animators, hotels and holidaymakers. The product and technical spec lives in `docs/`; read the relevant file before writing code:

- Product decisions and roles: `docs/01-product-overview.md`
- Pages, routes and flows: `docs/02-pages-and-flows.md`
- Scoring, QR, ranking, verification: `docs/03-trust-and-scoring.md`
- Revenue, iyzico, admin panel: `docs/04-revenue-and-admin.md`
- Stack, folder structure, coding rules: `docs/05-technical-architecture.md`
- Tables and RLS: `docs/06-data-model.md`
- Security and KVKK: `docs/07-security-and-privacy.md`
- Sprints and open decisions: `docs/08-roadmap.md`

Core rules:
- **Everything in the repo is English**: routes, identifiers, file names, commit messages, PRs, docs. The only exception is the site's UI: Turkish is the default locale (`tr`), English is second (`en`).
- Commits follow Conventional Commits in clear English (see `CONTRIBUTING.md`); the PM reads the history to follow progress.
- Stack: Next.js 16 (App Router) + TypeScript, Tailwind + shadcn/ui, next-intl (TR/EN), Supabase, Cloudflare R2, Resend, iyzico.
- Next.js 16 has breaking changes (e.g. `middleware` is now `proxy`); read `node_modules/next/dist/docs/` before using an API you are unsure about (see `AGENTS.md`).
- Boost never changes a score or the organic ranking.
- UI text lives in `messages/*.json`; score weights and limits live in `src/config/app.ts`.
- Ask the team before adding any paid service.
- When building the admin panel: every verification must also be under admin control.

@AGENTS.md
