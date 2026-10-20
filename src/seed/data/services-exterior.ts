import { ask, homeSize, stories } from '../questions'
import type { ServiceSeed } from '../types'

const SPRING_TO_FALL = ['spring', 'summer', 'fall'] as const

export const exteriorServices: ServiceSeed[] = [
  {
    slug: 'pressure-washing',
    title: 'Pressure Washing',
    category: 'exterior-cleaning',
    icon: 'spray',
    quoteMode: 'instant',
    seasons: [...SPRING_TO_FALL],
    bookingWindowNote: 'Best from April to October, when surfaces dry quickly.',
    headline: 'Hard surfaces that look new again',
    promise: 'Deep cleaning for concrete, pavers, brick and stone across {region}.',
    summary:
      'Pressure washing for driveways, walkways, patios and other hard surfaces, with the pressure matched to each material.',
    outcomeLabel: 'Get clean concrete',
    bullets: [
      'Driveways, walkways and patios',
      'Pressure matched to each surface',
      'Oil and rust pre-treatment',
    ],
    heroImageLabel: 'Concrete walkway half cleaned, showing a sharp line between dirty and clean',
    problem:
      'Hard surfaces take a beating. Winter salt, tire marks, oil drips, moss in the joints and summer dust build up a little at a time. One day the driveway looks gray and tired and the walkway is slick after rain. A garden hose can’t lift grime that has soaked into concrete and stone.',
    benefits: [
      {
        title: 'Safer footing',
        body: 'Removing algae, mud and grime cuts down on slippery spots on steps and walkways.',
      },
      {
        title: 'Instant curb appeal',
        body: 'Clean concrete and pavers make the whole property look cared for. It’s one of the quickest upgrades you can make.',
      },
      {
        title: 'Surfaces last longer',
        body: 'Dirt, salt and moss hold moisture that wears surfaces down. Washing them off slows that damage.',
      },
      {
        title: 'Ready for sealing',
        body: 'A deep clean is the first step before sealing a driveway or staining wood.',
      },
    ],
    included: [
      'Sweep of loose debris before washing',
      'Pre-treatment of oil, rust and organic stains',
      'Rotary surface cleaner for an even, stripe-free finish',
      'Detail work along edges, steps and drains',
      'Rinse of nearby walls and plants',
      'Walk-through with you at the end',
    ],
    method:
      'Flat areas get a rotary surface cleaner: two spinning jets under a hood give an even clean and keep the spray contained. Steps, edges and corners get a wand with a fan tip. We set pressure and nozzle for each material. Concrete takes more, pavers and soft stone take less. Tough stains get a pre-treatment that sits for a few minutes before we wash.',
    safety:
      'We wet down plants, cover outdoor outlets and keep spray away from windows and doors. Pavers and soft stone get lower pressure so the surface and joint sand stay put. Siding, roofs and wood are never pressure washed. Those get soft washing instead.',
    process: [
      {
        title: 'Get a price',
        body: 'Tell us the surfaces and rough size. Most homes get an instant price range online.',
      },
      { title: 'Prep', body: 'We move light items, cover outlets and wet down nearby plants.' },
      {
        title: 'Treat and wash',
        body: 'Stains are pre-treated, then we clean flat areas and detail the edges.',
      },
      {
        title: 'Rinse and review',
        body: 'We rinse everything, including splash on walls, and check the job with you.',
      },
    ],
    priceFactors: [
      'Total square footage',
      'Surface type: concrete, pavers, brick or stone',
      'Time since the last cleaning',
      'Oil, rust or paint stains that need treatment',
    ],
    addOns: [
      { name: 'Oil stain treatment', description: 'Degreaser and extra passes on parking spots.' },
      {
        name: 'Paver joint sand',
        description: 'Fresh polymeric sand swept into the joints after cleaning.',
      },
    ],
    faqs: [
      {
        question: 'Will pressure washing damage my concrete?',
        answer:
          'Not when it’s done right. A surface cleaner keeps the jets at an even height, and we lower the pressure for older or softer concrete. Etched lines and stripes come from holding a wand too close, which the surface cleaner avoids.',
      },
      {
        question: 'Do I need to be home?',
        answer:
          'No. We need an outdoor water tap and access to the areas we’re cleaning. We’ll send a message when we’re done.',
      },
      {
        question: 'Can you get oil stains out?',
        answer:
          'We pre-treat oil and rust and can usually lighten them a lot. Very old stains that have soaked deep into concrete may not disappear completely. We’ll tell you what to expect before we start.',
      },
      {
        question: 'How often should hard surfaces be washed?',
        answer:
          'Once a year is enough for most driveways and walkways. Shady spots that grow algae may need it twice. Spring is popular for washing off winter salt.',
      },
      {
        question: 'What’s the difference between pressure washing and soft washing?',
        answer:
          'Pressure washing uses force to clean hard surfaces like concrete. Soft washing uses low pressure and cleaning solutions for siding, roofs and anything delicate. We pick the right one for each surface.',
      },
    ],
    related: ['driveway-cleaning', 'patio-balcony-cleaning', 'garage-driveway-pressure-cleaning'],
    questions: [
      ask.select('surface', 'Main surface', ['Concrete', 'Pavers', 'Brick', 'Natural stone']),
      ask.number('area', 'Approximate area', {
        min: 50,
        max: 20000,
        unit: 'sq ft',
        helpText: 'A two-car driveway is roughly 400–600 sq ft.',
      }),
      ask.yesNo('stains', 'Oil or rust stains to treat?'),
    ],
  },
  {
    slug: 'soft-washing',
    title: 'Soft Washing',
    category: 'exterior-cleaning',
    icon: 'droplets',
    quoteMode: 'instant',
    seasons: ['all-year'],
    headline: 'Gentle cleaning for surfaces that can’t take pressure',
    promise: 'Low-pressure washing that removes algae, mildew and grime without damage.',
    summary:
      'Soft washing cleans siding, stucco, painted wood and other delicate surfaces with low pressure and cleaning solutions instead of force.',
    outcomeLabel: 'Get a gentle, deep clean',
    bullets: [
      'Safe for stucco, vinyl and paint',
      'Kills algae and mildew at the root',
      'Results last longer',
    ],
    heroImageLabel: 'Technician soft washing stucco with a low-pressure hose',
    problem:
      'Green and black streaks on siding are usually algae, mildew or mold. Blasting them with high pressure can force water behind siding, strip paint, crack stucco and leave marks. It also leaves the roots behind, so the growth comes back fast.',
    benefits: [
      {
        title: 'No damage',
        body: 'Low pressure, about what a garden hose puts out, is safe on stucco, vinyl, painted wood and window seals.',
      },
      {
        title: 'Cleans at the root',
        body: 'The cleaning solution kills algae and mildew instead of just knocking off the top layer.',
      },
      {
        title: 'Stays clean longer',
        body: 'Because the growth is killed, not just rinsed, surfaces stay clean for much longer.',
      },
    ],
    included: [
      'Inspection of the surface and nearby plants',
      'Pre-wetting of plants and landscaping',
      'Low-pressure application of a cleaning solution mixed for the surface',
      'Dwell time so the solution can work',
      'Thorough low-pressure rinse',
      'Final rinse of plants and walkways',
    ],
    method:
      'We mix a cleaning solution for the surface and the type of growth, then apply it at low pressure. It sits for several minutes to break down algae, mildew and dirt. Then we rinse everything with plenty of clean water at low pressure. Soft washing is the method we use inside our house washing and roof cleaning services.',
    safety:
      'We soak plants before, during and after the wash, and cover delicate ones. Doors and windows stay closed and outdoor outlets are covered. Nothing is sprayed at high pressure near seals, vents or light fixtures.',
    process: [
      { title: 'Assess', body: 'We check the surface, the type of staining and nearby plants.' },
      { title: 'Protect', body: 'Plants are soaked and delicate areas covered.' },
      {
        title: 'Apply',
        body: 'The cleaning solution goes on at low pressure and sits for a few minutes.',
      },
      { title: 'Rinse', body: 'We rinse the surface, plants and walkways with clean water.' },
    ],
    priceFactors: ['Surface area', 'Surface type', 'Height and access', 'How heavy the growth is'],
    faqs: [
      {
        question: 'Is soft washing safe for my plants?',
        answer:
          'Yes, when plants are protected. We soak them before and after, cover delicate ones, and rinse everything at the end. The solution is diluted and washed away.',
      },
      {
        question: 'Will it really clean without pressure?',
        answer:
          'Yes. The cleaning solution does the work that pressure would otherwise do, and it reaches into the surface to kill growth. The rinse removes what’s left.',
      },
      {
        question: 'What surfaces is soft washing for?',
        answer:
          'Vinyl and fiber cement siding, stucco, painted wood, brick, roofs, fences and outdoor furniture. Basically anything that could be damaged by high pressure.',
      },
      {
        question: 'How long do results last?',
        answer:
          'Usually one to two years, depending on shade and moisture. North-facing walls and shady spots tend to come back sooner.',
      },
      {
        question: 'Do I need to do anything before you arrive?',
        answer:
          'Close windows, move fragile items away from the walls and make sure we can reach an outdoor tap. We take care of the rest.',
      },
    ],
    related: ['house-washing', 'roof-cleaning', 'fence-cleaning'],
    questions: [
      ask.select('surface', 'What needs cleaning?', [
        'Vinyl siding',
        'Stucco',
        'Painted wood',
        'Brick',
        'Fiber cement',
        'Other',
      ]),
      ask.number('area', 'Approximate area', {
        min: 100,
        max: 20000,
        unit: 'sq ft',
        helpText: 'A rough guess is fine.',
      }),
    ],
  },
  {
    slug: 'house-washing',
    title: 'House Washing',
    category: 'exterior-cleaning',
    icon: 'house',
    quoteMode: 'instant',
    seasons: ['all-year'],
    bookingWindowNote: 'Book any time the temperature is above freezing.',
    headline: 'The whole house, washed top to bottom',
    promise: 'A full exterior wash for {region} homes, from soffits to foundation.',
    summary:
      'A complete exterior house wash using soft washing: siding, trim, soffits, fascia and front door, safely cleaned in one visit.',
    outcomeLabel: 'Get a brighter house',
    bullets: [
      'Siding, trim, soffits and fascia',
      'Soft wash: safe for every siding type',
      'Done in one visit',
    ],
    heroImageLabel: 'Crew soft-washing a two-story house with vinyl siding',
    problem:
      'Dust, pollen, spider webs, road grime and green algae build up on the outside of every home. It happens slowly, so it’s easy to miss until you see a clean house next door. Left alone, the growth stains siding and wears down paint.',
    benefits: [
      {
        title: 'Looks new again',
        body: 'Washing brings back the true color of your siding and trim.',
      },
      {
        title: 'Protects your paint and siding',
        body: 'Removing algae and grime slows fading and wear, so you repaint less often.',
      },
      {
        title: 'Healthier home',
        body: 'Less mold, mildew and pollen on the walls and around windows and doors.',
      },
      {
        title: 'Ready to sell or show',
        body: 'A clean exterior makes a strong first impression for buyers and guests.',
      },
    ],
    included: [
      'All siding, trim, soffits and fascia',
      'Front door, garage door and exterior light fixtures',
      'Window frames and sills (glass is a separate service)',
      'Removal of spider webs and wasp nests we can reach safely',
      'Protection and rinsing of plants',
      'Final walk-around with you',
    ],
    method:
      'We soft wash: a cleaning solution goes on at low pressure, sits for a few minutes, and is rinsed off with plenty of clean water. We work from the top down so dirty water never runs over clean areas. Each siding type gets its own mix. Stucco, vinyl, brick and painted wood each need something a little different.',
    safety:
      'No high pressure on siding, ever. That’s how water gets behind panels and paint gets stripped. We close vents and cover outlets, soak plants before and after, and use ladders and extension poles safely around power lines.',
    process: [
      {
        title: 'Get a price',
        body: 'Answer three questions about your home for an instant price range.',
      },
      { title: 'Protect', body: 'We close up vents and outlets and soak your plants.' },
      { title: 'Wash', body: 'We soft wash every side of the house from the top down.' },
      { title: 'Rinse', body: 'Siding, windows, plants and walkways get a clean-water rinse.' },
      { title: 'Review', body: 'We walk around the house with you, or send photos if you’re out.' },
    ],
    priceFactors: [
      'Size of the home',
      'Number of stories',
      'Siding type',
      'Heavy algae or staining',
    ],
    addOns: [
      { name: 'Window cleaning', description: 'Streak-free glass to match your clean siding.' },
      { name: 'Gutter brightening', description: 'Removes the black streaks on gutter faces.' },
    ],
    faqs: [
      {
        question: 'How often should I wash my house?',
        answer:
          'Once a year keeps most homes looking good. Homes with heavy shade or near trees may want it every spring and fall.',
      },
      {
        question: 'Will water get inside?',
        answer:
          'No. We use low pressure, keep windows and doors closed, and never spray up under siding laps or into vents.',
      },
      {
        question: 'Do you clean the windows too?',
        answer:
          'Frames and sills are included. Glass is cleaned with a separate method for a streak-free finish. Add window cleaning to the same visit.',
      },
      {
        question: 'Can you wash a house in winter?',
        answer:
          'Yes, on days above freezing. We avoid freezing temperatures so rinse water doesn’t ice up on walkways.',
      },
      {
        question: 'Is the cleaning solution safe for kids and pets?',
        answer:
          'Keep kids and pets inside while we work. Once everything is rinsed and dry, the area is safe to use again, usually within an hour.',
      },
    ],
    related: ['soft-washing', 'window-cleaning', 'gutter-brightening'],
    questions: [
      homeSize,
      stories,
      ask.select('siding', 'Siding type', [
        'Vinyl',
        'Stucco',
        'Brick',
        'Wood',
        'Fiber cement',
        'Mixed',
      ]),
    ],
  },
  {
    slug: 'driveway-cleaning',
    title: 'Driveway Cleaning',
    category: 'exterior-cleaning',
    icon: 'car',
    quoteMode: 'instant',
    seasons: [...SPRING_TO_FALL],
    bookingWindowNote: 'Spring is popular for washing off winter salt.',
    headline: 'A driveway that looks as good as the house',
    promise: 'Tire marks, salt, oil and grime lifted from concrete, pavers and asphalt.',
    summary:
      'Driveway cleaning for concrete, pavers and asphalt, with stain pre-treatment and a stripe-free finish.',
    outcomeLabel: 'Get a clean driveway',
    bullets: [
      'Concrete, pavers and asphalt',
      'Tire marks and salt residue',
      'Even, stripe-free finish',
    ],
    heroImageLabel: 'Concrete driveway after cleaning, with a clean line where the work stopped',
    problem:
      'Your driveway is the largest hard surface in front of your house. Tire marks, oil drips, salt from winter, rust from patio furniture and dark stains from leaves all show up there first.',
    benefits: [
      {
        title: 'Big visual change',
        body: 'A clean driveway brightens the whole front of the house.',
      },
      {
        title: 'Less wear from salt',
        body: 'Washing off winter salt slows spalling and pitting in concrete.',
      },
      {
        title: 'Ready for sealing',
        body: 'Sealer only bonds to a clean surface, so cleaning comes first.',
      },
    ],
    included: [
      'Pre-treatment of oil, rust and leaf stains',
      'Surface cleaner on the full driveway',
      'Edges, apron and expansion joints',
      'Rinse of the street gutter in front of the drive',
    ],
    method:
      'We pre-treat stains, then clean the whole drive with a rotary surface cleaner for an even finish. Concrete gets a stronger clean. Pavers and asphalt get lower pressure so we don’t loosen joint sand or wear the surface. We finish by detailing edges and rinsing the drive and gutter.',
    safety:
      'We keep spray away from cars, garage door seals and lawn edges, and we lower pressure on pavers and asphalt.',
    process: [
      {
        title: 'Get a price',
        body: 'Tell us the surface and rough size for an instant price range.',
      },
      { title: 'Pre-treat', body: 'Oil, rust and organic stains get a pre-treatment.' },
      { title: 'Clean', body: 'A surface cleaner covers the whole drive evenly.' },
      {
        title: 'Detail and rinse',
        body: 'Edges and joints are detailed, then everything is rinsed.',
      },
    ],
    priceFactors: ['Driveway size', 'Surface type', 'Number and type of stains'],
    addOns: [{ name: 'Sealing', description: 'Protect the clean surface with a sealer.' }],
    faqs: [
      {
        question: 'Do I need to move my cars?',
        answer: 'Yes, please park on the street or in the garage so we can reach the whole drive.',
      },
      {
        question: 'Can you clean asphalt?',
        answer: 'Yes, with lower pressure. Asphalt is softer than concrete, so we clean it gently.',
      },
      {
        question: 'How long until I can drive on it?',
        answer: 'Usually right away. On cool or shady days, give it an hour to dry.',
      },
      {
        question: 'Will the stains come out completely?',
        answer:
          'Most dirt and fresh stains do. Deep oil and rust stains usually fade a lot but may not vanish. We’ll set expectations before we start.',
      },
      {
        question: 'What’s the difference from garage and driveway cleaning?',
        answer:
          'This service covers the driveway only. Garage and driveway pressure cleaning adds the garage floor, with extra focus on oil stains and tire marks.',
      },
    ],
    related: ['driveway-sealing', 'garage-driveway-pressure-cleaning', 'pressure-washing'],
    questions: [
      ask.select('surface', 'Driveway surface', ['Concrete', 'Pavers', 'Asphalt']),
      ask.number('area', 'Approximate size', {
        min: 100,
        max: 10000,
        unit: 'sq ft',
        helpText: 'One car space is about 200 sq ft.',
      }),
      ask.yesNo('stains', 'Oil or rust stains to treat?'),
    ],
  },
  {
    slug: 'patio-balcony-cleaning',
    title: 'Patio & Balcony Cleaning',
    category: 'exterior-cleaning',
    icon: 'sun',
    quoteMode: 'instant',
    seasons: [...SPRING_TO_FALL],
    headline: 'Outdoor living space, ready for summer',
    promise: 'Clean patios and balconies you’ll actually want to use.',
    summary:
      'Cleaning for ground-level patios and upper balconies: stone, pavers, concrete, tile and composite.',
    outcomeLabel: 'Get your patio back',
    bullets: [
      'Patios, pavers and tile',
      'Upper balconies, no mess below',
      'Furniture moved and replaced',
    ],
    heroImageLabel: 'Clean stone patio with outdoor furniture set back in place',
    problem:
      'Patios and balconies collect pollen, bird droppings, grill grease, algae in shady corners and dirt in the joints. Balconies are hard to clean yourself without soaking the one below.',
    benefits: [
      { title: 'Ready to enjoy', body: 'A clean, fresh space for meals, guests and relaxing.' },
      { title: 'Less slippery', body: 'Removing algae makes shady patios safer to walk on.' },
      {
        title: 'Considerate on balconies',
        body: 'We control water and runoff so neighbors below stay dry.',
      },
    ],
    included: [
      'Moving light furniture and putting it back',
      'Pre-treatment of grease and organic stains',
      'Cleaning of the surface, steps and edges',
      'Railings and glass panels wiped down on balconies',
      'Runoff control on upper balconies',
    ],
    method:
      'Ground-level patios get a surface cleaner and careful edge work. Balconies are washed at low pressure with controlled water flow so runoff goes to the drain, not over the edge. Wood and composite get the gentle approach used for decks.',
    safety:
      'On balconies we check the drain first and keep water volume low. We never use high pressure on tile grout, wood or composite.',
    process: [
      { title: 'Get a price', body: 'Tell us the space, surface and rough size.' },
      { title: 'Clear', body: 'We move light furniture and planters out of the way.' },
      { title: 'Clean', body: 'Stains are treated and the surface is washed.' },
      { title: 'Reset', body: 'Everything is rinsed and your furniture goes back.' },
    ],
    priceFactors: ['Size', 'Surface type', 'Ground level or balcony', 'Furniture to move'],
    faqs: [
      {
        question: 'Can you clean a condo balcony?',
        answer:
          'Yes. We use low pressure and control runoff. Check your building’s rules, as some HOAs set cleaning days or times.',
      },
      {
        question: 'Will you clean the patio furniture?',
        answer: 'We move it and put it back. Washing the furniture itself can be added on request.',
      },
      {
        question: 'Is it safe for stone and tile?',
        answer: 'Yes. Natural stone and tile get low pressure and a gentle cleaner.',
      },
      {
        question: 'Can you remove grill grease?',
        answer:
          'We pre-treat grease and can usually remove most of it. Old, soaked-in stains may leave a shadow.',
      },
      {
        question: 'Do you need water from my unit?',
        answer:
          'For balconies, yes, from an outdoor tap if there is one, or we bring water in for small jobs.',
      },
    ],
    related: ['deck-cleaning', 'pressure-washing', 'window-cleaning'],
    questions: [
      ask.select('space', 'What needs cleaning?', ['Ground-level patio', 'Upper balcony']),
      ask.select('surface', 'Surface', [
        'Concrete',
        'Pavers',
        'Stone',
        'Tile',
        'Wood',
        'Composite',
      ]),
      ask.number('area', 'Approximate size', { min: 30, max: 3000, unit: 'sq ft' }),
    ],
  },
  {
    slug: 'deck-cleaning',
    title: 'Deck Cleaning',
    category: 'exterior-cleaning',
    icon: 'layers',
    quoteMode: 'instant',
    seasons: [...SPRING_TO_FALL],
    headline: 'Decks cleaned gently, never gouged',
    promise: 'Wood and composite decks cleaned without raising fibers or damaging boards.',
    summary: 'Gentle deck cleaning for wood, composite and PVC decks, including rails and stairs.',
    outcomeLabel: 'Get a clean deck',
    bullets: [
      'Wood, composite and PVC',
      'Rails and stairs included',
      'The first step before staining',
    ],
    heroImageLabel: 'Cedar deck with one half cleaned and the other still gray',
    problem:
      'Sun turns wood decks gray. Shade and moisture bring green algae and black mildew, and composite decks collect grime in their grain. High pressure from a rental washer often gouges wood and leaves fuzzy, raised fibers.',
    benefits: [
      {
        title: 'Brings back the wood',
        body: 'Removes gray, weathered fibers and grime so the wood’s color shows again.',
      },
      {
        title: 'Safer surface',
        body: 'Algae and mildew make decks slippery. Cleaning removes them.',
      },
      {
        title: 'Ready to stain',
        body: 'Stain needs clean, open wood to soak in. We prep it properly.',
      },
    ],
    included: [
      'Deck boards, rails, stairs and skirting',
      'Cleaning solution matched to wood or composite',
      'Low-pressure wash and rinse',
      'Brightener on wood to restore color',
      'Plants and siding protected and rinsed',
    ],
    method:
      'We apply a cleaner suited to the material, let it work, then wash with low pressure and a wide fan tip, moving with the grain. On wood we finish with a brightener that restores color and balances the wood for staining.',
    safety:
      'Low pressure only, kept at a safe distance from the boards. We protect plants and siding and keep the cleaner off nearby surfaces.',
    process: [
      { title: 'Get a price', body: 'Tell us the material and rough size.' },
      { title: 'Prep', body: 'Furniture is moved and plants are covered.' },
      { title: 'Clean', body: 'Cleaner goes on, then a gentle wash with the grain.' },
      { title: 'Brighten and rinse', body: 'Wood gets a brightener and everything is rinsed.' },
    ],
    priceFactors: ['Deck size', 'Material', 'Rails and stairs', 'Condition'],
    addOns: [
      { name: 'Staining', description: 'Book staining after the deck has dried for 48 hours.' },
    ],
    faqs: [
      {
        question: 'Will cleaning remove old stain?',
        answer:
          'It removes loose and failing stain. Fully stripping a solid stain needs a stripper, which we quote separately.',
      },
      {
        question: 'How long before I can stain?',
        answer: 'Wait at least 48 hours of dry weather so the wood can dry out.',
      },
      {
        question: 'Can you clean composite decks?',
        answer:
          'Yes. Composite gets a different cleaner and very low pressure to protect the surface.',
      },
      {
        question: 'Will it hurt my lawn or plants?',
        answer: 'We soak and cover plants and rinse everything afterward.',
      },
      {
        question: 'How often should a deck be cleaned?',
        answer: 'Once a year, usually in spring. Shady decks may need it twice.',
      },
    ],
    related: ['fence-deck-staining', 'patio-balcony-cleaning', 'fence-cleaning'],
    questions: [
      ask.select('material', 'Deck material', ['Wood', 'Composite', 'PVC']),
      ask.number('area', 'Approximate deck size', { min: 50, max: 3000, unit: 'sq ft' }),
      ask.yesNo('railings', 'Clean railings and stairs too?'),
    ],
  },
  {
    slug: 'fence-cleaning',
    title: 'Fence Cleaning',
    category: 'exterior-cleaning',
    icon: 'fence',
    quoteMode: 'instant',
    seasons: [...SPRING_TO_FALL],
    headline: 'A fence that looks good from both sides',
    promise: 'Algae, mildew and gray weathering lifted from wood, vinyl and metal fences.',
    summary: 'Fence cleaning for wood, vinyl, composite and metal, one side or both.',
    outcomeLabel: 'Get a cleaner fence',
    bullets: ['Wood, vinyl and metal', 'One side or both', 'Pairs with staining'],
    heroImageLabel: 'White vinyl fence half cleaned, with green algae on the other half',
    problem:
      'Fences sit close to sprinklers, soil and shade, so they grow green algae and black mildew fast. Wood fences also turn gray in the sun. A dirty fence frames your whole yard.',
    benefits: [
      { title: 'Brighter yard', body: 'A clean fence makes the whole yard look tidier.' },
      { title: 'Longer life', body: 'Removing algae and mildew slows rot on wood fences.' },
      { title: 'Ready for stain', body: 'Cleaning is the must-do first step before staining.' },
    ],
    included: [
      'Soft wash of fence boards, posts and caps',
      'Gate and hardware rinse',
      'Brightener on wood fences',
      'Protection of plants along the fence line',
    ],
    method:
      'We soft wash: a cleaner suited to the material goes on at low pressure, then we rinse it off. Wood gets a brightener to restore color. Vinyl and metal are washed and rinsed for a clean, even look.',
    process: [
      { title: 'Get a price', body: 'Tell us the length, material and number of sides.' },
      { title: 'Protect', body: 'We soak plants along the fence line.' },
      { title: 'Wash', body: 'We apply cleaner and rinse, board by board.' },
      { title: 'Finish', body: 'Wood gets a brightener and a final rinse.' },
    ],
    priceFactors: [
      'Length in linear feet',
      'One or both sides',
      'Material',
      'Access to the far side',
    ],
    faqs: [
      {
        question: 'Do you need my neighbor’s permission for their side?',
        answer:
          'Yes. If you want both sides cleaned, please check with your neighbor first. We’re happy to coordinate.',
      },
      {
        question: 'Can you clean a vinyl fence?',
        answer: 'Yes. Vinyl cleans up very well with a soft wash.',
      },
      {
        question: 'Should I stain after cleaning?',
        answer:
          'If it’s wood, yes. Clean wood takes stain better and it lasts longer. We offer both as a bundle.',
      },
      {
        question: 'Will it damage old boards?',
        answer: 'No. We use low pressure. If boards are loose or rotting, we’ll point them out.',
      },
      {
        question: 'How long does it take?',
        answer: 'Most backyard fences take two to four hours.',
      },
    ],
    related: ['fence-deck-staining', 'deck-cleaning', 'soft-washing'],
    questions: [
      ask.number('length', 'Fence length', {
        min: 10,
        max: 2000,
        unit: 'linear ft',
        helpText: 'Pace it off: one big step is about 3 feet.',
      }),
      ask.select('sides', 'Which sides?', ['One side', 'Both sides']),
      ask.select('material', 'Fence material', ['Wood', 'Vinyl', 'Metal', 'Composite']),
    ],
  },
  {
    slug: 'gutter-cleaning',
    title: 'Gutter Cleaning',
    category: 'exterior-cleaning',
    icon: 'wind',
    quoteMode: 'instant',
    seasons: ['spring', 'fall'],
    bookingWindowNote:
      'Book fall cleaning after most leaves drop, usually late October to November.',
    headline: 'Gutters that drain, not overflow',
    promise: 'Clogs cleared and downspouts flushed before the next storm.',
    summary: 'Gutter cleaning by hand, with downspouts flushed and debris bagged and hauled away.',
    outcomeLabel: 'Get flowing gutters',
    bullets: [
      'Cleaned by hand, then flushed',
      'Downspouts checked and cleared',
      'Debris bagged and hauled away',
    ],
    heroImageLabel: 'Technician on a ladder scooping leaves from a gutter into a bucket',
    problem:
      'Clogged gutters overflow. Water spills down siding, pools against the foundation and can freeze into ice dams along the roof edge in winter. Leaves, seeds and roof grit build up every season, and most people only notice when water pours over the edge.',
    benefits: [
      {
        title: 'Protects your foundation',
        body: 'Water goes down the downspouts and away from the house.',
      },
      {
        title: 'Fewer ice dams',
        body: 'Clear gutters drain before winter, so less meltwater freezes at the roof edge.',
      },
      { title: 'No ladder for you', body: 'We do the climbing, scooping and hauling.' },
    ],
    included: [
      'Hand removal of leaves and debris',
      'Flush of every gutter run',
      'Downspouts tested and cleared',
      'Debris bagged and hauled away',
      'Photos of anything that needs repair',
    ],
    method:
      'We scoop gutters by hand so nothing gets pushed into downspouts, then flush each run with water to check the flow. Blocked downspouts are cleared with a plumber’s snake or water. Loose brackets and leaking seams are photographed so you know what needs attention.',
    safety:
      'Ladders are set on stable ground with stand-offs so they don’t rest on the gutter. We use roof-edge safety gear on steep or tall homes and never work in high wind or lightning.',
    process: [
      {
        title: 'Get a price',
        body: 'Tell us the home size, stories and whether you have gutter guards.',
      },
      { title: 'Clean', body: 'We remove debris by hand around the whole house.' },
      { title: 'Flush', body: 'Every gutter and downspout is flushed and tested.' },
      { title: 'Report', body: 'You get photos of before, after and anything that needs repair.' },
    ],
    priceFactors: [
      'Length of gutters',
      'Number of stories',
      'Gutter guards',
      'Steep or hard-to-reach roof sections',
    ],
    addOns: [
      {
        name: 'Gutter brightening',
        description: 'Remove black streaks from the outside of the gutters.',
      },
      {
        name: 'Gutter guard cleaning',
        description: 'Guards removed, gutters cleaned and guards put back.',
      },
    ],
    faqs: [
      {
        question: 'How often should gutters be cleaned?',
        answer:
          'Twice a year for most homes: late spring after trees drop seeds and late fall after the leaves. Homes under big trees may need it more.',
      },
      {
        question: 'Do you clean gutters with guards?',
        answer:
          'Yes. Guards still let small debris through. We remove them, clean underneath and put them back.',
      },
      {
        question: 'Do I need to be home?',
        answer: 'No. We’ll send before and after photos when we’re done.',
      },
      {
        question: 'What happens to the debris?',
        answer: 'We bag it and take it away. Nothing gets left on your lawn.',
      },
      {
        question: 'Can you fix leaks too?',
        answer:
          'We’ll flag leaks and loose brackets. Small fixes can be quoted as minor exterior repairs.',
      },
    ],
    related: ['gutter-brightening', 'roof-cleaning', 'ice-control'],
    questions: [homeSize, stories, ask.yesNo('guards', 'Do you have gutter guards?')],
  },
  {
    slug: 'gutter-brightening',
    title: 'Gutter Brightening',
    category: 'exterior-cleaning',
    icon: 'sparkles',
    quoteMode: 'instant',
    seasons: ['all-year'],
    headline: 'Gutter faces without the black streaks',
    promise: 'Tiger stripes and oxidation removed from the outside of your gutters.',
    summary:
      'Hand cleaning of the outside faces of gutters to remove black streaks, oxidation and grime.',
    outcomeLabel: 'Get bright gutters',
    bullets: ['Removes black "tiger stripes"', 'Cleaned by hand', 'Pairs with house washing'],
    heroImageLabel: 'Close-up of a white gutter, half streaked and half bright',
    problem:
      'The black streaks on the outside of gutters, often called tiger stripes, are a mix of oxidation and grime that bonds to the surface. A normal wash doesn’t remove them, so a clean house can still look dirty at the roofline.',
    benefits: [
      { title: 'Finishes the look', body: 'Bright gutters complete a house wash.' },
      {
        title: 'No harsh scrubbing',
        body: 'We use a cleaner made for gutter finishes and soft brushes.',
      },
      {
        title: 'Lasts',
        body: 'Removing the bonded film means streaks take a long time to return.',
      },
    ],
    included: [
      'Cleaner made for gutter finishes',
      'Hand brushing of every gutter face',
      'Downspout faces included',
      'Thorough rinse',
    ],
    method:
      'We apply a cleaner made for painted aluminum and vinyl gutters, scrub each face with soft brushes, and rinse. It’s hand work, which is why a normal wash can’t do it.',
    process: [
      { title: 'Get a price', body: 'Tell us the gutter length and stories.' },
      { title: 'Apply', body: 'Cleaner goes on the gutter faces.' },
      { title: 'Brush', body: 'Each face is scrubbed by hand.' },
      { title: 'Rinse', body: 'Gutters and siding below are rinsed.' },
    ],
    priceFactors: ['Length of gutters', 'Number of stories', 'How heavy the staining is'],
    faqs: [
      {
        question: 'Is this the same as gutter cleaning?',
        answer:
          'No. Gutter cleaning clears the inside so water drains. Brightening cleans the outside faces you see.',
      },
      {
        question: 'Will it remove all streaks?',
        answer: 'Usually yes. Very old oxidation on faded paint may leave some shadowing.',
      },
      {
        question: 'Can it damage the paint?',
        answer:
          'No. We use soft brushes and a cleaner made for gutter finishes, never abrasive pads.',
      },
      {
        question: 'Can I book it with house washing?',
        answer: 'Yes, and it’s the best time to do it. Both use the same setup.',
      },
      {
        question: 'How long do results last?',
        answer: 'Usually several years, depending on trees and weather.',
      },
    ],
    related: ['gutter-cleaning', 'house-washing', 'roof-cleaning'],
    questions: [
      ask.number('length', 'Approximate gutter length', {
        min: 20,
        max: 1000,
        unit: 'linear ft',
        helpText: 'Most homes have 120–200 feet.',
      }),
      stories,
    ],
  },
  {
    slug: 'roof-cleaning',
    title: 'Roof Cleaning',
    category: 'exterior-cleaning',
    icon: 'house',
    quoteMode: 'instant',
    seasons: ['all-year'],
    headline: 'Black streaks and moss gone, shingles intact',
    promise: 'Soft-wash roof cleaning that protects your shingles and your warranty.',
    summary:
      'Soft-wash roof cleaning that removes black algae streaks, moss and lichen without high pressure.',
    outcomeLabel: 'Get a clean roof',
    bullets: ['Removes black streaks and moss', 'No pressure on shingles', 'Gutters rinsed after'],
    heroImageLabel:
      'Shingle roof with black algae streaks on one side and clean shingles on the other',
    problem:
      'Black streaks on a roof are usually algae feeding on the shingles. Moss and lichen grow in shady spots and hold water against the roof. Pressure washing a roof knocks off the granules that protect shingles, which shortens their life.',
    benefits: [
      {
        title: 'Protects shingles',
        body: 'Soft washing removes growth without stripping protective granules.',
      },
      {
        title: 'Better curb appeal',
        body: 'The roof is a big part of what people see. A clean roof makes the home look newer.',
      },
      {
        title: 'Prevents damage',
        body: 'Moss holds moisture that can lift shingles and lead to leaks.',
      },
    ],
    included: [
      'Roof inspection from the ground and ladder',
      'Soft-wash treatment of streaks, moss and lichen',
      'Gentle removal of loose moss',
      'Rinse of gutters, siding and plants',
      'Photos of any damage we notice',
    ],
    method:
      'We apply a cleaning solution at low pressure that kills algae, moss and lichen. Loose moss is brushed off by hand. Algae streaks fade during treatment, and the last traces wash away with the next rains. We never walk a roof more than we need to and never use high pressure on shingles.',
    safety:
      'Roof work uses fall protection and ladder stand-offs. Plants are soaked and covered and gutters are flushed so runoff doesn’t sit in them. We stay off roofs in wet, icy or windy weather.',
    process: [
      { title: 'Get a price', body: 'Tell us the home size, roof type and pitch.' },
      { title: 'Inspect', body: 'We check the roof’s condition before we start.' },
      { title: 'Treat', body: 'The roof gets a soft-wash treatment and loose moss is removed.' },
      { title: 'Rinse and report', body: 'We rinse gutters and plants and share photos.' },
    ],
    priceFactors: ['Roof size', 'Pitch (how steep)', 'Roof material', 'Amount of moss'],
    faqs: [
      {
        question: 'Will roof cleaning void my shingle warranty?',
        answer:
          'Soft washing follows the cleaning methods most shingle makers recommend. Pressure washing is the method that can cause problems, and we don’t use it on roofs.',
      },
      {
        question: 'Why does my roof have black streaks?',
        answer:
          'It’s usually a type of algae that spreads with wind and grows on shady, damp sections of the roof.',
      },
      {
        question: 'How long until the streaks are gone?',
        answer: 'Most fade the same day. Heavy growth can take a few rains to rinse away fully.',
      },
      {
        question: 'Can you clean cedar shake or tile roofs?',
        answer:
          'Yes, each with its own cleaner and approach. Tell us your roof type when you get a price.',
      },
      {
        question: 'How often does a roof need cleaning?',
        answer: 'Every two to four years for most homes, depending on shade and trees.',
      },
    ],
    related: ['gutter-cleaning', 'soft-washing', 'gutter-brightening'],
    questions: [
      homeSize,
      ask.select('pitch', 'How steep is the roof?', ['Low (walkable)', 'Medium', 'Steep']),
      ask.select('roof_type', 'Roof type', ['Asphalt shingle', 'Cedar shake', 'Metal', 'Tile']),
    ],
  },
  {
    slug: 'window-cleaning',
    title: 'Window Cleaning',
    category: 'exterior-cleaning',
    icon: 'window',
    quoteMode: 'instant',
    seasons: ['all-year'],
    headline: 'Streak-free windows, inside and out',
    promise: 'Clear glass, clean frames and fresh screens for {region} homes.',
    summary: 'Window cleaning inside and out, with screens, sills and tracks available.',
    outcomeLabel: 'Get streak-free windows',
    bullets: [
      'Inside, outside or both',
      'Screens and tracks available',
      'Pure-water finish outside',
    ],
    heroImageLabel: 'Technician squeegeeing a large living room window',
    problem:
      'Dust, pollen, hard water spots and fingerprints build up on glass. Upper-story windows are hard to reach safely, and household cleaners often leave streaks that show up as soon as the sun hits them.',
    benefits: [
      { title: 'More light', body: 'Clean glass lets in noticeably more daylight.' },
      { title: 'No streaks', body: 'Professional squeegees and pure water leave glass clear.' },
      {
        title: 'Longer-lasting screens and tracks',
        body: 'Clean tracks slide easily and screens hold up better.',
      },
    ],
    included: [
      'Glass cleaned with squeegee or pure-water pole system',
      'Frames and sills wiped',
      'Screens brushed and rinsed (if selected)',
      'Tracks vacuumed and wiped (if selected)',
      'Drop cloths and shoe covers indoors',
    ],
    method:
      'Outside, we use a water-fed pole with purified water. It dries spot-free, so it’s perfect for upper floors. Inside, we squeegee by hand and detail the edges with a microfiber towel. Screens are brushed and rinsed, and tracks are vacuumed and wiped.',
    safety:
      'Pure-water poles mean fewer ladders. When we do need them, they’re secured and padded. Indoors we use drop cloths and shoe covers.',
    process: [
      { title: 'Get a price', body: 'Tell us how many windows and what you want cleaned.' },
      { title: 'Outside', body: 'Glass and frames are cleaned with pure water.' },
      { title: 'Inside', body: 'Glass is squeegeed and sills are wiped.' },
      { title: 'Check', body: 'We look for streaks in the light before we leave.' },
    ],
    priceFactors: [
      'Number of windows',
      'Inside, outside or both',
      'Screens and tracks',
      'Number of stories',
    ],
    addOns: [
      {
        name: 'Hard water stain removal',
        description: 'Treatment for mineral spots from sprinklers.',
      },
    ],
    faqs: [
      {
        question: 'How do you count windows?',
        answer:
          'Count each separate pane of glass that opens or sits in its own frame. A double-hung window counts as one. When in doubt, a rough count is fine.',
      },
      {
        question: 'Do you clean in winter?',
        answer: 'Inside cleaning, yes. Outside cleaning needs temperatures above freezing.',
      },
      {
        question: 'What if it rains after you clean?',
        answer:
          'Pure water leaves no residue, so rain dries mostly clean. Heavy dust storms are another story.',
      },
      {
        question: 'Do you clean skylights?',
        answer: 'Yes, if we can reach them safely. Let us know when you book.',
      },
      {
        question: 'How often should windows be cleaned?',
        answer: 'Twice a year for most homes: spring and fall.',
      },
    ],
    related: ['house-washing', 'gutter-brightening', 'patio-balcony-cleaning'],
    questions: [
      ask.number('windows', 'How many windows?', { min: 1, max: 200, unit: 'windows' }),
      ask.select('scope', 'What should we clean?', ['Outside only', 'Inside and outside']),
      stories,
      ask.yesNo('screens', 'Clean screens too?'),
      ask.yesNo('tracks', 'Clean tracks too?'),
    ],
  },
  {
    slug: 'exterior-surface-cleaning',
    title: 'Exterior Surface Cleaning',
    category: 'exterior-cleaning',
    icon: 'brush',
    quoteMode: 'custom',
    seasons: ['all-year'],
    headline: 'Walls, signs and curbs, cleaned to suit',
    promise: 'Custom cleaning for any outdoor surface that doesn’t fit a standard service.',
    summary:
      'Custom exterior cleaning for retaining walls, signs, curbs, outdoor furniture, play sets and other surfaces.',
    outcomeLabel: 'Get a custom quote',
    bullets: ['Retaining walls and curbs', 'Signs and play sets', 'Quoted from your photos'],
    heroImageLabel: 'Stone retaining wall being soft washed',
    problem:
      'Some surfaces don’t fit a standard service: a stained retaining wall, a dirty business sign, a weathered play set, outdoor furniture or concrete curbs. They still need the right cleaner and pressure.',
    benefits: [
      {
        title: 'Right method every time',
        body: 'We match the cleaner and pressure to the material.',
      },
      {
        title: 'Quoted from photos',
        body: 'Send photos and we’ll price it without a visit in most cases.',
      },
      {
        title: 'Combine with other work',
        body: 'Add it to a house wash or pressure washing visit.',
      },
    ],
    included: [
      'Review of your photos and description',
      'Method chosen for the material',
      'Cleaning and rinse',
      'Protection of plants and nearby surfaces',
    ],
    method:
      'We look at your photos, identify the material and the staining, and choose soft washing, pressure washing or hand cleaning to suit. Most jobs are a mix.',
    process: [
      { title: 'Send photos', body: 'Upload photos and a short description.' },
      { title: 'Get a quote', body: 'We reply with a price and a recommended method.' },
      { title: 'Clean', body: 'We clean on the date you choose.' },
      { title: 'Review', body: 'We check the result with you or send photos.' },
    ],
    priceFactors: ['Size and height', 'Material', 'Type of staining', 'Access'],
    faqs: [
      {
        question: 'What kinds of surfaces do you clean?',
        answer:
          'Retaining walls, signs, curbs, outdoor furniture, play sets, planters, columns and more.',
      },
      {
        question: 'Can you remove rust stains from stone?',
        answer:
          'Often, yes. We use a rust remover suited to the stone. Send photos and we’ll let you know.',
      },
      {
        question: 'Do I need an in-person visit?',
        answer: 'Usually not. Clear photos and rough sizes are enough for most quotes.',
      },
      {
        question: 'Is this for businesses too?',
        answer: 'Yes. For larger commercial jobs, request a commercial bid.',
      },
      {
        question: 'Can you clean painted surfaces?',
        answer: 'Yes, gently. Old or chalky paint may lose some pigment, and we’ll warn you first.',
      },
    ],
    related: ['pressure-washing', 'soft-washing', 'graffiti-removal'],
  },
  {
    slug: 'driveway-sealing',
    title: 'Driveway Sealing',
    category: 'exterior-cleaning',
    icon: 'paint-bucket',
    quoteMode: 'instant',
    seasons: ['summer'],
    bookingWindowNote: 'Sealing needs warm, dry days. We book June through early September.',
    headline: 'Seal the driveway before winter gets to it',
    promise: 'Sealcoating that protects concrete and asphalt from water, salt and sun.',
    summary:
      'Driveway sealing and sealcoating for concrete and asphalt, with crack filling available.',
    outcomeLabel: 'Protect your driveway',
    bullets: ['Concrete and asphalt', 'Crack filling available', 'Cleaned first, then sealed'],
    heroImageLabel: 'Freshly sealcoated asphalt driveway with a crisp edge',
    problem:
      'Water seeps into unsealed concrete and asphalt, freezes, expands and cracks the surface. Road salt speeds this up, and sun dries out asphalt so it turns gray and brittle.',
    benefits: [
      {
        title: 'Slows freeze-thaw damage',
        body: 'Sealer keeps water out of the surface so less of it freezes inside.',
      },
      {
        title: 'Resists salt and oil',
        body: 'A sealed surface is easier to clean and stains less.',
      },
      { title: 'Fresh look', body: 'Asphalt gets its deep black color back; concrete looks even.' },
    ],
    included: [
      'Full driveway cleaning before sealing',
      'Crack filling (if selected)',
      'Edges cut in by hand',
      'Sealer applied evenly',
      'Barricade until dry',
    ],
    method:
      'A sealer only works on a clean, dry surface, so we wash the drive first and let it dry. Cracks are filled if selected. We cut in edges by hand and apply the sealer evenly, then block off the drive while it cures.',
    safety:
      'We tape off garage doors and walkways and post signs so no one walks or drives on wet sealer.',
    process: [
      { title: 'Get a price', body: 'Tell us the surface, size and whether cracks need filling.' },
      { title: 'Clean', body: 'We wash the driveway and let it dry.' },
      { title: 'Repair', body: 'Cracks are filled if selected.' },
      { title: 'Seal', body: 'Sealer goes on and the drive is closed off to cure.' },
    ],
    priceFactors: ['Driveway size', 'Concrete or asphalt', 'Crack filling', 'Condition'],
    faqs: [
      {
        question: 'How long before I can drive on it?',
        answer:
          'Usually 24–48 hours, depending on temperature and the sealer. We’ll tell you exactly.',
      },
      {
        question: 'How often should I seal?',
        answer: 'Asphalt every two to three years, concrete every three to five.',
      },
      {
        question: 'Can you seal in fall?',
        answer:
          'Only on warm days. Most sealers need temperatures above about 50°F for a full day.',
      },
      {
        question: 'Will sealing fix cracks?',
        answer: 'Crack filling seals them against water. It won’t level sunken or broken slabs.',
      },
      {
        question: 'Is the driveway cleaned first?',
        answer: 'Yes, always. It’s included.',
      },
    ],
    related: ['driveway-cleaning', 'pressure-washing', 'garage-driveway-pressure-cleaning'],
    questions: [
      ask.select('surface', 'Driveway surface', ['Concrete', 'Asphalt']),
      ask.number('area', 'Approximate size', { min: 100, max: 10000, unit: 'sq ft' }),
      ask.yesNo('cracks', 'Fill cracks too?'),
    ],
  },
]
