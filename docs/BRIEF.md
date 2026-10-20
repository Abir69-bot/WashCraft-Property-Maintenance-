# WashCraft Property Maintenance — Website Build Brief for Claude Code

> Paste this whole file into Claude Code, or save it as `docs/BRIEF.md` in an empty repo and start Claude Code with:
> **"Read docs/BRIEF.md completely, then follow section 0."**
>
> Database: **Neon serverless Postgres (free plan)**. Have your Neon connection strings ready — see section 4A.

---

## 0. How to work on this project

You are a senior full-stack engineer and conversion-focused web designer. Build a production-ready marketing and lead-generation website for **WashCraft Property Maintenance**.

1. Read this entire brief before writing any code.
2. Create `CLAUDE.md` in the repo root that records the stack, commands, folder structure, coding conventions and the rules in section 3, so they persist across sessions.
3. Post a short implementation plan (phases from section 20, plus any assumptions) and **wait for my "go"** before building.
4. Never invent business facts. Use the placeholders in section 2 from one config source. At the end of every phase, list every unresolved TODO.
5. Work phase by phase. At the end of each phase: run lint, typecheck, unit tests and a production build; fix all failures; commit with a conventional-commit message; post a summary (built, left, TODOs). Then continue to the next phase.
6. Keep `FEATURES.md` (section 17) updated: tick each feature only when it works in the browser.
7. Prefer simple, strongly typed, reusable code. No dead code, no unused dependencies. Everything must run on free accounts only — a free Neon account is the one required signup. Every other third-party integration degrades gracefully when its env var is missing (log to console, still save the lead).
8. When something in this brief is ambiguous, choose the option that produces more leads and better accessibility, note the decision in `DECISIONS.md`, and keep going.

---

## 1. Project overview

**Client:** WashCraft Property Maintenance — residential and commercial property maintenance: exterior cleaning, interior cleaning, winter snow and ice services, holiday lighting, and yard / exterior care.

**Goal:** turn visitors into qualified leads (instant quotes, custom quotes, seasonal contracts, commercial bids) and rank in local search for every service and service area.

**Reference sites — copy structure and features only, never content:**

- https://highfiveexteriorcleaning.com/ — conversion-first. Quick-quote form on every page, "instant pricing" button, call **and** text links, satisfaction guarantee, three-step process, comparison table, tabbed service explorer, one landing page per city, SMS lead alerts, self-serve price vs custom quote split.
- https://www.washtechsolution.ca/ — trust-first. 5-star rating badge, client logo marquee, background video, outcome-led service cards, testimonials with photos and "Verified Google Review" links, founder story, insurance/compliance block for property managers, rich service and city pages (neighbourhoods, cited local stats, localised FAQs), "solutions" long-tail pages, before/after sliders, seasonal lighting services.

**Primary conversions (in order):** quote submitted, phone call, text message, seasonal contract sign-up, commercial bid request.

---

## 2. Business details — single source of truth

Create `src/config/site.ts` and mirror it in a Payload global `site-settings` so the owner can edit it in the admin. Values in `[BRACKETS]` are TODO placeholders:

- In development, render placeholders visibly (e.g. a yellow "TODO: phone" chip).
- Add `scripts/check-config.ts`, run in CI before production builds, that fails if any required placeholder is still unset.

```ts
export const site = {
  name: 'WashCraft Property Maintenance',
  shortName: 'WashCraft',
  tagline: '[TAGLINE]',
  phone: '[PHONE]',                 // used for tel: and sms: links
  email: '[EMAIL]',
  address: '[STREET, CITY, PROVINCE/STATE, POSTAL CODE]', // or null for a service-area business
  hours: '[e.g. Mon–Sat 8am–6pm]',
  country: '[CA | US]',             // drives currency, spelling, consent law copy
  currency: '[CAD | USD]',
  locale: '[en-CA | en-US]',
  region: '[e.g. Greater Vancouver]',
  serviceAreas: ['[CITY 1]', '[CITY 2]', '[CITY 3]'], // each becomes a city page
  foundedYear: null,
  insuranceCoverage: null,          // e.g. '$2M liability' — hide if null
  workersCompRegistration: null,    // e.g. WorkSafeBC / WSIB number — hide if null
  licenceNumbers: [],
  googlePlaceId: null,
  googleReviewUrl: null,
  responseTimePromise: null,        // e.g. 'within 1 business hour' — hide if null
  guarantee: null,                  // owner-written guarantee text — hide band if null
  social: { facebook: null, instagram: null, linkedin: null, youtube: null, tiktok: null, nextdoor: null },
  stats: { jobsCompleted: null, happyClients: null, rating: null, reviewCount: null }, // hide any null stat
};
```

---

## 3. Non-negotiable rules

1. **Original brand.** Do not copy any text, image, logo, colour scheme, icon set, review, staff name, client logo, phone number or price from the reference sites. Replicate layouts, page types, features and conversion patterns only. Write all copy from scratch.
2. **No fake social proof.** Sample testimonials, reviews, client logos, team members, gallery items and stats are seeded with `isSample: true`. They show a visible "Sample" badge in development and preview, and are **automatically excluded in production**. Sections with no real entries hide themselves.
3. **No unverifiable claims** ("#1", "best in", years in business, insurance amounts, response times, guarantees) unless the value is set in site settings.
4. **Every page has a quote CTA**, except the quote flow itself and legal pages.
5. **Leads are never lost.** Save to the database first, then notify. If SMS/email fails, log it and flag the lead. If the database is unreachable (for example a Neon cold-start timeout after one retry), email the full lead to the owner and store it in R2 as a fallback (section 4A).
6. **Accessible and fast:** WCAG 2.2 AA and the performance budget in section 15 are acceptance criteria, not nice-to-haves.
7. **No online payments** in this version.

---

## 4. Tech stack

Use the latest stable versions at build time.

