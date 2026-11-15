# HoliJoy — Product and Technical Spec

> Status: **Draft v1** · 12 November 2026 (translated to English 15 November 2026) · Author: Mert · Reviewer: Doruk
> Source: the "HoliJoy — Tech Stack & Product Plan" deck (28 slides, Turkish): [`source/holijoy-tech-stack-product-plan-tr.pdf`](source/holijoy-tech-stack-product-plan-tr.pdf). This folder is the version of that deck meant to be read while coding.

HoliJoy is a **web marketplace** that connects hotel animators, hotels and holidaymakers. It makes an animator's reputation (ratings + reviews) visible; hotels and guests decide based on that reputation.

## Files

| File | Contents |
|---|---|
| [01-product-overview.md](01-product-overview.md) | Vision, decisions made, roles, scope |
| [02-pages-and-flows.md](02-pages-and-flows.md) | Sitemap and routes, profiles, matching, employment records, notifications |
| [03-trust-and-scoring.md](03-trust-and-scoring.md) | Two scores, review weights, QR flow, ranking, verification |
| [04-revenue-and-admin.md](04-revenue-and-admin.md) | Boost, featured hotel, iyzico, admin panel |
| [05-technical-architecture.md](05-technical-architecture.md) | Architecture, stack and rationale, folder structure, coding rules |
| [06-data-model.md](06-data-model.md) | Tables, enums, relations, RLS rules |
| [07-security-and-privacy.md](07-security-and-privacy.md) | Security, KVKK, rate limits, backups |
| [08-roadmap.md](08-roadmap.md) | Sprints, out of scope, open decisions, costs |

## Non-negotiable principles

1. **We are not an agency.** Contracts, salaries and social security stay off-platform.
2. **Boost sells visibility, never score.** Paid promotion never changes a score or the organic ranking.
3. **Reviews with evidence weigh more.** Anyone logged in can review; reviews via the animator's QR count more.
4. **Every verification is also under admin control.**
5. **Start on free plans;** every paid service is approved by the team.
