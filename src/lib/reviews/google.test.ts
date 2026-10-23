import { describe, expect, it, vi } from 'vitest'

import { fetchPlace, mapReview } from './google'

const review = {
  name: 'places/abc/reviews/r1',
  rating: 5,
  text: { text: 'Great job (translated)' },
  originalText: { text: 'Great job' },
  authorAttribution: {
    displayName: ' Jamie R. ',
    uri: 'https://maps.google.com/contrib/1',
    photoUri: 'https://lh3.googleusercontent.com/a/photo',
  },
  publishTime: '2026-09-01T12:00:00Z',
  googleMapsUri: 'https://maps.google.com/review/r1',
}

describe('mapReview', () => {
  it('keeps the reviewer’s own words, name, photo and link', () => {
    expect(mapReview(review, '2026-10-21T00:00:00.000Z')).toEqual({
      reviewId: 'places/abc/reviews/r1',
      authorName: 'Jamie R.',
      authorPhotoUrl: 'https://lh3.googleusercontent.com/a/photo',
      rating: 5,
      text: 'Great job',
      reviewUrl: 'https://maps.google.com/review/r1',
      publishedAt: '2026-09-01T12:00:00Z',
      fetchedAt: '2026-10-21T00:00:00.000Z',
    })
  })

  it('handles reviews with a rating only', () => {
    const mapped = mapReview({ name: 'places/abc/reviews/r2', rating: 4 }, 'now')
    expect(mapped).toMatchObject({ authorName: 'Google user', text: null, reviewUrl: null })
  })
})

describe('fetchPlace', () => {
  it('asks only for the rating, count and reviews', async () => {
    const fetcher = vi.fn(async () =>
      Response.json({ rating: 4.8, userRatingCount: 37, reviews: [review] }),
    )
    const place = await fetchPlace('ChIJ123', 'key', fetcher as unknown as typeof fetch)
    expect(place.rating).toBe(4.8)
    expect(place.reviews).toHaveLength(1)
    const [url, init] = fetcher.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe('https://places.googleapis.com/v1/places/ChIJ123')
    expect(init.headers).toMatchObject({
      'X-Goog-Api-Key': 'key',
      'X-Goog-FieldMask': 'rating,userRatingCount,reviews',
    })
  })

  it('treats a place without reviews as an empty list', async () => {
    const fetcher = async () => Response.json({})
    const place = await fetchPlace('id', 'key', fetcher as unknown as typeof fetch)
    expect(place.reviews).toEqual([])
  })

  it('reports Google’s error message', async () => {
    const fetcher = async () =>
      Response.json({ error: { message: 'API key not valid' } }, { status: 400 })
    await expect(fetchPlace('id', 'bad', fetcher as unknown as typeof fetch)).rejects.toThrow(
      'Google Places 400: API key not valid',
    )
  })
})
