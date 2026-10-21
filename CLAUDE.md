# WashCraft Property Maintenance — website

Marketing + lead-generation site for a residential/commercial property-maintenance company.
**Full spec: [docs/BRIEF.md](docs/BRIEF.md)** — read the relevant section before building any feature.
Decisions on ambiguities: [DECISIONS.md](DECISIONS.md). Feature status: [FEATURES.md](FEATURES.md). Owner to-dos: [CONTENT_TODO.md](CONTENT_TODO.md).

## Stack (pinned at project start, 2026-10)

| Concern         | Choice                                                                                                                                                                                             |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework       | Next.js 16.4 (App Router), React 19.3, TypeScript strict                                                                                                                                           |
| CMS             | Payload 3.91 embedded, admin at `/admin`, `@payloadcms/db-postgres`                                                                                                                                |
| Database        | Neon Postgres (free plan). Branches: `production` (Neon's name for the brief's `main`) = prod, `dev` = local. Pooled `DATABASE_URI` for the app, `DATABASE_URI_DIRECT` for migrations/backups only |
| Styling         | Tailwind CSS 4, tokens as CSS variables in `src/app/(site)/globals.css`; Radix primitives in `src/components/ui` (shadcn-style)                                                                    |
| Forms           | React Hook Form + Zod; schemas in `src/lib/schemas` shared by client and server                                                                                                                    |
| Spam            | Turnstile + honeypot + per-IP rate limit                                                                                                                                                           |
| Notify          | Twilio SMS, Resend email — behind `Notifier` in `src/lib/notify`, console fallback                                                                                                                 |
| Media           | Local disk in dev, Cloudflare R2 (S3 adapter) in prod                                                                                                                                              |
| Maps            | Leaflet + OSM, loaded only when visible                                                                                                                                                            |
| Analytics       | GTM (GA4) + Clarity, only after cookie consent                                                                                                                                                     |
| Tests           | Vitest 5 (unit + int projects), Playwright, @axe-core/playwright, Lighthouse CI                                                                                                                    |
| Package manager | pnpm 12 (`allowBuilds` in pnpm-workspace.yaml)                                                                                                                                                     |
| Tooling pins    | TypeScript 6.0 (typescript-eslint doesn't support 7), ESLint 9 (Next plugins don't support 10)                                                                                                     |

Payload 3.91 requires `next >=16.3.3 <17`. Check `@payloadcms/next` peer deps before bumping Next.
Next 16 docs ship in `node_modules/next/dist/docs/` (see AGENTS.md): check them when an API looks unfamiliar.

## Commands

```bash
pnpm dev                 # Next + Payload on :3000 (schema auto-pushes to the DB in .env = Neon `dev`)
pnpm build               # production build (needs a migrated DB: CI/Vercel run db:migrate first)
pnpm lint                # ESLint
pnpm format              # Prettier (format:check in CI)
pnpm typecheck           # next typegen && tsc --noEmit
pnpm test                # Vitest unit project (no DB)
pnpm test:db:up          # Docker Postgres on :5433 for integration tests
pnpm test:int            # Vitest int project against TEST_DATABASE_URI (never Neon)
pnpm db:migrate          # payload migrate (switches to DATABASE_URI_DIRECT via PAYLOAD_MIGRATING)
pnpm db:migrate:create   # payload migrate:create <name>; commit src/migrations
pnpm check-config        # unset business facts; strict on Vercel production / STRICT_CONFIG=true
pnpm generate:types      # payload generate:types -> src/payload-types.ts (commit it)
pnpm generate:importmap  # after adding custom admin components
pnpm seed [--force]      # idempotent starter content (pushes schema: sets NODE_ENV=development)
pnpm db:reset-dev        # migrate:fresh + seed on the DB in .env (asks to confirm)
pnpm content-todo        # regenerate photo + pricing lists in CONTENT_TODO.md
pnpm test:e2e            # Playwright + axe on desktop + Pixel 7, against `pnpm build` (port 3100)
```

Payload CLI commands load the config, so `DATABASE_URI` must be set (`.env` or inline) even for
`generate:types`. Integration tests must pass `migrations` from `@/migrations` to
`payload.db.migrate()`: Payload's own file loader can't import the generated files under Vitest.

Vercel build command: `pnpm db:migrate && pnpm check-config && pnpm build` (check-config reads the
saved Site settings, so migrations run first).

## Folder structure

```
src/
  app/(site)/           public pages (Server Components by default)
  app/(payload)/        Payload admin + API (generated; don't hand-edit)
  collections/          Payload collections (several per file, grouped by admin section)
  globals/              Payload globals (site-settings.ts + settings.ts)
  fields/common.ts      shared fields: seoTab, isSampleField, iconField, seasonsField, VERSIONS
  hooks/                collection hooks (redirect-on-slug-change)
  access/public-read.ts visitors: published only, no samples in production
  components/ui/        primitives (button, dialog, accordion, tabs, select, popover…)
  components/sections/  page sections (Hero, TrustStrip, BeforeAfter, …)
  components/layout/    header, mega-menu, mobile menu + action bar, footer, call band, cookie banner
  components/quote/     quick form, wizard, dedicated flows
  lib/env.ts            the ONLY place env vars are read (Zod-validated)
  lib/pricing/          pure pricing engine + tests
  lib/notify/           Notifier implementations
  lib/leads/            save-with-retry, R2 fallback, re-import
  lib/seo/              metadata + JSON-LD builders
  lib/schemas/          shared Zod schemas
  lib/data/             cached public queries (cachedQuery, tag `content`), seasonNow()
  lib/utils.ts          cn() (tailwind-merge aware of text-h1/h2/h3/body/small)
  access/roles.ts       owner/staff access helpers
  components/brand/     <Logo height> (next/image of src/assets/brand/washcraft-logo.png)
  assets/brand/         owner's logo (transparent PNG); icons in app/(site) are derived from it
  config/site.ts        business facts (seeds the `site-settings` global; `site.demo` = stand-ins)
  config/catalog.ts     seasons, quote modes, category tones, frequencies
  config/icons.ts       icon keys (map to Lucide in components/service-icon.tsx)
  lib/routes.ts         every public URL + DOC_PATHS (collection -> page path)
  lib/site-settings.ts  getSite(payload): saved settings or site.ts fallback
  lib/quote/questions.ts Zod schema for services' quoteQuestions JSON
  config/brand-tokens.ts colour tokens + contrast pairs (tested against globals.css)
  seed/                 seed.ts (idempotent), data/*.ts (all starter copy), types.ts
  migrations/           committed Payload migrations
tests/int/              Vitest integration tests (*.int.test.ts) + setup
e2e/                    Playwright specs
scripts/                check-config.ts, link check, etc.
```

