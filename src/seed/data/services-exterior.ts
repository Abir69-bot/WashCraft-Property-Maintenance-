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
    headline: 'Cleaner concrete, pavers and stone',
    promise: 'Pressure washing for hard outdoor surfaces in {region}.',
    summary:
      'Pressure washing for driveways, walkways, steps, patios and other hard surfaces, with the pressure matched to each material.',
    outcomeLabel: 'Get cleaner hard surfaces',
    bullets: [
      'Driveways, walkways and steps',
      'Patios and paver areas',
      'Pressure matched to the surface',
    ],
    heroImageLabel: 'Concrete walkway half cleaned, showing a sharp line between dirty and clean',
    problem:
      'Dirt, winter salt, tire marks, algae and moss build up on hard surfaces a little at a time. Over time a driveway or path looks dark and tired, and shady spots can get slippery when wet. A garden hose rarely lifts grime that has worked into concrete, brick and stone.',
    benefits: [
      {
        title: 'A fresher look',
        body: 'Clean concrete, brick and pavers make the whole property look cared for.',
      },
      {
        title: 'Better footing',
        body: 'Removing algae, moss and grime cuts down on slick spots on paths and steps.',
      },
      {
        title: 'Ready for what’s next',
        body: 'A clean surface is the first step before sealing a driveway or staining wood.',
      },
    ],
    included: [
      'Driveways, walkways, steps and patios agreed in your estimate',
      'Pressure set for each surface, lower for pavers and softer stone',
      'Extra attention on edges, corners and steps',
      'A rinse of nearby walls and walkways when we finish',
      'A final look at the work with you, if you’re home',
    ],
    suitableFor: [
      'Homeowners getting ready for spring, a sale or a family event',
      'Landlords and property managers preparing units between tenants',
      'Businesses with entrances, walkways or patios open to customers',
    ],
    exclusions: [
      'Siding, roofs, painted wood and other delicate surfaces are not pressure washed. Ask about soft washing instead.',
      'Very old oil, rust or paint stains may lighten but not disappear. We tell you what to expect before we start.',
      'Cracked, loose or crumbling surfaces can be damaged by washing. We point these out and may leave them alone.',
      'We need an outdoor water tap. If there isn’t one, tell us when you send your request.',
    ],
    preparation: [
      'Move vehicles, planters, furniture and toys off the areas to be cleaned.',
      'Close nearby windows and doors.',
      'Make sure we can reach an outdoor tap and the areas being washed (gates unlocked, pets inside).',
    ],
    method:
      'We check each surface first, then set the pressure and spray pattern for that material. Concrete can take more; pavers, brick and softer stone get less so the surface and the joint sand stay in place. Stubborn spots get extra attention, and we rinse splash off nearby walls and walkways at the end.',
    safety:
      'Delicate surfaces like siding, roofs and painted wood are never pressure washed. We keep spray away from windows, doors and outlets, and stop to ask if a surface looks damaged or fragile.',
    process: [
      {
        title: 'Send a request',
        body: 'Use the quote form or call. Photos help us understand the job.',
      },
      {
        title: 'We review it',
        body: 'We look at the details and may ask for more photos or a quick visit.',
      },
      {
        title: 'Written estimate',
        body: 'You get the scope, exclusions, price and conditions in writing.',
      },
      {
        title: 'Approve and schedule',
        body: 'Once you approve the estimate, we confirm a date that suits you.',
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
        question: 'Will pressure washing damage my driveway?',
        answer:
          'Not when the pressure suits the surface. We use less pressure on pavers, brick and older concrete. If a surface is already cracked or crumbling, we’ll tell you before we start.',
      },
      {
        question: 'Can you remove oil stains?',
        answer:
          'Oil and rust can often be lightened, but deep or old stains may not come out completely. We’ll be honest about what to expect when we quote.',
      },
      {
        question: 'Do I need to be home?',
        answer:
          'Not always. We need access to the areas being cleaned and an outdoor tap. We’ll confirm the details with you before the visit.',
      },
    ],
    related: ['soft-washing', 'driveway-sealing', 'patio-balcony-cleaning'],
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
    promise: 'Low-pressure exterior cleaning for siding and other delicate surfaces in {region}.',
    summary:
      'Soft washing cleans siding, stucco, painted surfaces and other delicate exteriors with low pressure and cleaning solution instead of force.',
    outcomeLabel: 'Get a gentle, thorough clean',
    bullets: [
      'Vinyl, stucco and painted surfaces',
      'Low pressure, not force',
      'Plants protected and rinsed',
    ],
    heroImageLabel: 'Technician soft washing stucco with a low-pressure hose',
    problem:
      'Green and black streaks on siding and trim are usually algae, mildew and dirt. High pressure can force water behind siding, strip paint and mark softer materials, so these surfaces need a gentler approach.',
    benefits: [
      {
        title: 'Gentle on surfaces',
        body: 'Low pressure is kinder to siding, stucco, paint and window seals than a pressure washer.',
      },
      {
        title: 'Thorough on grime',
        body: 'A cleaning solution loosens algae, mildew and dirt so it rinses away.',
      },
      {
        title: 'Careful around gardens',
        body: 'Plants are wet down before and rinsed after, and delicate ones are covered.',
      },
    ],
    included: [
      'A look at the surface and the plants nearby before we start',
      'Plants wet down and delicate ones covered',
      'Cleaning solution applied at low pressure and given time to work',
      'A full low-pressure rinse of the surface',
      'A final rinse of plants, walkways and windows below',
    ],
    suitableFor: [
      'Homes with vinyl, aluminum, fiber cement or stucco siding',
      'Painted trim, soffits, fences and other surfaces that pressure could damage',
      'Rental and commercial buildings that need a cleaner exterior',
    ],
    exclusions: [
      'Peeling paint, rot or damaged siding won’t be fixed by washing, and loose paint can come off. We point it out first.',
      'Some stains, such as rust, paint or hard-water marks, may need other treatment or may not come out.',
      'Areas we can only reach by working at height are confirmed when we quote, after we’ve seen photos or the property.',
      'Roofs are quoted separately under roof cleaning.',
    ],
    preparation: [
      'Close all windows and doors, including garage doors and vents you can close.',
      'Move outdoor furniture, decorations and anything fragile away from the walls.',
      'Make sure we can reach an outdoor tap and every side of the building being washed.',
    ],
    method:
      'We choose a cleaning solution for the surface and the type of grime, apply it at low pressure and give it a few minutes to work. Then we rinse the surface thoroughly at low pressure, along with plants, walkways and windows below.',
    safety:
      'Plants are soaked before and after and delicate ones covered. Windows and doors stay closed, and we keep water away from vents, outlets and light fixtures.',
    process: [
      {
        title: 'Send a request',
        body: 'Use the quote form or call. Photos help us understand the job.',
      },
      {
        title: 'We review it',
        body: 'We look at the details and may ask for more photos or a quick visit.',
      },
      {
        title: 'Written estimate',
        body: 'You get the scope, exclusions, price and conditions in writing.',
      },
      {
        title: 'Approve and schedule',
        body: 'Once you approve the estimate, we confirm a date that suits you.',
      },
    ],
    priceFactors: ['Surface area', 'Surface type', 'Height and access', 'How heavy the growth is'],
    faqs: [
      {
        question: 'Is soft washing safe for my plants?',
        answer:
          'We protect them by wetting them down before and after, covering delicate ones, and rinsing everything at the end. Tell us about any plants you’re worried about.',
      },
      {
        question: 'What’s the difference from pressure washing?',
        answer:
          'Pressure washing uses force for hard surfaces like concrete. Soft washing uses low pressure and a cleaning solution for surfaces that force could damage.',
      },
      {
        question: 'How often should siding be washed?',
        answer:
          'It depends on shade, trees and moisture around the house. Many homes are fine every year or two. We can suggest timing once we see the property.',
      },
    ],
    related: ['pressure-washing', 'window-cleaning', 'gutter-cleaning'],
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
    headline: 'Outdoor spaces ready to use again',
    promise: 'Patio and balcony cleaning in {region}, planned around building rules.',
    summary:
      'Cleaning for patios, balconies and outdoor living areas, with the method chosen for the surface and any building rules on water and access.',
    outcomeLabel: 'Get a cleaner patio',
    bullets: [
      'Patios, balconies and railings',
      'Method suited to the surface',
      'Building rules respected',
    ],
    heroImageLabel: 'Clean stone patio with outdoor furniture set back in place',
    problem:
      'Patios and balconies collect dirt, pollen, bird droppings, algae and grime from the city. Balconies are especially tricky: water can run onto the units below, and many buildings have rules about cleaning them.',
    benefits: [
      {
        title: 'Space you’ll use',
        body: 'A clean patio or balcony is far more inviting.',
      },
      {
        title: 'Considerate of neighbors',
        body: 'For balconies we plan the method so water and dirt don’t end up below.',
      },
      {
        title: 'The right method',
        body: 'Concrete, pavers, tile and wood each get an approach that suits them.',
      },
    ],
    included: [
      'Floors, railings and glass panels listed in your estimate',
      'A method suited to the surface and to your building’s rules',
      'Care to limit runoff to the units or areas below',
      'Furniture moved and put back if it’s light enough to move safely',
    ],
    suitableFor: [
      'Homeowners with patios, decks or outdoor living areas',
      'Condo and apartment owners or tenants with balconies',
      'Restaurants and businesses with outdoor seating',
    ],
    exclusions: [
      'Balcony cleaning depends on your building’s rules. Some buildings don’t allow water on balconies, and some need notice or approval first.',
      'We need access through your unit to reach a balcony; we don’t clean balconies from outside the building unless your estimate says so.',
      'Repairs, sealing and staining aren’t included unless your estimate says so.',
      'Heavy furniture, hot tubs and built-in items stay where they are.',
    ],
    preparation: [
      'For a balcony, check your building rules and let us know what’s allowed. Get any approval needed before the visit.',
      'Remove plants, small items and anything fragile.',
      'Arrange elevator access or parking for us if your building needs it.',
    ],
    method:
      'We choose how to clean based on the surface and where the water will go. On balconies that usually means low water use and careful containment, following your building’s rules.',
    safety:
      'We don’t lean over railings or work outside the balcony. If the railing or surface looks unsafe, we stop and tell you.',
    process: [
      {
        title: 'Send a request',
        body: 'Use the quote form or call. Photos help us understand the job.',
      },
      {
        title: 'We review it',
        body: 'We look at the details and may ask for more photos or a quick visit.',
      },
      {
        title: 'Written estimate',
        body: 'You get the scope, exclusions, price and conditions in writing.',
      },
      {
        title: 'Approve and schedule',
        body: 'Once you approve the estimate, we confirm a date that suits you.',
      },
    ],
    priceFactors: ['Size', 'Surface type', 'Ground level or balcony', 'Furniture to move'],
    faqs: [
      {
        question: 'Can you clean my condo balcony?',
        answer:
          'Often yes, but it depends on your building’s rules about water, noise and contractors. Check with your building and tell us what’s allowed when you send your request.',
      },
      {
        question: 'Will water drip onto the balcony below?',
        answer:
          'We plan the method to keep runoff to a minimum and follow your building’s rules. Some balconies need a mostly dry clean for this reason.',
      },
      {
        question: 'Do you clean balcony glass?',
        answer:
          'We can include glass panels and railings you can reach from the balcony. List them in your request so they’re in your estimate.',
      },
    ],
    related: ['pressure-washing', 'window-cleaning', 'soft-washing'],
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
    headline: 'Gutters cleared so water can drain',
    promise: 'Gutter and downspout cleaning in {region}.',
    summary:
      'Gutter cleaning that removes leaves, needles and debris from gutters, with downspouts checked so water can drain away from the building.',
    outcomeLabel: 'Get clear gutters',
    bullets: [
      'Leaves, needles and debris removed',
      'Downspouts checked',
      'Debris bagged or removed',
    ],
    heroImageLabel: 'Technician on a ladder scooping leaves from a gutter into a bucket',
    problem:
      'Leaves, seeds, needles and roof grit settle in gutters every season. Once gutters or downspouts block, water can spill over the edge, run down walls and pool near the foundation, and in winter it can freeze into ice along the roof edge.',
    benefits: [
      {
        title: 'Water goes where it should',
        body: 'Clear gutters and downspouts carry rain away from walls and foundations.',
      },
      {
        title: 'Fewer surprises',
        body: 'We point out loose sections, leaks or damage we notice while we work.',
      },
      {
        title: 'No ladder for you',
        body: 'Gutter cleaning is one of the riskiest jobs homeowners do themselves.',
      },
    ],
    included: [
      'Leaves, needles and debris cleared from the gutters in your estimate',
      'Downspouts checked for flow, and simple blockages cleared',
      'Debris bagged or removed as agreed in your estimate',
      'A note of anything loose, leaking or damaged that we notice',
    ],
    suitableFor: [
      'Homes with trees nearby, especially in fall and spring',
      'Landlords and property managers keeping up with seasonal maintenance',
      'Small commercial buildings with reachable gutters',
    ],
    exclusions: [
      'Gutter repairs, replacement and new guards are not included.',
      'Which gutters we can reach depends on height and roof access. This is confirmed in your estimate.',
      'Underground drains and blockages below ground level are not included.',
      'Roof cleaning is a separate service.',
    ],
    preparation: [
      'Move vehicles, furniture and planters away from the walls under the gutters.',
      'Unlock gates and keep pets inside.',
      'Tell us about any known leaks, loose sections or gutter guards.',
    ],
    method:
      'We clear debris from the gutters by hand or with suitable tools for the access we’ve agreed, check each downspout for flow and deal with simple blockages. We tidy up debris that falls during the work.',
    safety:
      'We only work where we can do so safely. If part of a roofline needs equipment or access that isn’t in your estimate, we’ll tell you rather than take the risk.',
    process: [
      {
        title: 'Send a request',
        body: 'Use the quote form or call. Photos help us understand the job.',
      },
      {
        title: 'We review it',
        body: 'We look at the details and may ask for more photos or a quick visit.',
      },
      {
        title: 'Written estimate',
        body: 'You get the scope, exclusions, price and conditions in writing.',
      },
      {
        title: 'Approve and schedule',
        body: 'Once you approve the estimate, we confirm a date that suits you.',
      },
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
          'Many homes need it at least once a year, often in late fall after the leaves drop. Homes under lots of trees may need it more often.',
      },
      {
        question: 'Do you take the debris away?',
        answer:
          'We’ll agree what happens to the debris in your written estimate, whether that’s bagged on site or taken away.',
      },
      {
        question: 'Do you repair gutters?',
        answer:
          'No. We clean them and tell you about any damage we notice so you can arrange a repair.',
      },
    ],
    related: ['roof-cleaning', 'window-cleaning', 'soft-washing'],
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
    headline: 'Moss and debris cleared from your roof',
    promise: 'Roof cleaning in {region}, quoted after we’ve seen your roof.',
    summary:
      'Roof cleaning to clear moss, debris and buildup, with the approach and any access limits agreed in writing after we’ve seen photos or the roof itself.',
    outcomeLabel: 'Ask about roof cleaning',
    bullets: [
      'Moss and debris cleared',
      'Quoted after we see the roof',
      'Approach agreed in writing',
    ],
    heroImageLabel:
      'Shingle roof with black algae streaks on one side and clean shingles on the other',
    problem:
      'Moss, leaves and debris collect on shaded roofs and hold moisture against the shingles. Left alone, buildup can block water from running off and spill into gutters.',
    benefits: [
      {
        title: 'A cleaner roofline',
        body: 'Clearing moss and debris improves how the whole house looks.',
      },
      {
        title: 'Water runs off',
        body: 'Less buildup means water can drain off the roof and into the gutters.',
      },
      {
        title: 'Planned for your roof',
        body: 'Every roof is different, so the approach is agreed with you before work starts.',
      },
    ],
    included: [
      'A review of photos or the roof itself before we quote',
      'Moss, debris and buildup cleared from the areas in your estimate',
      'Fallen debris tidied up around the house',
      'A note of any damaged, missing or loose shingles we notice',
    ],
    suitableFor: [
      'Homes with shaded or north-facing roofs where moss grows',
      'Owners preparing a house for sale',
      'Landlords keeping up with exterior maintenance',
    ],
    exclusions: [
      'Roof repairs, shingle replacement and leak repairs are not included.',
      'Steep, high or fragile roofs may not be suitable. Whether we can take on your roof is confirmed in your estimate.',
      'The cleaning method is chosen for your roof and agreed in writing before any work starts.',
      'Gutter cleaning is quoted separately, or alongside if you ask.',
    ],
    preparation: [
      'Send clear photos of the roof from the ground with your request.',
      'Move vehicles, furniture and planters away from the walls.',
      'Tell us about any known leaks or damage.',
    ],
    method:
      'Every roof is different, so we decide how to clean yours after seeing it and explain the approach in your written estimate before anything is booked. If we don’t think a roof can be cleaned safely or without risking damage, we’ll say so.',
    safety:
      'We only work on roofs we can access safely. Roof work is confirmed case by case; we won’t start a roof that isn’t covered by your written estimate.',
    process: [
      {
        title: 'Send a request',
        body: 'Use the quote form or call. Photos help us understand the job.',
      },
      {
        title: 'We review it',
        body: 'We look at the details and may ask for more photos or a quick visit.',
      },
      {
        title: 'Written estimate',
        body: 'You get the scope, exclusions, price and conditions in writing.',
      },
      {
        title: 'Approve and schedule',
        body: 'Once you approve the estimate, we confirm a date that suits you.',
      },
    ],
    priceFactors: ['Roof size', 'Pitch (how steep)', 'Roof material', 'Amount of moss'],
    faqs: [
      {
        question: 'How do you clean roofs?',
        answer:
          'We choose the approach for each roof after seeing photos or the roof itself, and explain it in your written estimate before any work is booked.',
      },
      {
        question: 'Can every roof be cleaned?',
        answer:
          'No. Very steep, high or fragile roofs may not be suitable. We’ll tell you honestly when we quote.',
      },
      {
        question: 'Will the moss come back?',
        answer:
          'Moss grows back over time on shaded, damp roofs. Trimming overhanging branches and keeping gutters clear can help slow it down.',
      },
    ],
    related: ['gutter-cleaning', 'soft-washing', 'window-cleaning'],
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
    headline: 'Clearer windows, inside and out',
    promise: 'Window cleaning for homes and businesses in {region}.',
    summary:
      'Window cleaning for glass, frames and sills, with the exact windows, sides and access confirmed in your written estimate.',
    outcomeLabel: 'Get clearer windows',
    bullets: ['Glass, frames and sills', 'Outside, inside or both', 'Scope confirmed in writing'],
    heroImageLabel: 'Technician squeegeeing a large living room window',
    problem:
      'Dust, pollen, road grime and rain spots build up on glass faster than most people notice. Dirty windows make rooms darker and a building look neglected, and the hard-to-reach ones rarely get cleaned.',
    benefits: [
      {
        title: 'More light',
        body: 'Clean glass lets more daylight into every room.',
      },
      {
        title: 'Better first impressions',
        body: 'Clear windows make a home or storefront look well kept.',
      },
      {
        title: 'One less chore',
        body: 'No ladders or step stools for you.',
      },
    ],
    included: [
      'Glass cleaned on the windows and sides listed in your estimate',
      'Frames and sills wiped',
      'Screens brushed off if you ask for it',
      'Drips and smudges checked before we leave',
    ],
    suitableFor: [
      'Homeowners and tenants who want brighter rooms',
      'Landlords preparing a unit for new tenants',
      'Storefronts, offices and other ground-level commercial glass',
    ],
    exclusions: [
      'Which windows we can reach depends on height and access. Upper floors and hard-to-reach glass are confirmed case by case in your estimate.',
      'We don’t work from rope access, swing stages or lifts unless your estimate says so.',
      'Scratches, etching, hard-water stains and seal failure (fog between panes) can’t be cleaned away.',
      'Interior cleaning needs clear access to the windows inside.',
    ],
    preparation: [
      'Tell us which windows you want cleaned and whether you want inside, outside or both. Photos of the house help.',
      'Clear sills and move furniture and blinds away from windows being cleaned inside.',
      'Unlock gates and keep pets inside or away from the work.',
    ],
    method:
      'We clean the glass, then detail the edges, frames and sills. Windows that need special access are agreed with you in advance, and we never use a method on a window that your estimate doesn’t cover.',
    safety:
      'We only clean windows we can reach safely. If a window is above what we can safely access, we’ll tell you when we quote rather than on the day.',
    process: [
      {
        title: 'Send a request',
        body: 'Use the quote form or call. Photos help us understand the job.',
      },
      {
        title: 'We review it',
        body: 'We look at the details and may ask for more photos or a quick visit.',
      },
      {
        title: 'Written estimate',
        body: 'You get the scope, exclusions, price and conditions in writing.',
      },
      {
        title: 'Approve and schedule',
        body: 'Once you approve the estimate, we confirm a date that suits you.',
      },
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
        question: 'Do you clean upper-floor windows?',
        answer:
          'It depends on the height and the access around your building. Send photos with your request and we’ll confirm which windows we can clean in your written estimate.',
      },
      {
        question: 'Do you clean inside and outside?',
        answer:
          'We can quote outside only, inside only or both. Inside cleaning needs clear access to each window.',
      },
      {
        question: 'Do you clean condo or apartment windows?',
        answer:
          'Many condo and apartment windows can only be reached from inside or by the building’s own contractor. Tell us your unit and building, and check your building rules, before you book.',
      },
    ],
    related: ['gutter-cleaning', 'soft-washing', 'pressure-washing'],
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
    headline: 'A cleaned and sealed driveway',
    promise: 'Driveway sealing in {region}, quoted for your surface.',
    summary:
      'Driveway sealing for suitable surfaces, starting with a clean so the sealer can bond. The surface type and product are confirmed in your written estimate.',
    outcomeLabel: 'Ask about driveway sealing',
    bullets: ['Cleaned first so sealer bonds', 'Suited to your surface', 'Drying time explained'],
    heroImageLabel: 'Freshly sealcoated asphalt driveway with a crisp edge',
    problem:
      'Sun, rain, freeze-thaw cycles and road salt wear driveways down. An unsealed surface soaks up stains and water, and faded or patchy driveways make the whole property look tired.',
    benefits: [
      {
        title: 'A refreshed look',
        body: 'A sealed driveway looks more even and better kept.',
      },
      {
        title: 'Easier upkeep',
        body: 'A sealed surface can make spills and dirt easier to clean.',
      },
      {
        title: 'Prepared properly',
        body: 'Cleaning first helps the sealer bond to the surface.',
      },
    ],
    included: [
      'A look at the surface type and condition when we quote',
      'Cleaning and drying of the driveway before sealing',
      'Sealer suited to your surface, as named in your estimate',
      'Clear instructions on when you can walk and drive on it',
    ],
    suitableFor: [
      'Homeowners with asphalt, concrete or paver driveways in fair condition',
      'Owners preparing a home for sale',
      'Landlords and small businesses with private driveways or lots',
    ],
    exclusions: [
      'Crack repair, resurfacing and replacing damaged pavers are not included unless your estimate says so.',
      'Sealing can’t hide deep stains, cracks or unevenness.',
      'Sealing needs dry weather and suitable temperatures, so dates can move if the weather turns.',
      'Large parking lots are quoted as commercial work.',
    ],
    preparation: [
      'Keep vehicles off the driveway on the day and until we say it’s ready.',
      'Turn off sprinklers that reach the driveway.',
      'Tell us what the surface is and send photos, including any cracks or stains.',
    ],
    method:
      'We clean the driveway, let it dry, then apply a sealer suited to the surface. Your estimate names the surface and product, and we tell you how long to keep off it afterwards.',
    safety:
      'We block off the driveway while the sealer cures and tell you when it’s ready for feet and for vehicles.',
    process: [
      {
        title: 'Send a request',
        body: 'Use the quote form or call. Photos help us understand the job.',
      },
      {
        title: 'We review it',
        body: 'We look at the details and may ask for more photos or a quick visit.',
      },
      {
        title: 'Written estimate',
        body: 'You get the scope, exclusions, price and conditions in writing.',
      },
      {
        title: 'Approve and schedule',
        body: 'Once you approve the estimate, we confirm a date that suits you.',
      },
    ],
    priceFactors: ['Driveway size', 'Concrete or asphalt', 'Crack filling', 'Condition'],
    faqs: [
      {
        question: 'Which driveways can you seal?',
        answer:
          'It depends on the surface and its condition. Send photos with your request and we’ll confirm what we can do in your estimate.',
      },
      {
        question: 'How long before I can drive on it?',
        answer:
          'It depends on the product and the weather. We’ll tell you before the job and again when we finish.',
      },
      {
        question: 'Can you seal in any weather?',
        answer:
          'No. Sealing needs dry weather and suitable temperatures, so we may need to move the date if rain is coming.',
      },
    ],
    related: ['pressure-washing', 'patio-balcony-cleaning', 'snow-removal'],
    questions: [
      ask.select('surface', 'Driveway surface', ['Concrete', 'Asphalt']),
      ask.number('area', 'Approximate size', { min: 100, max: 10000, unit: 'sq ft' }),
      ask.yesNo('cracks', 'Fill cracks too?'),
    ],
  },
]
