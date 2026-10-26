import { HOME_SECTIONS } from '@/globals/settings'
import { routes } from '@/lib/routes'

const range = (startMonth: number, startDay: number, endMonth: number, endDay: number) => ({
  startMonth: String(startMonth),
  startDay,
  endMonth: String(endMonth),
  endDay,
})

/** Defaults from brief §7: winter Nov–Mar, holiday Oct–Jan. */
export const seasonalSettings = {
  seasons: {
    spring: range(3, 1, 5, 31),
    summer: range(6, 1, 8, 31),
    fall: range(9, 1, 11, 30),
    winter: range(11, 1, 3, 31),
    holiday: range(10, 1, 1, 31),
  },
  heroOverride: 'auto',
  snowTriggers: ['2 cm', '5 cm', '8 cm'],
  announcements: [
    {
      season: 'winter',
      message: 'Snow contracts for this winter are open. Routes are limited, so sign up early.',
      linkLabel: 'Get on a route',
      linkHref: routes.quoteSnowContract,
      active: true,
    },
    {
      season: 'holiday',
      message: 'Holiday light install dates are booking now.',
      linkLabel: 'Book your lights',
      linkHref: routes.quoteHolidayLights,
      active: true,
    },
    {
      season: 'spring',
      message: 'Spring cleaning season: house washing, windows and gutters.',
      linkLabel: 'Get instant price',
      linkHref: routes.quoteInstant,
      active: true,
    },
    {
      season: 'summer',
      message: 'Summer is staining and sealing season. Book while the weather is dry.',
      linkLabel: 'Get instant price',
      linkHref: routes.quoteInstant,
      active: true,
    },
    {
      season: 'fall',
      message: 'Book fall gutter cleaning and leaf removal before the first snow.',
      linkLabel: 'Get instant price',
      linkHref: routes.quoteInstant,
      active: true,
    },
  ],
} as const

export const navigation = {
  headerCta: { label: 'Get instant price', href: routes.quoteInstant },
  companyLinks: [
    { label: 'About us', href: routes.about },
    { label: 'Our team', href: `${routes.about}#team` },
    { label: 'Reviews', href: routes.reviews },
    { label: 'Before & after', href: routes.beforeAndAfter },
    { label: 'Careers', href: routes.careers },
    { label: 'Blog', href: routes.blog },
    { label: 'FAQ', href: routes.faq },
  ],
  commercialLinks: [
    { label: 'HOA & condo services', href: routes.hoa },
    { label: 'Request a commercial bid', href: routes.quoteCommercial },
  ],
  featuredCard: { automatic: true },
}

export const footer = {
  blurb:
    'WashCraft keeps {region} homes and businesses clean, safe and looking their best in every season: exterior and interior cleaning, snow and ice, holiday lighting and yard care.',
  servicesPerCategory: 5,
  callBand: {
    heading: 'Let’s talk about your property',
    text: 'Call or text for a quick answer, or get an instant price online.',
    marquee: [
      'House washing',
      'Gutter cleaning',
      'Window cleaning',
      'Snow removal',
      'Holiday lights',
      'Yard cleanups',
      'Commercial & HOA',
    ].map((text) => ({ text })),
  },
  legalLinks: [
    { label: 'Privacy', href: routes.privacy },
    { label: 'Terms', href: routes.terms },
    { label: 'Accessibility', href: routes.accessibility },
  ],
}

const instantCta = { label: 'Get instant price', href: routes.quoteInstant }

