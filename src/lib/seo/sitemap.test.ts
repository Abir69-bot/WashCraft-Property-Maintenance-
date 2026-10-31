import { describe, expect, it } from 'vitest'

import { OPTIONAL_PATHS, sitemapEntries, STATIC_PATHS, type SitemapData } from './sitemap'

const data: SitemapData = {
  categories: [{ slug: 'exterior-cleaning', updatedAt: '2026-10-01T00:00:00.000Z' }],
  services: [{ slug: 'gutter-cleaning' }, { slug: 'roof-cleaning' }],
  cities: [{ slug: 'scarborough', servicePages: ['gutter-cleaning', 'disabled-service'] }],
  posts: [{ slug: 'gutters' }],
  solutions: [{ slug: 'ice-dams' }],
  team: [],
  jobs: [{ slug: 'crew-member' }],
  cityServicePages: false,
  optional: {
    instantPricing: false,
    dedicatedForms: false,
    gallery: false,
    reviews: false,
    hoa: false,
  },
}

const urls = (entries: ReturnType<typeof sitemapEntries>) => entries.map((entry) => entry.url)

describe('sitemapEntries', () => {
  it('lists static pages and every document with absolute URLs', () => {
    const entries = sitemapEntries(data, 'https://washcraft.example')
    expect(entries).toHaveLength(STATIC_PATHS.length + 7)
    expect(urls(entries)).toEqual(
      expect.arrayContaining([
        'https://washcraft.example/',
        'https://washcraft.example/exterior-cleaning',
        'https://washcraft.example/services/gutter-cleaning',
        'https://washcraft.example/areas/scarborough',
        'https://washcraft.example/blog/gutters',
        'https://washcraft.example/solutions/ice-dams',
        'https://washcraft.example/careers/crew-member',
      ]),
    )
    expect(entries.find((entry) => entry.url.endsWith('/exterior-cleaning'))?.lastModified).toBe(
      '2026-10-01T00:00:00.000Z',
    )
  })

  it('lists switched-off and empty pages only once they are on or have content', () => {
    const off = urls(sitemapEntries(data, 'https://x.example'))
    expect(off).not.toContain('https://x.example/quote/instant')
    expect(off).not.toContain('https://x.example/before-and-after')
    expect(off).toContain('https://x.example/quote')
    const on = urls(
      sitemapEntries(
        { ...data, optional: { ...data.optional, instantPricing: true, gallery: true } },
        'https://x.example',
      ),
    )
    expect(on).toContain('https://x.example/quote/instant')
    expect(on).toContain('https://x.example/maintenance-plans')
    expect(on).toContain('https://x.example/before-and-after')
    expect(on).toHaveLength(
      off.length + OPTIONAL_PATHS.instantPricing.length + OPTIONAL_PATHS.gallery.length,
    )
  })

  it('never lists the thank-you page or the styleguide', () => {
    const all = urls(sitemapEntries(data, 'https://washcraft.example')).join(' ')
    expect(all).not.toMatch(/thank-you|styleguide/)
  })

  it('adds service-in-city pages only with the feature on, for enabled services', () => {
    expect(urls(sitemapEntries(data, 'https://x.example'))).not.toContain(
      'https://x.example/areas/scarborough/gutter-cleaning',
    )
    const on = urls(sitemapEntries({ ...data, cityServicePages: true }, 'https://x.example'))
    expect(on).toContain('https://x.example/areas/scarborough/gutter-cleaning')
    expect(on).not.toContain('https://x.example/areas/scarborough/disabled-service')
  })
})
