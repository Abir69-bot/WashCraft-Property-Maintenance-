# WashCraft Property Maintenance — website

Marketing and lead-generation site with an embedded admin. Built with Next.js 16, Payload CMS 3
and Neon serverless Postgres. The full specification is in [docs/BRIEF.md](docs/BRIEF.md).

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

## Deploying (Vercel)

Do the [Neon setup](#neon-setup-one-time) and the [services setup](#services-setup) (at least R2
and Resend) first.

1. **Import the repository** in Vercel (Add New → Project). Framework: Next.js. Under **Build and
   Output Settings**, set the build command to
   `pnpm db:migrate && pnpm check-config && pnpm build`.
2. **Environment variables** (Settings → Environment Variables), for **Production**: everything in
   `.env.example` that you use. At minimum `DATABASE_URI` and `DATABASE_URI_DIRECT` (the Neon
   `production` strings), a new random `PAYLOAD_SECRET` (`openssl rand -hex 32`),
   `NEXT_PUBLIC_SITE_URL` (`https://www.yourdomain.com`), the R2 and Resend values, and
   `CRON_SECRET`. For **Preview**, use the Neon `dev` strings so previews never touch production.
3. **Region:** `vercel.json` runs functions in `cle1` (Cleveland), next to Neon in Ohio. If your
   Neon project is elsewhere, pick the nearest Vercel region.
4. **Business facts:** the build stops at `check-config` until every placeholder and demo value
   is replaced (CONTENT_TODO.md, section 1). Set them in `src/config/site.ts` before the first
   deploy, or in the admin under Site settings once the site runs.
5. **First production database setup** (from GitHub, close to Neon): in the repository, add these
   secrets under Settings → Secrets and variables → Actions: `PRODUCTION_DATABASE_URI`,
   `PRODUCTION_DATABASE_URI_DIRECT`, `PRODUCTION_PAYLOAD_SECRET` (the same value as in Vercel),
   `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_PUBLIC_BUCKET`, `R2_PUBLIC_URL` and
   `R2_PRIVATE_BUCKET`. Then Actions → **Production database** → Run workflow, with "Also add the
   starter content" ticked. It applies the migrations and seeds the content in a few minutes.
6. **Deploy** (push to `main`, or Redeploy in Vercel). Open `/admin` on the live site and create
   the first user straight away: it becomes the owner.
7. **Domain:** Settings → Domains. Then finish the search engine and local SEO steps below and in
   CONTENT_TODO.md (sections 8 and 10).

## Backups and restore

`.github/workflows/backup.yml` runs every Monday (and on demand from the Actions tab). It dumps the
Neon `production` branch with `pg_dump` 18, **restores the dump into a throwaway database and
compares row counts** (so a broken backup fails the run), uploads it to the private R2 bucket as
`backups/washcraft-<date>.dump` and keeps the newest 8. It uses the GitHub secrets from step 5
above. When a scheduled run fails, GitHub emails whoever last edited the workflow's schedule.

To restore (needs the Postgres 18 client tools and the AWS CLI):

```bash
# 1. Download a backup (R2 dashboard → private bucket → backups/, or with the AWS CLI)
aws s3 cp s3://washcraft-private/backups/washcraft-2026-11-02-0800.dump . \
  --endpoint-url https://<account-id>.r2.cloudflarestorage.com

# 2. In Neon, create a new branch to restore into (Branches → New branch), and copy its
#    direct connection string. Restoring into a fresh branch keeps production untouched
#    until you've checked the result.
pg_restore --no-owner --no-privileges --exit-on-error \
  --dbname="postgresql://…direct string of the new branch…" washcraft-2026-11-02-0800.dump

# 3. Check it: point a local build at the new branch, or open it in Neon's SQL editor.
```

To put it live, either make the restored branch Neon's default branch, or restore straight into
`production` with `--clean --if-exists` added (this replaces everything in it). Then redeploy in
Vercel so the pages pick up the restored content. On a Mac or Linux, `PGSSLROOTCERT=system` lets
`pg_restore` verify Neon's certificate with the connection strings' `sslmode=verify-full`.