export const homepage = {
  sections: HOME_SECTIONS.map((section) => ({ section, enabled: true })),
  heroVariants: [
    {
      season: 'spring',
      eyebrow: 'Spring cleaning season',
      headline: 'Exterior cleaning and yard care in {region}',
      subline:
        'Wash off winter: house washing, windows, gutters and spring cleanups, with a price range online in minutes.',
      cta: instantCta,
      imageLabel: 'Freshly washed house with spring flowers in the beds',
    },
    {
      season: 'summer',
      eyebrow: 'Summer projects',
      headline: 'Deck, fence and driveway care in {region}',
      subline: 'Cleaning, staining and sealing while the weather is warm and dry.',
      cta: instantCta,
      imageLabel: 'Freshly stained deck on a sunny afternoon',
    },
    {
      season: 'fall',
      eyebrow: 'Get ready for winter',
      headline: 'Gutters, leaves and driveways handled in {region}',
      subline: 'Gutter cleaning, leaf removal and driveway sealing before the first snow.',
      cta: instantCta,
      imageLabel: 'Technician cleaning gutters with fall leaves on the lawn',
    },
    {
      season: 'winter',
      eyebrow: 'Snow contracts open',
      headline: 'Snow and ice handled all winter in {region}',
      subline: 'Seasonal snow contracts for driveways and walkways, with salting and ice control.',
      cta: { label: 'Get on a snow route', href: routes.quoteSnowContract },
      imageLabel: 'Cleared driveway and walkway at dawn after a snowfall',
    },
    {
      season: 'holiday',
      eyebrow: 'Holiday lighting',
      headline: 'Holiday lights in {region}, hung for you',
      subline: 'Design, installation, January removal and storage. Use your lights or ours.',
      cta: { label: 'Book your lights', href: routes.quoteHolidayLights },
      imageLabel: 'Home at dusk with warm white roofline lights',
    },
    {
      season: 'all-year',
      eyebrow: 'Property maintenance',
      headline: 'Property maintenance in {region}, every season',
      subline:
        'Exterior and interior cleaning, snow and ice, holiday lighting and yard care from one local team.',
      cta: instantCta,
      imageLabel: 'Crew soft-washing a two-story house',
    },
  ],
  howItWorks: [
    {
      title: 'Get a quote',
      body: 'Answer a few questions for an instant price range, or send photos for a custom quote.',
    },
    {
      title: 'Pick a date',
      body: 'Choose a time that suits you. We confirm the price before any work starts.',
    },
    {
      title: 'Relax',
      body: 'We do the work, tidy up and send photos when we’re done.',
    },
  ],
  recurringUpsell: 'Want it handled every season? Put it on a maintenance plan.',
  whyChooseUs: [
    {
      title: 'Reliable',
      body: 'We confirm your date, show up when we say and keep you posted by text.',
      imageLabel: 'Crew arriving at a home in a branded truck',
    },
    {
      title: 'Safety-trained crews',
      body: 'Ladder, roof and equipment safety are part of every job, for our crew and your home.',
      imageLabel: 'Technician in safety harness on a roof',
    },
    {
      title: 'Careful with products',
      body: 'We choose cleaners for each surface, dilute them properly and protect your plants.',
      imageLabel: 'Technician soaking plants before washing',
    },
    {
      title: 'Damage-free methods',
      body: 'Soft washing for siding and roofs, controlled pressure for concrete. The right method every time.',
      imageLabel: 'Close-up of a soft-wash nozzle on siding',
    },
    {
      title: 'Locally owned',
      body: 'We live and work in {region}, and we’re here all year, not just one season.',
      imageLabel: 'Owner shaking hands with a customer at the front door',
    },
    {
      title: 'Clear pricing',
      body: 'See a price range online in minutes and get the final price before we start.',
      imageLabel: 'Customer checking a price on a phone',
    },
  ],
  comparison: {
    usLabel: 'WashCraft',
    independentLabel: 'Typical independent operator',
    largeLabel: 'Typical large company',
    rows: [
      {
        criterion: 'Price range online in minutes',
        us: 'Yes, for most home services',
        independent: 'Rarely',
        large: 'Sometimes',
      },
      {
        criterion: 'Services in every season',
        us: 'Cleaning, snow, lights and yard',
        independent: 'Usually one service',
        large: 'Often through subcontractors',
      },
      {
        criterion: 'Method matched to each surface',
        us: 'Soft wash or pressure, by surface',
        independent: 'Varies',
        large: 'Varies by crew',
      },
      {
        criterion: 'Call or text a real person',
        us: 'Yes',
        independent: 'Yes, when they can answer',
        large: 'Usually a call center',
      },
      {
        criterion: 'Bundles and recurring plans',
        us: 'Yes',
        independent: 'Sometimes',
        large: 'Yes',
      },
    ],
  },
}

export const pricingSettings = {
  rangeLow: 0.9,
  rangeHigh: 1.15,
  taxNote: 'Prices are estimates before any sales tax that applies.',
  estimateNote:
    'Your estimate is confirmed after we see photos or visit. We agree the final price before any work starts.',
}

/** Commercial hub points and the HOA & condo page (brief §9.5). Services are slugs. */
export const commercialPages = {
  points: [
    {
      title: 'One point of contact',
      body: 'One manager for every service and every site, so you always know who to call.',
    },
    {
      title: 'Year-round contracts',
      body: 'Washing, windows and gutters in the warm months, snow and ice all winter, and lighting for the holidays, on one schedule.',
    },
    {
      title: 'Volume and multi-site pricing',
      body: 'Several buildings or properties can be priced together under one proposal.',
    },
    {
      title: 'Notices for residents and tenants',
      body: 'We give you notices to share before each visit and work around entrances, parking and business hours.',
    },
  ],
  hoa: {
    headline: 'Exterior care for HOA communities and condo buildings',
    intro:
      'Clean siding, clear gutters, safe walkways and bright windows across every building, planned around your residents. We put the scope, schedule and price in writing so your board can compare and approve with confidence.',
    heroImageLabel: 'Crew washing the siding of a condo building while residents walk past',
    sections: [
      {
        title: 'Proposals your board can approve',
        body: 'After a site walk you get a written scope, a schedule and a price for each service. Ask us to split it by building or by season if that helps your budget.',
      },
      {
        title: 'Planned around residents',
        body: 'We plan work building by building, give you notices to share ahead of each visit and keep entrances, sidewalks and parking areas open where we can.',
      },
      {
        title: 'Every season on one calendar',
        body: 'Spring and fall washing and gutters, window cleaning, snow and ice clearing in winter and holiday lighting, all booked under one contract if you like.',
      },
      {
        title: 'Records after every visit',
        body: 'Photos and notes after each visit show what was done and flag anything that needs repair, ready for your next board meeting.',
      },
    ],
    services: [
      'hoa-building-washing',
      'commercial-gutter-cleaning',
      'commercial-window-cleaning',
      'commercial-roof-cleaning',
      'commercial-pressure-washing',
      'commercial-snow-clearing',
    ],
    faqs: [
      {
        question: 'How does the bidding process work?',
        answer:
          'Request a bid and tell us about the community. We walk the site, then send a written scope, schedule and price that your board can review.',
      },
      {
        question: 'Can you work around residents?',
        answer:
          'Yes. We schedule building by building, give you notices to share ahead of time and agree on parking and access before work starts.',
      },
      {
        question: 'Can one contract cover the whole year?',
        answer:
          'Yes. Washing, gutters, windows, snow clearing and holiday lighting can all be combined under one contract and one schedule.',
      },
      {
        question: 'Do you work with property management companies?',
        answer:
          'Yes. We can work with your manager or directly with the board, whichever your community prefers.',
      },
    ],
  },
}
