# WashCraft Property Maintenance — website

Marketing and lead-generation site with an embedded admin. Built with Next.js 16, Payload CMS 3
and Neon serverless Postgres. The full specification is in [docs/BRIEF.md](docs/BRIEF.md).

> This README grows with each build phase. Deployment, backups and restore, and how to add a
> service, city or season land in Phase 8.

## Requirements

- Node.js 22.12+ (24 recommended)
- pnpm 12: `npm i -g pnpm`, or `corepack enable pnpm`
- Docker Desktop, used only for the integration-test database
- A free [Neon](https://neon.tech) account

## Neon setup (one time)

1. In the Neon console, create a project named **washcraft**. Pick the Postgres version Payload
   supports (18) and the region closest to your customers. The region can't be changed later.
2. Neon creates a default branch called **`production`**. Under **Branches**, create a branch
   named **`dev`** from `production`.
3. For **each** branch, open **Connect** and copy two connection strings:
   - **Pooled**: the host contains `-pooler`. The running app uses this one.
   - **Direct**: turn off "Connection pooling"; the host has no `-pooler`. Migrations and backups
     use this one.
4. Put the `dev` strings in your local `.env`, as `DATABASE_URI` (pooled) and `DATABASE_URI_DIRECT`
   (direct).
5. Keep the `production` strings for the Vercel production environment. Never put them in a local
   `.env`.

## Local setup

```bash
pnpm install
cp .env.example .env          # then fill in DATABASE_URI, DATABASE_URI_DIRECT, PAYLOAD_SECRET
pnpm seed                     # starter content: services, cities, FAQs, articles, samples
pnpm dev                      # http://localhost:3000. The schema syncs to the Neon dev branch automatically
```

Open <http://localhost:3000/admin> and create the first user. That account becomes the **owner**.
The development-only styleguide is at <http://localhost:3000/styleguide>.

### Seeding

`pnpm seed` fills the database in `.env` with all starter content: 49 services, 6 categories,
the cities from `src/config/site.ts`, 36 FAQs, 6 blog posts, 6 solutions, placeholder pricing and
sample testimonials, team and gallery items (samples never appear on the live site).

- **Safe to re-run.** Existing documents are matched by slug or name and left alone, so your
  edits survive. `pnpm seed --force` overwrites them with the starter content.
- **It's slow over long distances.** Each document takes dozens of database round trips, so
  seeding a Neon project on another continent can take 30–45 minutes. Run it from close to the
  database region when you can.
- `pnpm db:reset-dev` wipes the database in `.env` and re-seeds it. It asks for confirmation.
  Never point it at production.

## Scripts

| Command                                        | What it does                                                                        |
| ---------------------------------------------- | ----------------------------------------------------------------------------------- |
| `pnpm dev`                                     | Dev server. Pushes schema changes to the database in `.env` (the Neon `dev` branch) |
| `pnpm build` / `pnpm start`                    | Production build / serve it                                                         |
| `pnpm lint` / `pnpm format` / `pnpm typecheck` | ESLint / Prettier / TypeScript                                                      |
| `pnpm test`                                    | Unit tests (no database)                                                            |
| `pnpm test:db:up` / `pnpm test:db:down`        | Start / stop the Docker Postgres for integration tests (port 5433)                  |
| `pnpm test:int`                                | Integration tests against `TEST_DATABASE_URI`, never Neon                           |
| `pnpm test:e2e`                                | Browser tests (desktop + phone, axe WCAG 2.2 AA) against the production build       |
| `pnpm db:migrate`                              | Apply committed migrations, over the **direct** connection                          |
| `pnpm db:migrate:create <name>`                | Generate a migration from schema changes. Commit `src/migrations`                   |
| `pnpm db:migrate:status`                       | List applied and pending migrations                                                 |
| `pnpm check-config`                            | List unset business facts. Fails production builds until they're set                |
| `pnpm generate:types`                          | Regenerate `src/payload-types.ts` after changing collections                        |
| `pnpm seed` / `pnpm seed --force`              | Add starter content / overwrite it                                                  |
| `pnpm db:reset-dev`                            | Wipe and re-seed the database in `.env` (development only)                          |
| `pnpm content-todo`                            | Regenerate the photo and pricing lists in `CONTENT_TODO.md`                         |

## Database workflow

- **While developing:** `pnpm dev` keeps the Neon `dev` branch in sync automatically (schema push).
- **Before merging a schema change:** run `pnpm db:migrate:create <name>` and commit
  `src/migrations`. CI fails if the Payload config and the committed migrations disagree.
- **On deploy:** the build command is `pnpm db:migrate && pnpm check-config && pnpm build`.
  Migrations run against the `production` branch through its direct connection. Then the config
  check reads the saved Site settings.
- **Never** run `pnpm dev` with `production` connection strings: dev mode pushes schema changes.
- **After changing data outside the admin** (a seed, a script or a backup restore), redeploy or
  save any document in the admin. Pages are cached, and only admin saves and new builds refresh
  that cache.

## Content updates

Saving in the admin updates the live pages within seconds. Services, categories and cities have
a **Preview** button that shows unpublished drafts (and sample content) to signed-in staff, with
an **Exit preview** button in the yellow banner.

## Testing

```bash
pnpm test             # unit
pnpm test:db:up       # once per session
pnpm test:int         # integration (runs the committed migrations first)

pnpm exec playwright install chromium   # once
pnpm build && pnpm test:e2e             # browser tests on http://localhost:3100
```

The browser tests use whatever database the build used (locally the Neon `dev` branch). The quick
quote test saves a lead named "E2E Test" with `utm_source=e2e`.

CI (`.github/workflows/ci.yml`) runs lint, format check, typecheck, unit tests, migrations, the
config check, integration tests (including a full seed run twice, in their own database), a seed
of the app database, the production build, the browser tests and a migration drift check. It
uses a throwaway Postgres service container, so CI never uses Neon compute. When browser tests
fail, the run keeps a `playwright-report` artifact for 7 days.

## Project documents

- [CLAUDE.md](CLAUDE.md): stack, conventions and rules for contributors (human or AI)
- [DECISIONS.md](DECISIONS.md): choices made where the brief was ambiguous
- [FEATURES.md](FEATURES.md): feature checklist (brief §17)
- [CONTENT_TODO.md](CONTENT_TODO.md): everything the owner still needs to supply
