import { describe, expect, it } from 'vitest'

import { allServices } from '@/seed/data/services'

import { beforeAfterExamples } from './before-after'

describe('before-and-after examples', () => {
  const entries = Object.entries(beforeAfterExamples)

  it('belong to seeded services', () => {
    const slugs = new Set(allServices.map((service) => service.slug))
    expect(entries.map(([slug]) => slug).filter((slug) => !slugs.has(slug))).toEqual([])
  })

  it('are equal-sized, described, credited pairs', () => {
    for (const [, example] of entries) {
      expect(example.before.width).toBe(example.after.width)
      expect(example.before.height).toBe(example.after.height)
      expect(example.beforeAlt.length).toBeGreaterThan(20)
      expect(example.afterAlt.length).toBeGreaterThan(20)
      expect(example.credit.licenseUrl).toMatch(/^https:\/\/creativecommons\.org\//)
    }
  })
})
