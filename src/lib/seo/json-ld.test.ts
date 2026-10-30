import { describe, expect, it } from 'vitest'

import { site } from '@/config/site'

import {
  articleLd,
  businessId,
  faqPage,
  localBusiness,
  parseHours,
  postalAddress,
  serviceLd,
} from './json-ld'

const origin = 'https://washcraft.example'
const places = [
  { name: 'Scarborough', state: 'ON' },
  { name: 'Markham', state: 'ON' },
]

describe('parseHours', () => {
  it('reads a day range and times', () => {
    expect(parseHours('Mon–Sat 7am–6pm')).toEqual([
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '07:00',
        closes: '18:00',
      },
    ])
  })

  it('reads several parts, single days and minutes', () => {
    expect(parseHours('Mon-Fri 8:30am - 5:30pm, Saturday 9am–12pm')).toEqual([
      expect.objectContaining({ opens: '08:30', closes: '17:30' }),
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '09:00',
        closes: '12:00',
      },
    ])
  })

  it('leaves out hours it cannot read exactly', () => {
    expect(parseHours('By appointment')).toBeNull()
    expect(parseHours('Mon–Sat 7am–6pm, holidays closed')).toBeNull()
    expect(parseHours('Sat–Mon 7am–6pm')).toBeNull()
    expect(parseHours('[HOURS]')).toBeNull()
  })
})

describe('postalAddress', () => {
  it('splits a full US address', () => {
    expect(postalAddress('123 Main St, Denver, CO 80202', places, 'US')).toEqual({
      '@type': 'PostalAddress',
      streetAddress: '123 Main St',
      addressLocality: 'Denver',
      addressRegion: 'CO',
      postalCode: '80202',
      addressCountry: 'US',
    })
  })

  it('splits a full Canadian address', () => {
    expect(postalAddress('12 Kingston Rd, Toronto, ON M1N 1T5', [], 'CA')).toEqual({
      '@type': 'PostalAddress',
      streetAddress: '12 Kingston Rd',
      addressLocality: 'Toronto',
      addressRegion: 'ON',
      postalCode: 'M1N 1T5',
      addressCountry: 'CA',
    })
  })

  it('gives only the province and country for an Ontario service-area business', () => {
    const ontario = [
      { name: 'Scarborough', state: 'ON' },
      { name: 'Mississauga', state: 'ON' },
    ]
    expect(postalAddress(null, ontario, 'CA')).toEqual({
      '@type': 'PostalAddress',
      addressRegion: 'ON',
      addressCountry: 'CA',
    })
  })

  it('gives only the state and country for a service-area business', () => {
    expect(postalAddress(null, places, 'CA')).toEqual({
      '@type': 'PostalAddress',
      addressRegion: 'ON',
      addressCountry: 'CA',
    })
    expect(
      postalAddress(null, [...places, { name: 'Gatineau', state: 'QC' }], 'CA'),
    ).toBeUndefined()
  })
})

describe('localBusiness', () => {
  it('uses only facts from settings', () => {
    const business = localBusiness({
      site: { ...site, phone: '(416) 555-0142' },
      origin,
      places,
      logo: '/logo.png',
      image: '/og.png',
    })
    expect(business).toMatchObject({
      '@type': 'HomeAndConstructionBusiness',
      '@id': businessId(origin),
      name: site.name,
      url: `${origin}/`,
      logo: `${origin}/logo.png`,
      telephone: '+14165550142',
      address: { addressRegion: 'ON' },
    })
    expect(business).not.toHaveProperty('sameAs')
    expect(business).not.toHaveProperty('aggregateRating')
  })

  it('skips placeholder values', () => {
    const business = localBusiness({
      site: { ...site, phone: '[PHONE]', email: '[EMAIL]', tagline: '[TAGLINE]' },
      origin,
      places,
      logo: '/logo.png',
      image: '/og.png',
    })
    // What the page renders: unset values disappear from the JSON.
    const rendered = JSON.parse(JSON.stringify(business))
    expect(rendered).not.toHaveProperty('telephone')
    expect(rendered).not.toHaveProperty('email')
    expect(rendered).not.toHaveProperty('description')
  })
})

describe('page items', () => {
  it('lists a category’s services as an offer catalog without prices', () => {
    const service = serviceLd({
      name: 'Exterior Cleaning',
      description: 'Washing for every outside surface.',
      path: '/exterior-cleaning',
      origin,
      places,
      catalog: [{ title: 'Gutter Cleaning', path: '/services/gutter-cleaning', description: 'x' }],
    })
    expect(service).toMatchObject({
      '@type': 'Service',
      provider: { '@id': businessId(origin) },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: { name: 'Gutter Cleaning', url: `${origin}/services/gutter-cleaning` },
          },
        ],
      },
    })
    expect(JSON.stringify(service)).not.toMatch(/price/i)
  })

  it('credits the business when an article has no public author', () => {
    const article = articleLd({
      headline: 'How often should gutters be cleaned?',
      description: 'Twice a year for most homes.',
      path: '/blog/gutters',
      origin,
      image: '/api/media/file/gutter.jpg',
      datePublished: '2026-09-15T15:00:00.000Z',
      author: null,
      site,
    })
    expect(article).toMatchObject({
      '@type': 'Article',
      image: [`${origin}/api/media/file/gutter.jpg`],
      author: { '@type': 'Organization', name: site.name },
      dateModified: '2026-09-15T15:00:00.000Z',
    })
  })

  it('builds FAQ questions and answers', () => {
    expect(faqPage([{ question: 'Q?', answer: 'A.' }]).mainEntity).toEqual([
      { '@type': 'Question', name: 'Q?', acceptedAnswer: { '@type': 'Answer', text: 'A.' } },
    ])
  })
})
