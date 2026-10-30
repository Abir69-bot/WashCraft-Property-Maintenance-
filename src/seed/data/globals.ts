import { HOME_SECTIONS } from '@/globals/settings'
import { quoteFormHref } from '@/lib/quote/flow'
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
  // Plain seasonal reminders; no claims about availability or how fast dates fill up.
  announcements: [
    {
      season: 'winter',
      message: 'Snow removal: send a quote request before the season starts.',
      linkLabel: 'Request a quote',
      linkHref: quoteFormHref('snow-removal'),
      active: true,
    },
    {
      season: 'holiday',
      message: 'Planning holiday lights this year? Ask us about Christmas light installation.',
      linkLabel: 'Request a quote',
      linkHref: quoteFormHref('christmas-light-installation'),
      active: true,
    },
    {
      season: 'spring',
      message: 'Spring exterior cleaning: windows, gutters, soft washing and more.',
      linkLabel: 'Request a quote',
      linkHref: routes.quote,
      active: true,
    },
    {
      season: 'summer',
      message: 'Patio, balcony and driveway care for the warmer months.',
      linkLabel: 'Request a quote',
      linkHref: routes.quote,
      active: true,
    },
    {
      season: 'fall',
      message: 'Fall gutter cleaning: send a quote request before the leaves pile up.',
      linkLabel: 'Request a quote',
      linkHref: quoteFormHref('gutter-cleaning'),
      active: true,
    },
  ],
} as const

export const navigation = {
  // No header button set: it follows the quote settings ("Request a Free Quote").
  companyLinks: [
    { label: 'Before & After', href: routes.beforeAndAfter },
    { label: 'About', href: routes.about },
    { label: 'FAQs', href: routes.faq },
    { label: 'Contact', href: routes.contact },
  ],
  featuredCard: {
    automatic: false,
    title: 'Not sure which service you need?',
    text: 'Send a quote request with a few photos and we’ll tell you what fits.',
    href: routes.quote,
  },
}

export const footer = {
  blurb:
    'WashCraft Property Maintenance offers interior, commercial, restaurant and post-construction cleaning, exterior cleaning, snow removal and holiday lighting for homes and businesses in {region}.',
  servicesPerCategory: 5,
  callBand: {
    heading: 'Let’s talk about your property',
    text: 'Send a quote request and we’ll get back to you with a written estimate.',
    // No scrolling marquee: it adds motion without adding information.
    marquee: [],
  },
  legalLinks: [
    { label: 'Privacy', href: routes.privacy },
    { label: 'Terms', href: routes.terms },
    { label: 'Accessibility', href: routes.accessibility },
  ],
}

const HERO = {
  headline: 'Year-Round Property Maintenance, Made Simple',
  subline:
    'From snow removal and seasonal lighting to interior cleaning, post-construction cleanup, commercial and restaurant cleaning, exterior cleaning, and property upkeep, WashCraft Property Maintenance helps Toronto-area customers keep their spaces clean, cared for, and ready for every season.',
  cta: { label: 'Request a Free Quote', href: routes.quote },
}

/** Home sections in page order. Switched-off and sample-only sections come last, disabled. */
const SHOWN = [
  'hero',
  'intro',
  'services',
  'why-choose-us',
  'trust-strip',
  'before-after',
  'testimonials',
  'commercial',
  'how-it-works',
  'service-areas',
  'guarantee',
  'need-us-now',
  'client-logos',
  'founder',
  'faq',
  'final-cta',
] as const

export const homepage = {
  sections: [
    ...SHOWN.map((section) => ({ section, enabled: true })),
    ...HOME_SECTIONS.filter((section) => !(SHOWN as readonly string[]).includes(section)).map(
      (section) => ({ section, enabled: false }),
    ),
  ],
  introduction: {
    title: 'Property care from one company, all year',
    body: 'WashCraft Property Maintenance looks after homes, rentals and businesses in {region}. We handle interior, commercial, restaurant and post-construction cleaning, exterior cleaning, snow removal and holiday lighting, so you can call one company as your property’s needs change through the year.\n\nEvery job starts with your request and ends with work you agreed to in writing. Your estimate sets out what’s included, what isn’t, the price and the conditions before anything is booked.',
  },
  // One headline all year (2026-10 brief); the eyebrow changes with the season.
  heroVariants: [
    {
      season: 'spring',
      eyebrow: 'Spring exterior cleaning',
      ...HERO,
      imageLabel: 'Freshly washed house with clean windows',
    },
    {
      season: 'summer',
      eyebrow: 'Patios, balconies and driveways',
      ...HERO,
      imageLabel: 'Clean patio on a sunny afternoon',
    },
    {
      season: 'fall',
      eyebrow: 'Gutters and fall cleanup',
      ...HERO,
      imageLabel: 'Clean gutters with fall leaves on the lawn',
    },
    {
      season: 'winter',
      eyebrow: 'Snow removal',
      ...HERO,
      imageLabel: 'Cleared driveway and walkway after a snowfall',
    },
    {
      season: 'holiday',
      eyebrow: 'Christmas light installation',
      ...HERO,
      imageLabel: 'Home at dusk with warm white roofline lights',
    },
    {
      season: 'all-year',
      eyebrow: 'Property maintenance in {region}',
      ...HERO,
      imageLabel: 'Clean, well-kept home exterior',
    },
  ],
  // The quote workflow (2026-10 brief §8). Information only: no payments or booking online.
  howItWorks: [
    {
      title: 'Send a request',
      body: 'Fill in the quote form, or call us if you prefer. A few photos help us understand the job.',
    },
    {
      title: 'We review the details',
      body: 'We look over your request and may ask for more photos or a few questions.',
    },
    {
      title: 'You get a written estimate',
      body: 'It sets out the scope, what’s not included, the price and the conditions.',
    },
    {
      title: 'Approve and schedule',
      body: 'Once you approve the estimate, we confirm a date that works for you.',
    },
    {
      title: 'After the job',
      body: 'You receive an invoice or receipt, and we may ask for an honest review.',
    },
  ],
  recurringUpsell: 'Want it handled every season? Put it on a maintenance plan.',
  whyChooseUs: [
    {
      title: 'Many services, one company',
      body: 'Interior, commercial and post-construction cleaning, exterior cleaning, snow removal and holiday lighting, without a different contractor for every job.',
    },
    {
      title: 'Care for every season',
      body: 'Your property’s needs change through the year. We cover cleaning in the warmer months, and snow and holiday lighting in winter.',
    },
    {
      title: 'Clear estimates and communication',
      body: 'Every quote is a written estimate with the scope, exclusions, price and conditions, so you know what to expect before anything is booked.',
    },
    {
      title: 'Local service coverage',
      body: 'We work in a set list of communities in {region}, so you can check right away whether we cover your property.',
    },
    {
      title: 'Respect for your property',
      body: 'We treat your home or business with care, follow your building’s rules and leave the site tidy.',
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
      title: 'One company for many jobs',
      body: 'Commercial, restaurant and post-construction cleaning, plus exterior and seasonal work, can be quoted together.',
    },
    {
      title: 'Everything in writing',
      body: 'Your estimate sets out the scope, exclusions, price and conditions before any work is booked.',
    },
    {
      title: 'Visits agreed in advance',
      body: 'We agree visit times with you so the work fits around your opening hours, tenants and deliveries.',
    },
    {
      title: 'Clear communication',
      body: 'Questions about your estimate or a visit go to the same people who prepared your quote.',
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
