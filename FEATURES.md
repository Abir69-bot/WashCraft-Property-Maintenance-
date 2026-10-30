# Features

From brief §17. An item is ticked only when it works in the browser.
☑ done everywhere listed · ◐ built and verified (with sample data where the section needs it),
but the live site needs something only the owner can supply: real reviews, ratings, logos or a
guarantee, insurance details, sourced local facts, or their own Twilio / Turnstile / R2 /
Tag Manager keys and production secrets to confirm it live · ⏸ built and verified, but switched
off by default until the owner confirms what it needs (Admin → Feature switches, or publishing
the services involved; see README → "Confirming services, areas and business details") ·
☐ not started.
Source: HF = High Five, WT = WashTech, C = client request, N = new for WashCraft.

| #   | Done | Feature                                                                                                          | Source | Where                   |
| --- | ---- | ---------------------------------------------------------------------------------------------------------------- | ------ | ----------------------- |
| 1   | ☑    | Sticky header with the quote button (and the phone, once one is confirmed)                                       | HF     | Header                  |
| 2   | ☑    | Icon mega-menus for services and commercial                                                                      | HF     | Header                  |
| 3   | ⏸    | Slide-in quick-quote popup                                                                                       | HF     | Global                  |
| 4   | ⏸    | Quick-quote form on home, service and city pages                                                                 | HF     | Sections                |
| 5   | ☑    | Hero with photo carousel or background video                                                                     | HF, WT | Home                    |
| 6   | ◐    | Star-rating badge in hero (real data only)                                                                       | WT     | Home, services          |
| 7   | ◐    | Client logo marquee (real logos only)                                                                            | WT     | Home, commercial        |
| 8   | ☑    | Three-step process with recurring upsell                                                                         | HF, WT | Home, services, cities  |
| 9   | ◐    | Satisfaction guarantee band                                                                                      | HF     | Home, services          |
| 10  | ☑    | Before/after comparison sliders                                                                                  | HF, WT | Home, services, cities  |
| 11  | ☑    | Filterable before & after gallery page                                                                           | WT     | /before-and-after       |
| 12  | ◐    | Call and text urgency block (tel:, sms:)                                                                         | HF     | Home, services          |
| 13  | ◐    | Featured testimonial with photo                                                                                  | HF     | Home                    |
| 14  | ◐    | Testimonial cards with photo, city, service, "Verified Google review" link                                       | WT     | Home, services, reviews |
| 15  | ◐    | Google rating and review count badge                                                                             | WT     | Home, reviews           |
| 16  | ◐    | Values story and trust badges                                                                                    | HF     | Home, about             |
| 17  | ◐    | Four-point trust strip                                                                                           | WT     | Home, cities, contact   |
| 18  | ☑    | Tabbed service explorer                                                                                          | HF     | Home                    |
| 19  | ☑    | Outcome-led service cards and button labels                                                                      | WT     | Home, hubs              |
| 20  | ⏸    | Generic comparison table vs other providers                                                                      | HF     | Home, services          |
| 21  | ☑    | "Why choose us" image cards                                                                                      | WT     | Home, cities            |
| 22  | ◐    | Insurance and compliance block for property managers                                                             | WT     | Home, commercial        |
| 23  | ◐    | Meet the founder + team bio pages                                                                                | WT     | Home, about, /team      |
| 24  | ☑    | Objection-handling FAQ blocks + FAQ page                                                                         | HF, WT | Many                    |
| 25  | ☑    | City landing pages + city grid                                                                                   | HF, WT | /areas                  |
| 26  | ◐    | Neighbourhood cards, cited local stats, localised FAQs                                                           | WT     | City pages              |
| 27  | ☑    | Service-area links on service pages; service-in-city pages                                                       | WT     | Services, /areas        |
| 28  | ☑    | Solutions (long-tail) collection                                                                                 | WT     | /solutions              |
| 29  | ☑    | Blog                                                                                                             | HF, WT | /blog                   |
| 30  | ☑    | Careers with application form                                                                                    | HF, WT | /careers                |
| 31  | ◐    | Reviews page                                                                                                     | HF     | /reviews                |
| 32  | ☑    | Commercial and restaurant section                                                                                | HF, WT | /commercial             |
| 33  | ⏸    | Instant price vs custom quote split by job size                                                                  | HF     | /quote                  |
| 34  | ⏸    | Commercial / strata bid path                                                                                     | HF     | /quote/commercial       |
| 35  | ◐    | Instant SMS lead alerts to the owner                                                                             | HF     | Notifications           |
| 36  | ☑    | "Let's talk" call band with marquee                                                                              | WT     | Global                  |
| 37  | ☑    | Full footer: services, areas, contact, hours, address, socials, badges, legal                                    | HF, WT | Footer                  |
| 38  | ◐    | Spam protection on all forms                                                                                     | HF     | Forms                   |
| 39  | ☑    | Holiday lighting and permanent LED lighting services                                                             | WT, C  | Services                |
| 40  | ☑    | Additional solutions: solar, graffiti, parkade, glass awning, post-construction                                  | WT, C  | Services                |
| 41  | ☑    | Service page: tabbed benefits, trust icons, what's included, process, FAQ, related links                         | HF, WT | Service template        |
| 42  | ☑    | All client-requested services (section 7.1–7.5)                                                                  | C      | Services                |
| 43  | ⏸    | Seasonal snow contract sign-up                                                                                   | C      | /quote/snow-contract    |
| 44  | ⏸    | Christmas light install, removal and storage booking                                                             | C      | /quote/holiday-lights   |
| 45  | ⏸    | Photo-based junk removal quote                                                                                   | C      | /quote/junk-removal     |
| 46  | ⏸    | Garbage bin cleaning subscription                                                                                | C      | Wizard / subscription   |
| 47  | ☑    | Seasonal announcement bar and auto-switching hero                                                                | N      | Global, home            |
| 48  | ⏸    | Maintenance plans and seasonal packages                                                                          | N      | /maintenance-plans      |
| 49  | ◐    | Mobile sticky Quote bar (Call and Text join it once a phone number is confirmed)                                 | N      | Global                  |
| 50  | ☑    | Postal-code service-area checker + map                                                                           | N      | Home, /areas, contact   |
| 51  | ☑    | Admin lead pipeline, CSV export, dashboard widget                                                                | N      | /admin                  |
| 52  | ☑    | Owner-editable pricing rules with review gate                                                                    | N      | /admin                  |
| 53  | ◐    | Customer auto-replies and review-request automation                                                              | N      | Notifications           |
| 54  | ◐    | Cookie consent + GA4/Clarity events                                                                              | N      | Global                  |
| 55  | ☑    | Schema markup, sitemap, redirects, OG images                                                                     | N      | SEO                     |
| 56  | ☑    | Neon Postgres with branches, pooled/direct strings and committed migrations                                      | N      | Infrastructure          |
| 57  | ◐    | Cold-start retry and R2 fallback so no lead is lost                                                              | N      | Quote system            |
| 58  | ☑    | Database size widget with warning at 80% of the free-plan limit                                                  | N      | /admin                  |
| 59  | ◐    | Weekly `pg_dump` backup of Neon `main` to R2                                                                     | N      | GitHub Actions          |
| 60  | ☑    | Quote request form: service picked from the page, phone and/or email, address and/or postal code, timing, photos | N      | /quote                  |
| 61  | ☑    | Only confirmed services, areas and articles published; drafts 404 and stay out of menus and the sitemap          | N      | Everywhere              |
| 62  | ☑    | Service template: included, who it's for, exclusions and access limits, preparation, areas, FAQs                 | N      | Service pages           |
| 63  | ☑    | No placeholder contact details: call, text and email links only once confirmed                                   | N      | Global                  |
| 64  | ☑    | Five-step quote process explained (home, quote page, thank-you page)                                             | N      | Home, /quote            |
| 65  | ☑    | CSS-only depth: raised cards, hover lift (hover devices, motion allowed), 3D hero stack                          | N      | Global                  |
| 66  | ☑    | Security headers, PII-free error logs, analytics and cookie banner only when configured                          | N      | Global                  |
| 67  | ◐    | Handover checklist (domain, hosting, email, renewals, admin access)                                              | N      | docs/HANDOVER.md        |
