# HoliJoy

Web marketplace for hotel animators, hotels and holidaymakers. The product and technical spec lives in `docs/`; read the relevant file before writing code:

- Product decisions and roles: `docs/01-product-overview.md`
- Pages, routes and flows: `docs/02-pages-and-flows.md`
- Scoring, QR, ranking, verification: `docs/03-trust-and-scoring.md`
- Revenue (bank transfer, no payment gateway), admin panel: `docs/04-revenue-and-admin.md`
- Stack, folder structure, coding rules: `docs/05-technical-architecture.md`
- Tables and RLS: `docs/06-data-model.md`
- Security and KVKK: `docs/07-security-and-privacy.md`
- Sprints and open decisions: `docs/08-roadmap.md`

Core rules:
- **Everything in the repo is English**: routes, identifiers, file names, commit messages, PRs, docs. Exceptions: the site's UI (Turkish is the default locale `tr`; English `en` and Russian `ru` are secondary) and `README.md`, which is Turkish for the team on GitHub (`README.en.md` is the English copy; keep both in sync).
- Commits follow Conventional Commits in clear English (see `CONTRIBUTING.md`); the PM reads the history to follow progress.
- Stack: Next.js 16 (App Router) + TypeScript, Tailwind + shadcn/ui, next-intl (TR/EN/RU), Supabase, Cloudflare R2, own SMTP server (later). No payment gateway, no Turnstile, no custom rate limiting, no in-site messaging (WhatsApp/phone links instead).
- Guests never log in: reviews are a single form (email, first/last name, country, rating, comment), all weighted equally. Hotels rate animators they confirmed working with: rating + comment only, once per season, shown as a separate hotel score. Each animator has one permanent QR code (`/q/[code]`).
- Next.js 16 has breaking changes (e.g. `middleware` is now `proxy`); read `node_modules/next/dist/docs/` before using an API you are unsure about (see `AGENTS.md`).
- Boost never changes a score or the organic ranking.
- UI text lives in `messages/*.json` (add every key to tr, en and ru); score weights and limits live in `src/config/app.ts`.
- Ask the team before adding any paid service.
- When building the admin panel: every verification must also be under admin control.

@AGENTS.md
