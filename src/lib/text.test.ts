import { describe, expect, it } from 'vitest'

import { e164, fillTokens, smsHref, telHref } from './text'

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
  })

  it('returns null for placeholders and invalid numbers', () => {
    expect(telHref('[PHONE]')).toBeNull()
    expect(smsHref('555-0142')).toBeNull()
    expect(e164(null)).toBeNull()
  })
})
