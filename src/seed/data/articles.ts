import type { ArticleSeed, Faq } from '../types'

export type PostSeed = ArticleSeed & {
  category: 'seasonal' | 'how-to' | 'guides' | 'news'
  publishedAt: string
}

export type SolutionSeed = ArticleSeed & { problem: string; faqs: Faq[] }

export const posts: PostSeed[] = [
  {
    slug: 'how-often-should-gutters-be-cleaned',
    title: 'How often should gutters be cleaned?',
    excerpt:
      'Twice a year is the usual answer, but trees, roof shape and winter weather can change it. Here’s how to tell what your home needs.',
    category: 'how-to',
    publishedAt: '2026-09-15T15:00:00.000Z',
    heroImageLabel: 'Close-up of a gutter full of leaves and seeds',
    relatedServices: ['gutter-cleaning', 'gutter-brightening', 'roof-cleaning'],
    markdown: `Gutters have one job: move water off the roof and away from your home. When they clog, water spills over the edge, soaks the ground next to the foundation and, in winter, freezes into ice along the roof edge.

## The short answer: twice a year

For most homes in {region}, cleaning gutters **twice a year** keeps them working:

- **Late spring**, after trees drop seeds, buds and pollen.
- **Late fall**, after most leaves have fallen and before the first hard freeze.

## When twice a year isn’t enough

Some homes need more frequent cleaning:

- **Big trees overhead.** Maples, oaks and pines can fill gutters in a few weeks. Three or four cleanings a year may be needed.
- **Low-slope roofs.** Debris doesn’t wash down as easily, so gutters fill faster.
- **Valleys and corners.** Where two roof sections meet, water and debris pile into one spot.

## Signs your gutters are clogged

Watch for these between cleanings:

1. Water pouring over the edge during rain.
2. Plants or grass growing out of the gutter.
3. Gutters pulling away from the fascia.
4. Stains or worn paint on siding below the gutter.
5. Icicles hanging from the gutter in winter.

## What about gutter guards?

Guards help, but they don’t make gutters maintenance-free. Fine debris and roof grit still get through, and leaves can sit on top of the guard and block water. Plan on cleaning guarded gutters at least once a year.

## Doing it yourself vs. hiring help

Cleaning a one-story gutter from a stable ladder is a reasonable weekend job. Two- and three-story homes, steep roofs and icy conditions are where most ladder accidents happen. A professional [gutter cleaning](/services/gutter-cleaning) includes flushing every downspout and photos of anything that needs repair.

If your gutters have black streaks on the outside, that’s a separate job. [Gutter brightening](/services/gutter-brightening) removes the stripes so the roofline looks clean again.`,
  },
  {
    slug: 'soft-washing-vs-pressure-washing',
    title: 'Soft washing vs. pressure washing: which does your home need?',
    excerpt:
      'Both clean, but they work very differently. Using the wrong one can damage siding, roofs and wood. Here’s how to choose.',
    category: 'guides',
    publishedAt: '2026-08-20T15:00:00.000Z',
    heroImageLabel: 'Split image: low-pressure hose on siding, surface cleaner on concrete',
    relatedServices: ['soft-washing', 'pressure-washing', 'house-washing'],
    markdown: `"Power washing" gets used for everything, but there are two very different ways to clean the outside of a home. Choosing the right one protects your siding, roof and wood.

## Pressure washing: force for hard surfaces

Pressure washing uses a high-pressure stream of water to blast dirt off a surface. It’s the right tool for:

- Concrete driveways, walkways and patios
- Brick and stone pavers
- Garage floors

Even here, pressure has to be adjusted. Older concrete and soft pavers need less, and a rotary surface cleaner gives a more even result than a wand.

## Soft washing: chemistry for delicate surfaces

Soft washing uses low pressure, about what a garden hose puts out, along with a cleaning solution that breaks down dirt, algae and mildew. Then everything is rinsed with clean water. It’s the right method for:

- Vinyl, fiber cement and wood siding
- Stucco
- Roofs
- Painted surfaces, fences and decks

## Why pressure washing siding is a problem

High pressure on siding can:

- Force water behind panels and into walls.
- Strip paint and etch wood.
- Crack stucco.
- Knock protective granules off shingles.

It also tends to leave the roots of algae and mildew behind, so the stains come back quickly.

## So which one do I need?

Most homes need **both**: soft washing for the house and roof, pressure washing for the driveway and walks. A good company chooses the method for each surface. That’s how our [house washing](/services/house-washing) and [pressure washing](/services/pressure-washing) services work.

Not sure what you need? Use our [soft washing](/services/soft-washing) page to see what’s included, or get an instant price for your home.`,
  },
  {
    slug: 'preparing-your-driveway-for-winter',
    title: 'How to get your driveway ready for winter',
    excerpt:
      'A little work in the fall protects your driveway from freeze-thaw cracks, salt damage and snow-clearing scrapes.',
    category: 'seasonal',
    publishedAt: '2026-10-01T15:00:00.000Z',
    heroImageLabel: 'Freshly sealed driveway with fall leaves at the edge',
    relatedServices: ['driveway-sealing', 'driveway-cleaning', 'driveway-snow-clearing'],
    markdown: `Winter is hard on driveways. Water gets into small cracks, freezes, expands and makes them bigger. Road salt eats at the surface, and plows and shovels scrape the edges. A few fall steps make a real difference.

## 1. Clean it

Leaves, oil and dirt hold moisture against the surface and stop sealer from bonding. A [driveway cleaning](/services/driveway-cleaning) in early fall gives you a clean slate.

## 2. Fill the cracks

Small cracks are where winter damage starts. Filling them keeps water out. Do this on a dry day when temperatures are mild.

## 3. Seal it, if it’s due

Sealer helps keep water and salt out of the surface. Most sealers need warm, dry weather, so plan [driveway sealing](/services/driveway-sealing) before temperatures drop in the fall. Asphalt usually needs sealing every two to three years and concrete every three to five.

## 4. Mark the edges

Before the first snow, put reflective stakes along the edges of the driveway and walkways. They show where the pavement ends so lawn edges, sprinklers and garden beds don’t get damaged.

## 5. Choose your ice melt

Rock salt is cheap but hard on concrete, plants and pets’ paws. Gentler blends cost more but cause less damage. Whatever you use, shovel first and use less melt.

## 6. Plan your snow clearing

If you don’t want to shovel, sign up for a [driveway snow clearing](/services/driveway-snow-clearing) route in the fall. Routes fill up before the first storm.`,
  },
  {
    slug: 'when-to-book-christmas-light-installation',
    title: 'When to book Christmas light installation',
    excerpt:
      'Install dates fill up fast. Here’s a simple timeline for booking, installing and taking down holiday lights.',
    category: 'seasonal',
    publishedAt: '2026-09-01T15:00:00.000Z',
    heroImageLabel: 'Home with warm white roofline lights at dusk',
    relatedServices: [
      'christmas-light-installation',
      'christmas-light-removal',
      'permanent-led-lighting',
    ],
    markdown: `Most people think about holiday lights the week after Thanksgiving. By then, professional installers are usually booked solid. Here’s a simple timeline.

## September to early October: book

This is the best time to reserve an install date. You’ll have the widest choice of dates, and there’s time to plan the design.

## Late October to mid-November: install

Installing before the weather turns cold is safer and faster. Lights don’t have to be switched on right away. Set the timer to start whenever you like.

## Through the season: maintain

Strands sometimes fail, and wind can knock clips loose. A good installer will fix outages during the season.

## January: take down and store

Taking lights down carefully, one clip at a time, keeps gutters and shingles undamaged and strands ready for next year. Storage means you don’t need garage space for the bins.

## Your lights or theirs?

You can use your own lights, or have commercial-grade LEDs supplied. Supplied lights are usually brighter, more even and come with the installation.

## Thinking of skipping the yearly install?

[Permanent LED lighting](/services/permanent-led-lighting) stays up all year and is controlled from your phone, with colors for every holiday.

Ready to book? Get a price for [Christmas light installation](/services/christmas-light-installation) and add [removal](/services/christmas-light-removal) for January.`,
  },
  {
    slug: 'spring-exterior-checklist',
    title: 'A spring checklist for the outside of your home',
    excerpt: 'Winter leaves its mark. Use this checklist to find and fix problems before summer.',
    category: 'seasonal',
    publishedAt: '2026-04-01T15:00:00.000Z',
    heroImageLabel: 'Freshly washed house with spring flowers in the beds',
    relatedServices: ['house-washing', 'gutter-cleaning', 'yard-cleanup', 'window-cleaning'],
    markdown: `Snow, salt and freeze-thaw cycles are tough on a home. Once the snow is gone, walk around the outside of your house with this list.

## Roof and gutters

- Look for missing or lifted shingles from the ground.
- Check gutters for sagging, leaks and loose downspouts.
- Clear out debris left from fall and winter. [Gutter cleaning](/services/gutter-cleaning) in late spring catches seeds and buds too.

## Siding and trim

- Look for green algae on north-facing walls.
- Check caulk around windows and doors for cracks.
- Look for peeling paint on trim.

A spring [house wash](/services/house-washing) removes winter grime and makes it easy to spot problems.

## Windows

- Clean the glass, screens and tracks.
- Check for broken screens before bug season.

[Window cleaning](/services/window-cleaning) inside and out lets in a lot more light.

## Driveway and walkways

- Wash off winter salt.
- Look for new cracks and heaved slabs.

## Yard

- Rake matted leaves off the lawn so grass can breathe.
- Cut back dead perennials and clear garden beds.
- Check fences and decks for loose boards.

A [spring yard cleanup](/services/yard-cleanup) handles the raking, cutting back and hauling in one visit.`,
  },
  {
    slug: 'what-a-move-out-clean-covers',
    title: 'What a move-out clean covers (and what it doesn’t)',
    excerpt:
      'Moving out? Here’s what a professional move-out clean includes, and how to plan it around your move.',
    category: 'guides',
    publishedAt: '2026-06-10T15:00:00.000Z',
    heroImageLabel: 'Empty, clean kitchen with open cabinets',
    relatedServices: ['move-in-move-out-cleaning', 'junk-removal', 'garage-cleaning'],
    markdown: `A move-out clean is deeper than a regular house cleaning. With the furniture gone, everything is on display, and landlords and buyers look closely.

## What’s usually included

- **Inside cabinets, drawers and closets**, wiped out completely.
- **Kitchens:** counters, sink, backsplash, outside of appliances, and inside if you choose.
- **Bathrooms:** toilets, tubs, showers, sinks, mirrors and cabinets.
- **Baseboards, doors, switches and outlets**, all the places people touch.
- **Window sills and tracks.**
- **Floors** vacuumed and mopped.

## What’s usually extra

- **Inside the fridge and oven**, often an add-on.
- **Carpet steam cleaning**, usually a separate specialist.
- **Wall repairs and painting.**
- **Leftover furniture and junk.** Add [junk removal](/services/junk-removal) to clear it.

## Timing it right

Book the clean **after the movers leave** and **before the final walk-through**. Keep the water and power on until the cleaners finish.

## Don’t forget the garage

Garages are often left full of odds and ends. A [garage cleaning](/services/garage-cleaning) clears and sweeps it so the whole property is ready.

Get an instant price for a [move-in or move-out clean](/services/move-in-move-out-cleaning) based on bedrooms and bathrooms.`,
  },
]

