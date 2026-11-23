import { describe, expect, it } from 'vitest'

import {
  INTRO_REPEAT_DAYS,
  INTRO_SCRIPT,
  INTRO_VERSION,
  introSeen,
  introWanted,
} from './intro-script'

const DAY = 86400000
const NOW = Date.UTC(2026, 10, 23, 12)
const page = (overrides: Partial<Parameters<typeof introWanted>[0]> = {}) => ({
  path: '/',
  search: '',
  referrer: '',
  seen: false,
  ...overrides,
})

describe('introSeen', () => {
  const seen = (record: unknown, now = NOW) =>
    introSeen(record, now, INTRO_VERSION, INTRO_REPEAT_DAYS)

  it('counts a visit from the last 30 days', () => {
    expect(seen({ v: INTRO_VERSION, at: NOW - 29 * DAY })).toBe(true)
  })

  it('greets the browser again after 30 days, or when the intro version changes', () => {
    expect(seen({ v: INTRO_VERSION, at: NOW - 30 * DAY })).toBe(false)
    expect(seen({ v: INTRO_VERSION + 1, at: NOW })).toBe(false)
  })

  it('ignores missing, malformed or future records', () => {
    for (const record of [null, undefined, 'x', 42, {}, { v: INTRO_VERSION, at: 'yesterday' }]) {
      expect(seen(record)).toBe(false)
    }
    expect(seen({ v: INTRO_VERSION, at: NOW + DAY })).toBe(false)
  })
})

describe('introWanted', () => {
  it('plays when a visit starts on the home page', () => {
    expect(introWanted(page())).toBe(true)
    expect(introWanted(page({ referrer: 'https://www.facebook.com/' }))).toBe(true)
  })

  it('never plays on other pages, or twice', () => {
    expect(introWanted(page({ path: '/services/gutter-cleaning' }))).toBe(false)
    expect(introWanted(page({ seen: true }))).toBe(false)
  })

  it('lets search, ad and tagged-link visitors straight in', () => {
    for (const referrer of [
      'https://www.google.com/',
      'https://www.google.ca/',
      'https://www.bing.com/search?q=x',
      'https://search.yahoo.com/',
      'https://duckduckgo.com/',
      'android-app://com.google.android.googlequicksearchbox/',
    ]) {
      expect(introWanted(page({ referrer })), referrer).toBe(false)
    }
    for (const search of ['?gclid=abc', '?utm_source=gbp&utm_medium=organic', '?a=1&fbclid=x']) {
      expect(introWanted(page({ search })), search).toBe(false)
    }
    expect(introWanted(page({ referrer: 'https://mygoogle.example.com/' }))).toBe(true)
  })

  it('plays on demand with ?intro=on', () => {
    expect(introWanted(page({ path: '/about', seen: true, search: '?intro=on' }))).toBe(true)
    expect(introWanted(page({ search: '?intro=only' }))).toBe(true)
    expect(introWanted(page({ seen: true, search: '?intro=only' }))).toBe(false)
  })
})

describe('INTRO_SCRIPT', () => {
  it('is valid JavaScript', () => {
    expect(() => new Function(INTRO_SCRIPT)).not.toThrow()
  })
})
