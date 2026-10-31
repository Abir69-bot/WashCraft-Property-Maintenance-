import { describe, expect, it } from 'vitest'

import { checkSiteConfig } from '@/config/check-site'
import type { SiteSetting } from '@/payload-types'

import { toSiteConfig } from './site-settings'

const saved: SiteSetting = {
  id: 1,
  name: 'WashCraft Property Maintenance',
  shortName: 'WashCraft',
  tagline: 'Exterior care, year-round',
  phone: '(416) 555-0142',
  email: 'hello@example.com',
  address: '',
  hours: 'Mon–Sat 7am–6pm',
  region: 'the Toronto area',
  country: 'CA',
  currency: 'CAD',
  locale: 'en-CA',
  freeQuotes: true,
  social: { instagram: 'https://instagram.com/washcraft', facebook: '' },
  stats: { rating: 4.9, reviewCount: 120 },
  demo: [],
  updatedAt: '2026-10-21T00:00:00.000Z',
}

describe('toSiteConfig', () => {
  it('maps saved settings to the SiteConfig shape', () => {
    const config = toSiteConfig(saved, ['Scarborough', 'Markham'])
    expect(config).toMatchObject({
      tagline: 'Exterior care, year-round',
      address: null,
      serviceAreas: ['Scarborough', 'Markham'],
      freeQuotes: true,
      social: { instagram: 'https://instagram.com/washcraft', facebook: null, tiktok: null },
      stats: { rating: 4.9, reviewCount: 120, jobsCompleted: null },
      insuranceCoverage: null,
    })
    expect(checkSiteConfig(config)).toEqual([])
  })

  it('turns a cleared field back into a placeholder', () => {
    const config = toSiteConfig({ ...saved, phone: ' ', email: '' }, ['Scarborough'])
    expect(config.phone).toBe('[PHONE]')
    expect(config.email).toBe('[EMAIL]')
    // Only the email blocks launch; without a phone the call links simply stay hidden.
    expect(checkSiteConfig(config).map((problem) => problem.field)).toEqual(['email'])
  })

  it('treats free quotes as unconfirmed until the box is ticked', () => {
    expect(toSiteConfig({ ...saved, freeQuotes: null }, ['Scarborough']).freeQuotes).toBe(false)
  })

  it('flags a missing city list and remaining demo values', () => {
    const config = toSiteConfig({ ...saved, demo: ['phone'] }, [])
    expect(checkSiteConfig(config).map((problem) => problem.field)).toEqual([
      'serviceAreas',
      'phone',
    ])
  })
})
