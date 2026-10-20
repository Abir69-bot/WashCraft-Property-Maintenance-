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
