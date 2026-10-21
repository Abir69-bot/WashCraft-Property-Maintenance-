import { ask } from '../questions'
import type { Faq, ServiceSeed } from '../types'

const bidProcess = [
  { title: 'Request a bid', body: 'Tell us about the property, the services and the schedule.' },
  { title: 'Site walk', body: 'We visit, measure and note access and safety needs.' },
  { title: 'Proposal', body: 'A written scope, schedule and price, with documents on request.' },
  { title: 'Service', body: 'Work done on schedule, with notices for residents or tenants.' },
]

const documentsFaq: Faq = {
  question: 'What documents can you provide for our board or manager?',
  answer:
    'Tell us what you need when you request a bid, such as proof of insurance or safety procedures, and we’ll confirm what we can provide with the proposal.',
}

const multiSiteFaq: Faq = {
  question: 'Do you handle multiple properties?',
  answer: 'Yes, under one contract and one point of contact, with volume pricing.',
}

export const commercialServices: ServiceSeed[] = [
  {
    slug: 'commercial-property-maintenance',
    title: 'Commercial Property Maintenance',
    category: 'commercial',
    icon: 'building',
    quoteMode: 'bid',
    seasons: ['all-year'],
    headline: 'One contractor for the whole property, all year',
    promise: 'Cleaning, upkeep, snow and lighting for commercial properties in {region}.',
    summary:
      'Year-round maintenance contracts for commercial properties: exterior cleaning, windows, gutters, snow and seasonal lighting.',
    outcomeLabel: 'Request a maintenance bid',
    bullets: ['One contract, one contact', 'Scheduled around your hours', 'Multi-site pricing'],
    heroImageLabel: 'Clean storefront and walkway of a small retail plaza',
    problem:
      'Managing separate vendors for washing, windows, gutters, snow and lighting means more calls, more invoices and more chances for something to slip.',
    benefits: [
      { title: 'One point of contact', body: 'A single manager for every service and site.' },
      {
        title: 'Planned calendar',
        body: 'Services scheduled through the year so nothing is missed.',
      },
      { title: 'Clear records', body: 'Service logs, photos and documents for your files.' },
    ],
    included: [
      'Annual service calendar',
      'Exterior cleaning, windows and gutters',
      'Snow and ice management in winter',
      'Seasonal or permanent lighting',
      'Service logs and photos',
    ],
    method:
      'We walk the property, agree on a service calendar and assign one account manager. Crews work around your hours, and every visit is logged with photos.',
    process: bidProcess,
    priceFactors: [
      'Property size',
      'Services and frequency',
      'Hours and access',
      'Number of sites',
    ],
    faqs: [
      {
        question: 'Can you work outside business hours?',
        answer: 'Yes. Early mornings, evenings and weekends can be scheduled.',
      },
      multiSiteFaq,
      documentsFaq,
      {
        question: 'Can we start with one service?',
        answer: 'Yes. Many clients start with one service and add more later.',
      },
      {
        question: 'How is pricing structured?',
        answer: 'Per visit, monthly or annual contracts, depending on what suits your budget.',
      },
    ],
    related: [
      'commercial-pressure-washing',
      'commercial-window-cleaning',
      'commercial-snow-clearing',
    ],
  },
  {
    slug: 'hoa-building-washing',
    title: 'HOA & Condo Building Washing',
    category: 'commercial',
    icon: 'building',
    quoteMode: 'bid',
    seasons: ['spring', 'summer', 'fall'],
    bookingWindowNote: 'Board approvals take time. Request spring bids in winter.',
    headline: 'Condo and townhome buildings, washed with residents in mind',
    promise: 'Building washing for HOAs and condo associations, with notices handled.',
    summary:
      'Exterior building washing for HOAs, condo associations and townhome communities, with resident notices and scheduling.',
    outcomeLabel: 'Request an HOA bid',
    bullets: ['Resident notices handled', 'Soft wash for all siding', 'Lifts and rope access'],
    heroImageLabel: 'Crew on a lift soft-washing a three-story condo building',
    problem:
      'Multi-unit buildings get dirty unevenly: north walls go green, balconies drip onto siding and entrances collect grime. Washing them means coordinating with dozens of residents.',
    benefits: [
      { title: 'Resident-friendly', body: 'We prepare notices and schedule building by building.' },
      { title: 'Protects the asset', body: 'Regular washing helps siding and paint last.' },
      { title: 'Board-ready proposals', body: 'Clear scope, schedule and documents.' },
    ],
    included: [
      'Soft wash of siding, trim and soffits',
      'Entrances and common areas',
      'Resident notices and scheduling',
      'Lift or rope access as needed',
      'Final inspection with the manager',
    ],
    method:
      'We soft wash buildings from the top down using lifts where needed. Residents get notices to close windows and move items from balconies. We wash one building or section at a time to limit disruption.',
    safety: 'Lifts are operated by trained crew, work zones are marked and plants are protected.',
    process: bidProcess,
    priceFactors: ['Number and height of buildings', 'Siding type', 'Access', 'Frequency'],
    faqs: [
      {
        question: 'Do you notify residents?',
        answer:
          'Yes. We provide notices for the manager to share, or post them with your permission.',
      },
      {
        question: 'Do residents need to be home?',
        answer: 'No, but windows must be closed and balconies cleared of fragile items.',
      },
      documentsFaq,
      {
        question: 'Can you present to the board?',
        answer: 'Yes. We can join a board meeting to walk through the proposal.',
      },
      multiSiteFaq,
    ],
    related: [
      'commercial-window-cleaning',
      'commercial-gutter-cleaning',
      'commercial-roof-cleaning',
    ],
  },
  {
    slug: 'commercial-gutter-cleaning',
    title: 'HOA & Commercial Gutter Cleaning',
    category: 'commercial',
    icon: 'wind',
    quoteMode: 'bid',
    seasons: ['spring', 'fall'],
    headline: 'Gutters cleared across every building',
    promise: 'Scheduled gutter cleaning for HOAs and commercial buildings.',
    summary:
      'Gutter and downspout cleaning for HOAs, condo buildings and commercial properties, spring and fall.',
    outcomeLabel: 'Request a gutter bid',
    bullets: ['Spring and fall schedule', 'Downspouts flushed', 'Photo report per building'],
    heroImageLabel: 'Technician cleaning gutters on a townhome row',
    problem:
      'Clogged gutters on large properties cause overflow at entrances, ice at walkways and water damage that turns into expensive repairs and resident complaints.',
    benefits: [
      { title: 'Fewer complaints', body: 'No overflow at entrances or icicles over walkways.' },
      { title: 'Protects buildings', body: 'Water drains away from foundations.' },
      { title: 'Documented', body: 'Photos and notes for every building.' },
    ],
    included: [
      'Hand cleaning of all gutters',
      'Downspouts flushed',
      'Debris hauled away',
      'Photo report with repair notes',
    ],
    method:
      'Crews work building by building, cleaning by hand and flushing downspouts. Each building gets a short photo report with any repairs needed.',
    process: bidProcess,
    priceFactors: ['Linear feet of gutters', 'Building height', 'Guards', 'Frequency'],
    faqs: [
      {
        question: 'How often should HOA gutters be cleaned?',
        answer: 'Twice a year, more for buildings near large trees.',
      },
      {
        question: 'Do you clean high gutters?',
        answer: 'Yes, with lifts or roof access where needed.',
      },
      documentsFaq,
      {
        question: 'Can you make minor repairs?',
        answer: 'We can re-secure brackets and downspouts. Larger repairs are quoted.',
      },
      multiSiteFaq,
    ],
    related: ['hoa-building-washing', 'commercial-roof-cleaning', 'gutter-cleaning'],
  },
  {
    slug: 'commercial-window-cleaning',
    title: 'Commercial Window Cleaning',
    category: 'commercial',
    icon: 'window',
    quoteMode: 'bid',
    seasons: ['all-year'],
    headline: 'Clear windows for storefronts, offices and condos',
    promise: 'Scheduled window cleaning for commercial and multi-unit buildings.',
    summary:
      'Window cleaning for storefronts, offices and low-rise condo buildings on a regular schedule.',
    outcomeLabel: 'Request a window bid',
    bullets: ['Storefronts and offices', 'Low-rise condos', 'Monthly to annual schedules'],
    heroImageLabel: 'Technician cleaning a storefront window with a squeegee',
    problem:
      'Dirty storefront and office windows send the wrong message to customers and tenants, and multi-story glass is hard to reach without the right equipment.',
    benefits: [
      { title: 'First impressions', body: 'Clean glass makes businesses look open and cared for.' },
      { title: 'Regular schedule', body: 'Weekly to annual, timed around your hours.' },
      { title: 'Safe access', body: 'Water-fed poles and lifts for upper floors.' },
    ],
    included: [
      'Exterior glass and frames',
      'Interior glass if requested',
      'Entrance doors',
      'Service log',
    ],
    method:
      'Storefronts are squeegeed by hand. Upper floors are cleaned with water-fed poles using purified water, or from lifts where needed.',
    process: bidProcess,
    priceFactors: ['Amount of glass', 'Height', 'Inside and out', 'Frequency'],
    faqs: [
      {
        question: 'Can you clean before we open?',
        answer: 'Yes. Early starts are common for storefronts.',
      },
      {
        question: 'How high can you clean?',
        answer: 'Water-fed poles reach about four stories. Higher buildings are quoted with lifts.',
      },
      documentsFaq,
      { question: 'Do you clean interior glass partitions?', answer: 'Yes, on request.' },
      multiSiteFaq,
    ],
    related: ['hoa-building-washing', 'glass-awning-cleaning', 'window-cleaning'],
  },
  {
    slug: 'commercial-roof-cleaning',
    title: 'HOA & Commercial Roof Cleaning',
    category: 'commercial',
    icon: 'house',
    quoteMode: 'bid',
    seasons: ['all-year'],
    headline: 'Roofs cleaned safely, building by building',
    promise: 'Soft-wash roof cleaning for HOAs and commercial properties.',
    summary:
      'Soft-wash roof cleaning for townhome communities, condo buildings and commercial roofs.',
    outcomeLabel: 'Request a roof bid',
    bullets: [
      'Soft wash, no high pressure',
      'Moss and algae treatment',
      'Building-by-building schedule',
    ],
    heroImageLabel: 'Townhome roofs with black streaks being treated',
    problem:
      'Streaked, mossy roofs make a whole community look worn and can shorten roof life. Roofs on large properties need planning, safety gear and resident coordination.',
    benefits: [
      { title: 'Longer roof life', body: 'Removing moss and algae protects roofing materials.' },
      { title: 'Uniform look', body: 'Every building cleaned to the same standard.' },
      { title: 'Safe work', body: 'Fall protection and marked work zones.' },
    ],
    included: [
      'Soft-wash treatment',
      'Moss removal',
      'Gutter rinse after treatment',
      'Photo report',
    ],
    method:
      'We soft wash roofs with low pressure and a cleaning solution, remove loose moss by hand and rinse gutters. Work is scheduled building by building with resident notices.',
    process: bidProcess,
    priceFactors: ['Roof area', 'Pitch and height', 'Roof material', 'Number of buildings'],
    faqs: [
      {
        question: 'Will roof cleaning affect warranties?',
        answer:
          'Soft washing follows commonly recommended methods. Share your warranty terms and we’ll review them.',
      },
      {
        question: 'Do you clean flat commercial roofs?',
        answer: 'Yes, including membrane roofs, with suitable cleaners.',
      },
      documentsFaq,
      {
        question: 'How often should roofs be cleaned?',
        answer: 'Every two to four years, depending on shade and trees.',
      },
      multiSiteFaq,
    ],
    related: ['commercial-gutter-cleaning', 'hoa-building-washing', 'roof-cleaning'],
  },
  {
    slug: 'commercial-pressure-washing',
    title: 'Commercial Pressure Washing',
    category: 'commercial',
    icon: 'spray',
    quoteMode: 'bid',
    seasons: ['spring', 'summer', 'fall'],
    headline: 'Clean entrances, walkways and plazas',
    promise: 'Pressure washing for sidewalks, entrances, drive-thrus and dumpster pads.',
    summary:
      'Commercial pressure washing for sidewalks, entrances, plazas, drive-thrus, loading docks and dumpster pads.',
    outcomeLabel: 'Request a pressure washing bid',
    bullets: ['Sidewalks and entrances', 'Gum and grease removal', 'After-hours service'],
    heroImageLabel: 'Surface cleaner on a busy store entrance at night',
    problem:
      'Gum, grease, spills and grime build up fast where people walk and cars stop. Dirty entrances and dumpster pads are noticed by customers and inspectors alike.',
    benefits: [
      { title: 'Better first impression', body: 'Clean entrances invite customers in.' },
      { title: 'Safer surfaces', body: 'Grease and grime removed from walkways.' },
      { title: 'Off-hours work', body: 'Done when you’re closed.' },
    ],
    included: [
      'Gum removal',
      'Grease and stain pre-treatment',
      'Surface cleaning',
      'Water recovery where required',
    ],
    method:
      'We pre-treat grease and stains, remove gum with hot water and clean with surface cleaners. Where local rules require it, we recover wash water instead of letting it drain.',
    process: bidProcess,
    priceFactors: ['Area', 'Gum and grease', 'Water recovery needs', 'Frequency'],
    faqs: [
      {
        question: 'Can you remove gum?',
        answer: 'Yes. Hot water and the right tools lift most gum.',
      },
      {
        question: 'Do you recover wash water?',
        answer: 'Yes, where required. We’ll confirm local requirements in the bid.',
      },
      documentsFaq,
      {
        question: 'Can you clean drive-thru lanes?',
        answer: 'Yes, scheduled when the lane is closed.',
      },
      multiSiteFaq,
    ],
    related: ['parking-garage-cleaning', 'graffiti-removal', 'pressure-washing'],
  },
  {
    slug: 'parking-garage-cleaning',
    title: 'Parking Garage Cleaning',
    category: 'commercial',
    icon: 'parking',
    quoteMode: 'bid',
    seasons: ['spring', 'summer', 'fall'],
    bookingWindowNote: 'Spring cleaning removes a winter of salt and grit.',
    headline: 'Parking garages cleaned of salt, oil and grime',
    promise: 'Sweeping, scrubbing and washing for parking garages and underground lots.',
    summary:
      'Parking garage cleaning for condos and commercial buildings: sweeping, oil treatment and washing.',
    outcomeLabel: 'Request a garage bid',
    bullets: ['Salt and grit removal', 'Oil stain treatment', 'Level-by-level schedule'],
    heroImageLabel: 'Underground parking level being scrubbed and rinsed',
    problem:
      'Winter salt, grit and oil build up in parking garages. Salt damages concrete over time, and dirty, dusty garages lead to resident complaints.',
    benefits: [
      { title: 'Protects concrete', body: 'Removing salt slows damage to slabs and rebar.' },
      { title: 'Cleaner air', body: 'Less dust and grime in enclosed spaces.' },
      { title: 'Organized', body: 'Level-by-level plan with resident notices.' },
    ],
    included: [
      'Sweeping and debris removal',
      'Oil stain treatment',
      'Washing and scrubbing',
      'Drain checks',
      'Resident notices',
    ],
    method:
      'Each level is swept first, then oil stains are treated and floors are washed and scrubbed. Water is directed to drains or recovered where required. We plan levels so residents can move cars.',
    process: bidProcess,
    priceFactors: ['Garage size and levels', 'Amount of salt and oil', 'Water recovery needs'],
    faqs: [
      {
        question: 'Do residents need to move cars?',
        answer: 'Yes, by level. We provide a schedule and notices.',
      },
      {
        question: 'Do you clean drains?',
        answer: 'We check and clear trench drains as part of the job.',
      },
      documentsFaq,
      {
        question: 'How often should a garage be cleaned?',
        answer: 'At least once a year after winter. Busy garages benefit from twice.',
      },
      multiSiteFaq,
    ],
    related: [
      'commercial-pressure-washing',
      'commercial-property-maintenance',
      'hoa-building-washing',
    ],
  },
  {
    slug: 'graffiti-removal',
    title: 'Graffiti Removal',
    category: 'commercial',
    icon: 'eraser',
    quoteMode: 'custom',
    seasons: ['all-year'],
    headline: 'Graffiti removed fast, surfaces protected',
    promise: 'Graffiti removal from brick, concrete, metal and painted surfaces.',
    summary:
      'Graffiti removal for walls, fences, signs and doors, with protective coating available.',
    outcomeLabel: 'Get graffiti removed',
    bullets: ['Brick, concrete and metal', 'Quoted from photos', 'Anti-graffiti coating'],
    heroImageLabel: 'Brick wall with graffiti partly removed',
    problem:
      'Graffiti that stays up tends to attract more. Removing it quickly matters, but the wrong method can etch brick or leave a ghost image.',
    benefits: [
      { title: 'Fast response', body: 'Quoted from photos so we can schedule quickly.' },
      { title: 'Surface-safe', body: 'Removers chosen for the surface.' },
      { title: 'Prevention', body: 'Optional coating makes future removal easier.' },
    ],
    included: [
      'Surface and paint assessment',
      'Graffiti remover and rinse',
      'Paint-over option on painted surfaces',
      'Anti-graffiti coating (if selected)',
    ],
    method:
      'We test a small area, then apply a remover suited to the paint and the surface and rinse at controlled pressure. On painted walls, color-matched paint-over is sometimes the cleaner result.',
    process: [
      { title: 'Send photos', body: 'Show us the graffiti and the surface.' },
      { title: 'Get a quote', body: 'Removal and optional coating.' },
      { title: 'Remove', body: 'Test, treat and rinse.' },
      { title: 'Protect', body: 'Coating applied if selected.' },
    ],
    priceFactors: ['Area', 'Surface type', 'Paint type', 'Coating'],
    faqs: [
      {
        question: 'Will there be a shadow left?',
        answer: 'Sometimes on porous brick. We’ll tell you what to expect after a test spot.',
      },
      {
        question: 'Do you remove graffiti from homes too?',
        answer: 'Yes, fences and garage doors included.',
      },
      {
        question: 'What does anti-graffiti coating do?',
        answer: 'It makes future graffiti easier to wash off.',
      },
      {
        question: 'Can you remove it from signs and metal?',
        answer: 'Yes, with removers safe for those surfaces.',
      },
      {
        question: 'Do you offer ongoing service?',
        answer: 'Yes. Properties with repeat graffiti can set up regular visits.',
      },
    ],
    related: [
      'commercial-pressure-washing',
      'exterior-surface-cleaning',
      'commercial-property-maintenance',
    ],
  },
  {
    slug: 'solar-panel-cleaning',
    title: 'Solar Panel Cleaning',
    category: 'commercial',
    icon: 'solar',
    quoteMode: 'instant',
    seasons: ['spring', 'summer', 'fall'],
    headline: 'Clean panels, more sunlight on your cells',
    promise: 'Pure-water solar panel cleaning for homes and businesses.',
    summary:
      'Solar panel cleaning with purified water and soft brushes, for homes and commercial arrays.',
    outcomeLabel: 'Clean my solar panels',
    bullets: ['Purified water, soft brushes', 'Homes and businesses', 'No harsh chemicals'],
    heroImageLabel: 'Technician cleaning rooftop solar panels with a soft brush pole',
    problem:
      'Dust, pollen, bird droppings and leaves block sunlight on panels. Rain alone often leaves a film behind, especially on panels with a low tilt.',
    benefits: [
      {
        title: 'More light reaches the cells',
        body: 'Removing grime lets panels work as designed.',
      },
      { title: 'Safe for panels', body: 'Purified water and soft brushes, no harsh chemicals.' },
      { title: 'Spot problems', body: 'We note cracked panels or loose wiring we see.' },
    ],
    included: [
      'Soft-brush wash with purified water',
      'Bird droppings and debris removed',
      'Visual check of panels',
    ],
    method:
      'We wash panels with purified water and soft brushes on extension poles, so there’s no residue to dry on the glass. We avoid harsh chemicals and high pressure.',
    safety: 'We work from the ground or with roof safety gear and never walk on panels.',
    process: [
      { title: 'Get a price', body: 'Tell us how many panels and where they are.' },
      { title: 'Wash', body: 'Soft brushes and purified water.' },
      { title: 'Rinse', body: 'Spot-free rinse.' },
      { title: 'Report', body: 'Notes on anything that looks damaged.' },
    ],
    priceFactors: ['Number of panels', 'Roof height and pitch', 'Ground or roof mount'],
    faqs: [
      {
        question: 'How often should panels be cleaned?',
        answer: 'Once or twice a year for most homes, more near dusty roads or trees.',
      },
      {
        question: 'Will cleaning void my warranty?',
        answer:
          'We follow common manufacturer guidance: soft brushes, purified water, no harsh chemicals. Check your warranty terms.',
      },
      {
        question: 'Do I need to turn the system off?',
        answer: 'We’ll advise on the day. Many systems don’t need to be shut down for cleaning.',
      },
      {
        question: 'Do you clean commercial arrays?',
        answer: 'Yes. Larger arrays are quoted with a site visit.',
      },
      {
        question: 'Can you remove nesting birds?',
        answer: 'We can clear debris. Critter guards are quoted separately.',
      },
    ],
    related: ['roof-cleaning', 'gutter-cleaning', 'window-cleaning'],
    questions: [
      ask.number('panels', 'How many panels?', { min: 1, max: 500, unit: 'panels' }),
      ask.select('mount', 'Where are they mounted?', ['Ground', '1-story roof', '2-story roof']),
    ],
  },
  {
    slug: 'glass-awning-cleaning',
    title: 'Glass Awning Cleaning',
    category: 'commercial',
    icon: 'umbrella',
    quoteMode: 'custom',
    seasons: ['all-year'],
    headline: 'Glass canopies that look like glass again',
    promise: 'Cleaning for glass awnings, canopies and skylights.',
    summary: 'Cleaning for glass awnings, entrance canopies, skylights and covered walkways.',
    outcomeLabel: 'Get an awning quote',
    bullets: ['Awnings and canopies', 'Skylights and walkways', 'Safe access'],
    heroImageLabel: 'Glass entrance canopy being cleaned from a lift',
    problem:
      'Glass awnings collect leaves, bird droppings and water stains that are visible from below. They’re hard to reach safely without the right equipment.',
    benefits: [
      { title: 'Bright entrances', body: 'Clean glass lets light through and looks sharp.' },
      { title: 'Safe access', body: 'Lifts and poles, never standing on glass.' },
      { title: 'Stain removal', body: 'Hard water and mineral stains treated.' },
    ],
    included: [
      'Debris removal',
      'Glass and frame cleaning',
      'Hard water treatment',
      'Gutter channels cleared',
    ],
    method:
      'We reach awnings from lifts or with water-fed poles, clear debris, wash glass and frames with purified water and treat mineral stains.',
    process: [
      { title: 'Send photos', body: 'Show us the awning and its height.' },
      { title: 'Get a quote', body: 'Including access equipment.' },
      { title: 'Clean', body: 'Debris, glass and frames.' },
      { title: 'Finish', body: 'Spot-free rinse.' },
    ],
    priceFactors: ['Size', 'Height and access', 'Staining'],
    faqs: [
      {
        question: 'Do you clean residential glass canopies?',
        answer: 'Yes, homes and businesses.',
      },
      {
        question: 'Can you remove hard water stains?',
        answer: 'Usually, with a mineral remover safe for glass.',
      },
      documentsFaq,
      {
        question: 'How often should awnings be cleaned?',
        answer: 'Two to four times a year for busy entrances.',
      },
      { question: 'Do you clean skylights?', answer: 'Yes, when we can reach them safely.' },
    ],
    related: ['commercial-window-cleaning', 'window-cleaning', 'commercial-property-maintenance'],
  },
  {
    slug: 'permanent-led-lighting',
    title: 'Permanent LED Lighting',
    category: 'commercial',
    icon: 'lamp',
    quoteMode: 'custom',
    siteVisit: true,
    seasons: ['all-year'],
    headline: 'Lights for every season, controlled from your phone',
    promise: 'Permanent LED roofline lighting for homes and businesses.',
    summary:
      'Permanent LED roofline lighting with app control: holiday colors, game days or everyday white, all year.',
    outcomeLabel: 'Book a lighting consult',
    bullets: [
      'Installed once, used all year',
      'App-controlled colors',
      'Discreet track along the roofline',
    ],
    heroImageLabel: 'Home with discreet permanent LED lights glowing along the roofline',
    problem:
      'Hanging holiday lights every year takes time and money, and they only go up for a few weeks. Many people want lights for every holiday and everyday accent lighting too.',
    benefits: [
      { title: 'No yearly install', body: 'Installed once and used all year.' },
      { title: 'Any color, any occasion', body: 'Holiday displays, team colors or warm white.' },
      { title: 'Low profile', body: 'Track blends into the trim during the day.' },
    ],
    included: [
      'Site visit and design',
      'Track and LED installation',
      'Controller and app setup',
      'Walk-through of the app',
    ],
    method:
      'We visit to measure the roofline, check power and choose a track color that matches your trim. The LED track is mounted along the roofline and connected to a controller you use from your phone.',
    process: [
      { title: 'Book a consult', body: 'We visit to measure and plan.' },
      { title: 'Design and quote', body: 'Layout, track color and price.' },
      { title: 'Install', body: 'Usually done in a day.' },
      { title: 'Set up', body: 'We show you the app and set your first schedule.' },
    ],
    priceFactors: ['Roofline length', 'Number of stories', 'Power and controller placement'],
    faqs: [
      {
        question: 'Can you see the lights during the day?',
        answer: 'The track is color-matched to your trim to keep it low profile.',
      },
      {
        question: 'Do I need an outlet?',
        answer: 'A nearby outdoor outlet is needed. We’ll check power at the site visit.',
      },
      { question: 'Can I set schedules?', answer: 'Yes. Set colors and schedules from the app.' },
      {
        question: 'Is this for businesses too?',
        answer: 'Yes. Storefronts and buildings use permanent lighting for branding and events.',
      },
      {
        question: 'Will I still need holiday lights?',
        answer: 'Many customers don’t. Some add wrapped trees and shrubs for the holidays.',
      },
    ],
    related: [
      'christmas-light-installation',
      'commercial-property-maintenance',
      'christmas-light-removal',
    ],
  },
]
