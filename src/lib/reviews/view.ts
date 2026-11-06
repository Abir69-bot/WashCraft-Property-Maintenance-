import type { City, GoogleReview, Service, Testimonial } from '@/payload-types'

/**
 * A review as the home page's review cards show it: one shape for reviews copied from Google
 * (`google-reviews`, filled by the daily sync) and reviews the owner entered (`testimonials`).
 */
export type ReviewView = {
  key: string
  name: string
  /** The reviewer's Google profile photo; cards show initials without one. */
  photoUrl: string | null
  rating: number
  text: string
  fromGoogle: boolean
  /** The original review on Google, when there is one. */
  url: string | null
  date: string | null
  /** Service and city, for reviews the owner entered. */
  detail: string | null
  isSample: boolean
}

/** Up to two initials from a reviewer's name ("Maria G." -> "MG"). */
export function initials(name: string): string {
  const letters = name
    .split(/\s+/)
    .map((part) => part.replace(/[^\p{L}\p{N}]/gu, '').charAt(0))
    .filter(Boolean)
  return (letters.length > 1 ? letters[0] + letters.at(-1) : (letters[0] ?? '?')).toUpperCase()
}

export function fromGoogle(review: GoogleReview): ReviewView {
  return {
    key: `google-${review.id}`,
    name: review.authorName,
    photoUrl: review.authorPhotoUrl ?? null,
    rating: review.rating,
    text: review.text?.trim() ?? '',
    fromGoogle: true,
    url: review.reviewUrl ?? null,
    date: review.publishedAt ?? null,
    detail: null,
    isSample: false,
  }
}

const nameOf = (value: number | City | Service | null | undefined) =>
  value && typeof value === 'object' ? ('name' in value ? value.name : value.title) : null

export function fromTestimonial(testimonial: Testimonial): ReviewView {
  const google = testimonial.source === 'google'
  const detail = [nameOf(testimonial.service), nameOf(testimonial.city)].filter(Boolean).join(' · ')
  return {
    key: `testimonial-${testimonial.id}`,
    name: testimonial.name,
    photoUrl: null,
    rating: testimonial.rating,
    text: testimonial.quote.trim(),
    fromGoogle: google,
    url: google ? (testimonial.sourceUrl ?? null) : null,
    date: testimonial.date ?? null,
    detail: detail || null,
    isSample: Boolean(testimonial.isSample),
  }
}

/**
 * The reviews the home page shows: Google's first (newest first), then the owner's own. A Google
 * review with a rating but no words has nothing to show on a card, so it's left out.
 */
export function homeReviews(google: GoogleReview[], testimonials: Testimonial[]): ReviewView[] {
  return [...google.map(fromGoogle), ...testimonials.map(fromTestimonial)].filter(
    (review) => review.text.length > 0,
  )
}