| Concern | Choice |
| --- | --- |
| Framework | Next.js (App Router), React, TypeScript in strict mode |
| Styling | Tailwind CSS with design tokens as CSS variables; Radix-based primitives (dialog, accordion, tabs, select, popover) in a shadcn/ui-style `components/ui` folder |
| CMS / admin | Payload CMS v3+ embedded in the Next.js app, admin at `/admin`, using the official Postgres adapter (`@payloadcms/db-postgres`) |
| Database | **Neon serverless Postgres, free plan** — `main` branch for production, `dev` branch for local development (section 4A) |
| Hosting | Vercel (Neon integration can inject the database env vars); images and uploads on Cloudflare R2 |
| Forms | React Hook Form + Zod, with schemas shared between client and server; server actions or route handlers |
| Spam protection | Cloudflare Turnstile + honeypot field + per-IP rate limit (Turnstile skipped when keys are missing in dev) |
| Notifications | Twilio (SMS) and Resend (email), each behind a `Notifier` interface with a console fallback |
| Media | Payload uploads: local disk in dev, S3-compatible storage (Cloudflare R2) in prod; `next/image`, AVIF/WebP |
| Maps | Leaflet + OpenStreetMap tiles (service-area map, city maps) |
| Reviews | Google Places API (Place Details), cached 24 h in the database; manual testimonials as fallback |
| Booking (optional) | Cal.com embed for site-visit scheduling, behind a feature flag |
| Analytics | GA4 via Google Tag Manager + Microsoft Clarity, loaded only after cookie consent |
| Testing | Vitest (unit), Playwright (e2e), @axe-core/playwright (accessibility), Lighthouse CI |
| Quality | ESLint, Prettier, GitHub Actions CI (lint, typecheck, test, build, config check, link check). CI uses a throwaway Postgres service container, never Neon, so tests don't spend Neon compute hours |

