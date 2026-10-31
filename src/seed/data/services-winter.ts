import { ask } from '../questions'
import type { ServiceSeed } from '../types'

const SNOW_NOTE =
  'Routes are planned in the fall. Sign up by early November for full-season service.'

const driveway = ask.select('driveway', 'Driveway size', ['1 car', '2 cars', '3 cars', '4+ cars'])
const walkway = ask.number('walkway_length', 'Walkway and sidewalk length', {
  min: 0,
  max: 1000,
  unit: 'linear ft',
  helpText: 'Front walk plus public sidewalk. A typical lot is 60–120 feet.',
})

export const winterServices: ServiceSeed[] = [
  {
    slug: 'snow-removal',
    title: 'Snow Removal',
    category: 'winter-services',
    icon: 'snowflake',
    quoteMode: 'contract',
    seasons: ['winter'],
    headline: 'Snow cleared from your property',
    promise: 'Snow removal for homes and businesses in {region}.',
    summary:
      'Snow removal for driveways, walkways and entrances. The areas, timing and options are confirmed in your written estimate before winter starts.',
    outcomeLabel: 'Ask about snow removal',
    bullets: ['Driveways and walkways', 'Homes and businesses', 'Options confirmed in writing'],
    heroImageLabel: 'Snow blower clearing a long residential driveway',
    problem:
      'Snow and ice make driveways and walkways hard to use and slippery to walk on. Clearing them yourself after every storm takes time and effort, especially early in the morning.',
    benefits: [
      {
        title: 'Clear paths',
        body: 'Driveways, walkways and entrances cleared so people can get in and out.',
      },
      {
        title: 'Less to worry about',
        body: 'No shoveling for you after a snowfall.',
      },
      {
        title: 'Agreed in advance',
        body: 'The areas and options are set out in your estimate, so you know what to expect.',
      },
    ],
    included: [
      'Snow cleared from the driveway, walkways and entrances listed in your estimate',
      'Timing and service options as set out in your written estimate',
      'Snow placed in agreed spots on your property',
    ],
    suitableFor: [
      'Homeowners who’d rather not shovel',
      'Landlords responsible for clearing tenant access',
      'Small businesses with entrances, walkways or small lots',
    ],
    exclusions: [
      'Service options, such as when we come out and how often, are confirmed in your estimate. We don’t advertise options before they’re confirmed.',
      'Roof snow removal is not included.',
      'Snow can’t be pushed onto the street or a neighbor’s property.',
      'Large lots that need heavy equipment are quoted separately.',
    ],
    preparation: [
      'Send a request before winter so we can plan your property.',
      'Mark the edges of driveways, gardens and anything hidden under snow.',
      'Keep vehicles and items out of the areas to be cleared when you can.',
    ],
    method:
      'Before winter we agree which areas we clear and where snow can go. Your estimate sets out the options and timing that apply to your property.',
    safety:
      'Ice can form after we clear. Tell us about steps and slopes that need special attention, and ask about ice control when you request a quote.',
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
      'Driveway size',
      'Walkway and sidewalk length',
      'Trigger depth',
      'Add-ons like salting',
    ],
    addOns: [
      { name: 'Salting and de-icing', description: 'Treatment after each visit.' },
      { name: 'Ice control', description: 'Pre-treatment before storms and ice checks.' },
      { name: 'Snowbank removal', description: 'Haul away banks when they pile too high.' },
    ],
    faqs: [
      {
        question: 'When should I request a quote?',
        answer: 'Before winter is best, so we can plan your property ahead of the first snowfall.',
      },
      {
        question: 'What options do you offer?',
        answer:
          'We confirm the options for your property, such as timing and areas covered, in your written estimate.',
      },
      {
        question: 'Do you clear roofs?',
        answer: 'No. Snow removal covers driveways, walkways and entrances.',
      },
    ],
    related: ['christmas-light-installation', 'gutter-cleaning', 'driveway-sealing'],
    questions: [driveway, walkway],
  },
  {
    slug: 'driveway-snow-clearing',
    title: 'Driveway Snow Clearing',
    category: 'winter-services',
    icon: 'car',
    quoteMode: 'contract',
    seasons: ['winter'],
    bookingWindowNote: SNOW_NOTE,
    headline: 'Your driveway clear before you need the car',
    promise: 'Driveway snow clearing on a seasonal route.',
    summary: 'Seasonal driveway snow clearing, including the plow ridge at the end of the drive.',
    outcomeLabel: 'Clear my driveway',
    bullets: ['Cleared edge to edge', 'Plow ridge included', 'Seasonal or per visit'],
    heroImageLabel: 'Freshly cleared driveway with neat snow edges',
    problem:
      'The driveway is the biggest shoveling job, and the city plow usually leaves a heavy ridge across the end just after you’ve finished.',
    benefits: [
      { title: 'Get out on time', body: 'Your car can leave without a fight with the snow.' },
      { title: 'Plow ridge handled', body: 'We clear the heavy ridge the street plow leaves.' },
      {
        title: 'Less ice later',
        body: 'Clearing edge to edge means less snow to melt and refreeze.',
      },
    ],
    included: [
      'Full driveway width, edge to edge',
      'Plow ridge at the end of the drive',
      'Area in front of the garage door',
      'Snow piled where it won’t block sight lines',
    ],
    method:
      'We use snow blowers on most residential drives and plows on long ones. We clear the full width and stack snow where it won’t slide back or block the view of the street.',
    process: [
      { title: 'Sign up', body: 'Tell us how many cars your driveway fits.' },
      { title: 'Mark edges', body: 'We stake edges and obstacles before the first snow.' },
      { title: 'Clear', body: 'After each qualifying snowfall.' },
      { title: 'Ridge check', body: 'We clear the plow ridge on the same visit when it’s there.' },
    ],
    priceFactors: ['Driveway size', 'Slope and shape', 'Trigger depth'],
    faqs: [
      {
        question: 'Do you clear around parked cars?',
        answer: 'We clear around them, but moving cars before a storm gives the best result.',
      },
      {
        question: 'Will you damage my lawn edges?',
        answer:
          'Staking the edges before winter prevents most damage. We stake them for you at the start of the season.',
      },
      {
        question: 'What about gravel driveways?',
        answer: 'Yes, with care. We set equipment higher so we don’t throw gravel.',
      },
      {
        question: 'Is the walkway included?',
        answer: 'Add walkway and sidewalk clearing, or choose the full snow removal contract.',
      },
      {
        question: 'Do you salt the driveway?',
        answer: 'Add salting and de-icing for treatment after each visit.',
      },
    ],
    related: ['walkway-sidewalk-snow-clearing', 'salting-de-icing', 'snow-removal'],
    questions: [driveway],
  },
  {
    slug: 'walkway-sidewalk-snow-clearing',
    title: 'Walkway & Sidewalk Snow Clearing',
    category: 'winter-services',
    icon: 'footprints',
    quoteMode: 'contract',
    seasons: ['winter'],
    bookingWindowNote: SNOW_NOTE,
    headline: 'Safe walkways for everyone who visits',
    promise: 'Front walks, steps and public sidewalks cleared by hand.',
    summary: 'Seasonal clearing of front walks, steps, porches and public sidewalks.',
    outcomeLabel: 'Clear my walkways',
    bullets: ['Steps and porches by hand', 'Public sidewalk included', 'Pairs with salting'],
    heroImageLabel: 'Crew member shoveling front steps and a walkway',
    problem:
      'Snowy steps and walkways are where most winter slips happen. Mail carriers, delivery drivers and guests all need a safe path, and many cities expect public sidewalks to be cleared soon after snow stops.',
    benefits: [
      { title: 'Fewer slips', body: 'Clear steps and walks for family and visitors.' },
      { title: 'Sidewalk handled', body: 'We clear the public sidewalk in front of your home.' },
      { title: 'Ready to salt', body: 'Clearing first makes salt work better and last longer.' },
    ],
    included: [
      'Front walk and porch',
      'Steps cleared by hand',
      'Public sidewalk along your frontage',
      'Side or back paths if included',
    ],
    method:
      'Steps and porches are shoveled by hand. Longer paths and sidewalks get a walk-behind snow blower. We clear down to the surface wherever we can so ice has less to build on.',
    process: [
      { title: 'Sign up', body: 'Tell us the length of walkways and sidewalk.' },
      { title: 'Plan', body: 'We note steps, ramps and obstacles.' },
      { title: 'Clear', body: 'After each qualifying snowfall.' },
      { title: 'Treat', body: 'Salting or ice control if you’ve added it.' },
    ],
    priceFactors: ['Length of walkways and sidewalk', 'Number of steps', 'Trigger depth'],
    faqs: [
      {
        question: 'Do you clear corner-lot sidewalks?',
        answer: 'Yes, both sides. Include the full length when you sign up.',
      },
      {
        question: 'Can you clear a back path to the alley?',
        answer: 'Yes. Add it to the walkway length.',
      },
      {
        question: 'Do you clear ramps?',
        answer: 'Yes, by hand, with extra care on wood and composite.',
      },
      {
        question: 'Will salt damage my steps?',
        answer:
          'Some salts can harm new concrete and plants. Ask us about gentler ice melt options.',
      },
      {
        question: 'Is the driveway included?',
        answer: 'Add driveway clearing, or choose the full snow removal contract.',
      },
    ],
    related: ['driveway-snow-clearing', 'salting-de-icing', 'ice-control'],
    questions: [walkway],
  },
  {
    slug: 'salting-de-icing',
    title: 'Salting & De-Icing',
    category: 'winter-services',
    icon: 'thermometer-snow',
    quoteMode: 'addon',
    parent: 'snow-removal',
    seasons: ['winter'],
    bookingWindowNote: 'Added to a snow contract.',
    headline: 'Treated surfaces after every clear',
    promise: 'Ice melt applied after snow clearing to keep paths safe.',
    summary: 'Salt or ice melt applied after each snow visit, per application or for the season.',
    outcomeLabel: 'Add salting',
    bullets: [
      'Applied after each visit',
      'Per application or seasonal',
      'Gentler options available',
    ],
    heroImageLabel: 'Ice melt being spread on a cleared walkway',
    problem:
      'Even after clearing, a thin layer of snow and meltwater can freeze into ice overnight. Steps and shady walkways are the worst.',
    benefits: [
      { title: 'Safer surfaces', body: 'Ice melt stops freshly cleared paths from refreezing.' },
      { title: 'Right amount', body: 'Spread evenly with a spreader, not dumped in piles.' },
      {
        title: 'Gentler options',
        body: 'Choose products that are kinder to concrete, plants and paws.',
      },
    ],
    included: [
      'Application right after clearing',
      'Steps, walkways and driveway apron',
      'Choice of standard or gentler ice melt',
    ],
    method:
      'We spread ice melt with a hand spreader so it lands evenly. Steps and shady spots get a little extra. We choose the product for the temperature, since some only work above certain temperatures.',
    process: [
      { title: 'Add to contract', body: 'Choose per application or seasonal.' },
      { title: 'Choose the product', body: 'Standard or a gentler blend.' },
      { title: 'Apply', body: 'After every snow clearing visit.' },
      { title: 'Recheck', body: 'Extra applications during freezing rain if you choose.' },
    ],
    priceFactors: ['Area treated', 'Per application or seasonal', 'Type of ice melt'],
    faqs: [
      {
        question: 'Is this different from ice control?',
        answer:
          'Yes. Salting treats surfaces after snowfall. Ice control is preventive: pre-treating before storms and checking for ice.',
      },
      {
        question: 'Will salt hurt my concrete?',
        answer:
          'Rock salt can damage new or weak concrete over time. Gentler blends are available.',
      },
      {
        question: 'Is it pet-safe?',
        answer: 'We offer blends that are gentler on paws. Wipe pets’ feet after walks either way.',
      },
      {
        question: 'Can I get salting without snow clearing?',
        answer: 'It works best after clearing, so we add it to a snow contract.',
      },
      {
        question: 'Do you treat during freezing rain?',
        answer: 'Ask about ice control, which includes visits for icy conditions.',
      },
    ],
    related: ['ice-control', 'walkway-sidewalk-snow-clearing', 'snow-removal'],
  },
  {
    slug: 'ice-control',
    title: 'Ice Control',
    category: 'winter-services',
    icon: 'shield',
    quoteMode: 'addon',
    parent: 'snow-removal',
    seasons: ['winter'],
    bookingWindowNote: 'Added to a snow contract.',
    headline: 'Stop ice before it forms',
    promise: 'Pre-treatment before storms and checks for icy conditions.',
    summary:
      'Preventive ice control: anti-icing before storms plus visits for freezing rain and refreeze.',
    outcomeLabel: 'Add ice control',
    bullets: ['Pre-treat before storms', 'Freezing rain visits', 'Pairs with salting'],
    heroImageLabel: 'Liquid anti-icing being sprayed on a walkway before a storm',
    problem:
      'Freezing rain and melt-and-refreeze days create ice without any new snow. That’s when walkways are most dangerous, and when a regular snow route doesn’t come.',
    benefits: [
      {
        title: 'Prevention first',
        body: 'Anti-icing before a storm stops ice bonding to the surface.',
      },
      { title: 'Covers freezing rain', body: 'Visits for ice events, not just snow.' },
      {
        title: 'Less product overall',
        body: 'Pre-treating often needs less salt than melting ice later.',
      },
    ],
    included: [
      'Pre-treatment before forecast storms',
      'Visits for freezing rain and refreeze',
      'Spot treatment of steps and shady areas',
    ],
    method:
      'Before a forecast storm, we spray a liquid anti-icer on walkways and steps so snow and ice can’t bond. During freezing rain or refreeze days, we visit to treat icy spots.',
    process: [
      { title: 'Add to contract', body: 'Choose ice control with your snow plan.' },
      { title: 'Watch the forecast', body: 'We plan pre-treatment for storms.' },
      { title: 'Pre-treat', body: 'Liquid anti-icer before snow or ice.' },
      { title: 'Respond', body: 'Visits for ice events through the season.' },
    ],
    priceFactors: ['Area treated', 'Number of ice visits included', 'Product choice'],
    faqs: [
      {
        question: 'How is this different from salting?',
        answer:
          'Salting treats after snowfall. Ice control prevents ice and covers ice events with no snow.',
      },
      {
        question: 'Does pre-treatment work every time?',
        answer:
          'It helps a lot, but very cold temperatures and heavy freezing rain still need follow-up treatment.',
      },
      {
        question: 'Is it safe for plants?',
        answer: 'We keep spray to the walkway and can use gentler products near beds.',
      },
      {
        question: 'Who decides when to visit?',
        answer: 'We watch forecasts and conditions. You can also call us about icy spots.',
      },
      {
        question: 'Is it good for businesses?',
        answer: 'Yes, especially entrances and parking areas. See commercial snow clearing.',
      },
    ],
    related: ['salting-de-icing', 'snow-removal', 'commercial-snow-clearing'],
  },
  {
    slug: 'snowbank-removal',
    title: 'Snowbank Removal',
    category: 'winter-services',
    icon: 'mountain',
    quoteMode: 'custom',
    seasons: ['winter'],
    headline: 'When there’s nowhere left to put the snow',
    promise: 'Snowbanks cut back or hauled away to restore space and sight lines.',
    summary: 'Snowbank cutting and hauling when piles block driveways, sight lines or parking.',
    outcomeLabel: 'Get a snowbank quote',
    bullets: ['Restores sight lines', 'Frees up parking', 'Quoted from photos'],
    heroImageLabel: 'Loader moving a large snowbank at the end of a driveway',
    problem:
      'After a few storms, banks get so tall that they block the view of the street, narrow the driveway and leave nowhere to put the next snowfall.',
    benefits: [
      { title: 'Safer exits', body: 'Lower banks mean you can see traffic when backing out.' },
      { title: 'Room for more snow', body: 'Clearing banks makes space for the rest of winter.' },
      {
        title: 'Less meltwater',
        body: 'Fewer giant piles melting across your driveway in spring.',
      },
    ],
    included: [
      'Cutting back or moving banks',
      'Hauling away when needed',
      'Clearing around hydrants and mailboxes',
    ],
    method:
      'Depending on space, we push banks back with equipment or load and haul them away. We quote from photos so you know the cost up front.',
    process: [
      { title: 'Send photos', body: 'Show us the banks and where they are.' },
      { title: 'Get a quote', body: 'Cut back or haul away.' },
      { title: 'We clear', body: 'Banks lowered or removed.' },
      { title: 'Done', body: 'Sight lines and space restored.' },
    ],
    priceFactors: ['Volume of snow', 'Haul-away or move on site', 'Access for equipment'],
    faqs: [
      {
        question: 'Where does the snow go?',
        answer:
          'If there’s room, it’s moved on your property. Otherwise it’s hauled to a permitted site.',
      },
      {
        question: 'Is this included in a snow contract?',
        answer: 'It’s an add-on, because big banks only build up in heavy winters.',
      },
      {
        question: 'Can you clear around fire hydrants?',
        answer: 'Yes. It’s important for emergency access.',
      },
      {
        question: 'Do you need photos?',
        answer: 'Photos help us quote quickly and bring the right equipment.',
      },
      {
        question: 'Do you do this for businesses?',
        answer: 'Yes, for parking lots and HOA streets. Request a commercial bid.',
      },
    ],
    related: ['snow-removal', 'driveway-snow-clearing', 'commercial-snow-clearing'],
  },
  {
    slug: 'commercial-snow-clearing',
    title: 'Commercial Snow Clearing',
    category: 'winter-services',
    icon: 'cloud-snow',
    quoteMode: 'bid',
    seasons: ['winter'],
    bookingWindowNote: 'Commercial contracts are planned in early fall.',
    headline: 'Open for business after every storm',
    promise: 'Snow and ice management for lots, walkways and entrances.',
    summary:
      'Commercial snow plowing, walkway clearing and ice management for businesses, HOAs and property managers.',
    outcomeLabel: 'Request a snow bid',
    bullets: [
      'Lots, walkways and entrances',
      'Ice management plans',
      'Service logs for every visit',
    ],
    heroImageLabel: 'Plow clearing a retail parking lot at night',
    problem:
      'Customers, tenants and staff need safe access the moment you open. Snow and ice on lots and entrances bring slip risks, complaints and lost business.',
    benefits: [
      { title: 'Ready before you open', body: 'Service timed to your hours of operation.' },
      { title: 'Documented', body: 'Visit logs with times and treatments for your records.' },
      { title: 'One plan', body: 'Plowing, walkways, salting and banks under one contract.' },
    ],
    included: [
      'Parking lot plowing',
      'Walkway and entrance clearing',
      'Salting and ice management',
      'Visit logs with times and treatments',
      'Snow stacking or hauling plan',
    ],
    method:
      'We walk the site before winter and plan plow routes, snow storage areas and priority entrances. During storms we clear in order of priority and log each visit.',
    process: [
      { title: 'Request a bid', body: 'Share the lot size, walkways and hours.' },
      { title: 'Site walk', body: 'We map priorities and storage areas.' },
      { title: 'Contract', body: 'Seasonal or per-event pricing.' },
      { title: 'Service', body: 'Clearing and logs all winter.' },
    ],
    priceFactors: [
      'Lot and walkway size',
      'Hours of operation',
      'Trigger depth',
      'Salting and hauling needs',
    ],
    faqs: [
      {
        question: 'Do you provide service logs?',
        answer: 'Yes. Every visit is logged with times and treatments applied.',
      },
      {
        question: 'Can you serve multiple sites?',
        answer: 'Yes, under one contract and one point of contact.',
      },
      {
        question: 'What documents can you provide?',
        answer:
          'Tell us what your property needs when you request a bid, and we’ll confirm what we can include.',
      },
      {
        question: 'Seasonal or per-event pricing?',
        answer: 'Both are available. We’ll recommend one based on your site and budget.',
      },
      {
        question: 'Can you clear before we open?',
        answer: 'Yes. Service is scheduled around your hours of operation.',
      },
    ],
    related: ['ice-control', 'snowbank-removal', 'commercial-property-maintenance'],
  },
]
