import { describe, expect, it } from 'vitest'

import { checkIntegrations, checkSiteConfig } from './check-site'
import { isPlaceholder, site, type SiteConfig } from './site'

const complete: SiteConfig = {
  ...site,
  tagline: 'Exterior, interior and seasonal care for your property',
  phone: '(303) 555-0142',
  email: 'hello@example.com',
  address: null,
  hours: 'Mon–Sat 8am–6pm',
  country: 'US',
  currency: 'USD',
  locale: 'en-US',
  region: 'Example Region',
  serviceAreas: ['Northtown', 'Southvale'],
  demo: [],
}

const fields = (config: SiteConfig) => checkSiteConfig(config).map((problem) => problem.field)

describe('isPlaceholder', () => {
  it('detects bracketed values only', () => {
    expect(isPlaceholder('[PHONE]')).toBe(true)
    expect(isPlaceholder(' [e.g. Denver Metro] ')).toBe(true)
    expect(isPlaceholder('303 555 0142')).toBe(false)
    expect(isPlaceholder('[]')).toBe(false)
    expect(isPlaceholder(null)).toBe(false)
  })
})

describe('checkSiteConfig', () => {
  it('blocks the shipped demo config until the owner confirms it', () => {
    expect(fields(site)).toEqual(site.demo)
    expect(site.demo.length).toBeGreaterThan(0)
  })

  it('flags unset placeholders', () => {
    const config: SiteConfig = {
      ...complete,
      phone: '[PHONE]',
      serviceAreas: ['Northtown', '[CITY 2]'],
    }
    expect(fields(config)).toEqual(['phone', 'serviceAreas[1]'])
  })

  it('flags fields still marked as demo', () => {
    expect(fields({ ...complete, demo: ['phone', 'serviceAreas'] })).toEqual([
      'phone',
      'serviceAreas',
    ])
  })

  it('passes a complete config', () => {
    expect(checkSiteConfig(complete)).toEqual([])
  })

  it('accepts a real address', () => {
    expect(fields({ ...complete, address: '1 Main St, Northtown, CO 80000' })).toEqual([])
  })

  it('requires at least one service area', () => {
    expect(fields({ ...complete, serviceAreas: [] })).toEqual(['serviceAreas'])
  })

  it('validates phone and email formats', () => {
    expect(fields({ ...complete, phone: '555-0142', email: 'not-an-email' })).toEqual([
      'phone',
      'email',
    ])
  })

  it('keeps currency and locale consistent with the country', () => {
    expect(fields({ ...complete, country: 'CA' })).toEqual(['currency', 'locale'])
  })

  it('requires https URLs for review and social links', () => {
    const config: SiteConfig = {
      ...complete,
      googleReviewUrl: 'http://g.page/x',
      social: { ...complete.social, instagram: 'instagram.com/x' },
    }
    expect(fields(config)).toEqual(['googleReviewUrl', 'social.instagram'])
  })

  it('rejects impossible stats and founding years', () => {
    const config: SiteConfig = {
      ...complete,
      foundedYear: 1850,
      stats: { ...complete.stats, rating: 6, reviewCount: 2.5 },
    }
    expect(fields(config)).toEqual(['stats.rating', 'stats.reviewCount', 'foundedYear'])
  })
})

describe('checkIntegrations', () => {
  const r2 = {
    R2_ENDPOINT: 'https://account.r2.cloudflarestorage.com',
    R2_ACCESS_KEY_ID: 'id',
    R2_SECRET_ACCESS_KEY: 'secret',
    R2_PRIVATE_BUCKET: 'private',
    R2_PUBLIC_BUCKET: 'public',
    R2_PUBLIC_URL: 'https://media.example.com',
  }

  it('requires storage and email for production', () => {
    const { required, recommended } = checkIntegrations({})
    expect(required.map((problem) => problem.field)).toEqual([
      'R2 private bucket',
      'R2 public bucket',
      'Resend email',
    ])
    expect(recommended.map((problem) => problem.field)).toEqual(['Turnstile', 'Twilio'])
  })

  it('passes once everything is set', () => {
    const result = checkIntegrations({
      ...r2,
      RESEND_API_KEY: 're_x',
      EMAIL_FROM: 'WashCraft <q@example.com>',
      TURNSTILE_SECRET_KEY: 's',
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: 'k',
      TWILIO_ACCOUNT_SID: 'AC',
      TWILIO_AUTH_TOKEN: 't',
      TWILIO_FROM: '+17205550100',
    })
    expect(result).toEqual({ required: [], recommended: [] })
  })

  it('treats blank values as missing', () => {
    expect(checkIntegrations({ ...r2, R2_PRIVATE_BUCKET: ' ' }).required[0].field).toBe(
      'R2 private bucket',
    )
  })
})
