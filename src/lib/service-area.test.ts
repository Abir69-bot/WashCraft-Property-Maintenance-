import { describe, expect, it } from 'vitest'

import { matchCity, normalizePostalCode } from './service-area'

const cities = [
  { name: 'Scarborough', slug: 'scarborough', zipPrefixes: ['M1B', 'M1C'] },
  { name: 'North York', slug: 'north-york', zipPrefixes: ['M2N', 'm3a '] },
  { name: 'Mississauga', slug: 'mississauga', zipPrefixes: ['L5'] },
  { name: 'Port Credit', slug: 'port-credit', zipPrefixes: ['L5G'] },
  { name: 'Denver', slug: 'denver', zipPrefixes: ['802'] },
]

describe('normalizePostalCode', () => {
  it('formats Canadian postal codes however they are typed', () => {
    expect(normalizePostalCode('M1B 2K3')).toBe('M1B 2K3')
    expect(normalizePostalCode(' m1b2k3 ')).toBe('M1B 2K3')
    expect(normalizePostalCode('l5g-4l1')).toBe('L5G 4L1')
  })

  it('accepts 5-digit and ZIP+4 codes', () => {
    expect(normalizePostalCode('80202')).toBe('80202')
    expect(normalizePostalCode(' 80202-1234 ')).toBe('80202')
    expect(normalizePostalCode('802021234')).toBe('80202')
  })

  it('rejects anything else', () => {
    expect(normalizePostalCode('8020')).toBeNull()
    expect(normalizePostalCode('M1B')).toBeNull()
    // No Canadian postal code starts with D, F, I, O, Q, U, W or Z.
    expect(normalizePostalCode('D1B 2K3')).toBeNull()
    expect(normalizePostalCode('')).toBeNull()
  })
})

describe('matchCity', () => {
  it('matches the first three characters of a postal code', () => {
    expect(matchCity('M1B 2K3', cities)?.slug).toBe('scarborough')
    expect(matchCity('m3a1a1', cities)?.slug).toBe('north-york')
  })

  it('prefers the longest matching prefix', () => {
    expect(matchCity('L5G 4L1', cities)?.slug).toBe('port-credit')
    expect(matchCity('L5B 1M2', cities)?.slug).toBe('mississauga')
  })

  it('still matches US ZIP codes', () => {
    expect(matchCity('80218', cities)?.slug).toBe('denver')
  })

  it('returns null outside the service area or for bad input', () => {
    expect(matchCity('K1A 0B1', cities)).toBeNull()
    expect(matchCity('hello', cities)).toBeNull()
  })

  it('ignores cities without postal codes', () => {
    expect(matchCity('M1B 2K3', [{ name: 'X', slug: 'x', zipPrefixes: null }])).toBeNull()
  })
})
