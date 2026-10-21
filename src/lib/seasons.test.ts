import { describe, expect, it } from 'vitest'

import { activeSeasons, currentSeason, inSeasonNow, isInRange, isInSeason } from './seasons'

const on = (iso: string) => new Date(`${iso}T12:00:00Z`)

describe('isInRange', () => {
  it('handles ranges inside one year', () => {
    const summer = { startMonth: 6, startDay: 1, endMonth: 8, endDay: 31 }
    expect(isInRange(on('2026-06-01'), summer)).toBe(true)
    expect(isInRange(on('2026-08-31'), summer)).toBe(true)
    expect(isInRange(on('2026-09-01'), summer)).toBe(false)
  })

  it('handles ranges that wrap the new year', () => {
    const winter = { startMonth: '11', startDay: 1, endMonth: '3', endDay: 31 }
    expect(isInRange(on('2026-12-25'), winter)).toBe(true)
    expect(isInRange(on('2027-02-10'), winter)).toBe(true)
    expect(isInRange(on('2026-04-01'), winter)).toBe(false)
  })
})

describe('currentSeason', () => {
  it.each([
    ['2026-03-15', 'spring'], // winter is still on, but spring began more recently
    ['2026-07-04', 'summer'],
    ['2026-09-20', 'fall'],
    ['2026-10-10', 'holiday'], // book lights in October
    ['2026-11-15', 'winter'], // snow contracts from November
    ['2026-12-20', 'winter'],
    ['2027-01-15', 'winter'],
  ])('%s → %s', (date, season) => {
    expect(currentSeason(on(date))).toBe(season)
  })

  it('respects an admin override', () => {
    expect(currentSeason(on('2026-07-04'), undefined, 'holiday')).toBe('holiday')
    expect(currentSeason(on('2026-07-04'), undefined, 'auto')).toBe('summer')
  })

  it('lists every active season, newest first', () => {
    expect(activeSeasons(on('2026-11-15'))).toEqual(['winter', 'holiday', 'fall'])
  })
})

describe('in-season services', () => {
  const services = [
    { slug: 'house-washing', seasons: ['all-year'] },
    { slug: 'snow-removal', seasons: ['winter'] },
    { slug: 'leaf-removal', seasons: ['fall'] },
  ]

  it('treats all-year services as always bookable', () => {
    expect(isInSeason(['all-year'], ['summer'])).toBe(true)
    expect(isInSeason(['winter'], ['summer'])).toBe(false)
  })

  it('spotlights only seasonal services that are in season', () => {
    expect(inSeasonNow(services, activeSeasons(on('2026-11-15'))).map((s) => s.slug)).toEqual([
      'snow-removal',
      'leaf-removal',
    ])
  })

  it('puts the current season first', () => {
    const october = activeSeasons(on('2026-10-10')) // holiday, then fall
    const lights = { slug: 'christmas-light-installation', seasons: ['holiday'] }
    expect(inSeasonNow([...services, lights], october).map((s) => s.slug)).toEqual([
      'christmas-light-installation',
      'leaf-removal',
    ])
  })
})