Styling: brand colours only (Tailwind defaults removed). Use `-strong` colour variants for text and
icons on light backgrounds, `on-dark` for primary-background bands, `container` and `section-y` for
layout, and `text-h1/h2/h3/body/small` for type. Adding a colour means updating `globals.css` and
`brand-tokens.ts`; the token test enforces contrast.

## Non-negotiable rules (brief §3)

1. **Original brand.** Never copy text, images, logos, colours, icons, reviews, names, client logos, phone numbers or prices from the reference sites. Layouts and patterns only; all copy written from scratch.
2. **No fake social proof.** Sample testimonials/reviews/logos/team/gallery/stats are seeded `isSample: true`, show a "Sample" badge in dev/preview, and are excluded in production. Sections with no real entries hide themselves.
3. **No unverifiable claims** ("#1", "best in", years in business, insurance amounts, response times, guarantees) unless the value is set in site settings.
4. **Every page has a quote CTA**, except the quote flow and legal pages.
5. **Leads are never lost.** Save to DB first, then notify. Notify failure → log + flag the lead. DB unreachable after one retry → email the full lead to the owner and write JSON to R2 `failed-leads/`.
6. **WCAG 2.2 AA and the §15 performance budget are acceptance criteria.**
7. **No online payments.**

## Conventions

- Never invent business facts. Read them from site settings (`getSite()`); placeholders in `[BRACKETS]` render as a yellow "TODO" chip in dev and fail `check-config` for prod. Fields in `site.demo` are owner-approved demo stand-ins: render them normally, never treat them as confirmed facts (e.g. no "call us" urgency copy that depends on a real number), and they also fail `check-config`.
- Every third-party integration is optional: missing env var → console fallback, feature still works or hides itself. Only `DATABASE_URI` is required.
- Read env vars only through `src/lib/env.ts`.
- Server Components by default; `'use client'` only for interactive leaves (budget: < 150 KB JS per content page).
- Public pages are static/ISR and must not hit the DB at request time. Revalidate from Payload `afterChange` hooks, not short timers. Public queries go through `cachedQuery()` in `src/lib/data`; the site layout's daily `revalidate` is what switches seasons.
- Images: pass `mediaSrc(media)` to `next/image`, never `media.url` (Payload's URLs are absolute).
- **Public data queries pass `overrideAccess: false`**, so `publicRead()` hides drafts and (in production) samples. The local API skips access control by default.
- Copy may contain `{region}`; fill it in at render time, never store the expanded text.
- Links between documents use `routes` / `DOC_PATHS` from `src/lib/routes.ts`, never hand-built strings.
- Public-content collections: SEO fields, drafts, `versions.maxPerDoc: 20`. Index every slug and every filter field.
- Schema changes: `push` in dev only; production changes go through committed migrations, run over the direct (non-pooler) connection.
- Tests never touch the Neon `production` branch. CI uses a Postgres service container.
- TypeScript strict, no `any`, no dead code, no unused dependencies. Kebab-case filenames, `@/` → `src/`.
- **US business.** Visitor-facing copy uses US English, "ZIP code", "HOA & condo" (not "strata"), "parking garage" (not "parkade"), USD and TCPA/CAN-SPAM consent. See DECISIONS.md for the slug changes from the brief.
- Copy: plain language, grade 6–8 reading level, `{region}` used naturally, no keyword stuffing, no prices, guarantees or payment terms.
- Unit tests sit next to the code (`*.test.ts`); e2e specs live in `e2e/`.

## Per-phase workflow

1. Build the phase.
2. Run `pnpm lint && pnpm typecheck && pnpm test && pnpm build` and fix every failure.
3. Tick FEATURES.md items only when verified in the browser.
4. Commit with a conventional-commit message.
5. Post a summary: built / left / unresolved TODOs.

## Phases (brief §20 — acceptance criteria are in the brief)

0. Plan
1. Foundation — done when `pnpm dev` runs on Neon `dev`, admin login works, initial migration committed, CI green
2. Content model + seed (all copy lands here) — re-running seed creates no duplicates
3. Layout + home — home matches §9.1 on mobile + desktop, axe clean
4. Templates — every seeded service, category and city renders with correct metadata
5. Quote system — quote e2e green, leads saved with no API keys, retry + R2 fallback tested
6. Proof + content pages — sample content hidden in production mode
7. SEO + analytics + performance — Lighthouse ≥ 90, Rich Results Test passes
8. QA + handover — §17–19 complete, a test restore from backup succeeds

Definition of done: FEATURES.md all ticked, CI green, zero TS errors, zero serious a11y violations, deployable from README.md alone.
