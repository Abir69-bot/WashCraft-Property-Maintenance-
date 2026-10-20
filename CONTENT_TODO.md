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

Each photo slot on the site shows a placeholder describing exactly what to shoot. Shoot real
work only (no stock photos of people). Upload photos in the admin under **Media**, then attach
them to the matching page. This list is regenerated with `pnpm content-todo`.

<!-- photos:start -->

**Home page**

- [ ] Hero (spring): Freshly washed house with spring flowers in the beds
- [ ] Hero (summer): Freshly stained deck on a sunny afternoon
- [ ] Hero (fall): Technician cleaning gutters with fall leaves on the lawn
- [ ] Hero (winter): Cleared driveway and walkway at dawn after a snowfall
- [ ] Hero (holiday): Home at dusk with warm white roofline lights
- [ ] Hero (all-year): Crew soft-washing a two-story house
- [ ] Why choose us, "Reliable": Crew arriving at a home in a branded truck
- [ ] Why choose us, "Safety-trained crews": Technician in safety harness on a roof
- [ ] Why choose us, "Careful with products": Technician soaking plants before washing
- [ ] Why choose us, "Damage-free methods": Close-up of a soft-wash nozzle on siding
- [ ] Why choose us, "Locally owned": Owner shaking hands with a customer at the front door
- [ ] Why choose us, "Clear pricing": Customer checking a price on a phone

**Category pages**

- [ ] Exterior Cleaning: Two-story home with freshly washed siding, clean windows and a bright driveway
- [ ] Interior Cleaning: Bright, freshly cleaned kitchen with clear counters
- [ ] Winter Services: Crew member clearing a residential driveway at dawn after a snowfall
- [ ] Holiday Lighting: Home at dusk with warm white roofline lights and lit shrubs
- [ ] Yard & Exterior Care: Neat front yard with edged beds and a freshly stained fence
- [ ] Commercial & HOA: Crew on a lift washing a three-story condo building

**Service pages**

- [ ] Pressure Washing: Concrete walkway half cleaned, showing a sharp line between dirty and clean
- [ ] Soft Washing: Technician soft washing stucco with a low-pressure hose
- [ ] House Washing: Crew soft-washing a two-story house with vinyl siding
- [ ] Driveway Cleaning: Concrete driveway after cleaning, with a clean line where the work stopped
- [ ] Patio & Balcony Cleaning: Clean stone patio with outdoor furniture set back in place
- [ ] Deck Cleaning: Cedar deck with one half cleaned and the other still gray
- [ ] Fence Cleaning: White vinyl fence half cleaned, with green algae on the other half
- [ ] Gutter Cleaning: Technician on a ladder scooping leaves from a gutter into a bucket
- [ ] Gutter Brightening: Close-up of a white gutter, half streaked and half bright
- [ ] Roof Cleaning: Shingle roof with black algae streaks on one side and clean shingles on the other
- [ ] Window Cleaning: Technician squeegeeing a large living room window
- [ ] Exterior Surface Cleaning: Stone retaining wall being soft washed
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
- [ ] HOA & Commercial Gutter Cleaning: Technician cleaning gutters on a townhome row
- [ ] Commercial Window Cleaning: Technician cleaning a storefront window with a squeegee
- [ ] HOA & Commercial Roof Cleaning: Townhome roofs with black streaks being treated
- [ ] Commercial Pressure Washing: Surface cleaner on a busy store entrance at night
- [ ] Parking Garage Cleaning: Underground parking level being scrubbed and rinsed
- [ ] Graffiti Removal: Brick wall with graffiti partly removed
- [ ] Solar Panel Cleaning: Technician cleaning rooftop solar panels with a soft brush pole
- [ ] Glass Awning Cleaning: Glass entrance canopy being cleaned from a lift
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
- [ ] Black streaks and moss on your roof: Roof with black streaks next to a clean section
- [ ] Ice dams along the roof edge: Thick ice and icicles along a snowy roof edge
- [ ] Oil stains on the driveway or garage floor: Oil stain on a concrete garage floor, partly treated
- [ ] Green streaks on siding: North wall of a house with green algae on vinyl siding
- [ ] Gutters overflowing in the rain: Rainwater pouring over the edge of a gutter
- [ ] Icy walkways and steps: Icy front steps with ice melt being applied

**Before & after pairs (same angle and distance for both)**

- [ ] Two-story vinyl house wash: before "Vinyl siding with green algae on the north wall", after "Same wall after soft washing, bright and even"
- [ ] Concrete driveway with tire marks: before "Gray driveway with tire marks and leaf stains", after "Same driveway after cleaning, light and even"
- [ ] Shingle roof with black streaks: before "Roof with black algae streaks", after "Same roof after soft-wash treatment"
- [ ] Cedar deck restored: before "Gray, weathered cedar deck", after "Same deck cleaned and brightened"
- [ ] Wood fence cleaned and stained: before "Weathered gray fence", after "Same fence stained a warm cedar tone"
- [ ] Gutter faces brightened: before "White gutter with black tiger stripes", after "Same gutter, bright white"

**Team**

- [ ] Founder: Founder portrait outdoors in natural light, in work clothes
- [ ] Exterior crew lead: Crew lead next to a soft-wash rig
- [ ] Winter operations: Team member with a snow blower beside a cleared driveway
- [ ] Customer care: Team member at a desk with a headset, smiling

<!-- photos:end -->

## 5. Pricing awaiting review

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
- [ ] **Sample content.** Testimonials, before/after pairs, client logos, team members and the two
      job openings are samples. They never appear on the live site. Replace them with real ones.
- [ ] **Comparison table and "Why choose us"** (admin, **Home page**). Make sure every point is
      true for your business.

## 7. Infrastructure decisions

- [x] **Neon region.** Recreated in AWS US East 2 (Ohio).

## 8. Local SEO setup (do once, keep name/address/phone identical everywhere)

1. **Google Business Profile:** create or claim the profile at business.google.com. Use the
   exact business name, phone and address (or service areas) from section 1. Choose a primary
   category such as "Pressure washing service", add the service areas, hours, photos and the
   website URL, then verify.
2. **Bing Places:** at bingplaces.com, import from Google Business Profile, then check every
   field matches.
3. **Apple Business Connect:** at businessconnect.apple.com, add the business with the same
   details, so it appears in Apple Maps and Siri.
4. Copy the Google **Place ID** and the **review link** into site settings (section 2).
