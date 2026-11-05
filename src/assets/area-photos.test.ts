import { describe, expect, it } from 'vitest'

import { areaSummaries } from '@/config/areas'
import { toSlug } from '@/lib/text'
import { cities } from '@/seed/data/cities'

import { areaPhotos } from './area-photos'

const slugs = cities.map((city) => toSlug(city.name))

describe('service area pages', () => {
  it('have a credited photo and a summary for every seeded city', () => {
    expect(slugs.filter((slug) => !areaPhotos[slug])).toEqual([])
    expect(slugs.filter((slug) => !areaSummaries[slug])).toEqual([])
  })

  it('use a different photo for each city, with alt text and a license link', () => {
    const photos = Object.values(areaPhotos)
    expect(new Set(photos.map((photo) => photo.credit.source)).size).toBe(photos.length)
    for (const photo of photos) {
      expect(photo.alt.length).toBeGreaterThan(20)
      expect(photo.credit.licenseUrl).toMatch(/^https:\/\/creativecommons\.org\//)
    }
  })

  it('name the city in a summary short enough for a search result', () => {
    for (const city of cities) {
      const summary = areaSummaries[toSlug(city.name)]
      expect(summary).toContain(city.name)
      expect(summary.length).toBeLessThanOrEqual(160)
    }
  })
})
