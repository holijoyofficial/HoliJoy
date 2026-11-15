# HoliJoy

> 🇹🇷 Türkçe: [README.md](README.md)

A web marketplace that connects **hotel animators**, **hotels** and **holidaymakers** through verified ratings and reviews.

- Product and technical spec: [`docs/`](docs/README.md)
- How we write commits and work with Git: [`CONTRIBUTING.md`](CONTRIBUTING.md)

The site's main language is Turkish (`/tr`, default) with English as second (`/en`). Everything else (code, routes, commits, docs) is in English.

## Tech stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui · next-intl · Supabase · Vercel. Planned: Cloudflare R2, Resend, iyzico. See [docs/05](docs/05-technical-architecture.md).

## Run it locally

Requirements: Node.js 20+ and npm.

```bash
git clone https://github.com/holijoyofficial/HoliJoy.git holijoy
cd holijoy
npm install
cp .env.example .env.local   # then fill in the values (ask Mert/Doruk)
npm run dev
```

Open http://localhost:3000. You are redirected to http://localhost:3000/tr.

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Production build (run this before pushing bigger changes) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

## Project structure

```
messages/            UI text: tr.json (default), en.json — never hard-code UI strings
src/
  app/[locale]/      pages; every route lives under /tr or /en
  components/        React components (components/ui = shadcn)
  config/app.ts      score weights and limits — the only place to change them
  i18n/              next-intl routing and navigation helpers
  lib/supabase/      Supabase clients (browser, server, proxy)
  proxy.ts           locale redirect + Supabase session refresh (Next 16 "proxy" = old middleware)
docs/                product and technical spec
```

Adding a page: create `src/app/[locale]/<english-route>/page.tsx`, put its text in both `messages/tr.json` and `messages/en.json`, and use `Link` from `@/i18n/navigation` (not `next/link`) so the locale is kept.

## Environment variables

See [`.env.example`](.env.example). Locally they go in `.env.local` (git-ignored); on Vercel they go in **Project → Settings → Environment Variables**. Never commit real keys and never prefix a secret with `NEXT_PUBLIC_`.

## Deployment (Vercel)

Every push to `main` deploys to production automatically; every other branch or pull request gets its own preview URL. The footer of the site shows the live commit (`Live version: abc1234 · <commit message>`), so you can check that your push is live.

### One-time setup (with the HoliJoy accounts)

1. **GitHub:** the repo lives at [holijoyofficial/HoliJoy](https://github.com/holijoyofficial/HoliJoy). Invite the team (Settings → Collaborators).
2. **Supabase:** sign in with the HoliJoy Google account → New project → name `holijoy`, region **Frankfurt (eu-central-1)**, generate the database password and store it in the team password manager. Then Project Settings → API: copy the **Project URL** and the **publishable (anon) key**.
3. **Vercel (Hobby, free):** sign up with the HoliJoy GitHub account → Add New → Project → import the repo. Framework is detected automatically. Before deploying, add the two Supabase variables from `.env.example` under Environment Variables. Deploy.
4. Share the production URL (`https://<project>.vercel.app`) with the team.

> **Vercel Hobby caveats:** the Hobby plan is for non-commercial use (fine for the MVP preview; switch to Pro before taking payments, see [docs/08](docs/08-roadmap.md)). On Hobby, a **private** repo may only auto-deploy commits from the Vercel account owner, and repos owned by a GitHub *organization* may not be importable. If teammates' pushes do not deploy, either make the repo public (no secrets live in the code) or move to Vercel Pro. Check Vercel's current docs when setting this up.

> **`*.vercel.app` is blocked by some Turkish ISPs:** if `holijoy.vercel.app` does not open on home internet but works on mobile data, the ISP is blocking the domain (it blocks the TLS handshake by hostname). Fix: connect our own domain to Vercel. Until then, use mobile data or Cloudflare WARP (free).
