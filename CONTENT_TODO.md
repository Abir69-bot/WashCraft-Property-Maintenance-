# Content to-do (for the owner)

Everything the site still needs from you. Nothing unconfirmed is shown on the live site:
services you haven't confirmed are unpublished, and contact details you haven't given simply
don't appear. `pnpm check-config` blocks production deploys until the required facts are set.

## 0. Confirm before advertising (2026-10-30 update)

You confirmed the services below and the seven service areas. Their **scope details** are still
open, so the pages say these are confirmed in each written estimate. Answer these, then update
the service's **Not included and access limits** list in the admin:

- [ ] **Window cleaning:** which floors or heights can you clean safely, inside and out? Ladders,
      water-fed poles, lifts? (Until then, upper floors are "confirmed case by case".)
- [ ] **Roof cleaning:** which method do you use, which roof types and pitches do you take on,
      and is it covered by your insurance? (The page names no method until you confirm one.)
- [ ] **Snow removal:** seasonal contract, per visit or both? Trigger depth, timing, salting,
      walkways, commercial lots? (The page advertises no options until confirmed.)
- [ ] **Christmas lights:** do you supply lights, use the customer's, take them down, store them?
      Any roofline height limit?
- [ ] **Patio & balcony cleaning:** condo balconies included? Do you need building approval or
      unit access? Any water-use limits?
- [ ] **Restaurant cleaning:** which areas exactly? Any kitchen tasks? (Exhaust hood, duct and
      grease trap cleaning are listed as **not offered**.)
- [ ] **Commercial cleaning:** office, retail, common areas; after-hours visits?
- [ ] **Interior house cleaning:** supplies included? (Carpet cleaning is listed as not offered.)
- [ ] **Driveway sealing:** which surfaces (asphalt, concrete, pavers)?
- [ ] **Photos:** confirm the before/after photos in the gallery are your own jobs. The window
      cleaning photo (high windows with a pole) isn't used as a hero until heights are confirmed.

<!-- confirmations:start -->

**Published: confirmed by you on 2026-10-30**

- [ ] Pressure Washing
- [ ] Soft Washing
- [ ] Patio & Balcony Cleaning
- [ ] Gutter Cleaning
- [ ] Roof Cleaning
- [ ] Window Cleaning
- [ ] Driveway Sealing
- [ ] Interior House Cleaning
- [ ] Post-Construction Cleaning
- [ ] Snow Removal
- [ ] Christmas Light Installation
- [ ] Commercial Cleaning
- [ ] Restaurant Cleaning

**Unpublished drafts: publish one in the admin (Services → open it → Publish) only once you offer it**

- [ ] House Washing
- [ ] Driveway Cleaning
- [ ] Deck Cleaning
- [ ] Fence Cleaning
- [ ] Gutter Brightening
- [ ] Exterior Surface Cleaning
- [ ] Move-In / Move-Out Cleaning
- [ ] Garage Cleaning
- [ ] Junk Removal & Hauling
- [ ] General Property Maintenance
- [ ] Driveway Snow Clearing
- [ ] Walkway & Sidewalk Snow Clearing
- [ ] Salting & De-Icing
- [ ] Ice Control
- [ ] Snowbank Removal
- [ ] Commercial Snow Clearing
- [ ] Christmas Light Removal
- [ ] Christmas Light Storage
- [ ] Spring & Fall Yard Cleanup
- [ ] Leaf Removal
- [ ] Garden & Bed Cleanup
- [ ] Garbage Bin Cleaning
- [ ] Exterior Caulking
- [ ] Minor Exterior Repairs
- [ ] Fence & Deck Staining
- [ ] Exterior Painting
- [ ] Garage & Driveway Pressure Cleaning
- [ ] Commercial Property Maintenance
- [ ] HOA & Condo Building Washing
- [ ] HOA & Commercial Gutter Cleaning
- [ ] Commercial Window Cleaning
- [ ] HOA & Commercial Roof Cleaning
- [ ] Commercial Pressure Washing
- [ ] Parking Garage Cleaning
- [ ] Graffiti Removal
- [ ] Solar Panel Cleaning
- [ ] Glass Awning Cleaning
- [ ] Permanent LED Lighting

**Possible service areas: add each as a city in the admin, with its own page copy, once confirmed**

- [ ] Toronto
- [ ] East York
- [ ] York
- [ ] Brampton
- [ ] Pickering
- [ ] Ajax

<!-- confirmations:end -->

## 1. Business facts — required before launch

Set these in the admin under **Site settings** (or `src/config/site.ts` before the first deploy).
`pnpm check-config` lists whatever is still missing. Country (Canada), currency (CAD) and language
(en-CA) are set.

| Field        | Status                                                                                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `email`      | **Required.** Not set. Leads go here unless separate alert emails are set. The suggested `info@washcraft.ca` is unconfirmed: only enter it once the mailbox works. |
| `tagline`    | Demo value "Exterior care, year-round" (from your logo). Confirm or replace it: the business now covers interior and seasonal work too.                            |
| `phone`      | Optional. Not set, so no call or text links appear. Add it once the number is confirmed.                                                                           |
| `hours`      | Optional. Not set, so no hours are shown.                                                                                                                          |
| `address`    | Not shown (service-area business). Never published without your permission.                                                                                        |
| `region`     | "the Toronto area" (your wording in the brief). Used in page titles.                                                                                               |
| `freeQuotes` | Confirmed 2026-10-30: quotes are free ("Request a Free Quote").                                                                                                    |
| Domain       | `washcraft.ca` is proposed. Confirm it's registered, then follow docs/HANDOVER.md.                                                                                 |

