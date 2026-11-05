import { describe, expect, it } from 'vitest'

import { sampleProof } from '@/config/site'

import { shownGuarantee, shownRating } from './proof'

const unset = {
  stats: { jobsCompleted: null, happyClients: null, rating: null, reviewCount: null },
}
const rated = { stats: { ...unset.stats, rating: 4.7, reviewCount: 23 } }

describe('shownRating', () => {
  it('shows a real rating', () => {
    expect(shownRating(rated)).toEqual({ rating: 4.7, reviewCount: 23 })
  })

  it('needs both the rating and the review count', () => {
    expect(shownRating({ stats: { ...unset.stats, rating: 4.7 } })).toBeNull()
  })

  it('never shows a sample rating', () => {
    expect(shownRating(unset)).toBeNull()
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
