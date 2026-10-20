import { ask, bathrooms, bedrooms, garageSize } from '../questions'
import type { ServiceSeed } from '../types'

export const interiorServices: ServiceSeed[] = [
  {
    slug: 'house-cleaning',
    title: 'House Cleaning',
    category: 'interior-cleaning',
    icon: 'sparkles',
    quoteMode: 'instant',
    seasons: ['all-year'],
    headline: 'Come home to a clean house',
    promise: 'One-time or recurring house cleaning on a checklist you can see.',
    summary:
      'One-time, every-other-week or monthly house cleaning, with kitchens, bathrooms, floors and dusting on a set checklist.',
    outcomeLabel: 'Get a clean home',
    bullets: [
      'One-time or recurring',
      'Same checklist every visit',
      'Inside fridge and oven available',
    ],
    heroImageLabel: 'Bright living room with freshly vacuumed rug and dusted shelves',
    problem:
      'Between work, kids and everything else, cleaning slips. Bathrooms and kitchens need attention every week, and the deep corners and baseboards never get done.',
    benefits: [
      { title: 'Time back', body: 'Spend your weekend on something other than scrubbing.' },
      {
        title: 'Consistent results',
        body: 'We follow the same room-by-room checklist every visit.',
      },
      { title: 'Flexible schedule', body: 'Book once, or set a regular schedule and save.' },
    ],
    included: [
      'Kitchen counters, sink, stovetop and outside of appliances',
      'Bathrooms: toilets, tubs, showers, sinks and mirrors',
      'Dusting of reachable surfaces and baseboards',
      'Vacuuming and mopping of all floors',
      'Beds made and trash emptied',
    ],
    method:
      'We work top to bottom and room by room, so dust falls onto areas we haven’t cleaned yet. Each room has a checklist, and we use separate cloths for kitchens and bathrooms. First visits take longer because we catch up on built-up dirt.',
    safety:
      'We bring our own supplies and can use yours if you prefer specific products. Let us know about pets and anything fragile or off-limits.',
    process: [
      { title: 'Get a price', body: 'Tell us bedrooms, bathrooms and any add-ons.' },
      { title: 'Choose a schedule', body: 'One-time, every other week or monthly.' },
      { title: 'We clean', body: 'Room by room, following the checklist.' },
      { title: 'Walk-through', body: 'Tell us anything you’d like done differently next time.' },
    ],
    priceFactors: [
      'Bedrooms and bathrooms',
      'Size of the home',
      'Pets',
      'Add-ons such as inside the fridge or oven',
    ],
    addOns: [
      { name: 'Inside fridge', description: 'Shelves and drawers emptied, wiped and restocked.' },
      { name: 'Inside oven', description: 'Racks and interior degreased.' },
      { name: 'Interior windows', description: 'Glass, sills and tracks.' },
    ],
    faqs: [
      {
        question: 'Do I need to be home?',
        answer:
          'No. Many customers give us a door code or key. We’ll message you when we arrive and leave.',
      },
      {
        question: 'Do you bring supplies?',
        answer:
          'Yes, all supplies and equipment. If you prefer certain products, leave them out and we’ll use them.',
      },
      {
        question: 'Is the first clean different?',
        answer:
          'It usually takes longer because we catch up on built-up dirt. Regular visits after that are quicker.',
      },
      {
        question: 'Can I skip or reschedule a visit?',
        answer: 'Yes. Give us 48 hours’ notice and we’ll move it.',
      },
      {
        question: 'Do you clean homes with pets?',
        answer:
          'Yes. Tell us about pets so we can bring the right vacuum attachments and keep doors closed.',
      },
    ],
    related: ['move-in-move-out-cleaning', 'garage-cleaning', 'window-cleaning'],
    questions: [
      bedrooms,
      bathrooms,
      ask.yesNo('pets', 'Any pets?'),
      ask.yesNo('fridge', 'Clean inside the fridge?'),
      ask.yesNo('oven', 'Clean inside the oven?'),
    ],
  },
  {
    slug: 'move-in-move-out-cleaning',
    title: 'Move-In / Move-Out Cleaning',
    category: 'interior-cleaning',
    icon: 'package',
    quoteMode: 'instant',
    seasons: ['all-year'],
    headline: 'Empty home, spotless from top to bottom',
    promise: 'A deep clean built for landlord walk-throughs and fresh starts.',
    summary:
      'A deep clean of an empty home, including inside cabinets, appliances and closets, for moving in or out.',
    outcomeLabel: 'Get move-out ready',
    bullets: [
      'Inside cabinets and closets',
      'Inside appliances available',
      'Built for walk-throughs',
    ],
    heroImageLabel: 'Empty, freshly cleaned kitchen with open cabinets',
    problem:
      'Moving is exhausting, and the last thing you want is to scrub an empty house. Landlords and buyers look closely, and dirt hidden by furniture is suddenly on display.',
    benefits: [
      {
        title: 'Walk-through ready',
        body: 'We clean the places inspectors check: inside cabinets, appliances and baseboards.',
      },
      {
        title: 'Start fresh',
        body: 'Moving in? Unpack into a home that’s clean inside every drawer.',
      },
      { title: 'One less moving task', body: 'Hand us the keys and focus on the move.' },
    ],
    included: [
      'Inside all cabinets, drawers and closets',
      'Kitchen and bathrooms deep cleaned',
      'Baseboards, doors, switches and outlets wiped',
      'Window sills and tracks',
      'Floors vacuumed and mopped',
      'Inside appliances (if selected)',
    ],
    method:
      'An empty home lets us reach everything. We start with cabinets and closets, work through kitchens and bathrooms, wipe every surface people touch, and finish with floors. We follow a move-out checklist modeled on common landlord walk-through forms.',
    process: [
      {
        title: 'Get a price',
        body: 'Tell us bedrooms, bathrooms and whether to clean inside appliances.',
      },
      { title: 'Pick the date', body: 'Ideally after the movers and before the walk-through.' },
      { title: 'Deep clean', body: 'Every room, cabinet and closet.' },
      { title: 'Photos', body: 'We send photos you can share with a landlord or buyer.' },
    ],
    priceFactors: ['Bedrooms and bathrooms', 'Inside appliances', 'Condition of the home'],
    faqs: [
      {
        question: 'Does the home need to be empty?',
        answer: 'Yes, or nearly. Furniture and boxes block the areas this clean is designed for.',
      },
      {
        question: 'Will this get my deposit back?',
        answer:
          'We clean to a high standard and follow a typical walk-through checklist, but deposits also depend on damage and your landlord’s decision.',
      },
      {
        question: 'Do you clean carpets?',
        answer:
          'We vacuum them thoroughly. Steam cleaning is not included, and we can recommend a partner.',
      },
      {
        question: 'Can you remove leftover items?',
        answer: 'Yes. Add junk removal and we’ll haul away what’s left behind.',
      },
      {
        question: 'Do you need electricity and water on?',
        answer: 'Yes, please keep utilities on until we’ve finished.',
      },
    ],
    related: ['house-cleaning', 'junk-removal', 'garage-cleaning'],
    questions: [bedrooms, bathrooms, ask.yesNo('appliances', 'Clean inside appliances?')],
  },
  {
    slug: 'post-construction-cleaning',
    title: 'Post-Construction Cleaning',
    category: 'interior-cleaning',
    icon: 'construction',
    quoteMode: 'custom',
    seasons: ['all-year'],
    headline: 'From construction dust to move-in ready',
    promise: 'Fine dust, paint flecks and stickers cleared after renovations and new builds.',
    summary:
      'Cleaning after renovations and new builds: fine dust, debris, paint specks, labels and window residue.',
    outcomeLabel: 'Get a post-construction quote',
    bullets: ['Fine dust removal', 'Stickers and paint specks', 'Rough or final clean'],
    heroImageLabel: 'Newly renovated room with dust-free floors and windows',
    problem:
      'Construction dust gets everywhere: inside cabinets, on top of door frames and in window tracks. It keeps settling for days, and regular cleaning just moves it around.',
    benefits: [
      { title: 'Truly dust-free', body: 'HEPA vacuums and repeated wipe-downs remove fine dust.' },
      {
        title: 'Details handled',
        body: 'Labels, tape residue and paint specks are removed carefully.',
      },
      { title: 'Builder-friendly', body: 'We schedule around trades and final inspections.' },
    ],
    included: [
      'HEPA vacuuming of all surfaces',
      'Wipe-down of walls, trim, doors and cabinets inside and out',
      'Removal of stickers, tape and light paint specks',
      'Windows, sills and tracks',
      'Floors vacuumed and mopped',
    ],
    method:
      'We vacuum with HEPA filters first so dust is captured, not spread. Then we wipe every surface from top to bottom, including inside cabinets. Stickers and paint specks are removed with the right tools for each surface.',
    process: [
      { title: 'Send photos', body: 'Tell us the size and stage of the project.' },
      { title: 'Get a quote', body: 'We price a rough clean, a final clean or both.' },
      { title: 'Clean', body: 'We clean around your schedule and trades.' },
      { title: 'Touch-up', body: 'A quick follow-up for dust that settled later, if needed.' },
    ],
    priceFactors: ['Square footage', 'Stage: rough or final clean', 'Amount of dust and debris'],
    faqs: [
      {
        question: 'When should I book?',
        answer: 'After the last trade finishes and before you move furniture in.',
      },
      {
        question: 'Do you haul construction debris?',
        answer: 'Small amounts, yes. For larger loads, add junk removal.',
      },
      {
        question: 'Can you work for builders?',
        answer: 'Yes. We clean new builds and remodels for contractors and homeowners.',
      },
      {
        question: 'Will you clean inside cabinets?',
        answer: 'Yes, inside and out.',
      },
      {
        question: 'How long does it take?',
        answer: 'Most single-room remodels take a few hours. Whole homes take a day or more.',
      },
    ],
    related: ['junk-removal', 'house-cleaning', 'window-cleaning'],
  },
  {
    slug: 'garage-cleaning',
    title: 'Garage Cleaning',
    category: 'interior-cleaning',
    icon: 'warehouse',
    quoteMode: 'instant',
    seasons: ['all-year'],
    headline: 'Park in your garage again',
    promise: 'Garages swept, cleaned and decluttered, with the junk hauled away.',
    summary: 'Garage cleaning and decluttering for one-, two- and three-car garages.',
    outcomeLabel: 'Get your garage back',
    bullets: ['Sweep, dust and wipe-down', 'Decluttering available', 'Unwanted items hauled'],
    heroImageLabel: 'Organized two-car garage with a clean floor',
    problem:
      'Garages turn into storage rooms. Boxes pile up, dust and leaves blow in, and the car ends up in the driveway all winter.',
    benefits: [
      { title: 'Room for the car', body: 'Clear space so you can park inside in winter.' },
      { title: 'Find things again', body: 'We group items so you can see what you own.' },
      { title: 'Less waste on you', body: 'We haul away what you don’t want to keep.' },
    ],
    included: [
      'Sweep and blow-out of the floor',
      'Cobwebs and dust removed from walls and shelves',
      'Decluttering and grouping of items (if selected)',
      'Haul-away of unwanted items (priced by load)',
    ],
    method:
      'We pull items out, sweep and clean, then put things back in groups so it’s easy to find what you need. Anything you mark for removal goes on our truck.',
    process: [
      { title: 'Get a price', body: 'Tell us the garage size and whether to declutter.' },
      { title: 'Sort', body: 'Keep, donate or haul: you decide.' },
      { title: 'Clean', body: 'Floors, walls and shelves.' },
      { title: 'Reset', body: 'Items go back in tidy groups.' },
    ],
    priceFactors: ['Garage size', 'Decluttering', 'Amount to haul away'],
    addOns: [
      {
        name: 'Garage floor pressure cleaning',
        description: 'Oil and tire marks lifted from the slab.',
      },
    ],
    faqs: [
      {
        question: 'Do I need to be there?',
        answer: 'For decluttering, yes, at least at the start so you can decide what stays.',
      },
      {
        question: 'Do you take hazardous waste?',
        answer: 'No paint cans, chemicals or batteries. We’ll set them aside for proper disposal.',
      },
      {
        question: 'Can you pressure wash the floor?',
        answer: 'Yes. Add garage and driveway pressure cleaning for oil stains and tire marks.',
      },
      {
        question: 'Do you install shelving?',
        answer: 'Simple shelving can be quoted as minor repairs.',
      },
      {
        question: 'Where do donations go?',
        answer: 'We drop usable items at local donation centers when we can.',
      },
    ],
    related: ['garage-driveway-pressure-cleaning', 'junk-removal', 'house-cleaning'],
    questions: [garageSize, ask.yesNo('declutter', 'Sort and declutter too?')],
  },
  {
    slug: 'junk-removal',
    title: 'Junk Removal & Hauling',
    category: 'interior-cleaning',
    icon: 'truck',
    quoteMode: 'custom',
    dedicatedFlow: 'junk-removal',
    seasons: ['all-year'],
    headline: 'Point at it, and it’s gone',
    promise: 'Furniture, yard waste, appliances and clutter hauled away, priced from your photos.',
    summary:
      'Junk removal and hauling, quoted from your photos and priced by how much of the truck you fill.',
    outcomeLabel: 'Get a junk removal quote',
    bullets: ['Quoted from photos', 'Priced by truck load', 'We do all the lifting'],
    heroImageLabel: 'Crew loading an old sofa into a trailer',
    problem:
      'Old furniture, broken appliances, renovation debris and boxes you’ve stopped opening take up space. Getting rid of them means borrowing a truck, lifting heavy things and finding where each item can go.',
    benefits: [
      {
        title: 'No lifting',
        body: 'We carry items out from anywhere: basement, garage or curbside.',
      },
      { title: 'Clear pricing', body: 'Send photos and get a price by load size before we come.' },
      { title: 'Responsible disposal', body: 'We donate and recycle what we can.' },
    ],
    included: [
      'Photo-based quote by load size',
      'Loading by our crew',
      'Sweep of the area we cleared',
      'Donation and recycling where possible',
    ],
    method:
      'Upload photos and tell us where the items are. We estimate how much of the truck it fills, from a minimum load to a full load, and confirm the price before we lift anything.',
    process: [
      { title: 'Send photos', body: 'Show us what’s going and where it is.' },
      { title: 'Get a price', body: 'Priced by load size, confirmed on arrival.' },
      { title: 'We haul', body: 'We carry, load and sweep up.' },
      {
        title: 'Sorted',
        body: 'Usable items are donated and the rest is recycled or disposed of.',
      },
    ],
    priceFactors: [
      'Load size',
      'Access (stairs, basement, curbside)',
      'Heavy items such as appliances',
    ],
    faqs: [
      {
        question: 'What won’t you take?',
        answer: 'Hazardous materials like paint, chemicals, propane tanks and asbestos.',
      },
      {
        question: 'How do you price a load?',
        answer: 'By how much of our truck it fills: minimum, quarter, half, three-quarter or full.',
      },
      {
        question: 'Do I need to move items to the curb?',
        answer: 'No. We can take items from inside, including basements and upper floors.',
      },
      {
        question: 'Can you take yard waste?',
        answer: 'Yes: branches, leaves and old landscaping materials.',
      },
      {
        question: 'Do you take appliances?',
        answer: 'Yes. Some appliances have a disposal fee, which we include in the quote.',
      },
    ],
    related: ['garage-cleaning', 'move-in-move-out-cleaning', 'yard-cleanup'],
  },
  {
    slug: 'property-maintenance',
    title: 'General Property Maintenance',
    category: 'interior-cleaning',
    icon: 'wrench',
    quoteMode: 'custom',
    seasons: ['all-year'],
    headline: 'The to-do list, handled',
    promise: 'Recurring or one-off maintenance tasks for homes and rentals.',
    summary:
      'General maintenance for homes and rentals: seasonal checklists, small fixes and upkeep on a schedule.',
    outcomeLabel: 'Get your list done',
    bullets: ['Seasonal checklists', 'Rental and vacation homes', 'One visit or a schedule'],
    heroImageLabel: 'Technician replacing a furnace filter',
    problem:
      'Furnace filters, smoke detector batteries, caulking, squeaky doors, burnt-out bulbs: small jobs add up, and they’re easy to forget, especially for rentals and second homes.',
    benefits: [
      {
        title: 'Nothing slips',
        body: 'A seasonal checklist covers the jobs that keep a home in good shape.',
      },
      { title: 'Great for rentals', body: 'We handle turnover tasks between tenants or guests.' },
      { title: 'One call', body: 'Combine maintenance with cleaning and exterior work.' },
    ],
    included: [
      'Walk-through of your task list',
      'Small fixes and replacements',
      'Seasonal checklist (filters, detectors, hoses, vents)',
      'Photos and notes after each visit',
    ],
    method:
      'Send us your list, or start from our seasonal checklist. We group tasks into a single visit and send notes and photos so you know what was done.',
    process: [
      { title: 'Share your list', body: 'Tell us the tasks and how often.' },
      { title: 'Get a quote', body: 'Per visit or as a recurring plan.' },
      { title: 'We visit', body: 'Tasks done in one trip.' },
      { title: 'Report', body: 'Notes and photos after every visit.' },
    ],
    priceFactors: ['Number and type of tasks', 'Visit frequency', 'Materials needed'],
    faqs: [
      {
        question: 'Do you do plumbing or electrical work?',
        answer:
          'Only simple replacements like bulbs and faucet aerators. Licensed work goes to licensed trades.',
      },
      {
        question: 'Can you look after a vacation home?',
        answer: 'Yes. Regular checks and maintenance while you’re away.',
      },
      {
        question: 'Do you supply materials?',
        answer: 'Yes, at cost, or we use materials you provide.',
      },
      {
        question: 'Can you work between rental guests?',
        answer: 'Yes. Tell us the turnover window and we’ll schedule around it.',
      },
      {
        question: 'Is there a minimum visit?',
        answer: 'Each visit has a minimum time. Grouping tasks makes the best use of it.',
      },
    ],
    related: ['minor-exterior-repairs', 'exterior-caulking', 'house-cleaning'],
  },
]
