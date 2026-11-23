import { describe, expect, it } from 'vitest'

import { INTRO_SCRIPT, introWanted } from './intro-script'

const page = (overrides: Partial<Parameters<typeof introWanted>[0]> = {}) => ({
  path: '/',
  search: '',
  referrer: '',
  ...overrides,
})

describe('introWanted', () => {
  it('plays whenever the home page is opened directly or from another site', () => {
    expect(introWanted(page())).toBe(true)
    expect(introWanted(page({ referrer: 'https://www.facebook.com/' }))).toBe(true)
    expect(introWanted(page({ referrer: 'https://www.washcraft.ca/services' }))).toBe(true)
  })

  it('never plays on other pages', () => {
    expect(introWanted(page({ path: '/services/gutter-cleaning' }))).toBe(false)
    expect(introWanted(page({ path: '/quote' }))).toBe(false)
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

  it('plays on any page with ?intro=on', () => {
    expect(introWanted(page({ path: '/about', search: '?intro=on' }))).toBe(true)
    expect(introWanted(page({ path: '/about', search: '?intro=only' }))).toBe(false)
  })
})

describe('INTRO_SCRIPT', () => {
  it('is valid JavaScript', () => {
    expect(() => new Function(INTRO_SCRIPT)).not.toThrow()
  })
})