The service areas are confirmed (2026-10-27): Scarborough, North York, Etobicoke, Markham,
Vaughan, Richmond Hill and Mississauga.

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

- [ ] Hero (winter): Cleared driveway and walkway after a snowfall
- [ ] Hero (holiday): Home at dusk with warm white roofline lights

**Category and commercial pages**

- [ ] Residential Cleaning (optional): Bright, freshly cleaned kitchen with clear counters
- [ ] Commercial & Restaurant Cleaning (optional): Clean office reception and a restaurant dining room before opening
- [ ] Post-Construction Cleaning (optional): Newly renovated room, dust-free and ready to use
- [ ] Exterior Cleaning (optional): Two-story home with freshly washed siding, clean windows and a bright driveway
- [ ] Snow Removal (optional): Residential driveway cleared after a snowfall
- [ ] Holiday Lighting (optional): Home at dusk with warm white roofline lights
- [ ] About page: The WashCraft team in front of a freshly cleaned home

**Service pages**

- [ ] Window Cleaning (optional): Technician squeegeeing a large living room window
- [ ] Driveway Sealing (optional): Freshly sealcoated asphalt driveway with a crisp edge
- [ ] Interior House Cleaning (optional): Bright living room with freshly vacuumed rug and dusted shelves
- [ ] Post-Construction Cleaning (optional): Newly renovated room with dust-free floors and windows
- [ ] Snow Removal (optional): Snow blower clearing a long residential driveway
- [ ] Christmas Light Installation (optional): Two-story home at dusk with warm white roofline lights and lit trees
- [ ] Commercial Cleaning (optional): Clean, bright office reception area
- [ ] Restaurant Cleaning (optional): Clean restaurant dining room before opening

**City pages**

- [ ] Scarborough: Brick bungalow on a quiet Scarborough street with mature trees
- [ ] Scarborough, Agincourt: Two-story brick home in Agincourt with a wide driveway
- [ ] Scarborough, Guildwood: Guildwood home under tall trees in the fall
- [ ] Scarborough, Birch Cliff: Older Birch Cliff home with a front porch
- [ ] Scarborough, Malvern: Row of townhouses in Malvern after a fresh wash
- [ ] North York: Detached North York home with large windows and a landscaped front yard
- [ ] North York, Willowdale: New stone-front home in Willowdale with large windows
- [ ] North York, Don Mills: Mid-century Don Mills home with a low roofline
- [ ] North York, Bayview Village: Bayview Village home with a long driveway in winter
- [ ] North York, York Mills: Large York Mills home surrounded by tall trees
- [ ] Etobicoke: Tudor-style home in Etobicoke with a stone walkway in the fall
- [ ] Etobicoke, The Kingsway: Brick and stone home in the Kingsway under tall trees
- [ ] Etobicoke, Mimico: Mimico street with older homes near the lake
- [ ] Etobicoke, Long Branch: Long Branch home with a wooden fence and deck
- [ ] Etobicoke, Islington Village: Two-story home in Islington Village in winter
- [ ] Markham: Two-story stone and brick home in a Markham subdivision
- [ ] Markham, Unionville: Heritage home near Main Street Unionville
- [ ] Markham, Markham Village: Older home on a treed street in Markham Village
- [ ] Markham, Cornell: Townhouses with front porches in Cornell
- [ ] Markham, Berczy Village: Berczy Village home with an interlock driveway
- [ ] Vaughan: Large detached home in Vaughan with a stone front and interlock driveway
- [ ] Vaughan, Woodbridge: Woodbridge home with a stone front and interlock driveway
- [ ] Vaughan, Maple: Two-story homes on a street in Maple
- [ ] Vaughan, Concord: Townhouses and a small business plaza in Concord
- [ ] Vaughan, Thornhill: Thornhill home under mature trees in the fall
- [ ] Richmond Hill: Richmond Hill home with a landscaped yard and a double garage
- [ ] Richmond Hill, Oak Ridges: Oak Ridges home near Lake Wilcox
- [ ] Richmond Hill, Mill Pond: Home on a treed street near Mill Pond
- [ ] Richmond Hill, Bayview Hill: Large Bayview Hill home with a long driveway
- [ ] Richmond Hill, Jefferson: Jefferson home with a deck backing onto trees
- [ ] Mississauga: Two-story Mississauga home with a clean driveway and front garden
- [ ] Mississauga, Port Credit: Port Credit home near the lake
- [ ] Mississauga, Streetsville: Older home near Streetsville’s main street
- [ ] Mississauga, Meadowvale: Meadowvale townhouses beside a park
- [ ] Mississauga, Lorne Park: Lorne Park home on a large treed lot

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

**More before & after pairs, from your own jobs only (same angle for both shots)**

- [ ] Winter: a driveway and walkway before and after snow removal
- [ ] Holiday: a home before and after light installation (daytime and dusk)
- [ ] Interior: a kitchen or bathroom before and after cleaning
- [ ] Post-construction: a room before and after the final clean

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
- [ ] **Snow contracts** (admin → Seasonal settings): the trigger depths offered (2, 5 or 8 cm
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
- [ ] Interior House Cleaning (job)
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
- [ ] **Blog posts and solutions.** Read each one: they were written before the 2026-10 update and
      may mention services you haven't confirmed. Links to unpublished services show as plain
      text, and the two articles about unconfirmed services only (move-out cleaning, icy
      walkways) are drafts. Edit or unpublish any that describe work you don't offer.
- [ ] **Cities.** Check each city's postal code prefixes (the first three characters, e.g. M1B)
      and neighborhoods, and read the intro (admin, **Cities**). Add local conditions (snowfall,
      rainfall) only with a source link.
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