Photos in the public R2 bucket aren't in the database dump. R2 keeps them unless you delete them;
copy the bucket now and then (for example with `rclone`) if you want a second copy.

## Content updates

Saving in the admin updates the live pages within seconds. Services, categories, cities, blog
posts, solutions, team members and job openings have a **Preview** button that shows unpublished
drafts (and sample content) to signed-in staff, with an **Exit preview** button in the yellow
banner.

**Redirects** (Admin → Redirects): when you change a page's slug, a 301 from the old address is
added for you. Add your own for addresses from an old website, e.g. from `/gutters.html` to the
Gutter Cleaning page. A redirect only applies where there is no page, and it starts working
within a minute of saving.

### Adding a service

1. Admin → **Services → Create new**. Fill in the title, the slug (the address, e.g.
   `paver-sealing`), the category and the **Page content** tab. Copy can use `{region}`.
2. **Card & menu:** the summary, icon, three card bullets and the button text.
3. **Quote & pricing:** pick how it's quoted. "Custom quote" works straight away. "Instant price"
   also needs a pricing rule (Pricing → Pricing rules → the service), and questions if the
   service needs its own; until the rule is checked and **Needs review** is unticked, the wizard
   says "We'll price this with you". Tick the seasons when it's offered.
4. **Related:** related services, solutions and articles. Add a hero photo (or a photo label
   describing what to shoot), then **Publish**.

The service appears in the menus, its category page, `/services`, the 404 search and the sitemap
without a redeploy. Changing a slug later adds a redirect from the old address.

### Adding a city

1. Admin → **Cities → Create new**. Fill in the name, slug, the intro (at least 150 words of
   genuinely local text; the editor counts them), neighborhoods and FAQs.
2. **Location:** the state (e.g. `CO`), the ZIP codes it covers (used by the ZIP checker and to
   match quotes to a city) and its latitude and longitude (for the map).
3. **Local conditions** only with a source link. Then **Publish**.

The city gets its page under `/areas`, joins the service-area lists, map, footer, ZIP checker and
the business's structured data, and the sitemap. Cities are the service-area list, so there's
nothing to change in Site settings.

### Seasons

The five seasons (spring, summer, fall, winter, holiday season) and their dates are set in
Admin → **Seasonal settings**. For each season you can change:

- **Dates** (Seasonal settings): when the season starts and ends. Overlaps are fine; the season
  that started most recently leads.
- **Home page hero** (Home page → Hero → Hero variants): headline, button and photo per season.
  **Force a hero** in Seasonal settings to show one regardless of the date.
- **Announcement bar** (Seasonal settings → Announcements): a message and link per season, each
  switched on or off.
- **Services in season:** tick seasons on each service (Quote & pricing); they lead the "In season
  now" section and the mega-menu's featured card.

Pages switch over within a day without a deploy (the site layout refreshes daily). A brand-new
kind of season would be a code change: add it to `SEASONS` in `src/config/catalog.ts`, to the
date ranges in `src/globals/settings.ts`, then create and commit a migration.

## Search engines

- `/sitemap.xml` lists every live page (it updates itself) and `/robots.txt` points to it. Preview
  and development deployments tell search engines to stay away.
