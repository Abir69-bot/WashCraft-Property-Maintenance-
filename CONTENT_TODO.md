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

| Field                              | Unlocks                                                      |
| ---------------------------------- | ------------------------------------------------------------ |
| `foundedYear`                      | "Serving since …"                                            |
| `insuranceCoverage`                | Insurance badge and compliance block                         |
| `workersCompRegistration`          | Workers' comp badge (state workers' comp policy)             |
| `licenceNumbers`                   | License list in the footer and commercial pages              |
| `googlePlaceId`, `googleReviewUrl` | Daily Google rating and reviews, "Leave us a review" button  |
| `responseTimePromise`              | "We reply within …" on forms and the thank-you page          |
| `guarantee`                        | The satisfaction-guarantee band (your own wording)           |
| `social.*`                         | Footer social icons                                          |
| `stats.*`                          | Jobs completed, happy clients, rating, review count          |
| `alertPhones`, `alertEmails`       | Who gets a text / email for every new lead (Lead alerts tab) |

## 3. Brand

- [x] **Logo.** Your badge logo is in use (`src/assets/brand/washcraft-logo.png`), along with
      the browser-tab, phone home-screen and social-share images made from it.
- [ ] **Original logo file.** The copy we received had a black background, which was removed
      automatically. If you have the original PNG with a transparent background (or an SVG/AI
      vector file), send it for cleaner edges.

## 4. Photos needed

Each photo slot on the site shows a placeholder describing exactly what to shoot. Shoot real
work only (no stock photos of people). Upload photos in the admin under **Media**, then attach
them to the matching page. This list is regenerated with `pnpm content-todo`.

**Most urgent: the holiday hero photo.** Holiday season runs Oct 1 – Jan 31 and winter Nov 1 –
Mar 31, and your current photos are all summer work, so the home page hero shows a placeholder
until a holiday photo (then a winter one) is uploaded. Attach it in the admin: **Home page → Hero tab →
Hero Variants → the Holiday row → Image**. You can also change the season dates in **Seasonal settings**.

<!-- photos:start -->

**Home page**

- [ ] Hero (winter): Cleared driveway and walkway at dawn after a snowfall
- [ ] Hero (holiday): Home at dusk with warm white roofline lights
- [ ] Why choose us, "Reliable": Crew arriving at a home in a branded truck
- [ ] Why choose us, "Careful with products": Technician soaking plants before washing
- [ ] Why choose us, "Locally owned": Owner shaking hands with a customer at the front door
- [ ] Why choose us, "Clear pricing": Customer checking a price on a phone

**Category and commercial pages**

- [ ] Exterior Cleaning: Two-story home with freshly washed siding, clean windows and a bright driveway
- [ ] Interior Cleaning: Bright, freshly cleaned kitchen with clear counters
- [ ] Winter Services: Crew member clearing a residential driveway at dawn after a snowfall
- [ ] Holiday Lighting: Home at dusk with warm white roofline lights and lit shrubs
- [ ] Yard & Exterior Care: Neat front yard with edged beds and a freshly stained fence
- [ ] Commercial & HOA: Crew on a lift washing a three-story condo building
- [ ] HOA & condo page: Crew washing the siding of a condo building while residents walk past
- [ ] About page: The WashCraft crew in front of a freshly washed home

**Service pages**

