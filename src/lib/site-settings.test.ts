import { describe, expect, it } from 'vitest'

import { checkSiteConfig } from '@/config/check-site'
import type { SiteSetting } from '@/payload-types'

import { toSiteConfig } from './site-settings'

const saved: SiteSetting = {
  id: 1,
  name: 'WashCraft Property Maintenance',
  shortName: 'WashCraft',
  tagline: 'Exterior care, year-round',
  phone: '(303) 555-0142',
  email: 'hello@example.com',
  address: '',
  hours: 'Mon–Sat 7am–6pm',
  region: 'Denver Metro',
  country: 'US',
  currency: 'USD',
  locale: 'en-US',
  social: { instagram: 'https://instagram.com/washcraft', facebook: '' },
  stats: { rating: 4.9, reviewCount: 120 },
  demo: [],
  updatedAt: '2026-10-21T00:00:00.000Z',
}

describe('toSiteConfig', () => {
  it('maps saved settings to the SiteConfig shape', () => {
    const config = toSiteConfig(saved, ['Denver', 'Aurora'])
    expect(config).toMatchObject({
      tagline: 'Exterior care, year-round',
      address: null,
      serviceAreas: ['Denver', 'Aurora'],
      social: { instagram: 'https://instagram.com/washcraft', facebook: null, tiktok: null },
      stats: { rating: 4.9, reviewCount: 120, jobsCompleted: null },
      insuranceCoverage: null,
    })
    expect(checkSiteConfig(config)).toEqual([])
  })

  it('turns a cleared required field back into a placeholder', () => {
    const config = toSiteConfig({ ...saved, phone: ' ' }, ['Denver'])
    expect(config.phone).toBe('[PHONE]')
    expect(checkSiteConfig(config).map((problem) => problem.field)).toEqual(['phone'])
  })

  it('flags a missing city list and remaining demo values', () => {
    const config = toSiteConfig({ ...saved, demo: ['phone'] }, [])
    expect(checkSiteConfig(config).map((problem) => problem.field)).toEqual([
      'serviceAreas',
      'phone',
    ])
  })
})