export const solutions: SolutionSeed[] = [
  {
    slug: 'roof-moss-and-algae-removal',
    title: 'Black streaks and moss on your roof',
    problem: 'Dark streaks running down the roof, or green moss growing on shady sections.',
    excerpt: 'What causes roof streaks and moss, why it matters and how to remove it safely.',
    heroImageLabel: 'Roof with black streaks next to a clean section',
    relatedServices: ['roof-cleaning', 'gutter-cleaning', 'soft-washing'],
    markdown: `## What you’re seeing

**Black streaks** on a shingle roof are usually a type of algae. It spreads with wind and grows best on shady, damp parts of the roof. **Green moss** and crusty **lichen** grow in the same conditions, often on north-facing sections and under trees.

## Why it matters

- Moss holds water against shingles and can lift their edges.
- Water held on the roof can lead to leaks and shorter roof life.
- Streaks make the whole home look older than it is.

## What not to do

Don’t pressure wash a roof. High pressure strips the granules that protect shingles from the sun, and it can force water under them.

## The fix

A soft-wash treatment kills algae, moss and lichen at low pressure. Loose moss is brushed off by hand, gutters are rinsed, and any remaining streaks fade over the next few rains. That’s how our [roof cleaning](/services/roof-cleaning) works.

## Keep it from coming back

- Trim branches that shade the roof.
- Keep gutters clear so water drains. [Gutter cleaning](/services/gutter-cleaning) twice a year helps.
- Plan a roof treatment every few years.`,
    faqs: [
      {
        question: 'Is roof algae harmful?',
        answer:
          'Mostly it’s cosmetic, but moss and heavy growth hold moisture that can damage shingles over time.',
      },
      {
        question: 'Can I just scrape the moss off?',
        answer: 'Scraping can tear shingles. Treating it first lets it come off gently.',
      },
      {
        question: 'How long does a treatment last?',
        answer: 'Usually several years, depending on shade and trees.',
      },
    ],
  },
  {
    slug: 'ice-dam-prevention',
    title: 'Ice dams along the roof edge',
    problem: 'A ridge of ice at the roof edge, with big icicles and water stains inside.',
    excerpt:
      'Why ice dams form, the damage they cause and what you can do before and during winter.',
    heroImageLabel: 'Thick ice and icicles along a snowy roof edge',
    relatedServices: ['gutter-cleaning', 'ice-control', 'snow-removal'],
    markdown: `## What an ice dam is

An ice dam is a ridge of ice that forms at the edge of a roof. Snow higher on the roof melts, the water runs down, and it refreezes at the colder edge. The ridge grows and traps more water behind it, which can back up under shingles and leak into the home.

## Warning signs

- Thick ice along the roof edge or in gutters.
- Large icicles, especially with water dripping behind them.
- Water stains on ceilings or walls near outside walls.

## What causes them

The main cause is **heat escaping into the attic**, which warms the roof and melts snow from below. Clogged gutters make it worse because meltwater has nowhere to go.

## How to help prevent them

1. **Clean gutters in late fall** so meltwater can drain. See [gutter cleaning](/services/gutter-cleaning).
2. **Ask an insulation or roofing pro** about attic insulation and ventilation. That’s the long-term fix.
3. **Rake snow** off the lowest few feet of the roof from the ground after heavy storms.
4. **Treat walkways** under the roof edge, where dripping water refreezes. [Ice control](/services/ice-control) covers those icy spots.

## If you already have one

Don’t chip at the ice with tools, which can damage shingles and gutters. If water is getting inside, call a roofer.`,
    faqs: [
      {
        question: 'Do clean gutters stop ice dams?',
        answer: 'They help meltwater drain, but the root cause is heat loss into the attic.',
      },
      {
        question: 'Are icicles always a sign of an ice dam?',
        answer: 'Not always, but large icicles with ice built up behind them are a warning sign.',
      },
      {
        question: 'Can you remove ice dams?',
        answer:
          'We focus on prevention: clean gutters and treated walkways. Active leaks need a roofer.',
      },
    ],
  },
  {
    slug: 'oil-stains-on-concrete',
    title: 'Oil stains on the driveway or garage floor',
    problem: 'Dark, greasy spots on concrete where cars park.',
    excerpt: 'How to lift oil stains from concrete, and when they won’t fully come out.',
    heroImageLabel: 'Oil stain on a concrete garage floor, partly treated',
    relatedServices: ['garage-driveway-pressure-cleaning', 'driveway-cleaning', 'driveway-sealing'],
    markdown: `## Why oil stains are stubborn

Concrete is porous. Oil soaks in, and the longer it sits, the deeper it goes. Water alone can’t lift it.

## For fresh spills

1. Cover the spill with cat litter or sawdust right away to soak up as much as possible.
2. Sweep it up after a few hours.
3. Scrub the spot with a degreaser and a stiff brush, then rinse.

## For older stains

Older stains need a stronger degreaser left to sit, then hot water and a surface cleaner. Our [garage and driveway pressure cleaning](/services/garage-driveway-pressure-cleaning) uses this approach.

## Setting expectations

Most stains fade a lot. Very old stains that have soaked deep into the concrete may leave a light shadow.

## Keep stains from coming back

- Fix the leak at the source.
- Use a drip mat where you park.
- [Seal the driveway](/services/driveway-sealing) so future spills sit on top and wipe up more easily.`,
    faqs: [
      {
        question: 'Will pressure washing alone remove oil?',
        answer: 'Not usually. Oil needs a degreaser first, then washing.',
      },
      {
        question: 'Can oil stains be removed from pavers?',
        answer: 'Often, yes, with care, since pavers need lower pressure.',
      },
      {
        question: 'Does sealing help?',
        answer: 'Yes. Sealed concrete absorbs less oil, so spills clean up more easily.',
      },
    ],
  },
  {
    slug: 'green-algae-on-siding',
    title: 'Green streaks on siding',
    problem: 'Green or black film on siding, usually on the shady side of the house.',
    excerpt: 'What the green film on your siding is and how to remove it without damage.',
    heroImageLabel: 'North wall of a house with green algae on vinyl siding',
    relatedServices: ['house-washing', 'soft-washing', 'gutter-brightening'],
    markdown: `## What it is

The green film on siding is usually **algae**, sometimes with mildew mixed in. It grows where siding stays damp and shady: north-facing walls, near trees and shrubs, and below sprinklers.

## Why scrubbing or blasting doesn’t last

Scrubbing removes the surface layer but leaves roots behind. Pressure washing can push water behind siding, strip paint and crack stucco, and the growth comes back quickly.

## The fix

A soft wash applies a cleaning solution at low pressure that kills the growth, then rinses it away. It’s safe for vinyl, fiber cement, painted wood and stucco. See [soft washing](/services/soft-washing), or book a full [house wash](/services/house-washing).

## Slowing it down

- Trim shrubs so siding gets air and light.
- Point sprinklers away from walls.
- Keep gutters flowing so water doesn’t run down the siding.
- Plan a yearly house wash.`,
    faqs: [
      {
        question: 'Is algae on siding harmful?',
        answer: 'It’s mostly cosmetic, but it holds moisture and can stain siding over time.',
      },
      {
        question: 'Will bleach kill it?',
        answer:
          'Cleaning solutions do, but they must be diluted correctly and rinsed to protect plants.',
      },
      {
        question: 'How long until it grows back?',
        answer: 'Usually one to two years after a soft wash, longer in sunny spots.',
      },
    ],
  },
  {
    slug: 'overflowing-gutters',
    title: 'Gutters overflowing in the rain',
    problem: 'Water spilling over the edge of the gutter instead of going down the downspout.',
    excerpt: 'The common causes of overflowing gutters and how to fix each one.',
    heroImageLabel: 'Rainwater pouring over the edge of a gutter',
    relatedServices: ['gutter-cleaning', 'minor-exterior-repairs', 'gutter-brightening'],
    markdown: `## Common causes

1. **Clogs.** Leaves, seeds and roof grit block the gutter or downspout.
2. **Blocked downspouts.** The gutter looks clear but water can’t get out.
3. **Wrong slope.** Gutters sag or tilt the wrong way, so water pools.
4. **Too much water in one spot.** Roof valleys can send more water than a gutter can carry.

## How to fix each one

- **Clogs and downspouts:** a full [gutter cleaning](/services/gutter-cleaning) clears the gutters and flushes every downspout.
- **Sagging or loose gutters:** re-securing brackets and adjusting slope. Small fixes can be quoted as [minor exterior repairs](/services/minor-exterior-repairs).
- **Valley overflow:** a splash guard at the corner often solves it.

## Why it matters

Overflow soaks the ground beside the foundation, stains siding and can lead to basement moisture. In winter, overflow freezes into ice on walkways and along the roof edge.`,
    faqs: [
      {
        question: 'My gutters are clean but still overflow. Why?',
        answer: 'Check the downspouts. A blocked downspout makes a clean gutter overflow.',
      },
      {
        question: 'Do gutter guards stop overflow?',
        answer:
          'They reduce clogs but can be overwhelmed in heavy rain or when covered with leaves.',
      },
      {
        question: 'Can you fix a sagging gutter?',
        answer: 'Usually, by re-securing brackets. Badly damaged sections may need replacing.',
      },
    ],
  },
  {
    slug: 'icy-walkways-and-steps',
    title: 'Icy walkways and steps',
    problem: 'Steps and walkways that turn to ice overnight, even after shoveling.',
    excerpt: 'Why cleared walkways ice over, and how to keep steps safe all winter.',
    heroImageLabel: 'Icy front steps with ice melt being applied',
    relatedServices: ['salting-de-icing', 'ice-control', 'walkway-sidewalk-snow-clearing'],
    markdown: `## Why it happens

Even after clearing, a thin layer of snow or meltwater stays behind. When temperatures drop overnight, it freezes. Water dripping from roof edges and gutters makes some spots worse.

## How to keep walkways safe

1. **Clear down to the surface** soon after snowfall, before it’s packed down. [Walkway clearing](/services/walkway-sidewalk-snow-clearing) on a snow route handles this for you.
2. **Treat right after clearing.** Ice melt works best on a thin layer. See [salting and de-icing](/services/salting-de-icing).
3. **Pre-treat before storms.** A liquid anti-icer stops ice bonding to the surface. That’s part of [ice control](/services/ice-control).
4. **Fix drips.** Clean gutters and check downspouts that drain onto walkways.

## Choosing ice melt

Rock salt is cheap but can damage concrete and plants and is hard on pets’ paws. Gentler blends cost more but cause less damage. Use the least amount that works.`,
    faqs: [
      {
        question: 'Why do my steps ice over but not the driveway?',
        answer: 'Steps are often shaded and get drips from the roof, so they stay wet and freeze.',
      },
      {
        question: 'Is ice melt safe for new concrete?',
        answer: 'Avoid rock salt on concrete less than a year old. Ask about gentler options.',
      },
      {
        question: 'Can you treat for freezing rain?',
        answer: 'Yes. Ice control includes visits for freezing rain and refreeze.',
      },
    ],
  },
]