Folder structure (adjust if Payload's template requires):

```
src/
  app/(site)/...        public pages
  app/(payload)/...     Payload admin + API
  collections/          Payload collections
  globals/              Payload globals
  components/ui/        primitives
  components/sections/  page sections (Hero, TrustStrip, BeforeAfter, ...)
  components/quote/     quote forms and wizard
  lib/pricing/          pure pricing engine + tests
  lib/notify/           Notifier implementations
  lib/seo/              metadata + JSON-LD builders
  config/site.ts
  seed/                 seed scripts and content
  migrations/           Payload database migrations (committed)
```

---

## 4A. Database — Neon serverless Postgres

Neon (free plan) is the project's only database. It is standard Postgres, so use Payload's normal Postgres adapter — no Neon-specific ORM or driver is required.

### Branches

| Neon branch | Used by | Rules |
| --- | --- | --- |
| `main` | Production (Vercel production environment) | Schema changes only through committed migrations; never `push` |
| `dev` | Local development and seeding | Safe to reset from `main` at any time |
| `preview-*` (optional) | Vercel preview deployments | Only if it stays within free-plan branch limits; otherwise previews use `dev` |

### Connection strings

Two strings per branch, both with `sslmode=require`. Add both to `.env.example`:

```bash
# Pooled — host contains "-pooler". Used by the running app (serverless-safe).
DATABASE_URI=postgresql://USER:PASSWORD@ep-xxxx-pooler.REGION.aws.neon.tech/washcraft?sslmode=require

# Direct — no "-pooler". Used only for migrations and backups (pg_dump).
DATABASE_URI_DIRECT=postgresql://USER:PASSWORD@ep-xxxx.REGION.aws.neon.tech/washcraft?sslmode=require

# Storage warning threshold for the admin widget (match your Neon plan's per-project limit)
DB_STORAGE_LIMIT_MB=512
```

Validate all env vars with Zod in one place (`src/lib/env.ts`) and fail fast at startup if `DATABASE_URI` is missing. If the Vercel–Neon integration injects `DATABASE_URL` / `DATABASE_URL_UNPOOLED`, map them to these names in that same file.

### Payload adapter configuration

```ts
import { postgresAdapter } from '@payloadcms/db-postgres'
import { env } from '@/lib/env'

export const db = postgresAdapter({
  pool: {
    connectionString: env.DATABASE_URI,  // pooled string
    max: 5,                              // small pool; Neon's PgBouncer does the heavy lifting
    connectionTimeoutMillis: 15_000,     // allow for scale-to-zero cold starts
    idleTimeoutMillis: 10_000,
  },
  push: process.env.NODE_ENV !== 'production', // auto-sync schema in dev only
  migrationDir: './src/migrations',
})
```

Check the current Payload docs for the exact option names at build time and adjust if they have changed.

### Migrations workflow

- **While building:** `push` keeps the `dev` branch in sync automatically.
- **Before merging a schema change:** run `pnpm payload migrate:create <name>` and commit `src/migrations`.
- **On deploy:** the Vercel build command is `pnpm db:migrate && pnpm build`, where `db:migrate` runs `payload migrate` with `DATABASE_URI` set to `DATABASE_URI_DIRECT` (migrations must not go through the pooler).
- Add scripts: `db:migrate`, `db:migrate:create`, `db:reset-dev` (re-seed the `dev` branch), `seed`.

### Staying inside the free plan

- **Compute (scale to zero):** visitor-facing pages are static/ISR, so page views never wake the database. Only form submissions, the admin, on-demand revalidation and scheduled jobs query it. Revalidate pages from Payload `afterChange` hooks instead of short time-based revalidation. No uptime monitors or health checks that hit the database. Refresh Google reviews at most once a day.
- **Cold starts:** the first query after idle can take a few seconds. Quote forms show a clear "Sending…" state; the server retries once on connection errors; if it still fails, it emails the full lead to the owner and writes the JSON to a private R2 path (`failed-leads/`), and an admin task re-imports those files. Cover this with a test.
- **Storage:** images, photos and RFP files live in R2 — Postgres stores only their metadata. Cap Payload versions (`versions: { drafts: true, maxPerDoc: 20 }`). Never store logs or analytics events in the database. The admin dashboard shows current database size (`select pg_database_size(current_database())`) and warns at 80% of `DB_STORAGE_LIMIT_MB`.
- **Backups:** add a weekly GitHub Actions workflow that runs `pg_dump` (same major version as Neon) against `DATABASE_URI_DIRECT` for `main`, compresses it, uploads it to a private R2 bucket and keeps the last 8 dumps. Document the restore command in the README.
- **Region:** create the Neon project in the region closest to your customers and set the Vercel functions region to match it.
- **Extensions:** PostGIS is available on Neon; enable it with a migration only if the optional property lookup (section 10.6) is turned on.
- **CI and tests:** GitHub Actions uses a `postgres` service container (same major version as Neon). Tests never touch `main`.

### One-time setup (document step by step in the README)

1. Create a free Neon account and a project named `washcraft`, choosing the Postgres version Payload supports and the region closest to your customers.
2. Create a `dev` branch from `main`.
3. Copy the pooled and direct connection strings for both branches.
4. Put the `dev` strings in local `.env`; put the `main` strings in Vercel's production environment (or connect the Neon integration).
5. Run `pnpm dev` (schema pushes to `dev`), then `pnpm seed`.
6. Before the first production deploy, create the initial migration and let the build run `pnpm db:migrate` against `main`.

---

## 5. Brand and design system

**Personality:** crafted, reliable, local, seasonal. "Craft" means precision and care; the site should feel premium but approachable.

**Logo:** create an original SVG placeholder — a "WashCraft" wordmark plus a simple mark (a water droplet merged with a house roofline). Provide colour, white and mono versions, a favicon set and an Open Graph default image. Mark it as a placeholder in `CONTENT_TODO.md`.

**Colour tokens** (CSS variables; light theme only for v1):

| Token | Hex | Use |
| --- | --- | --- |
| `--primary` | #0E4D64 | Header, footer, headings, dark sections |
| `--secondary` | #2CB1BC | Links, icons, highlights |
| `--cta` | #F5B700 | Primary buttons only, with `--ink` text |
| `--ink` | #14202B | Body text |
| `--muted` | #5B6B78 | Secondary text |
| `--surface` | #F4F8FA | Alternating section backgrounds |
| `--success` / `--error` | #2E9E5B / #C62828 | Form states |
| `--winter` | #3B82C4 | Winter category badges and icons only |
| `--holiday` | #B83A3A | Holiday category badges and icons only |
| `--yard` | #4C9A50 | Yard-care category badges and icons only |

Verify every text/background pair meets 4.5:1 contrast.

**Typography:** Plus Jakarta Sans (headings, 700/800) and Inter (body, 400/500/600), self-hosted with `next/font`. Desktop scale: H1 48, H2 36, H3 24, body 17 (line-height 1.6), small 14. Mobile: H1 34, H2 28, H3 20, body 16.

**Layout:** 8 px grid; container 1200 px max with 24 px gutters (16 px on phones); section padding 96 px desktop / 56 px mobile; 12 px card radius; pill buttons; minimum 44 px tap targets; breakpoints 480 / 768 / 1024 / 1280.

**Imagery:** build a `<PhotoPlaceholder label="Crew soft-washing a two-storey house" />` component (neutral background, camera icon, the label text, correct aspect ratio) so the client knows exactly which photos to shoot. No stock photos of people. Before/after pairs use the same placeholder pattern until real photos are uploaded.

**Icons:** Lucide. One consistent icon per service and per category.

**Motion:** subtle fades and slides only; marquees and auto-advancing carousels pause on hover and are disabled under `prefers-reduced-motion`.

**Styleguide:** a dev-only `/styleguide` route showing tokens, typography and every component state.

---

## 6. Sitemap and URL rules

| Route | Purpose |
| --- | --- |
| `/` | Home |
| `/services` | All services, filterable by category, with search |
| `/exterior-cleaning`, `/interior-cleaning`, `/winter-services`, `/holiday-lighting`, `/yard-care`, `/commercial` | Category hub pages |
| `/services/[service]` | Service page (one template, CMS-driven) |
| `/commercial/strata` | Strata and property-manager page |
| `/maintenance-plans` | Recurring plans and seasonal packages |
| `/areas` | Service-area overview with map and postal-code checker |
| `/areas/[city]` | City landing page |
| `/areas/[city]/[service]` | Service-in-city page — generated only for combinations the owner enables (flag `cityServicePages`) |
| `/quote` | Quote hub (routes by job type) |
| `/quote/instant` | Instant-price wizard |
| `/quote/custom` | Custom quote with photo upload |
| `/quote/snow-contract` | Winter seasonal contract sign-up |
| `/quote/holiday-lights` | Christmas light install / removal / storage booking |
| `/quote/junk-removal` | Photo-based junk removal quote |
| `/quote/commercial` | Commercial / strata bid request |
| `/quote/thank-you` | Confirmation (noindex) |
| `/before-and-after` | Filterable gallery |
| `/reviews` | Reviews and testimonials |
| `/about`, `/team/[slug]` | Company story, founder, team bios |
| `/careers`, `/careers/[slug]` | Jobs and applications |
| `/blog`, `/blog/[slug]` | Articles |
| `/solutions`, `/solutions/[slug]` | Long-tail problem/solution pages (e.g. "roof moss removal", "ice dam prevention") |
| `/faq` | Grouped FAQ |
| `/contact` | Contact details, form, map |
| `/privacy`, `/terms`, `/accessibility` | Legal |
| `/styleguide` | Dev only |
| `sitemap.xml`, `robots.txt`, custom `404` | Generated |

URL rules: lowercase hyphenated slugs; exactly one canonical URL per page; menu, footer, breadcrumbs and sitemap all use the same URLs; a Payload `redirects` collection powers 301s whenever a slug changes.

---

## 7. Service catalog — seed every one of these

**Quote modes:** `instant` (wizard computes a price range), `custom` (form + photos), `contract` (seasonal contract flow), `subscription` (recurring), `bid` (commercial bid form).
**Seasons** (configurable date ranges in the `seasonal-settings` global): all-year, spring, summer, fall, winter (default Nov–Mar), holiday (default Oct–Jan).

### 7.1 Exterior Cleaning & Maintenance — `/exterior-cleaning`

| Service | Slug | Quote mode | Season | Main pricing input |
| --- | --- | --- | --- | --- |
| Pressure Washing | pressure-washing | instant | spring–fall | Surface area (sq ft), surface type |
| Soft Washing | soft-washing | instant | all-year | Surface area, surface type |
| House Washing | house-washing | instant | all-year | Floor-area band, storeys, siding type |
| Driveway Cleaning | driveway-cleaning | instant | spring–fall | Area, surface (concrete, pavers, asphalt) |
| Patio & Balcony Cleaning | patio-balcony-cleaning | instant | spring–fall | Area, surface |
| Deck Cleaning | deck-cleaning | instant | spring–fall | Area, material |
| Fence Cleaning | fence-cleaning | instant | spring–fall | Linear ft, one or both sides |
| Gutter Cleaning | gutter-cleaning | instant | fall, spring | Linear ft (or estimate from size + storeys), guards |
| Gutter Brightening | gutter-brightening | instant | all-year | Linear ft (exterior gutter faces) |
| Roof Cleaning | roof-cleaning | instant | all-year | Roof area or home size, pitch, roof type |
| Window Cleaning | window-cleaning | instant | all-year | Window count, inside/outside, screens, tracks |
| Exterior Surface Cleaning | exterior-surface-cleaning | custom | all-year | Description + photos (walls, signage, curbs) |
| Driveway Sealing / Sealcoating | driveway-sealing | instant | summer | Area, crack repair |

### 7.2 Interior / General Maintenance — `/interior-cleaning`

| Service | Slug | Quote mode | Season | Main pricing input |
| --- | --- | --- | --- | --- |
| Inside House Cleaning | house-cleaning | instant | all-year | Bedrooms, bathrooms, sq ft, add-ons, frequency |
| Move-In / Move-Out Cleaning | move-in-move-out-cleaning | instant | all-year | Bedrooms, bathrooms, appliances inside |
| Post-Construction Cleaning | post-construction-cleaning | custom | all-year | Size, stage, photos |
| Garage Cleaning | garage-cleaning | instant | all-year | 1/2/3-car, declutter yes/no |
| Junk Removal / Hauling | junk-removal | custom (dedicated flow) | all-year | Photos, load size |
| General Property Maintenance | property-maintenance | custom | all-year | Task list, frequency |

### 7.3 Winter Services — `/winter-services`

| Service | Slug | Quote mode | Season | Main pricing input |
| --- | --- | --- | --- | --- |
| Snow Removal | snow-removal | contract | winter | Hub page for all snow services |
| Driveway Snow Clearing | driveway-snow-clearing | contract | winter | Driveway size (cars / area) |
| Walkway & Sidewalk Snow Clearing | walkway-sidewalk-snow-clearing | contract | winter | Linear ft of walkway and sidewalk |
| Salting / De-Icing | salting-de-icing | contract add-on | winter | Area, per application or seasonal |
| Ice Control | ice-control | contract add-on | winter | Anti-icing pre-treatment and monitoring plan |
| Snowbank Removal | snowbank-removal | custom | winter | Photos, volume |
| Commercial Snow Clearing | commercial-snow-clearing | bid | winter | Lot size, walkways, hours of operation |

### 7.4 Seasonal — `/holiday-lighting`

| Service | Slug | Quote mode | Season | Main pricing input |
| --- | --- | --- | --- | --- |
| Christmas Light Installation | christmas-light-installation | instant (dedicated flow) | holiday | Roofline linear ft, storeys, trees/shrubs, own vs supplied lights |
| Christmas Light Removal | christmas-light-removal | add-on | holiday (Jan) | Included or per job |
| Christmas Light Storage | christmas-light-storage | add-on | holiday | Per season |

### 7.5 Yard & Exterior Care — `/yard-care`

| Service | Slug | Quote mode | Season | Main pricing input |
| --- | --- | --- | --- | --- |
| Spring/Fall Yard Cleanup | yard-cleanup | instant | spring, fall | Yard size (S/M/L), debris bags |
| Leaf Removal | leaf-removal | instant | fall | Yard size, haul-away |
| Garden/Bed Cleanup | garden-bed-cleanup | custom | spring, fall | Bed count/area, photos |
| Garbage Bin Cleaning | garbage-bin-cleaning | subscription | all-year | Number of bins, frequency |
| Exterior Caulking | exterior-caulking | custom | spring–fall | Windows/doors count, photos |
| Minor Exterior Repairs | minor-exterior-repairs | custom | all-year | Description + photos |
| Fence/Deck Staining | fence-deck-staining | instant | summer | Area or linear ft, condition |
| Exterior Painting | exterior-painting | custom (site visit) | summer | Photos, storeys |
| Garage/Driveway Pressure Cleaning | garage-driveway-pressure-cleaning | instant | all-year | Garage floor + driveway area |

### 7.6 Commercial & Strata — `/commercial` (from the reference sites; seed with `enabled: true`, owner can disable)

| Service | Slug | Quote mode |
| --- | --- | --- |
| Commercial Property Maintenance | commercial-property-maintenance | bid |
| Strata Building Washing | strata-building-washing | bid |
| Strata / Commercial Gutter Cleaning | commercial-gutter-cleaning | bid |
| Commercial Window Cleaning | commercial-window-cleaning | bid |
| Strata / Commercial Roof Cleaning | commercial-roof-cleaning | bid |
| Commercial Pressure Washing | commercial-pressure-washing | bid |
| Parkade Cleaning | parkade-cleaning | bid |
| Graffiti Removal | graffiti-removal | custom |
| Solar Panel Cleaning | solar-panel-cleaning | instant (panel count) |
| Glass Awning Cleaning | glass-awning-cleaning | custom |
| Permanent LED Lighting | permanent-led-lighting | custom (site visit) |

### 7.7 Overlapping services — give each a distinct angle and cross-link

- **Pressure Washing** = hub for all hard surfaces → links to Driveway Cleaning, Patio & Balcony, Deck, Garage/Driveway Pressure Cleaning.
- **Driveway Cleaning** = driveway only; **Garage/Driveway Pressure Cleaning** = garage floor + driveway combo (oil stains, tire marks).
- **Soft Washing** = the low-pressure method for delicate surfaces; **House Washing** = the whole-home package that uses it.
- **Snow Removal** = hub; **Driveway** and **Walkway & Sidewalk** pages each cover one area.
- **Salting / De-Icing** = treatment after snowfall; **Ice Control** = preventive anti-icing and monitoring.
- **Fence Cleaning** vs **Fence/Deck Staining**: cleaning is a prerequisite for staining; offer them as a bundle.

### 7.8 Content fields on every service

Hero headline and one-line promise · problem and 3–5 benefits (also shown as tabs) · "What's included" checklist · method ("how we do it") and safety notes · 4–6 process steps · pricing guide (from-price or price factors; hidden if empty) · add-ons · best season and booking-window note · 5–7 FAQs · related services (3) · related solutions/articles · icon · hero image placeholder label · SEO title and description · `quoteMode` · `quoteQuestions` (section 10.3).

Write original, genuinely helpful placeholder copy for every service (300–500 words), in plain language, grade 6–8 reading level, using `site.region` naturally. No keyword stuffing.

---

## 8. Global components

- **Announcement bar** (top): the current seasonal message from `seasonal-settings` (e.g. "Snow contracts for [season] are open — limited routes"), dismissible for 7 days.
- **Utility bar:** phone (tel:), "Text us" (sms:), hours, service-area link.
- **Header (sticky, shrinks on scroll):** logo; mega-menu "Services" with the 6 categories, an icon and links per service, and a featured seasonal card; "Commercial" dropdown; "Areas" dropdown; "Company" dropdown (About, Team, Reviews, Before & After, Careers, Blog, FAQ); primary button "Get instant price".
- **Mobile:** full-screen menu with accordions; **sticky bottom action bar** with Call · Text · Get quote (below 768 px, hidden on quote pages).
- **Slide-in quick quote:** desktop only; opens on exit intent or after 45 s; once per visitor per 7 days; never on quote pages; fully keyboard-accessible.
- **Quick quote form component:** name, phone, postal code, service (grouped select); reused in hero, service pages, city pages and the slide-in.
- **Breadcrumbs** on all inner pages (with BreadcrumbList schema).
- **"Let's talk" call band:** large phone number + scrolling marquee before the footer on all pages except quote and legal pages.
- **Footer:** logo and blurb; social icons; columns for each service category (top services + "All services"), Areas, Company, Contact (phone, text, email, hours, address); insurance/compliance badges (only when set); legal links; copyright with current year.
- **Cookie consent banner** controlling analytics and Clarity.
- **Optional chat widget** slot behind a feature flag (off by default).

---

## 9. Page specifications

### 9.1 Home — sections in this order

1. **Hero:** rating badge (only if a real rating exists); H1 combining service + `site.region`; subline naming the local problem (weather, moss, snow) plus proof points from settings; buttons "Get instant price" and "Call [phone]"; background video (muted, looped, with poster, disabled under reduced motion) or photo carousel. **Seasonal hero variants** switch automatically by date (winter → snow contract CTA; holiday → lights booking; spring/fall → cleanup and gutters), with admin override.
2. **Quick quote form** strip.
3. **Client logo marquee** (hidden until real logos exist).
4. **Trust strip:** 4 checkmarks (e.g. insured, workers' comp registered, before/after photos on every job, satisfaction guarantee) — each only if backed by settings.
5. **Service categories:** 6 large tiles, then a **tabbed service explorer** of featured services, each with a short description, 3 bullets and an outcome-led button ("Get streak-free windows").
6. **Seasonal spotlight:** services in season right now.
7. **How it works:** 3 steps (Get a quote → Pick a date → Relax), with a recurring-plan upsell on step 3.
8. **Before/after:** drag sliders with arrow controls, 3–6 pairs.
9. **Guarantee band** (only if `site.guarantee` is set).
10. **"Need us now?" block:** call and text buttons.
11. **Testimonials:** Google rating badge and review count; cards with photo, name, city, service, star rating, and a "Verified Google review" link when the source is Google; one featured testimonial with a large photo.
12. **Why choose us:** 6 image cards (reliable, safety-trained, eco-friendly products, damage-free methods, locally owned, clear pricing).
13. **Comparison table:** WashCraft vs "typical independent operator" vs "typical large company" on 5–6 criteria. Generic categories only; never name competitors.
14. **Commercial & strata block** with the insurance/compliance summary and a link to `/commercial`.
15. **Maintenance plans teaser.**
16. **Meet the founder:** photo, short story, link to bio.
17. **Service areas:** city grid + Leaflet map + postal-code checker.
18. **FAQ:** 6–8 objection-handling questions.
19. **Latest articles:** 3 cards.
20. **Final CTA band** + "Let's talk" band.

### 9.2 Category hub page (×6)

Hero with category icon and accent colour · intro · grid of the category's services · seasonal timing ("book by…") · bundles/packages for the category · before/after filtered to the category · testimonials filtered · category FAQ · CTA.

### 9.3 Service page (one template, ×~55)

1. Breadcrumbs · H1 "[Service] in [region]" · promise · CTA buttons · quick quote form.
2. Intro with 3 benefit bullets and a trust line.
3. Tabbed benefits (3 tabs).
4. "What's included" checklist.
5. Method and safety (e.g. soft wash vs pressure wash explained).
6. Process steps (4–6), numbered.
7. Pricing guide and add-ons (hidden if empty).
8. 6 trust icons (fast quotes, fair pricing, insured, satisfaction, warranty, top-rated — each only if backed).
9. Comparison table (shared component).
10. "Need us now?" call/text block.
11. Before/after and testimonials filtered to this service.
12. Service areas list linking to city pages (and service-in-city pages when enabled).
13. FAQ (FAQPage schema).
14. Related services, related solutions and articles.
15. Final CTA. Seasonal services show a "Booking window" badge and switch the CTA to the right flow (snow contract, holiday lights).

### 9.4 City page (×N from `serviceAreas`)

H1 "Property maintenance in [City]" + neighbourhoods served · trust strip · city photo placeholder · **local conditions** block using owner-entered stats with source links (rainfall, snowfall, tree canopy) — never invented; hidden if empty · service cards rewritten per city · before/after and reviews from that city · 3-step "what to expect" · neighbourhood cards (photo placeholder + blurb) · localised "why choose us" · Leaflet map of the area · localised FAQ · related services/solutions · CTA. In the admin, warn if a city's unique intro is under 150 words (avoid doorway pages).

### 9.5 Commercial hub and `/commercial/strata`

Audience: property managers, strata councils, retail and offices. Sections: services for commercial clients · single point of contact · volume and multi-site pricing · year-round maintenance contracts (cleaning + snow + lighting) · **insurance and compliance block** (liability insurance, workers' comp, safety training, certificates on request) · documentation request form · client logos (real only) · case studies (CMS, optional) · bid CTA.

### 9.6 Maintenance plans

Three tiers (e.g. Essential, Plus, Premium) and four seasonal packages (Spring refresh, Summer exterior, Fall prep, Winter care) in a comparison table, built from CMS data. Price fields may be null → show "Custom quote". CTA per plan opens the instant wizard pre-filled.

### 9.7 Other pages

| Page | Must include |
| --- | --- |
| `/services` | All services grouped by category, filter chips, search |
| `/quote` | Route cards: Instant price (most homes), Custom quote (large or unusual jobs), Snow contract, Holiday lights, Junk removal, Commercial bid; phone and text |
| `/before-and-after` | Filter by category, service and city; drag sliders; lightbox; captions |
| `/reviews` | Aggregate rating, Google reviews + manual testimonials, filter by service, "Leave us a review" button (googleReviewUrl) |
| `/about` | Story, mission and values, founder, team grid, credentials with downloadable certificates, community involvement |
| `/team/[slug]` | Photo, role, bio, specialities, quote CTA |
| `/careers` | Why work here, benefits, open roles, application form (name, email, phone, role, résumé upload, message) |
| `/blog`, `/solutions` | Listing with categories; article template with table of contents, author box, mid-article CTA, related services, related posts |
| `/faq` | Grouped accordion with client-side search |
| `/contact` | Form, phone, text, email, hours, address, map, postal-code checker |
| `/quote/thank-you` | What happens next, response-time promise (if set), optional "book a call" (Cal.com), conversion event, links back |
| `404` | Search, popular services, CTA |

---

## 10. Quote and booking system

### 10.1 Quick quote (short form)

Fields: name, phone, postal code, service (grouped select), optional email, consent checkbox (unticked). Server-validated with Zod, Turnstile, honeypot and rate limit. Creates a lead with `source: 'quick_form'` and notifies the owner.

### 10.2 Instant-price wizard (`/quote/instant`)

1. Postal code → service-area check (match against `cities.postalPrefixes`). Outside the area: continue, but flag the lead `outOfArea`.
2. Property type: house, townhouse, condo/strata unit, commercial (commercial exits to the bid form).
3. Services: multi-select from all `instant` services, grouped by category; preselected via `?service=` query param.
4. Questions for each selected service, rendered from that service's `quoteQuestions`.
5. Frequency: one-time, twice a year, quarterly, monthly (only options the service allows), each with a configurable discount.
6. **Contact step:** name, phone, email, address, preferred dates, notes, consent. The lead is saved here, before the price is shown (status `estimate_viewed` if they leave).
7. **Result:** price range per service and total, bundle discount applied, minimum charge, tax note, "estimate confirmed after photos or a site visit" note; buttons "Book this" (status `booking_requested`) and "Request a call-back".

Progress saved in `localStorage` (wrapped in try/catch); back/next without losing data; progress bar; fully keyboard- and screen-reader-accessible.

### 10.3 Data-driven questions

Each service stores `quoteQuestions` as JSON validated by Zod, e.g.:

```json
[
  { "id": "storeys", "type": "select", "label": "How many storeys?", "options": ["1", "2", "3"], "required": true },
  { "id": "area", "type": "number", "label": "Approximate area (sq ft)", "min": 50, "max": 20000, "helpText": "A rough guess is fine" },
  { "id": "screens", "type": "boolean", "label": "Clean screens too?" }
]
```

Adding a new instant service must require no code changes.

### 10.4 Pricing engine (`src/lib/pricing`)

Pure, fully unit-tested TypeScript. Owner-editable `pricing-rules` per service: unit, base fee, unit rate, multipliers keyed by answer (e.g. storeys, surface type, roof pitch), add-on prices, minimum charge. `discounts`: bundle (2+ / 3+ services), frequency plans.

```
price = max(minCharge, Σ over services (baseFee + unitRate × quantity × Π multipliers + addOns))
        × (1 − bundleDiscount) × (1 − frequencyDiscount)
range  = [price × rangeLow, price × rangeHigh]   // rangeLow / rangeHigh configurable, e.g. 0.9 / 1.15
```

Seed every rule with placeholder numbers and `needsReview: true`; show an admin banner until the owner has reviewed all rules. Never present placeholder prices as real in production (fall back to "Request a quote" when `needsReview` is true and `NODE_ENV === 'production'`).

### 10.5 Dedicated flows

- **Snow contract (`/quote/snow-contract`):** property type; driveway size (number of cars or area); walkway and sidewalk length; add-ons (salting/de-icing, ice control, snowbank removal); service trigger (configurable snowfall depth option list); seasonal flat rate vs per-visit option; start date; payment schedule shown as text (no online payment); sign-up deadline and "routes remaining" counter from `seasonal-settings` (hidden if null); commercial option exits to bid form.
- **Holiday lights (`/quote/holiday-lights`):** roofline linear ft (or estimate from home size + storeys), storeys, trees/shrubs/railings count, own lights vs supplied lights, style (warm white, multicolour, custom), preferred install window, removal date (January), storage add-on; price from pricing rules.
- **Junk removal (`/quote/junk-removal`):** item description, up to 10 photos, load estimate (minimum, ¼, ½, ¾, full), access (curbside, garage, inside, stairs), preferred date.
- **Custom quote (`/quote/custom`):** services multi-select, description, up to 10 photos, address, timeline, optional budget range.
- **Commercial bid (`/quote/commercial`):** company, contact, role, property type (strata, retail, office, industrial, parkade, multi-site), units or sq ft, services, frequency, insurance-certificate request checkbox, RFP upload, preferred walkthrough date.
- **Subscriptions** (garbage bin cleaning, maintenance plans): bins / plan, frequency, start date → lead with `type: 'subscription'`.

Uploads: images (JPEG/PNG/HEIC/WebP) and PDF for RFPs; max 10 MB each; virus-safe handling (type sniffing, size limits); stored privately and linked from the lead.

### 10.6 Optional property-data lookup (feature flag `propertyLookup`, off)

Define a `PropertyDataProvider` interface (`lookup(address) → { floorAreaSqFt?, storeys?, footprintSqFt? }`) with a stub implementation. Document in `README.md` how to back it later with Statistics Canada's Open Database of Buildings (Canada) or Microsoft building footprints, loaded into a PostGIS table on Neon, to pre-fill wizard answers. Do not import any dataset now — it would also need more storage than the free plan provides.

---

## 11. Leads, notifications and admin

- **Leads collection:** type (quick, instant, custom, snow_contract, holiday_lights, junk, commercial_bid, subscription, contact, careers), status pipeline (`new → contacted → quoted → booked → won / lost`, plus `estimate_viewed`, `booking_requested`), contact fields, address, postal code, city, property type, line items with answers and price range, total range, photos, consent + timestamp, UTM source/medium/campaign, referrer, landing page, device, `outOfArea`, `notificationStatus`, internal notes, assigned staff.
- **Owner alert by SMS** within seconds: "New [type] lead: [name], [service(s)], [city], [range] — [admin link]".
- **Owner email** with all details and photo links. **Customer auto-reply** email (and SMS only with consent) confirming receipt and next steps.
- **Admin:** list view with filters (type, status, service, city, date), quick status change, CSV export, a dashboard widget with this week's leads by source and status.
- **Review requests (flag `reviewRequests`):** when a lead is marked `won`, send the customer an SMS/email with `googleReviewUrl` (only with consent), once.
- **Consent copy** adapts to `site.country` (Canada: CASL express consent; US: TCPA-compliant SMS consent). Every marketing message includes an opt-out.

---

## 12. Content model (Payload)

**Collections:** services, service-categories, cities (name, slug, province, intro, neighbourhoods[], postalPrefixes[], localStats[] with value + source URL, lat/lng, FAQs), pricing-rules, discounts, plans, leads, media, testimonials (manual, `isSample`), google-reviews (cache), gallery-items (before, after, service, city, caption, `isSample`), posts, solutions, team-members (`isSample`), job-openings, applications, faqs (category, question, answer, linked services), client-logos (`isSample`), case-studies, redirects, users (roles: owner, staff).

**Globals:** site-settings (section 2), seasonal-settings (season date ranges, active campaigns, announcement text, hero variant overrides, snow sign-up deadline, routes remaining), navigation, footer, homepage (section toggles and order), feature-flags (`cityServicePages`, `propertyLookup`, `reviewRequests`, `chatWidget`, `calBooking`).

Every collection with public content gets SEO fields (title, description, OG image) and draft/publish with preview, keeping at most 20 versions per document to protect Neon storage. Add database indexes on every slug, on `leads.status`, `leads.createdAt`, `leads.type`, and on relationship fields used for filtering (service, city).

---

## 13. SEO

- **Metadata:** unique title and description per page from patterns — Service: "[Service] in [Region] | WashCraft"; City: "Property Maintenance in [City] | WashCraft"; Category: "[Category] Services in [Region] | WashCraft". One H1 per page.
- **JSON-LD:** `LocalBusiness` (subtype `HomeAndConstructionBusiness`) site-wide with name, phone, address or `areaServed`, hours, geo, `sameAs`; `Service` + `OfferCatalog` on service and category pages; `FAQPage`; `BreadcrumbList`; `Article` on blog/solutions. Only real reviews may appear in markup.
- **Technical:** generated `sitemap.xml` (excluding noindex pages), `robots.txt`, canonical tags, 301 redirects, `noindex` on thank-you, admin, styleguide and preview; dynamic OG images with `next/og`.
- **Internal linking:** service ↔ city ↔ solution triangle; every article links to at least one service; category hubs link to all their services.
- **Local SEO support:** `CONTENT_TODO.md` lists the Google Business Profile, Bing Places and Apple Business Connect setup steps and keeps name/address/phone identical everywhere.

---

## 14. Analytics events (GA4 via GTM, after consent)

`quick_form_submit`, `quote_start`, `quote_step` (step number), `quote_contact_submitted`, `quote_estimate_viewed`, `booking_requested`, `snow_contract_submit`, `holiday_lights_submit`, `junk_quote_submit`, `commercial_bid_submit`, `call_click`, `sms_click`, `email_click`, `review_link_click`, `careers_apply`. Include service, category and city as parameters. Mark the submit events as conversions.

---

## 15. Performance and accessibility

| Metric (mobile, 75th percentile) | Target |
| --- | --- |
| Largest Contentful Paint | ≤ 2.5 s |
| Interaction to Next Paint | ≤ 200 ms |
| Cumulative Layout Shift | ≤ 0.1 |
| Content-page weight | < 1 MB |
| Content-page JavaScript | < 150 KB compressed |
| Lighthouse (Performance, Accessibility, Best Practices, SEO) | ≥ 90 each |

Static generation / ISR for all content pages; preload the hero image; lazy-load below the fold; load video, maps, reviews and chat only when visible or after interaction.

Accessibility (WCAG 2.2 AA): semantic landmarks; skip link; visible labels on every field; errors announced and tied to fields with `aria-describedby`; keyboard-operable slider, tabs, accordion, mega-menu, wizard and popups with focus trapping and Esc to close; visible focus styles; alt text on every image; reduced-motion support; colour contrast verified.

---

## 16. Seed content

- All ~55 services (section 7) with original copy and placeholder image labels.
- 6 categories, cities from `site.serviceAreas` (3 placeholder cities if empty) with neighbourhood placeholders.
- 30+ FAQs across categories; 6 blog posts and 6 solutions pages (e.g. "How often should gutters be cleaned?", "Soft washing vs pressure washing", "Preparing your driveway for winter", "Roof moss removal", "Ice dam prevention", "When to book Christmas light installation").
- Sample testimonials, gallery items, team members and client logos — all `isSample: true`.
- Pricing rules and plans with placeholder values and `needsReview: true`.
- 2 sample job openings.
- One `pnpm seed` command that is idempotent (safe to re-run).

---

## 17. Feature checklist → `FEATURES.md`

Create `FEATURES.md` from this table and tick each item only when it works. Source: HF = High Five, WT = WashTech, C = client request, N = new for WashCraft.

| # | Feature | Source | Where |
| --- | --- | --- | --- |
| 1 | Sticky header with phone and "instant price" button | HF | Header |
| 2 | Icon mega-menus for services and commercial | HF | Header |
| 3 | Slide-in quick-quote popup | HF | Global |
| 4 | Quick-quote form on home, service and city pages | HF | Sections |
| 5 | Hero with photo carousel or background video | HF, WT | Home |
| 6 | Star-rating badge in hero (real data only) | WT | Home, services |
| 7 | Client logo marquee (real logos only) | WT | Home, commercial |
| 8 | Three-step process with recurring upsell | HF, WT | Home, services, cities |
| 9 | Satisfaction guarantee band | HF | Home, services |
| 10 | Before/after comparison sliders | HF, WT | Home, services, cities |
| 11 | Filterable before & after gallery page | WT | /before-and-after |
| 12 | Call and text urgency block (tel:, sms:) | HF | Home, services |
| 13 | Featured testimonial with photo | HF | Home |
| 14 | Testimonial cards with photo, city, service, "Verified Google review" link | WT | Home, services, reviews |
| 15 | Google rating and review count badge | WT | Home, reviews |
| 16 | Values story and trust badges | HF | Home, about |
| 17 | Four-point trust strip | WT | Home, cities, contact |
| 18 | Tabbed service explorer | HF | Home |
| 19 | Outcome-led service cards and button labels | WT | Home, hubs |
| 20 | Generic comparison table vs other providers | HF | Home, services |
| 21 | "Why choose us" image cards | WT | Home, cities |
| 22 | Insurance and compliance block for property managers | WT | Home, commercial |
| 23 | Meet the founder + team bio pages | WT | Home, about, /team |
| 24 | Objection-handling FAQ blocks + FAQ page | HF, WT | Many |
| 25 | City landing pages + city grid | HF, WT | /areas |
| 26 | Neighbourhood cards, cited local stats, localised FAQs | WT | City pages |
| 27 | Service-area links on service pages; service-in-city pages | WT | Services, /areas |
| 28 | Solutions (long-tail) collection | WT | /solutions |
| 29 | Blog | HF, WT | /blog |
| 30 | Careers with application form | HF, WT | /careers |
| 31 | Reviews page | HF | /reviews |
| 32 | Strata and commercial section | HF, WT | /commercial |
| 33 | Instant price vs custom quote split by job size | HF | /quote |
| 34 | Commercial / strata bid path | HF | /quote/commercial |
| 35 | Instant SMS lead alerts to the owner | HF | Notifications |
| 36 | "Let's talk" call band with marquee | WT | Global |
| 37 | Full footer: services, areas, contact, hours, address, socials, badges, legal | HF, WT | Footer |
| 38 | Spam protection on all forms | HF | Forms |
| 39 | Holiday lighting and permanent LED lighting services | WT, C | Services |
| 40 | Additional solutions: solar, graffiti, parkade, glass awning, post-construction | WT, C | Services |
| 41 | Service page: tabbed benefits, trust icons, what's included, process, FAQ, related links | HF, WT | Service template |
| 42 | All client-requested services (section 7.1–7.5) | C | Services |
| 43 | Seasonal snow contract sign-up | C | /quote/snow-contract |
| 44 | Christmas light install, removal and storage booking | C | /quote/holiday-lights |
| 45 | Photo-based junk removal quote | C | /quote/junk-removal |
| 46 | Garbage bin cleaning subscription | C | Wizard / subscription |
| 47 | Seasonal announcement bar and auto-switching hero | N | Global, home |
| 48 | Maintenance plans and seasonal packages | N | /maintenance-plans |
| 49 | Mobile sticky Call · Text · Quote bar | N | Global |
| 50 | Postal-code service-area checker + map | N | Home, /areas, contact |
| 51 | Admin lead pipeline, CSV export, dashboard widget | N | /admin |
| 52 | Owner-editable pricing rules with review gate | N | /admin |
| 53 | Customer auto-replies and review-request automation | N | Notifications |
| 54 | Cookie consent + GA4/Clarity events | N | Global |
| 55 | Schema markup, sitemap, redirects, OG images | N | SEO |
| 56 | Neon Postgres with branches, pooled/direct strings and committed migrations | N | Infrastructure |
| 57 | Cold-start retry and R2 fallback so no lead is lost | N | Quote system |
| 58 | Database size widget with warning at 80% of the free-plan limit | N | /admin |
| 59 | Weekly `pg_dump` backup of Neon `main` to R2 | N | GitHub Actions |

---

## 18. Testing and QA

- **Unit (Vitest):** pricing engine (multipliers, add-ons, minimums, bundle and frequency discounts, ranges, `needsReview` fallback); Zod schemas (including `src/lib/env.ts`); seasonal date logic; service-area matcher; lead-save retry and R2 fallback when the database is unreachable.
- **Database in tests:** CI runs against a Postgres service container; locally, tests use the Neon `dev` branch or a local Postgres. Never the `main` branch.
- **E2E (Playwright, desktop + mobile viewport):** quick form; instant wizard with 3 services; snow contract; holiday lights; junk removal with photo upload; commercial bid with PDF; careers application; mobile action bar; slide-in popup frequency cap; seasonal hero switching (mock date); sample content hidden in production mode.
- **Accessibility:** axe checks on home, a service page, a city page, every quote flow — zero serious or critical violations.
- **Lighthouse CI** on home, a service page and a city page with the thresholds in section 15.
- **Link check:** zero broken internal links.
- **Config check:** `scripts/check-config.ts` passes before production builds.

---

## 19. Deliverables

- The repository, with `README.md` (local setup, Neon setup — project, branches, pooled vs direct strings — env vars, migrations, seeding, backups and restore, deployment to Vercel with Neon and R2, how to add a service, a city or a season).
- `.github/workflows/backup.yml` (weekly `pg_dump` of Neon `main` to R2).
- `.env.example` listing every variable with a comment.
- `CLAUDE.md`, `DECISIONS.md`, `FEATURES.md` (all ticked), and `CONTENT_TODO.md` listing every placeholder, every photo needed (from `PhotoPlaceholder` labels), every pricing rule awaiting review, and the local-SEO setup steps.

---

## 20. Phases and acceptance criteria

| Phase | Scope | Done when |
| --- | --- | --- |
| 0. Plan | Read brief, write CLAUDE.md, post plan | I reply "go" |
| 1. Foundation | Next.js + Payload connected to the Neon dev branch, env validation, migration scripts, Tailwind tokens, fonts, logo placeholder, UI primitives, /styleguide, site config + check script, CI with a Postgres service container | `pnpm dev` runs against Neon dev, admin login works, initial migration committed, CI green |
| 2. Content model + seed | All collections and globals, idempotent seed with every service, category, city, FAQ, post, solution, sample content | Admin shows all seeded content; re-running seed creates no duplicates |
| 3. Layout + home | Announcement bar, header, mega-menu, mobile menu and action bar, footer, call band, breadcrumbs, consent banner, full home page | Home matches section 9.1 on mobile and desktop; axe clean |
| 4. Templates | Category hubs, service template, city template, /services, /areas, commercial pages, maintenance plans | Every seeded service, category and city renders with correct metadata |
| 5. Quote system | Quick form, instant wizard, pricing engine, all dedicated flows, uploads, leads, notifications, thank-you page, admin pipeline | All quote e2e tests pass; leads saved even with no API keys; cold-start retry and R2 fallback tested |
| 6. Proof + content pages | Gallery, reviews (Google + manual), about, team, careers, blog, solutions, FAQ, contact, legal, 404 | All pages render; sample content hidden in production mode |
| 7. SEO + analytics + performance | Metadata, JSON-LD, sitemap, robots, redirects, OG images, GA4/Clarity events, performance tuning | Lighthouse ≥ 90 on tested pages; Rich Results Test passes on sample pages |
| 8. QA + handover | Full test suite, link check, weekly backup workflow, first production migration against Neon main, docs, FEATURES.md, CONTENT_TODO.md | Everything in sections 17–19 complete; a test restore from a backup succeeds |

**Definition of done:** every item in `FEATURES.md` is ticked, CI is green, there are zero TypeScript errors and zero serious accessibility violations, and the site can be deployed by following `README.md` alone.