- [ ] Driveway Cleaning: Concrete driveway after cleaning, with a clean line where the work stopped
- [ ] Deck Cleaning: Cedar deck with one half cleaned and the other still gray
- [ ] Fence Cleaning: White vinyl fence half cleaned, with green algae on the other half
- [ ] Gutter Brightening: Close-up of a white gutter, half streaked and half bright
- [ ] Driveway Sealing: Freshly sealcoated asphalt driveway with a crisp edge
- [ ] House Cleaning: Bright living room with freshly vacuumed rug and dusted shelves
- [ ] Move-In / Move-Out Cleaning: Empty, freshly cleaned kitchen with open cabinets
- [ ] Post-Construction Cleaning: Newly renovated room with dust-free floors and windows
- [ ] Garage Cleaning: Organized two-car garage with a clean floor
- [ ] Junk Removal & Hauling: Crew loading an old sofa into a trailer
- [ ] General Property Maintenance: Technician replacing a furnace filter
- [ ] Snow Removal: Snow blower clearing a long residential driveway
- [ ] Driveway Snow Clearing: Freshly cleared driveway with neat snow edges
- [ ] Walkway & Sidewalk Snow Clearing: Crew member shoveling front steps and a walkway
- [ ] Salting & De-Icing: Ice melt being spread on a cleared walkway
- [ ] Ice Control: Liquid anti-icing being sprayed on a walkway before a storm
- [ ] Snowbank Removal: Loader moving a large snowbank at the end of a driveway
- [ ] Commercial Snow Clearing: Plow clearing a retail parking lot at night
- [ ] Christmas Light Installation: Two-story home at dusk with warm white roofline lights and lit trees
- [ ] Christmas Light Removal: Technician coiling light strands into a labeled bin
- [ ] Christmas Light Storage: Shelves of labeled storage bins in a dry storeroom
- [ ] Spring & Fall Yard Cleanup: Freshly raked lawn with edged garden beds in spring
- [ ] Leaf Removal: Leaves being blown into a tarp on a front lawn
- [ ] Garden & Bed Cleanup: Garden bed with fresh mulch and crisp edges
- [ ] Garbage Bin Cleaning: Freshly washed trash and recycling bins at the curb
- [ ] Exterior Caulking: Technician applying a clean bead of caulk around a window frame
- [ ] Minor Exterior Repairs: Technician replacing a broken fence picket
- [ ] Fence & Deck Staining: Freshly stained cedar fence with rich color
- [ ] Exterior Painting: Painter rolling fresh color onto wood siding
- [ ] Garage & Driveway Pressure Cleaning: Garage floor with oil stain treated, next to a cleaned driveway
- [ ] Commercial Property Maintenance: Clean storefront and walkway of a small retail plaza
- [ ] HOA & Condo Building Washing: Crew on a lift soft-washing a three-story condo building
- [ ] Commercial Window Cleaning: Technician cleaning a storefront window with a squeegee
- [ ] HOA & Commercial Roof Cleaning: Townhome roofs with black streaks being treated
- [ ] Commercial Pressure Washing: Surface cleaner on a busy store entrance at night
- [ ] Parking Garage Cleaning: Underground parking level being scrubbed and rinsed
- [ ] Graffiti Removal: Brick wall with graffiti partly removed
- [ ] Solar Panel Cleaning: Technician cleaning rooftop solar panels with a soft brush pole
- [ ] Permanent LED Lighting: Home with discreet permanent LED lights glowing along the roofline

**City pages**

- [ ] Denver: Brick Denver Square home on a tree-lined street in fall
- [ ] Denver, Washington Park: Brick home near Washington Park with mature trees
- [ ] Denver, Highland: Row of Highland homes, old and new side by side
- [ ] Denver, Park Hill: Park Hill Tudor home with a long front walkway
- [ ] Denver, Central Park: Newer townhomes in Central Park with clean siding
- [ ] Aurora: Two-story stucco home in an Aurora subdivision with a wide driveway
- [ ] Aurora, Saddle Rock: Stucco and stone home in Saddle Rock
- [ ] Aurora, Tallyn’s Reach: Wide driveway in Tallyn’s Reach after snow clearing
- [ ] Aurora, Murphy Creek: Home in Murphy Creek with open views
- [ ] Aurora, Hoffman Heights: Ranch home in Hoffman Heights with mature trees
- [ ] Lakewood: Lakewood ranch home with the foothills in the background
- [ ] Lakewood, Belmar: Townhomes near Belmar with clean windows
- [ ] Lakewood, Green Mountain: Home on Green Mountain with trees and a foothills view
- [ ] Lakewood, Bear Creek: Leaf-covered yard near Bear Creek in fall
- [ ] Arvada: Historic storefronts and homes near Olde Town Arvada
- [ ] Arvada, Olde Town Arvada: Older wood-sided home near Olde Town Arvada
- [ ] Arvada, Candelas: New home in Candelas with large windows
- [ ] Arvada, Ralston Valley: Backyard deck and fence in Ralston Valley
- [ ] Arvada, Leyden Rock: Home in Leyden Rock backing onto open space
- [ ] Littleton: Historic Main Street in Littleton with brick storefronts
- [ ] Littleton, Downtown Littleton: Historic home near downtown Littleton
- [ ] Littleton, Ken Caryl: Ken Caryl home with a deck and foothills behind
- [ ] Littleton, Roxborough Park: Home among trees and red rocks near Roxborough
- [ ] Centennial: Centennial two-story home with a manicured front yard
- [ ] Centennial, Willow Creek: Two-story home in Willow Creek with tall trees
- [ ] Centennial, Southglenn: Tidy front yard and siding in Southglenn
- [ ] Centennial, Piney Creek: Home with a long driveway in Piney Creek
- [ ] Centennial, Cherry Knolls: Cherry Knolls home with mature landscaping

**Articles**

