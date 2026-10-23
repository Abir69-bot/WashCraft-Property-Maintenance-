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

## Services setup

Everything below is optional for local development: without keys, texts and emails are written
to the terminal and files are stored in `.private-uploads/` and `media/`. A production build
(`pnpm check-config` on Vercel) **requires R2 and Resend**, and recommends Turnstile and Twilio.
Put each value in `.env` locally and in Vercel → Project → Settings → Environment Variables.

### Cloudflare R2 (photos, customer uploads, lead backups)

1. In the Cloudflare dashboard, open **R2** and create two buckets, e.g. `washcraft-media` and
   `washcraft-private`. Choose a location near your customers.
2. **Public bucket** (`washcraft-media`): Settings → Public access → connect a custom domain such
   as `media.yourdomain.com` (or enable the r2.dev URL for testing). That address is
   `R2_PUBLIC_URL`, without a trailing slash.
3. **Private bucket** (`washcraft-private`): leave public access **off**. Under Settings → CORS
   policy, allow uploads from the site (customers' photos go straight from the browser to R2):

   ```json
   [
     {
       "AllowedOrigins": ["https://www.yourdomain.com", "http://localhost:3000"],
       "AllowedMethods": ["PUT"],
       "AllowedHeaders": ["content-type"],
       "MaxAgeSeconds": 3600
     }
   ]
   ```

   Optional: a lifecycle rule that deletes objects under `lead-files/` after, say, 365 days, and
   under `failed-leads/imported/` after 90 days.

4. **R2 → Manage API tokens → Create API token** with "Object Read & Write" on both buckets. Copy
   the **Access Key ID**, **Secret Access Key** and the **S3 endpoint**
   (`https://<account-id>.r2.cloudflarestorage.com`).
5. Set `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_PUBLIC_BUCKET`,
   `R2_PUBLIC_URL` and `R2_PRIVATE_BUCKET`.

### Resend (email)

1. Create a [Resend](https://resend.com) account and add your domain under **Domains**. Add the
   DNS records it shows at your domain host and wait for "Verified".
2. **API Keys → Create** with "Sending access". Set `RESEND_API_KEY`.
3. Set `EMAIL_FROM`, e.g. `WashCraft <quotes@yourdomain.com>` (on the verified domain).
4. In the admin, **Site settings → Lead alerts → Email new leads to**: who gets lead emails
   (blank uses the business email).

### Twilio (text alerts)

1. Create a [Twilio](https://www.twilio.com) account and buy a local number with SMS. US numbers
   need A2P 10DLC registration before they can text customers; owner alerts to a verified number
   work on a trial account.
2. Copy the **Account SID** and **Auth Token** from the console. Set `TWILIO_ACCOUNT_SID`,
   `TWILIO_AUTH_TOKEN` and `TWILIO_FROM` (your Twilio number, e.g. `+17205550100`).
3. In the admin, **Site settings → Lead alerts → Text new leads to**: the mobile numbers that get
   a text for every new lead.

### Cloudflare Turnstile (spam protection)

1. Cloudflare dashboard → **Turnstile → Add widget**. Add your domain (and `localhost` for
   testing), mode "Managed".
2. Set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (site key) and `TURNSTILE_SECRET_KEY` (secret key).
   The check is invisible for most visitors and only asks for a click when Cloudflare isn't sure.

### Google reviews (rating and reviews, daily)

1. In [Google Cloud Console](https://console.cloud.google.com/), create a project, enable
   **Places API (New)** and create an **API key**. Restrict the key to that API.
2. Find your **Place ID** with Google's
   [Place ID finder](https://developers.google.com/maps/documentation/places/web-service/place-id)
   and paste it into Admin → Site settings → Google & social. Add your "Leave us a review" link
   there too.
3. Set `GOOGLE_PLACES_API_KEY` and a random `CRON_SECRET` (e.g. `openssl rand -hex 32`) in Vercel.
   Vercel Cron (`vercel.json`) then calls `/next/cron/google-reviews` once a day with that secret.
   It copies the rating, review count and the up to five reviews Google shares into the admin
   (Social proof → Google reviews), where you can tick **Hide on site** for any of them.
4. To run it now: `curl -H "Authorization: Bearer $CRON_SECRET" https://<your-site>/next/cron/google-reviews`.

Google's free monthly allowance covers a daily call. Without the key or the Place ID the job does
nothing and the reviews page shows your own testimonials only.

## Working with leads (admin)

- **Leads** lists every request, newest first. Change a status straight from the list; open a
  lead for its answers, estimate, notes, consent and where the visitor came from.
- **Photos and documents** are under each lead (and in **Lead files**). Open one and click
  **Download file**; only signed-in staff can.
- **CSV export:** Leads list → **⋮** → **Export**. Pick the fields, clear the **Limit** to export
  everything, then **Download**.
- **Job applications** (Leads → Job applications) come from the careers pages, with the résumé
  under each one. Contact-page messages arrive as leads of type "contact".
- **Backed-up leads:** if the database was unreachable when someone sent a form (including job
  applications), it was emailed to you and saved to backup storage. A red banner on the dashboard and the Leads list
  then offers **Re-import backed-up leads**.
- **Prices:** every seeded price is a placeholder. Until you check a rule (Pricing → Pricing rules,
  Discounts, Plans) and untick **Needs review**, the live site shows "We'll price this with you"
  instead of a number.

## Property data lookup (optional, off)

`src/lib/property-data.ts` defines a `PropertyDataProvider` that could pre-fill the wizard (floor
area, stories) from an address. Only a no-op provider exists. To add one later: load a building
dataset (Statistics Canada's Open Database of Buildings, or Microsoft's building footprints for
the US) into a PostGIS table, enable PostGIS with a migration, implement `lookup()` with a
spatial query, and turn on **Feature switches → Property lookup**. Check storage first: these
datasets are far larger than Neon's free plan.

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

The browser tests use whatever database the build used (locally the Neon `dev` branch). The quote
tests save leads named "E2E Test" with `utm_source=e2e` (delete them from the admin afterwards
if you like). The staff tests (admin preview, dashboard, status changes) only run on an empty
database, as in CI, where they create the first account; elsewhere they skip.

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
