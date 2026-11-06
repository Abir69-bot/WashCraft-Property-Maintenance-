import { describe, expect, it } from 'vitest'

import type { GoogleReview, Testimonial } from '@/payload-types'

import { homeReviews, initials } from './view'

const google = (fields: Partial<GoogleReview>) =>
  ({
    id: 1,
    reviewId: 'r1',
    authorName: 'Jordan Lee',
    rating: 5,
    text: 'Our gutters were clear and the yard was tidy after.',
    reviewUrl: 'https://maps.google.com/?cid=1',
    authorPhotoUrl: 'https://lh3.googleusercontent.com/a/photo',
    publishedAt: '2026-10-01T00:00:00.000Z',
    ...fields,
  }) as GoogleReview

const testimonial = (fields: Partial<Testimonial>) =>
  ({
    id: 7,
    name: 'Sam R.',
    quote: '  Windows look great.  ',
    rating: 4,
    source: 'direct',
    city: { id: 1, name: 'Scarborough' },
    service: { id: 2, title: 'Window Cleaning' },
    ...fields,
  }) as Testimonial

describe('initials', () => {
  it('takes the first and last initials', () => {
    expect(initials('Jordan Lee')).toBe('JL')
    expect(initials('Maria G.')).toBe('MG')
    expect(initials('anna maria de souza')).toBe('AS')
  })

  it('copes with one word, symbols and an empty name', () => {
    expect(initials('Priya')).toBe('P')
    expect(initials('  (Ö)zil ')).toBe('Ö')
    expect(initials('')).toBe('?')
  })
})

describe('homeReviews', () => {
  it('puts Google reviews first and keeps their link and photo', () => {
    const [first, second] = homeReviews([google({})], [testimonial({})])
    expect(first).toMatchObject({
      key: 'google-1',
      name: 'Jordan Lee',
      fromGoogle: true,
      url: 'https://maps.google.com/?cid=1',
      photoUrl: 'https://lh3.googleusercontent.com/a/photo',
      isSample: false,
    })
    expect(second).toMatchObject({
      key: 'testimonial-7',
      text: 'Windows look great.',
      fromGoogle: false,
      url: null,
      detail: 'Window Cleaning · Scarborough',
    })
  })

  it('links an owner-entered review to Google only when it came from Google', () => {
    const [review] = homeReviews(
      [],
      [testimonial({ source: 'google', sourceUrl: 'https://g.co/review' })],
    )
    expect(review).toMatchObject({ fromGoogle: true, url: 'https://g.co/review' })
  })

  it('leaves out reviews with no words', () => {
    expect(homeReviews([google({ text: null }), google({ text: '  ' })], [])).toEqual([])
  })
})