- [ ] How often should gutters be cleaned?: Close-up of a gutter full of leaves and seeds
- [ ] Soft washing vs. pressure washing: which does your home need?: Split image: low-pressure hose on siding, surface cleaner on concrete
- [ ] How to get your driveway ready for winter: Freshly sealed driveway with fall leaves at the edge
- [ ] When to book Christmas light installation: Home with warm white roofline lights at dusk
- [ ] A spring checklist for the outside of your home: Freshly washed house with spring flowers in the beds
- [ ] What a move-out clean covers (and what it doesn’t): Empty, clean kitchen with open cabinets
- [ ] Ice dams along the roof edge: Thick ice and icicles along a snowy roof edge
- [ ] Oil stains on the driveway or garage floor: Oil stain on a concrete garage floor, partly treated
- [ ] Icy walkways and steps: Icy front steps with ice melt being applied

**More before & after pairs (same angle and distance for both shots)**

- [ ] Winter: a driveway and walkway before and after snow clearing
- [ ] Holiday: a home before and after light installation (daytime and dusk)
- [ ] Yard care: a fence or deck before and after staining
- [ ] Interior: a garage before and after cleaning

**Team**

- [ ] Founder: Founder portrait outdoors in natural light, in work clothes
- [ ] Exterior crew lead: Crew lead next to a soft-wash rig
- [ ] Winter operations: Team member with a snow blower beside a cleared driveway
- [ ] Customer care: Team member at a desk with a headset, smiling

<!-- photos:end -->

## 5. Pricing awaiting review

Until each rule, discount and plan below is checked and **Needs review** is unticked, the live site
shows "We'll price this with you" instead of a price (the admin dashboard shows how many are left).
Also check these quote settings:

- [ ] **Repeat schedules per service** (each service → Quote & pricing → Frequencies): which
      services can be booked twice a year, quarterly or monthly in the instant-price wizard.
- [ ] **Roofline estimate by home size** (`src/config/quote.ts`, `ROOFLINE_ESTIMATES`): used when a
      customer doesn't know their roofline length for holiday lights (120–240 ft).
