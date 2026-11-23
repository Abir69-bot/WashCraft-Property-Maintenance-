import { describe, expect, it } from 'vitest'

import { SNOW_OVERRIDE_SCRIPT, snowOverride } from './snow-settings'

describe('snowOverride', () => {
  it('reads ?snow=on and ?snow=off', () => {
    expect(snowOverride('?snow=on')).toBe(true)
    expect(snowOverride('?utm_source=x&snow=off')).toBe(false)
  })

  it('leaves the season in charge otherwise', () => {
    expect(snowOverride('')).toBeNull()
    expect(snowOverride('?snow=yes')).toBeNull()
    expect(snowOverride('?nosnow=on')).toBeNull()
  })
})

describe('SNOW_OVERRIDE_SCRIPT', () => {
  it('is valid JavaScript', () => {
    expect(() => new Function(SNOW_OVERRIDE_SCRIPT)).not.toThrow()
  })
})