- After launch, add the site to [Google Search Console](https://search.google.com/search-console)
  and [Bing Webmaster Tools](https://www.bing.com/webmasters), and submit
  `https://<your-domain>/sitemap.xml` in both.
- Every page carries structured data (business details, breadcrumbs, services, FAQs, articles).
  Check any page with Google's [Rich Results Test](https://search.google.com/test/rich-results)
  once the site is live. It only uses facts from Site settings: set the address (or leave it blank
  as a service-area business), hours as "Mon–Sat 8am–6pm" and your social profile links.
- Pages without a photo of their own get a generated share image with their title.

## Analytics

Nothing is loaded until a visitor clicks **Accept** in the cookie banner, and nothing at all
without the IDs below.

1. **Google Tag Manager + GA4.** Create a GA4 property and a Tag Manager container
   (tagmanager.google.com). In the container add a **Google tag** with your GA4 measurement ID,
   triggered on "Initialization – All Pages". GA4's enhanced measurement already counts page
   views when visitors move between pages. Set `NEXT_PUBLIC_GTM_ID` (e.g. `GTM-ABC1234`).
2. **Events.** The site pushes these to the data layer, each with `service`, `category` and `city`
   where the page has them: `quick_form_submit`, `quote_start`, `quote_step`,
   `quote_contact_submitted`, `quote_estimate_viewed`, `booking_requested`, `snow_contract_submit`,
   `holiday_lights_submit`, `junk_quote_submit`, `commercial_bid_submit`, `call_click`,
   `sms_click`, `email_click`, `review_link_click`, `careers_apply`, `contact_submit`. In Tag
   Manager, add a **Custom Event** trigger matching them all (regex
   `^(quick_form_submit|quote_.*|booking_requested|.*_submit|.*_click|careers_apply)$`) and a
   **GA4 Event** tag with event name `{{Event}}` and the three parameters as data layer variables.
3. **Conversions.** In GA4 → Admin → Key events, mark `quick_form_submit`,
   `quote_contact_submitted`, `booking_requested`, `snow_contract_submit`,
   `holiday_lights_submit`, `junk_quote_submit`, `commercial_bid_submit` and `call_click`.
4. **Microsoft Clarity** (optional, heatmaps and recordings): create a project at clarity.microsoft.com
   and set `NEXT_PUBLIC_CLARITY_ID`. In Clarity → Settings → Masking, choose **Strict** so
   recordings never show what visitors type.

Consent Mode v2 tells Google that analytics was allowed and advertising was not (the banner only
asks about analytics). "Cookie settings" in the footer lets visitors change their mind; declining
then removes the analytics cookies.

## Testing

```bash
pnpm test             # unit
pnpm test:db:up       # once per session
pnpm test:int         # integration (runs the committed migrations first)

pnpm exec playwright install chromium   # once
pnpm build && pnpm test:e2e             # browser tests on http://localhost:3100
pnpm build && pnpm test:lighthouse      # Lighthouse on port 3000 (stop `pnpm dev` first)
```

Lighthouse (`lighthouserc.json`) scores the home page, a service page and a city page five
times each on a simulated phone, and fails below 90 in performance, accessibility, best
practices or SEO (the median run counts). Reports are saved in `.lighthouseci/`. Scores from a
Windows machine run low (see DECISIONS.md, Phase 7); CI's Linux runner is the reference.

The browser tests use whatever database the build used (locally the Neon `dev` branch). The quote
tests save leads named "E2E Test" with `utm_source=e2e` (delete them from the admin afterwards
if you like). The staff tests (admin preview, dashboard, status changes) only run on an empty
database, as in CI, where they create the first account; elsewhere they skip.

CI (`.github/workflows/ci.yml`) runs lint, format check, typecheck, unit tests, migrations, the
config check, integration tests (including a full seed run twice, in their own database), a seed
of the app database, the production build, the browser tests (including a check of every
internal link on every page in the sitemap), Lighthouse and a migration drift check. It uses a
throwaway Postgres service container, so CI never uses Neon compute. When browser tests fail,
the run keeps a `playwright-report` artifact for 7 days; Lighthouse reports are kept as a
`lighthouse` artifact.

To run the browser tests locally against a throwaway database instead of Neon `dev`, as CI does:
`pnpm test:db:up`, create a `washcraft` database in that container, then set `DATABASE_URI` and
`DATABASE_URI_DIRECT` to `postgresql://postgres:postgres@localhost:5433/washcraft` in your shell
before `pnpm db:migrate`, `pnpm payload run src/seed/index.ts`, `pnpm build` and `pnpm test:e2e`.

## Project documents

- [CLAUDE.md](CLAUDE.md): stack, conventions and rules for contributors (human or AI)
- [DECISIONS.md](DECISIONS.md): choices made where the brief was ambiguous
- [FEATURES.md](FEATURES.md): feature checklist (brief §17)
- [CONTENT_TODO.md](CONTENT_TODO.md): everything the owner still needs to supply
