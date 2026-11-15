# Contributing

## Language

Everything in this repository is **English**: code, file and route names, commit messages, pull requests, issues and docs. The only Turkish content is the UI text in `messages/tr.json` (Turkish is the site's default language).

## Commit messages

We use [Conventional Commits](https://www.conventionalcommits.org/). Anyone on the team, including non-developers, should be able to read the history and understand what changed.

```
<type>(<optional scope>): <what changed, in plain English>

<optional body: why, and the details worth knowing>
```

| Type | Use it for |
|---|---|
| `feat` | A new feature or page users can see |
| `fix` | A bug fix |
| `docs` | Documentation only |
| `style` | Visual/CSS changes with no behaviour change |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test` | Adding or fixing tests |
| `chore` | Tooling, dependencies, config |
| `ci` | GitHub Actions / deployment pipeline |

Rules:
- Subject line in the imperative ("add", not "added"), max ~72 characters, no trailing period.
- Say what changed for the product, not which file you touched.
- One logical change per commit.
- Never: `update`, `fix stuff`, `wip`, `asdf`, Turkish messages.

Good:
```
feat(home): add coming-soon landing page in Turkish and English
fix(auth): keep users logged in after the access token expires
docs: translate product spec to English
chore: add Supabase client helpers and env template
```

Bad: `update`, `düzeltme`, `changes`, `final final v2`.

To get the template in your editor every time you commit:

```bash
git config commit.template .gitmessage
```

AI assistants (Claude etc.) must follow the same rules; `CLAUDE.md` tells them to.

## Branches and deploys

- `main` is production: every push to it goes live on Vercel within a minute or two.
- For anything bigger than a small fix, work on a branch (`feat/animator-profile`, `fix/login-redirect`) and open a pull request; Vercel posts a preview URL on the PR.
- Run `npm run lint` and `npm run build` before pushing to `main`.
