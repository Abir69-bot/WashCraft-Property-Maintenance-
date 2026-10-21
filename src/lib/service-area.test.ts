import { describe, expect, it } from 'vitest'

import { matchCity, normalizeZip } from './service-area'

const cities = [
  { name: 'Denver', slug: 'denver', zipPrefixes: ['802'] },
  { name: 'Aurora', slug: 'aurora', zipPrefixes: ['80010', '80012'] },
  { name: 'Centennial', slug: 'centennial', zipPrefixes: ['80112', '80015'] },
]

describe('normalizeZip', () => {
  it('accepts 5-digit and ZIP+4 codes', () => {
    expect(normalizeZip('80202')).toBe('80202')
    expect(normalizeZip(' 80202-1234 ')).toBe('80202')
    expect(normalizeZip('802021234')).toBe('80202')
  })

  it('rejects anything else', () => {
    expect(normalizeZip('8020')).toBeNull()
    expect(normalizeZip('V6B 1A1')).toBeNull()
    expect(normalizeZip('')).toBeNull()
  })
})

describe('matchCity', () => {
  it('matches a 3-digit prefix', () => {
    expect(matchCity('80218', cities)?.slug).toBe('denver')
  })

  it('prefers the longest matching prefix', () => {
    expect(matchCity('80012', cities)?.slug).toBe('aurora')
  })

  it('returns null outside the service area or for bad input', () => {
    expect(matchCity('90210', cities)).toBeNull()
    expect(matchCity('hello', cities)).toBeNull()
  })

  it('ignores cities without ZIP codes', () => {
    expect(matchCity('80218', [{ name: 'X', slug: 'x', zipPrefixes: null }])).toBeNull()
  })
})
