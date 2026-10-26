import { describe, expect, it } from 'vitest'

import { sampleProof } from '@/config/site'

import { shownGuarantee, shownRating } from './proof'

const unset = {
  stats: { jobsCompleted: null, happyClients: null, rating: null, reviewCount: null },
}
const rated = { stats: { ...unset.stats, rating: 4.7, reviewCount: 23 } }

describe('shownRating', () => {
  it('shows a real rating everywhere', () => {
    expect(shownRating(rated, true)).toEqual({ rating: 4.7, reviewCount: 23, sample: false })
    expect(shownRating(rated, false)).toEqual({ rating: 4.7, reviewCount: 23, sample: false })
  })

  it('needs both the rating and the review count', () => {
    expect(shownRating({ stats: { ...unset.stats, rating: 4.7 } }, true)).toBeNull()
  })

  it('shows the sample rating, flagged, outside production only', () => {
    expect(shownRating(unset, false)).toEqual({
      rating: sampleProof.rating,
      reviewCount: sampleProof.reviewCount,
      sample: true,
    })
    expect(shownRating(unset, true)).toBeNull()
  })
})

describe('shownGuarantee', () => {
  it('shows the owner’s guarantee everywhere', () => {
    expect(shownGuarantee({ guarantee: 'Happy or we return.' }, true)).toEqual({
      text: 'Happy or we return.',
      sample: false,
    })
  })

  it('shows the sample guarantee, flagged, outside production only', () => {
    expect(shownGuarantee({ guarantee: null }, false)).toEqual({
      text: sampleProof.guarantee,
      sample: true,
    })
    expect(shownGuarantee({ guarantee: null }, true)).toBeNull()
  })
})
