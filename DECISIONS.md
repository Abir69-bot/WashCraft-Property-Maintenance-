# Decisions

Choices made where the brief was ambiguous or the ground had shifted since it was written.
Newest phase at the bottom. Rule of thumb from the brief: more leads and better accessibility win.

## Phase 1 — Foundation (2026-10-21)

### Infrastructure

- **Neon's default branch is `production`, not `main`.** Neon now names the default branch
  `production`. Docs and scripts use that name; the brief's `main` means the same branch.
  The Git default branch is still `main`.
- **Neon region: flagged.** The project was created in AWS ap-southeast-2 (Sydney). If the business
  is in Canada or the US, recreate it in the closest US region before launch (Neon can't move a
  project) and set the Vercel functions region to match. Tracked in CONTENT_TODO.md.
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
- **Spelling: Canadian English** for seed copy, because the brief uses Canadian terms ("strata",
  WorkSafeBC, "neighbourhood"). Pending the owner's `country` choice. Consent copy switches on
  `site.country` while the site runs.

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
