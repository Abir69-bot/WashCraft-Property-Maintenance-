import { describe, expect, it } from 'vitest'

import { directionsHref, e164, fillTokens, smsHref, telHref, toSlug } from './text'

describe('fillTokens', () => {
  it('fills known tokens', () => {
    expect(
      fillTokens('Gutters in {region}, {city} too', { region: 'Denver Metro', city: 'Aurora' }),
    ).toBe('Gutters in Denver Metro, Aurora too')
  })

  it('leaves tokens without a real value untouched', () => {
    expect(fillTokens('Serving {region} and {city}', { region: '[REGION]' })).toBe(
      'Serving {region} and {city}',
    )
  })
})

describe('phone links', () => {
  it('formats US numbers as E.164', () => {
    expect(e164('(720) 555-0142')).toBe('+17205550142')
    expect(e164('1-720-555-0142')).toBe('+17205550142')
    expect(telHref('720.555.0142')).toBe('tel:+17205550142')
    expect(smsHref('720 555 0142')).toBe('sms:+17205550142')
    expect(telHref('+1 (647) 451-0230')).toBe('tel:+16474510230')
  })

  it('returns null for placeholders and invalid numbers', () => {
    expect(telHref('[PHONE]')).toBeNull()
    expect(smsHref('555-0142')).toBeNull()
    expect(e164(null)).toBeNull()
  })
})

describe('directionsHref', () => {
  it('links to Google Maps directions to the address', () => {
    expect(directionsHref('43 Ridgemoor Ave, Scarborough, ON M1N 1M5')).toBe(
      'https://www.google.com/maps/dir/?api=1&destination=43%20Ridgemoor%20Ave%2C%20Scarborough%2C%20ON%20M1N%201M5',
    )
  })
})

describe('toSlug', () => {
  it('makes lowercase hyphenated slugs', () => {
    expect(toSlug('Castle Rock')).toBe('castle-rock')
    expect(toSlug('  Coeur d’Alene! ')).toBe('coeur-d-alene')
  })
})
