# Decisions

Choices made where the brief was ambiguous or the ground had shifted since it was written.
Newest phase at the bottom. Rule of thumb from the brief: more leads and better accessibility win.

## Phase 1 — Foundation (2026-10-21)

### Infrastructure

- **Neon's default branch is `production`, not `main`.** Neon now names the default branch
  `production`. Docs and scripts use that name; the brief's `main` means the same branch.
  The Git default branch is still `main`.
- **Neon region: AWS us-east-2 (Ohio).** The first project was created in Sydney. The business is
  in the US, so the project was recreated in Ohio (Neon can't move a project). The Vercel
  functions region must match: `iad1`/`cle1` (Phase 8).
- **Postgres 18.** The Neon project runs 18.6, so the Docker test database and the CI service
  container use `postgres:18` to match.
- **`sslmode=verify-full` in connection strings.** node-postgres already treats `require` as
  `verify-full` and prints a warning. Saying it explicitly keeps the same (secure) behavior
  without the warning.
- **Versions (latest stable that the toolchain supports):** Next 16.4.2, React 19.3.1, Payload 3.91,
  Tailwind 4.3, Zod 4, Vitest 5, pnpm 12. **TypeScript 6.0.3, not 7.0:** typescript-eslint only
  supports TS < 6.1. **ESLint 9, not 10:** Next's bundled lint plugins don't support 10 yet.
- **Schema push only under `next dev`.** The brief's adapter config pushes whenever
  `NODE_ENV !== 'production'`. Narrowed to `NODE_ENV === 'development'` so unit, integration and
  CI runs exercise the committed migrations exactly as production does.
- **Migrations use the direct connection automatically.** `payload migrate` sets
  `PAYLOAD_MIGRATING=true`; the config switches to `DATABASE_URI_DIRECT` when it sees it.
  No wrapper script is needed.
- **CI catches forgotten migrations.** After the build, CI runs
  `payload migrate:create --skip-empty` and fails if it would generate a file.
- **Integration tests use `TEST_DATABASE_URI` only** (Docker Postgres on port 5433 locally, a service
  container in CI). They can't touch a Neon branch by accident.
- **GraphQL is disabled.** Nothing uses it; less attack surface and a smaller server bundle.

### Config and environments

- **`check-config` is report-only in CI and strict on production deploys.** If it were strict in
  CI, CI would stay red until the owner supplies every business fact. It becomes strict when
  `VERCEL_ENV=production`, with `STRICT_CONFIG=true`, or with `--strict`. Phase 2 extends it to
  read the `site-settings` global.
- **`SITE_ENV` (development | preview | production)** is derived from `VERCEL_ENV`/`NODE_ENV` and
  can be overridden. Production hides sample content and allows indexing. Development and preview
  show "Sample" badges and send `noindex`.
- **The business is in the US** (owner confirmed 2026-10-21): `country: 'US'`, `currency: 'USD'`,
  `locale: 'en-US'`. All visitor-facing copy uses US English ("color", "neighborhood",
  "two-story", "ZIP code"). Code identifiers keep the brief's names (e.g. `licenceNumbers`).
  SMS consent follows the TCPA, and marketing email follows CAN-SPAM.
- **US terms replace the brief's Canadian ones (applied in Phase 2).** US customers don't search
  for "strata" or "parkade", so the brief's terms would cost leads:
  - "strata" becomes "HOA & condo": `/commercial/strata` becomes `/commercial/hoa`, and
    `strata-building-washing` becomes `hoa-building-washing`.
  - "Strata / Commercial" service names become "HOA & Commercial".
  - "parkade" becomes "parking garage": `parkade-cleaning` becomes `parking-garage-cleaning`.
  - "Workers' comp registration" refers to the state workers' compensation policy rather than
    WorkSafeBC/WSIB.
  - Postal-code fields and checkers say "ZIP code" and match 5-digit ZIP prefixes.

### Demo business details (2026-10-21)

- **Demo stand-ins at the owner's request.** The owner asked for demo values until the real ones are
  known. They're realistic but can't reach anyone or mislead a customer:
  - Tagline: "Exterior care, year-round", taken from the line on the owner's logo.
  - Phone: (720) 555-0142. The 555-0100–0199 range is reserved for fiction.
  - Email: hello@example.com, a reserved domain.
  - Address: `null`, presented as a service-area business, so no fake street address is shown.
  - Hours: Mon–Sat 7am–6pm.
  - Region: Denver Metro. Cities: Denver, Aurora, Lakewood, Arvada, Littleton and Centennial.
- **Why Denver Metro:** the logo shows sun, snow and mountains, and the service mix includes snow
  removal and holiday lighting. Colorado fits both, and it's close to the Neon region (Ohio).
- **Demo values block production.** `site.demo` lists every stand-in field. `check-config` reports
  each one, so a production deploy is impossible until the owner confirms or replaces it and
  removes it from the list.

### Logo (2026-10-21)

- **Owner's logo in use.** The owner sent a raster badge logo (mascot house with crown). The pasted
  copy had a flat black background, which was removed by flood-filling from the edges. A stray
  light line along the right edge was cleared too. Result: `src/assets/brand/washcraft-logo.png`
  (638×595, transparent).
- **One version for all backgrounds.** The badge has its own dark outline, so it reads on white and
  on `--primary`. No white or mono variants are needed.
- **Icons use a crop of the mascot** (crowned house face) on a `--primary` rounded square. The
  full badge is unreadable at 16–32px.
- **Pending:** the original file with a transparent background (or a vector version) would give
  cleaner edges. Tracked in CONTENT_TODO.md.

### Design system

- **Contrast-safe colour variants.** Several brand hues fail 4.5:1 as text on white:
  secondary #2CB1BC (2.6:1), success #2E9E5B (3.4:1), winter #3B82C4 (4.1:1) and yard #4C9A50 (3.5:1).
  The brief's hues stay for fills and accents. Darker "-strong" shades (each ≥ 4.6:1 on white
  and on `--surface`) are used for text, links, badges and meaningful icons.
  `--secondary-on-dark` (#68C7CF) is used for teal text on primary backgrounds.
  `--border-strong` (#7B8C98, 3.5:1) is used for form-field borders (WCAG 1.4.11).
  `brand-tokens.test.ts` checks every pair the UI uses.
- **Tailwind's default palette is removed** (`--color-*: initial`), so off-brand classes like
  `bg-blue-500` don't compile.
- **Category badge colours:** the brief assigns winter, holiday and yard. Exterior uses
  `secondary-strong`, interior uses `primary` and commercial uses `ink`.
- **Fluid type scale.** Sizes scale linearly from the brief's mobile size at 480px to its desktop size
  at 1280px using `clamp()`. A rem term keeps text zoomable.
- **Native `<select>` and checkbox instead of Radix Select/Checkbox for forms.** These give OS
  pickers on phones, `<optgroup>` for the grouped service list, and they work before JavaScript
  loads. Radix is still used for dialog, accordion, tabs and popover.
- **Accordion answers are always in the HTML** (`forceMount`, hidden when closed), so FAQ text is
  crawlable and the FAQPage schema matches visible content.
- **Optional fields say "(optional)"**, and required fields carry `aria-required`. This follows
  GOV.UK-style guidance and avoids asterisk-heavy forms.
- **Fonts** come from `next/font/google`, which downloads at build time and serves from our origin
  (self-hosted).

### Admin

- **Roles: owner and staff.** The account created on the "create first user" screen becomes the
  owner. Only owners manage users. Staff see and edit only their own account and can't change
  their role.

### Free-plan caveats (from the plan, for the owner)

- Vercel Hobby is for non-commercial use under Vercel's terms. A client business site technically
  needs Pro. The code stays host-neutral.
- Cloudflare R2 asks for a payment card before it can be enabled, even on the free tier. Without
  R2 in production, upload fields will hide themselves and ask customers to text photos (decided
  in Phase 5).
- Twilio has no free plan; trial credit can only text verified numbers. Google Places needs a
  billing-enabled Google Cloud account. Both fall back gracefully.

## Phase 2 — Content model + seed (2026-10-21)

### Schema

- **Drafts only where there's a page.** Services, categories, cities, posts, solutions, team
  members and job openings get drafts, preview and SEO fields (max 20 versions each).
  Testimonials, gallery items, client logos, FAQs, plans and pricing have no page of their own,
  so they publish immediately and have no SEO tab.
- **SEO tab from the official SEO plugin**, with "Generate" buttons that follow the brief's title
  patterns (`src/lib/seo/titles.ts`). Pages fall back to the same patterns when the fields are
  blank.
- **301s from the official redirects plugin.** When a published page's slug changes, a hook adds
  a redirect from the old URL, repoints older redirects to the new URL (no chains) and deletes any
  redirect away from the new URL (no loops).
- **Public reads go through `publicRead()`.** Visitors only see published documents, and on the
  live site never samples. The local API skips access control by default, so every public data
  query must pass `overrideAccess: false`.
- **`{region}` is a token, filled in when a page renders.** The seed copy says "{region}" instead
  of "Denver Metro", so changing the region in Site settings updates every page.
- **Service FAQs live on each service** (5–7 each). The FAQs collection holds the 36 site-wide and
  category FAQs for the FAQ page, category hubs and the home page.
- **Site settings mirror `site.ts`, except service areas.** The Cities collection is the live list
  of service areas (each city is a page). `getSite()` returns the saved settings plus published
  city names, and falls back to `site.ts` until the settings have been saved once.
- **`check-config` reads the admin's Site settings** when the database is reachable, because
  that's what the live site shows. Deploy order is therefore `db:migrate` → `check-config` →
  `build`.
- **A `pricing-settings` global** (not in the brief's list) holds the range multipliers (0.9 /
  1.15), the tax note and the estimate note.
- **Per-unit add-ons.** A pricing-rule add-on with answer `*` is priced per unit of a number
  answer (e.g. $60 per tree). The brief's formula only has flat add-ons.
- **Private uploads in their own collection.** Customer photos, RFPs and résumés go to
  `lead-files` (signed-in staff only), never to the public `media` collection.
- **Leads can't be created through the public REST API.** Forms save on the server with
  `overrideAccess`, after validation, spam checks and rate limiting (Phase 5).
- **Case studies have no detail page.** They aren't in the brief's sitemap, so they show on the
  commercial pages only, with no slug, drafts or SEO.
- **Schema push is opt-in.** It runs only when NODE_ENV is explicitly "development" (`next dev`,
  `pnpm seed`). Scripts with NODE_ENV unset (check-config, migrations) can never push to
  production.

### Seed content

- **49 services**, the brief's full catalog (its "~55" was approximate), each with original US-English
  copy: problem, 3–4 benefits, what's included, method, safety, 4–5 steps, price factors, add-ons,
  5 FAQs and 3 related services. Plus 6 categories, 6 cities, 36 FAQs, 6 posts, 6 solutions,
  29 pricing rules, 5 discounts and 7 plans.
- **No invented business facts in the copy.** Two drafted FAQs were reworded: one named payment
  methods and one promised "we'll make it right" (a guarantee). Operational details in the copy
  (notice periods, what we haul) are flagged for the owner's review in CONTENT_TODO.md.
- **No prices in the copy.** `fromPrice` is left blank. Placeholder numbers live only in pricing
  rules and plans, all marked `needsReview` and hidden on the live site.
- **Re-running the seed keeps owner edits.** Documents are matched by slug, question or name.
  Existing ones are skipped unless `--force` is passed, so a re-run never duplicates content or
  overwrites edits.
- **Demo cities use real geography only.** Names, coordinates, ZIP codes and neighborhoods are
  general public knowledge for the Denver Metro area. No local statistics are seeded, because
  they'd need a cited source. ZIP lists and neighborhoods are flagged for review.
- **Seeding Neon from a distant machine is slow.** Every save is dozens of small queries, and from
  the UK to Ohio that's about 20 seconds per document. The first `dev` seed took about 40 minutes.
  The production seed will run from a US-based GitHub runner instead (Phase 8).
- **CONTENT_TODO.md lists are generated.** `pnpm content-todo` rebuilds the photo list (117 so far)
  and the pricing-review list from the seed data and every `<PhotoPlaceholder label>` in the code.

### Admin

- The owner's logo brands the admin login and navigation.
- City pages show a live word count and warn below 150 words (brief §9.4).

## Phase 3 — Layout + home (2026-10-21)

### Rendering and caching

- **Static pages, rebuilt daily and on every edit.** Public pages use Next's ISR model (no
  `cacheComponents`). The site layout sets `revalidate = 86400`, so the seasonal hero, the
  announcement and the "in season now" order switch over within a day without a deploy. Payload
  `afterChange`/`afterDelete` hooks call `revalidateTag('content')` and `revalidatePath('/',
'layout')`, so admin edits show up straight away. Data helpers wrap queries in `unstable_cache`
  (tag `content`) plus React `cache()`, so one render never asks twice.
- **The newest season wins.** When seasons overlap (fall and holiday in November), the hero uses
  the active season that began most recently. The owner can pin one in Seasonal settings.
- **Image URLs are made same-origin.** Payload builds absolute media URLs from the request host,
  which `next/image` rejects. `mediaSrc()` turns `/api/media/file/...` URLs into relative paths;
  R2 URLs (Phase 5) stay absolute and get a `remotePatterns` entry then.

### Photos

- **The owner's job photos are real content.** They confirmed the 23 photos are their own jobs, so
  they are seeded as normal (non-sample) gallery items and hero images and show on the live site.
  Baked-in "before/after" labels were cropped, side-by-side shots split, and license plates in two
  gutter photos blurred. No caption names a city, because the photos weren't tagged with one.
- **The hero only shows photos that fit the season.** The season's own hero image comes first,
  then featured "after" photos. Winter and holiday heroes skip the gallery (it's all summer work)
  and show a placeholder until the owner uploads a seasonal photo.

### Claims and copy

- **"Recommended", not "Most popular".** The plans teaser badge can't claim popularity without
  sales data (brief §3.3). The "lower price than one-off visits" line was dropped for the same
  reason; plan prices are placeholders and hidden on the live site until reviewed.
- **Hero proof points come from Site settings only.** "Insured", "Workers' comp covered",
  "Serving since…" and a reply-time promise each appear only when that setting is filled in. The
  star badge needs a real rating and review count (Phase 6).
- **Sample-only sections hide on the live site.** Testimonials, client logos and the founder block
  only have samples so far, so production builds don't render them. The guarantee band only shows
  once a guarantee is written in Site settings, and the call/text block only with a valid phone
  number (the demo number counts).

### Components

- **Native `<select>` and checkbox in forms.** They work with every screen reader, autofill and
  phone picker, and need no JavaScript. Radix is used for the mega-menu, mobile menu dialog,
  accordions (`forceMount`, so answers are in the HTML for search engines), tabs and popovers.
- **Mega-menu shows six services per category** plus an "All … →" link, so it fits one screen. The
  featured card follows the current season unless the owner sets one in Navigation.
- **Announcement dismissal is remembered without a flash.** A small inline script in `<head>`
  reads `localStorage` and hides the bar before first paint.
- **The quick quote already saves leads.** It validates with the shared Zod schema, ignores a
  filled honeypot, matches the ZIP to a city and stores consent text and UTM tags. Turnstile, rate
  limiting, retry + R2 fallback and notifications arrive with the quote system (Phase 5).
- **Leaflet loads only when the map scrolls into view** (OSM tiles, non-interactive markers with
  city labels). The ZIP checker works without it.

### Accessibility and tests

- **Wide tables scroll inside a focusable region** (`role="region"`, label, `tabIndex=0`) so
  keyboard users can scroll them on phones (axe `scrollable-region-focusable`).
- **One axe exclusion, scoped and tested.** Radix NavigationMenu adds an `aria-hidden` focusable
  span after an open trigger that forwards focus into the menu. axe reports it as
  `aria-hidden-focus`; the mega-menu test excludes only that span and checks that Tab really lands
  on the first menu link.
- **E2E runs against a production build** on port 3100 (desktop Chrome + Pixel 7), so "no samples
  on the live site" is tested for real. The quick-quote test creates a lead named "E2E Test" with
  `utm_source=e2e`; Phase 5 must stop such leads from sending notifications.
- **CI gives integration tests their own database** (`washcraft_test`). The app database is
  migrated, seeded with plain `payload run` (no schema push), built and tested with Playwright.

## Phase 4 — Templates (2026-10-21)

### Pages and titles

- **The H1 is the SEO title pattern** on service, category and city pages ("Gutter Cleaning in
  Denver Metro", "Exterior Cleaning Services in Denver Metro", "Property Maintenance in
  Denver"). The CMS hero headline shows below it as a lead line. `/services`, `/areas`,
  `/maintenance-plans` and the HOA page follow the same "[Topic] in [Region]" pattern. The SEO
  tab can override the title, description and share image; every page has a canonical URL.
- **Category hubs use a top-level `[category]` route.** `/commercial` is its own page (the hub
  plus the §9.5 sections), so the commercial category's slug must stay `commercial`
  (`COMMERCIAL_CATEGORY` in `lib/routes.ts`).
- **Unknown URLs never query the database.** Page loaders (`lib/data/load.ts`) check the slug
  against the cached menu data first. Preview skips the check so staff can see unpublished pages.
- **New services and cities need no redeploy.** Pages missing from the build render on their
  first visit, then stay cached.
- **The data cache is versioned per build.** `next.config.ts` sets a new `CONTENT_CACHE_VERSION`
  on every build and every `pnpm dev` start, and content queries include it in their cache keys.
  Without it, a build reused the previous build's cached data (Next keeps `.next/cache`, and
  Vercel keeps its data cache across deploys), so changes made outside the admin, such as a seed
  or a backup restore, never reached the site. Admin saves still clear the cache at once.

### Quote buttons

- **Each service's button follows its quote flow** (`lib/quote/flow.ts`): holiday lights and
  junk removal go to their own pages, snow contracts to `/quote/snow-contract`, commercial bids
  to `/quote/commercial`, instant-price services to `/quote/instant?service=<slug>`, everything
  else to `/quote/custom?service=<slug>`. Add-ons use their parent service's flow. Category hubs
  use their accent: winter → snow contract, holiday → lights, commercial → bid, others →
  instant price. Plan buttons open `/quote/instant?plan=<id>`. Phase 5 reads these parameters.

### Content rules

- **City pages fill `{region}` in shared claims with the region, not the city.** "We live and
  work in {region}" must not become "in Aurora". Service copy and FAQs, which describe where the
  work happens, use the city name.
- **Service FAQs merge the service's own questions with FAQ-collection entries linked to it**,
  dropping repeats.
- **Insurance appears only from Site settings.** The compliance block and "Certificates of
  insurance on request" show only once insurance details are set. Seeded copy that implied
  certificates (three FAQs, the commercial intro) and two "…and save" lines were reworded.
- **The HOA & condo page** (the brief's `/commercial/strata`, renamed for the US) is edited in a
  new **Commercial pages** global, which also holds the commercial hub's "why managers work with
  us" points. Its copy describes working practices and is listed for the owner to review.
- **Photo uploads for category heroes, city heroes and neighborhoods.** Phase 2 only had
  placeholder labels for these.
- **Service-in-city pages** stay off unless the owner turns on the switch and picks services per
  city. They reuse the service content plus the city's neighborhoods, local facts and FAQs; no
  pages are generated by default, to avoid thin, near-duplicate pages.

### Components and accessibility

- **`/services` renders every card on the server** and passes them to a small client filter
  (category chips with `aria-pressed`, search box, live result count). The full list works
  without JavaScript.
- **Benefit tabs keep every panel in the HTML** (`forceMount`) so search engines see them.
- **Plain links inside sentences are underlined** (`a:not([class])`, WCAG 1.4.1). Styled links
  (cards, buttons, menus) set their own decoration.
- **A basic 404** with popular services and quote buttons, marked `noindex`. Search arrives with
  the Phase 6 404 page.

### Preview

- **The admin's Preview button** (services, categories, cities) opens `/next/preview`, which
  checks the Payload login, turns on Next's draft mode and redirects. Draft mode bypasses every
  cache, so staff see the latest draft and sample content, with a banner and an **Exit preview**
  button. Visitors get a 401, and only same-site paths are accepted.

### Tests

- **Every seeded service, category and city is checked in a real browser**
  (`e2e/templates.spec.ts`): status 200, one H1, the title pattern, description length,
  canonical URL, Open Graph title and breadcrumbs, plus axe on each template.
- **The preview test runs only on an empty database** (CI), where it creates the first admin
  user. It skips locally so it never touches a real account.
- **Neon `dev` was patched with one-off scripts** when seeded copy changed, because the seed
  never overwrites existing documents. Production will be seeded fresh from the current data.

## Phase 5 — Quote system (2026-10-21)

### Saving leads

- **Database first, then everything else** (`lib/leads/pipeline.ts`). A lead and its file records
  are created in one transaction. A connection error (Neon waking up) gets one retry after 1.5 s;
  if that fails too, or on any other error, the full lead is written as JSON to private storage
  under `failed-leads/` and emailed to the owner. If both of those fail, the whole lead is
  written to the server log as a last resort. Re-imports happen from the Leads list ("Re-import
  backed-up leads", `POST /api/leads/reimport`); imported files move to
  `failed-leads/imported/`, so nothing is imported twice.
- **Notifications run after the visitor already has an answer** (`after()`), so a slow SMS or
  email never delays the form. The results go into the lead's notification log; a failure marks
  it `partial` or `failed` and is logged.
- **Small system updates write single columns** (`payload.db.updateOne`). A full Payload update
  rewrites the whole record, and a "Book this" click landing while notifications were being
  logged overwrote the log (seen in testing, now covered by an integration test).
- **Lead statuses:** the wizard, snow and holiday forms save as `estimate_viewed` before the price
  is shown; "Book this" moves it to `booking_requested` (only from `new` or `estimate_viewed`);
  "Request a call-back" ticks `callbackRequested`. A signed token (an HMAC of the lead id) lets
  the visitor do this without an account.

### Pricing

- **The minimum charge applies per service**, before bundle and frequency discounts. The brief's
  formula can be read either way; per service matches how the rules are stored.
- **The best matching discount of each kind applies**: one bundle discount (by number of priced
  services) and one frequency discount. Ranges are rounded outwards to $5.
- **Placeholders never reach the live site.** Rules and discounts marked "Needs review" are used
  (and badged "Placeholder price") in development and preview only. On the live site the line
  shows "We'll price this with you", and the e2e tests check that no placeholder or dollar figure
  appears. The admin dashboard and the pricing lists show how many prices still need review.
- **Pricing runs on the server only.** Rules, discounts and settings are cached server-side and
  never sent to the browser; the visitor only sees ranges.
- **Each service lists the repeat schedules it allows** (new "Frequencies" field). The wizard
  offers only the schedules every chosen service allows and Pricing settings offers.
- **Questions asked identically by several services are asked once** ("About your property"),
  then copied to each service, so choosing house washing and gutters doesn't ask for the home
  size twice.

### Forms

- **One schema per form, shared by browser and server** (`lib/schemas/quote.ts`). Answers to a
  service's own CMS questions are checked with a schema built from those questions, so a new
  instant service still needs no code. Number fields that would need converting are validated
  as text and converted on the server, so the form and server types stay identical.
- **The wizard runs in the browser only** (dynamic import, no server rendering): it restores
  saved progress from localStorage and reads `?service=` and `?plan=`. Commercial properties stop
  at the property step with a link to the bid form. A maintenance plan books as a `subscription`
  lead, as does any subscription service (garbage bin cleaning).
- **Dedicated forms are tied to specific services by slug** (`FLOW_SERVICES` in
  `config/quote.ts`): snow removal, the three holiday-light services and junk removal. Renaming
  those slugs means updating that file.
- **Holiday lights: "I don't know my roofline"** uses a rough length per home size
  (`ROOFLINE_ESTIMATES`), marked as estimated on the lead and listed for the owner to check.
- **Snow contract:** trigger depths and an optional payment note come from Seasonal settings
  (defaults 1, 2 or 3 inches; no payment terms invented). The deadline and routes left show only
  when set. Per-visit billing has no estimate; seasonal billing does.
- **The quick quote and the dedicated forms end on `/quote/thank-you`** (not indexed). The
  instant, snow and holiday flows show their estimate first.
- **The slide-in quick quote** (desktop, exit intent or 45 s, once per 7 days, never on quote
  pages) also stays away while the visitor is filling in a form, and loads its form code only
  when it opens.

### Uploads

- **Files go straight from the browser to private storage** with a 10-minute signed URL (R2
  presigned PUT in production; a signed local route in development). This avoids Vercel's
  4.5 MB request limit, so photos and PDFs up to 10 MB work.
- **Every file is checked by its content**, right after upload (so the visitor is told) and again
  when the form is sent. Anything that isn't JPEG, PNG, WebP, HEIC or (for bids) PDF is deleted.
- **Customer files never use the public Media collection or bucket.** `lead-files` records point
  at objects in the private bucket and are downloaded through a staff-only endpoint, always as an
  attachment. Deleting the record deletes the file.
- **Site photos use Payload's official S3 adapter on a separate public R2 bucket**, with
  `alwaysInsertFields`, so the schema is the same with or without R2 configured.
- Abandoned uploads (a visitor leaves without sending) stay in the private bucket; an R2
  lifecycle rule can expire them (README).
- **The lead-files schema change took two migrations.** Turning the upload collection into plain
  records adds and drops columns in one table, which makes the migration tool ask whether each new
  column is a rename; that question can't be answered in a script, so the drops and the adds are
  separate migrations.

### Spam, alerts, admin

- **Spam:** a honeypot (silently accepted, nothing saved), Turnstile when keys are set, and a
  rate limit of 6 submissions and 40 uploads per 10 minutes per visitor IP, kept in memory per
  server instance (no database or extra service). Local requests (no IP, or loopback) are never
  limited. If Cloudflare can't be reached, the submission goes through: losing a real lead is
  worse.
- **Twilio and Resend are called over plain HTTPS**, without SDKs. Who gets alerts is set in the
  admin (Site settings → Lead alerts); email falls back to the business email.
- **Customer messages:** an email confirmation when they gave an email; a text only with consent,
  always ending "Reply STOP to opt out". The reply-time line only appears when the owner set a
  response-time promise.
- **Review requests** (switch "Review requests"): when a lead with consent is first marked won,
  one text and/or email with the Google review link; `reviewRequestedAt` stops repeats.
- **Admin:** a dashboard with this week's leads by type, source and status, the database size
  against `DB_STORAGE_LIMIT_MB` (red warning from 80%), and banners for prices to review and leads
  waiting in backup; a status menu in each Leads row; CSV export from the list's ⋮ menu (Payload's
  import-export plugin: download only, no stored export files or job queue).
- **`check-config` now requires R2 and Resend for production builds** (Vercel's disk is read-only,
  and the owner must hear about leads) and recommends Turnstile and Twilio.
- **Property data lookup** (§10.6): an interface and a no-op provider only; nothing imported.

### Tests

- 13 pricing-engine tests, plus tests for retry, backup and re-import, messages, file sniffing,
  spam checks, tokens, notifiers and storage. Integration tests cover the transaction and its
  rollback, column-level updates, re-import with files and review requests against Postgres.
- Browser tests cover every flow on desktop and phone, uploads (including a disguised file), saved
  progress, the commercial exit, plans, the slide-in frequency cap and axe on every quote page.
  Staff tests (preview, dashboard, status change, pricing banner) run only on an empty database
  (CI), where they create the first account.
- **The e2e server runs with its own address as the site URL**: Payload only accepts signed-in
  writes from the configured origin (its CSRF check), and the test server uses port 3100.

## Phase 6 — Proof and content pages (2026-10-23)

### Pages

- **About, Careers and the legal pages are edited as globals** (Admin → Pages): About page,
  Careers page, Legal pages. Every About section hides itself until it has content; the starter
  copy invents no story, community work, certificates or staff benefits (listed in
  CONTENT_TODO.md). Certificates are PDFs uploaded to Media, which now accepts PDFs.
- **H1s follow the page-type pattern** like the other templates: "About WashCraft",
  "Careers at WashCraft in Denver Metro", "Contact WashCraft". The CMS headline ("One team for
  every season") shows under the H1.
- **Blog posts and solutions share one article template:** a table of contents built from the h2
  and h3 headings (sticky beside the text on wide screens), a call to action at the h2 nearest
  the middle (at the end of short articles), and the related services' quote flow. `{region}`
  tokens are filled inside the rich text at render time, so the CMS keeps the tokens.
- **The author box is hidden when the author isn't public.** Seeded posts are by the sample
  founder, so on the live site they show no author until a real team member is chosen.
- **Filters and search run in the browser over server-rendered content** (blog categories,
  solution topics, review services, FAQ search, gallery selects), so every card, answer and
  photo is in the HTML for search engines and works without JavaScript. Solutions are filtered
  by the categories of their related services (they have no category of their own).
- **Before & after: three selects** (category, service, city), each shown only when it would
  narrow the list. The lightbox is a full-screen dialog with a larger slider and Previous/Next;
  focus is trapped and Esc closes it.
- **Reviews: Google reviews and the owner's testimonials in one list.** The rating in the hero
  only shows when Google (or the owner, in Site settings) has provided one. With nothing real to
  show, the page says the business is just getting started with reviews and offers the
  "Leave us a review" link when it's set.
- **Unknown URLs at any depth get the site's own 404** via a catch-all route
  (`app/(site)/[...missing]`) that calls `notFound()`, instead of the experimental
  `global-not-found` file: the 404 keeps the header, footer and search. The catch-all renders on
  request (it isn't cached, so junk URLs can't fill the cache) and reads only cached data. The
  404 search runs in the browser over services, cities, solutions, articles and main pages.
- **Known Next.js limitation: 404 pages are drawn in the browser.** When a page calls
  `notFound()`, Next 16 sends the 404 status with an empty HTML shell (`<html id="__next_error__">`)
  and the browser renders the 404 page from the data in that response. Visitors see the full
  page (header, search, footer) as soon as it loads; without JavaScript it is blank. This applies
  to every `notFound()` page (unknown service, city, article…), not just the catch-all. Next's
  experimental `global-not-found` would server-render unmatched URLs only, so it isn't worth a
  second copy of the layout. Revisit if Next renders not-found boundaries on the server.
- **Inactive or sample job openings have no public page** (404), like other hidden content; a
  closed role only shows its "This role is closed" notice in preview.
- **Careers and Contact keep a quote CTA** (brief §3.4) as the closing band ("Looking for a
  quote instead?" on careers); legal pages have none.

### Forms

- **Contact form → a `contact` lead** through `submitLead` (save, retry, backup, notifications).
  The ZIP code is optional; without one the lead isn't marked out of area.
- **Job applications use the same safety net as leads** but are saved to Job applications, not
  Leads (`submitApplication`). A backed-up application is stored with `collection:
"applications"` and re-imported by the same "Re-import backed-up leads" button. The owner gets
  the SMS/email alert; the applicant gets a confirmation email that promises no reply time.
  Notification results are logged (applications have no notification-status field).
- **The résumé is optional** and may be a PDF or a photo (the existing `document` upload kind,
  checked by content, private storage). Many seasonal applicants don't have a résumé file.
- **Applications have their own consent line** ("WashCraft may call, text or email me about my
  application."), separate from the marketing consent on quote forms.

### Google reviews

- **Places API (New), once a day** (`/next/cron/google-reviews`, Vercel Cron in `vercel.json`,
  protected by `CRON_SECRET`). It stores the rating, review count and the up to five reviews
  Google returns, so pages never call Google while a visitor waits. Reviews Google stops
  returning are deleted, except ones staff hid, so a hidden review stays hidden if it returns.
  Without `GOOGLE_PLACES_API_KEY` or a Place ID the job does nothing.
- **Google's numbers win** over a rating typed into Site settings → Stats.
- **Attribution:** each Google review shows the reviewer's name, "Google review", the date and a
  link to the review on Google, as Google's display rules require. Reviewer photos are not shown
  (they would need another image domain allowed).

## Phase 7 — SEO, analytics and performance (2026-10-26)

### Structured data

- **JSON-LD is typed with `schema-dts`** and built in `lib/seo/json-ld.ts`. Every page carries the
  business (`HomeAndConstructionBusiness`) and `WebSite`. Service pages add `Service`, category
  hubs a `Service` with an `OfferCatalog` of their services (no prices), FAQ sections one
  `FAQPage`, inner pages a `BreadcrumbList`, and blog posts and solutions an `Article` (the
  business is the author until a real team member is chosen). Unset or placeholder facts are left
  out, never guessed.
- **Opening hours are read from the settings text** ("Mon–Sat 7am–6pm", or several ranges
  separated by commas). Text the parser can't read exactly is left out of the markup rather than
  marked up half right.
- **A service-area business gives only its state.** With no street address, the address is the
  state the cities are in (when they share one) plus the country, and `areaServed` lists the
  cities.
- **No review or rating markup at all.** Google ignores ratings a local business publishes about
  itself ("self-serving reviews"), so even real ones would earn nothing. The browser tests check
  that no `AggregateRating` or `Review` appears.

### Sitemap, robots, redirects, share images

- **`/sitemap.xml`** lists the indexable static pages plus every published category, service,
  city, post, solution, team member and open job (service-in-city pages only when switched on),
  with each document's last change. The thank-you page, styleguide and preview are left out, and
  samples never appear because the queries use public access.
- **`/robots.txt`:** development and preview deployments disallow everything. The live site keeps
  the admin, APIs, internal `/next/` routes and the thank-you page out, but leaves media files and
  share images crawlable.
- **Admin redirects apply only where there's no page.** Dynamic pages and the catch-all route call
  `notFoundUnlessMoved()`, which looks the path up in the cached redirect list before showing the
  404, so real pages never pay for it. Paths are matched case- and slash-insensitively, and pasted
  full URLs work. Saving a redirect clears the cache.
- **Share images:** the SEO tab's image, else the page's photo, else a generated 1200×630 card
  (`/next/og`, `next/og`) with the title on the brand color. The text travels in the URL with an
  HMAC signature, so the route can't be used to draw anything the site didn't write.

### Analytics

- **Nothing before consent.** GTM and Clarity are added only after "Accept", and only when their
  IDs are set. Consent Mode v2 marks analytics granted and all advertising denied (the banner only
  asks about analytics). Declining later tells both tools to stop and deletes their cookies.
- **Every event names its page's service, category and city.** Pages declare them in `wc:` meta
  tags (`pageMetadata({ context })`) and `track()` adds them, so a form doesn't need to know where
  it is shown. Call, text, email and review links are tracked by one listener on `data-track`.
- **CI uses made-up IDs** (`GTM-E2ETEST`) with every request to Google and Microsoft intercepted,
  so the loader is tested without sending anything anywhere.

### Performance

- **JavaScript only on first use.** The mobile menu, the slide-in quote panel and the 404 search
  index load when first needed instead of with every page; Zod stays out of the quick quote form's
  first download (`check-answers.ts`).
- **Colour-scheme client hints only in the admin.** Payload sends `Critical-CH`/`Vary` on every
  route for its theme. On public pages that made Chrome repeat the first request and split the
  CDN cache, so the headers are limited to `/admin`.
- **Lighthouse CI** (`lighthouserc.json`): the home page, a service page and a city page, five
  runs each on a simulated phone, failing below 90 in any category (median run). It runs in CI
  after the browser tests.
- **Measured 2026-10-26** (production build, Linux Chrome in the `lhci-client` image):
  accessibility and SEO 100 on all three pages; performance 93–96 on most runs (LCP about 2.6 s,
  TBT 110–210 ms, CLS 0). Some runs show Chrome presenting its first frame about a second after
  it was painted (seen in the traces; the page itself is idle by then), which Lighthouse's
  simulation turns into an LCP of about 3.5 s and a score of 87–89. Five runs instead of three
  keep the median away from those. On Windows the delay shows on nearly every run (scores in the
  70s and 80s), so local Windows numbers aren't the reference; CI is.
- **The JavaScript budget (< 150 KB compressed per content page, brief §15) isn't met:** about
  210 KB loads up front, of which Next.js and React themselves are about 136 KB. The rest is the
  header menu (Radix), the quick quote form (React Hook Form) and small widgets. Zod, the mobile
  menu, the slide-in panel, the map and the 404 index already load only when used. Getting under
  150 KB would mean dropping React Hook Form or Radix from the quick quote form and header.

### Sample proof (2026-10-26)

- **Demo data for the empty proof sections, at the owner's request.** The rating badge, trust
  strip and guarantee band had nothing to show, so they couldn't be reviewed. A sample rating
  (4.9 from 48 reviews) and a sample guarantee are now constants in code (`sampleProof` in
  `config/site.ts`), not settings, so they can't be mistaken for real facts or saved as them.
  `lib/proof.ts` uses them only while the real value is unset and never on the live site, and
  every place that shows them adds the "Sample" badge. Real values (Google, Site settings) always
  win.
- **Sample client logos are drawn for the demo**, not borrowed: six generic marks with "Sample …"
  names (`src/seed/media/sample-logo-*.png`). The marquee shows a client's logo file, or its name
  when there is none.
- **Testimonial cards show the testimonial's photo** when it has one. Three samples, including
  the featured one, use the owner's own job photos of the service they describe; no photos of
  people are used.
- Neon `dev` was patched with a one-off script for the logos and photos, because the seed never
  overwrites existing documents.

## Phase 8 — QA and handover (2026-10-26)

### Backups

- **Every backup is restored before it's kept.** The weekly workflow restores the dump into a
  Postgres 18 service container and compares row counts of key tables with production before
  uploading it, so a dump that can't be restored fails the run instead of sitting in the bucket.
  Dumps use pg_dump's custom format (compressed, and pg_restore can pick tables). The newest 8
  are kept under `backups/` in the private bucket.
- **pg_dump 18 comes from the PostgreSQL apt repository.** Ubuntu runners ship an older client,
  and pg_dump refuses to dump a newer server. `PGSSLROOTCERT=system` lets libpq check Neon's
  certificate, keeping `sslmode=verify-full`.
- **Test restore, 2026-10-26:** a pg_dump 18 of Neon `dev` (750 KB) restored into a local
  Postgres 18 with `--exit-on-error`, and the row counts matched (49 services, 6 cities, 6 posts,
  6 testimonials, 6 client logos, 29 media, migrations). The first scheduled run repeats this
  against `production`.

### Production setup

- **The production database is set up from GitHub** (`production-db.yml`, run by hand): the
  committed migrations, then the seed if ticked, from a US runner next to Neon. It refuses to
  seed without R2, because the seeded photos would otherwise be written to the runner's disk and
  lost. Vercel still migrates on every production build.
- **Vercel functions run in `cle1`** (Cleveland), next to Neon in us-east-2 (Ohio).

### Tests

- **Link check as a browser test** (`e2e/links.spec.ts`): every internal link on every page in
  the sitemap must answer 200 directly. A link that redirects counts as broken, so menus and copy
  always point at final addresses.
- **Seasonal hero switching is tested end to end by forcing the season** in Seasonal settings (a
  staff test, so CI only). A mocked browser clock can't change a page rendered on the server; the
  date logic itself is unit tested. Forcing a season also changes the announcement bar on every
  page, so the test has its own Playwright project that runs after all the others.
- **404 search:** among equal matches, titles that start with the query now come first ("gutter"
  finds Gutter Cleaning before Commercial Gutter Cleaning). The browser test waits for the index,
  which loads on first use since Phase 7, and picks from the results instead of the footer.

## After handover (2026-10-26)

- **Services mega-menu spans the header.** Radix wraps the menu list in a `position: relative`
  div, so the panel (`left-0 right-0`) was only as wide as the four menu buttons and its six
  category columns overlapped. The wrapper is made static, so the panel is laid out against the
  header row like the design intended; the smaller menus stay under their own buttons.
- **The admin dashboard uses Payload's modular dashboard** (`admin.dashboard`, marked
  experimental in Payload 3.91): a welcome box with shortcuts to everyday jobs, a leads box (who
  is waiting for a reply, booking requests, this week by source, the latest six requests) and a
  "Before you go live" checklist worked out from the database (business details, prices, lead
  alerts, real reviews, team, seasonal hero photos) with the storage meter. Staff can rearrange
  or remove the boxes; the warning banners stay above them and can't be removed. Check the
  dashboard after Payload updates, since the widget API may still change.
- **Leads come first in the admin menu**, ahead of the content collections, and every admin
  screen has a "View website" link.