- [ ] **Snow contracts** (admin → Seasonal settings): the trigger depths offered (1, 2 or 3 inches
      for now), how contracts are billed (the payment note; blank says "confirmed with your
      contract"), the sign-up deadline and routes left (both hidden until set).

<!-- pricing:start -->

Every number below is a placeholder. While a rule is marked **Needs review** in the admin, the
live site shows "Request a quote" instead of a price. Review each one under **Pricing**.

**Pricing rules**

- [ ] Pressure Washing (sq ft)
- [ ] Soft Washing (sq ft)
- [ ] House Washing (job)
- [ ] Driveway Cleaning (sq ft)
- [ ] Patio & Balcony Cleaning (sq ft)
- [ ] Deck Cleaning (sq ft)
- [ ] Fence Cleaning (linear ft)
- [ ] Gutter Cleaning (job)
- [ ] Gutter Brightening (linear ft)
- [ ] Roof Cleaning (job)
- [ ] Window Cleaning (window)
- [ ] Driveway Sealing (sq ft)
- [ ] House Cleaning (job)
- [ ] Move-In / Move-Out Cleaning (job)
- [ ] Garage Cleaning (job)
- [ ] Spring & Fall Yard Cleanup (job)
- [ ] Leaf Removal (job)
- [ ] Fence & Deck Staining (sq ft)
- [ ] Garage & Driveway Pressure Cleaning (sq ft)
- [ ] Solar Panel Cleaning (panel)
- [ ] Garbage Bin Cleaning (bin)
- [ ] Christmas Light Installation (linear ft)
- [ ] Christmas Light Removal (job)
- [ ] Christmas Light Storage (job)
- [ ] Snow Removal (job)
- [ ] Driveway Snow Clearing (job)
- [ ] Walkway & Sidewalk Snow Clearing (linear ft)
- [ ] Salting & De-Icing (job)
- [ ] Ice Control (job)

**Discounts**

- [ ] Bundle: 2 services: 5%
- [ ] Bundle: 3 or more services: 10%
- [ ] Twice a year: 5%
- [ ] Quarterly: 10%
- [ ] Monthly: 15%

**Plans and packages**

- [ ] Essential: $499 per year
- [ ] Plus: $899 per year
- [ ] Premium: $1999 per year
- [ ] Spring refresh: $549 per visit
- [ ] Summer exterior: $899 per visit
- [ ] Fall prep: $449 per visit
- [ ] Winter care: $799 per season

<!-- pricing:end -->

## 6. Copy and local details to review

The starter text was written for you, but only you know your methods and policies.

- [ ] **Service pages.** Read each service in the admin. Check the method, what's included, the
      safety notes and the FAQs, especially notice periods, what you haul and what you won't do.
- [ ] **Demo cities.** Check each city's ZIP codes and neighborhoods (admin, **Cities**). Add
      local conditions (snowfall, rainfall) only with a source link.
- [ ] **Sample content.** Testimonials, client logos, team members and the two job openings are
      samples. They never appear on the live site. Replace them with real ones. (The 23 job photos
      you sent are real and already in use: before/after gallery, home hero, "Why choose us", and
      as photos on three sample testimonials.)
- [ ] **Sample rating and guarantee.** The development site shows a sample rating (4.9 from 48
      reviews) and a sample guarantee, both badged "Sample", so you can see where they go. The
      live site shows neither until you connect Google reviews or fill in **Stats** and
      **Guarantee** in Site settings (your own wording).
- [ ] **Comparison table and "Why choose us"** (admin, **Home page**). Make sure every point is
      true for your business.
- [ ] **Commercial and HOA pages** (admin, **Commercial pages**). The four "Why managers work with
      us" points and the HOA & condo page describe how you work with boards: written proposals,
      resident notices, one contract for the year, photo records after each visit. Keep only what
      you actually do.
- [ ] **Insurance block.** The commercial pages show an "Insurance and compliance" box only after
      you fill in `insuranceCoverage`, `workersCompRegistration` or `licenceNumbers` in Site
      settings. Certificates are only mentioned once insurance is set.
- [ ] **Optional: city service pages.** To add pages like "Gutter Cleaning in Aurora", turn on
      **Feature switches → City service pages**, then pick services under each city's
      **Location → Service-in-city pages**. Only do this for services where you can add local
      detail; near-identical pages can hurt search rankings. New pages go live when you save.
- [ ] **Quote forms and messages.** The "What happens next" steps on the quote pages and the
      thank-you page, and the confirmation email/text customers get (`src/lib/leads/messages.ts`).
      They promise only that you'll be in touch; add your reply time in Site settings to show it.

## 7. Pages to fill in (Admin → Pages, Company)

Each of these stays hidden until you add it; nothing has been made up for you.

- [ ] **About → Our story:** how WashCraft started and who is behind it, in your own words.
- [ ] **About → Community involvement:** local teams, causes or events you support.
- [ ] **About → Downloadable certificates:** e.g. your certificate of insurance or a license, as
      PDFs (upload to Media first). Only documents you are happy to publish.
- [ ] **Careers → Benefits:** pay, schedule, equipment, training. Only what you actually offer.
- [ ] **Team:** replace the four sample team members (Company → Team) with real people and
      photos, and tick "Meet the founder" on yours. Then choose yourself as the author of each
      blog post (the author box stays hidden until the author is a real team member).
- [ ] **Job openings:** the two seeded roles are samples and never show on the live site. Add
      real roles when you're hiring; with none, the careers page invites general applications.
- [ ] **Legal pages:** the privacy policy, terms of use and accessibility statement describe how
      this website actually works, but have them reviewed (ideally by a lawyer) before launch,
      and update the "Last updated" dates when they change.

## 8. Services to set up before launch

Step-by-step instructions are in README.md → "Services setup". `pnpm check-config` blocks a
production deploy until the first two are done.

- [ ] **Cloudflare R2** (required): a public bucket for photos and a private bucket for customer
      uploads and lead backups.
- [ ] **Resend** (required): sends you every new lead by email and confirms to customers.
- [ ] **Twilio** (recommended): texts you each new lead. US numbers need A2P 10DLC registration
      before texting customers.
- [ ] **Cloudflare Turnstile** (recommended): invisible spam check on every form.
- [ ] **Lead alerts** (admin → Site settings → Lead alerts): the phone numbers and email addresses
      that should hear about new leads and job applications.
- [ ] **Google reviews** (recommended): a Google Places API key (`GOOGLE_PLACES_API_KEY`), a
      random `CRON_SECRET`, and your Place ID in Site settings. The site then copies your rating
      and latest reviews once a day (README → "Google reviews").
- [ ] **GitHub secrets** (required): the production database strings, `PAYLOAD_SECRET` and the
      R2 keys, so the weekly backup can run and the production database can be set up from
      GitHub (README → "Deploying", step 5, and "Backups and restore").
- [ ] **Analytics** (optional): a Google Tag Manager container with GA4, and Microsoft Clarity
      (README → "Analytics"). Nothing is tracked until these IDs are set.

## 9. Infrastructure decisions

- [x] **Neon region.** Recreated in AWS US East 2 (Ohio).

## 10. Local SEO setup (do once, keep name/address/phone identical everywhere)

1. **Google Business Profile:** create or claim the profile at business.google.com. Use the
   exact business name, phone and address (or service areas) from section 1. Choose a primary
   category such as "Pressure washing service", add the service areas, hours, photos and the
   website URL, then verify.
2. **Bing Places:** at bingplaces.com, import from Google Business Profile, then check every
   field matches.
3. **Apple Business Connect:** at businessconnect.apple.com, add the business with the same
   details, so it appears in Apple Maps and Siri.
4. Copy the Google **Place ID** and the **review link** into site settings (section 2).
