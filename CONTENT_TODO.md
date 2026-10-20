# Content to-do (for the owner)

Everything the site still needs from you. Placeholders show as yellow **TODO** chips on the
development site, and production deploys stay blocked until the required facts are set.

## 1. Business facts — required before launch

Set these in `src/config/site.ts` (or later in the admin under **Site settings**).
`pnpm check-config` lists whatever is still missing. Country (US), currency (USD) and
language (en-US) are already set.

**Demo values are in place for now** (listed in `site.demo`). The site looks complete, but
production deploys stay blocked until each one is confirmed or replaced:

| Field          | Demo value                                              |
| -------------- | ------------------------------------------------------- |
| `tagline`      | Exterior care, year-round (from your logo)              |
| `phone`        | (720) 555-0142 (fictional number)                       |
| `email`        | hello@example.com (fictional address)                   |
| `address`      | none shown (service-area business)                      |
| `hours`        | Mon–Sat 7am–6pm                                         |
| `region`       | Denver Metro                                            |
| `serviceAreas` | Denver, Aurora, Lakewood, Arvada, Littleton, Centennial |

| Field          | What to provide                                                       | Example format                                           |
| -------------- | --------------------------------------------------------------------- | -------------------------------------------------------- |
| `tagline`      | One short line under the logo and in search results                   | "Exterior, interior and seasonal care for your property" |
| `phone`        | Main number for calls **and** texts                                   | (303) 555-0142                                           |
| `email`        | Address leads and customers write to                                  | hello@yourdomain.com                                     |
| `address`      | Street address, or tell us you work from home (service-area business) | 123 Main St, Denver, CO 80202                            |
| `hours`        | Office hours                                                          | Mon–Sat 8am–6pm                                          |
| `region`       | How locals name your area                                             | Denver Metro                                             |
| `serviceAreas` | Every city you serve (each gets its own page)                         | Aurora, Lakewood, …                                      |

## 2. Optional facts — each section stays hidden until you set it

| Field                              | Unlocks                                                |
| ---------------------------------- | ------------------------------------------------------ |
| `foundedYear`                      | "Serving since …"                                      |
| `insuranceCoverage`                | Insurance badge and compliance block                   |
| `workersCompRegistration`          | Workers' comp badge (state workers' comp policy)       |
| `licenceNumbers`                   | License list in the footer and commercial pages        |
| `googlePlaceId`, `googleReviewUrl` | Live Google reviews and the "Leave us a review" button |
| `responseTimePromise`              | "We reply within …" on forms and the thank-you page    |
| `guarantee`                        | The satisfaction-guarantee band (your own wording)     |
| `social.*`                         | Footer social icons                                    |
| `stats.*`                          | Jobs completed, happy clients, rating, review count    |

## 3. Brand

- [x] **Logo.** Your badge logo is in use (`src/assets/brand/washcraft-logo.png`), along with
      the browser-tab, phone home-screen and social-share images made from it.
- [ ] **Original logo file.** The copy we received had a black background, which was removed
      automatically. If you have the original PNG with a transparent background (or an SVG/AI
      vector file), send it for cleaner edges.

## 4. Photos needed

Every `PhotoPlaceholder` label is listed here as pages are built. Shoot real work only.
Before/after pairs should use the same angle and distance.

_No page photos yet. The list fills in from Phase 3._

## 5. Pricing rules awaiting review

_Filled in Phase 2 when placeholder pricing rules are seeded (`needsReview: true`)._

## 6. Infrastructure decisions

- [x] **Neon region.** Recreated in AWS US East 2 (Ohio).

## 7. Local SEO setup (do once, keep name/address/phone identical everywhere)

1. **Google Business Profile:** create or claim the profile at business.google.com. Use the
   exact business name, phone and address (or service areas) from section 1. Choose a primary
   category such as "Pressure washing service", add the service areas, hours, photos and the
   website URL, then verify.
2. **Bing Places:** at bingplaces.com, import from Google Business Profile, then check every
   field matches.
3. **Apple Business Connect:** at businessconnect.apple.com, add the business with the same
   details, so it appears in Apple Maps and Siri.
4. Copy the Google **Place ID** and the **review link** into site settings (section 2).
