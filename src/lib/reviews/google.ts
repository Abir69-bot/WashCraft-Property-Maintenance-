import type { BasePayload } from 'payload'
import { z } from 'zod'

/**
 * Google reviews (brief §9.7): once a day the site asks the Places API (New) for the business's
 * rating, review count and the reviews Google chooses to share (up to five), and keeps a copy
 * so pages never call Google while a visitor waits. Reviews Google stops returning are removed,
 * unless staff hid them (so a hidden review stays hidden if it comes back).
 */

const PLACES_URL = 'https://places.googleapis.com/v1/places/'
const FIELD_MASK = 'rating,userRatingCount,reviews'

const placeSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  userRatingCount: z.number().int().nonnegative().optional(),
  reviews: z
    .array(
      z.object({
        name: z.string().min(1),
        rating: z.number().int().min(1).max(5),
        text: z.object({ text: z.string() }).optional(),
        originalText: z.object({ text: z.string() }).optional(),
        authorAttribution: z
          .object({
            displayName: z.string().optional(),
            uri: z.string().optional(),
            photoUri: z.string().optional(),
          })
          .optional(),
        publishTime: z.string().optional(),
        googleMapsUri: z.string().optional(),
      }),
    )
    .default([]),
})

export type PlaceResponse = z.infer<typeof placeSchema>
type PlaceReview = PlaceResponse['reviews'][number]

/** A Places API review as a `google-reviews` document. */
export function mapReview(review: PlaceReview, fetchedAt: string) {
  const author = review.authorAttribution
  return {
    reviewId: review.name,
    authorName: author?.displayName?.trim() || 'Google user',
    authorPhotoUrl: author?.photoUri ?? null,
    rating: review.rating,
    // The reviewer's own words when Google translated them.
    text: review.originalText?.text ?? review.text?.text ?? null,
    reviewUrl: review.googleMapsUri ?? author?.uri ?? null,
    publishedAt: review.publishTime ?? null,
    fetchedAt,
  }
}

/** Reads the place from Google. Throws with Google's message on any error. */
export async function fetchPlace(
  placeId: string,
  apiKey: string,
  fetcher: typeof fetch = fetch,
): Promise<PlaceResponse> {
  const response = await fetcher(`${PLACES_URL}${encodeURIComponent(placeId)}`, {
    headers: { 'X-Goog-Api-Key': apiKey, 'X-Goog-FieldMask': FIELD_MASK },
    signal: AbortSignal.timeout(10_000),
  })
  const body: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    const message = (body as { error?: { message?: string } } | null)?.error?.message
    throw new Error(`Google Places ${response.status}: ${message ?? response.statusText}`)
  }
  return placeSchema.parse(body)
}

export type SyncResult =
  | { status: 'skipped'; reason: string }
  | {
      status: 'synced'
      rating: number | null
      count: number | null
      reviews: number
      removed: number
    }

/** Copies the rating and reviews into the CMS. Staff's "Hide on site" choices are kept. */
export async function syncGoogleReviews({
  payload,
  apiKey,
  fetcher,
  now = new Date(),
}: {
  payload: BasePayload
  apiKey: string | undefined
  fetcher?: typeof fetch
  now?: Date
}): Promise<SyncResult> {
  if (!apiKey) return { status: 'skipped', reason: 'GOOGLE_PLACES_API_KEY is not set' }
  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
  const placeId = settings.googlePlaceId?.trim()
  if (!placeId) return { status: 'skipped', reason: 'No Google Place ID in Site settings' }

  const place = await fetchPlace(placeId, apiKey, fetcher)
  const fetchedAt = now.toISOString()
  // One cache refresh at the end (the settings update), not one per review.
  const context = { disableRevalidate: true }

  const kept = new Set<string>()
  for (const review of place.reviews) {
    const data = mapReview(review, fetchedAt)
    kept.add(data.reviewId)
    const { docs } = await payload.find({
      collection: 'google-reviews',
      where: { reviewId: { equals: data.reviewId } },
      limit: 1,
      depth: 0,
    })
    if (docs[0]) {
      await payload.update({ collection: 'google-reviews', id: docs[0].id, data, context })
    } else {
      await payload.create({ collection: 'google-reviews', data, context })
    }
  }

  const { docs: stale } = await payload.find({
    collection: 'google-reviews',
    where: {
      and: [{ reviewId: { not_in: [...kept] } }, { hidden: { not_equals: true } }],
    },
    pagination: false,
    depth: 0,
  })
  for (const doc of stale) {
    await payload.delete({ collection: 'google-reviews', id: doc.id, context })
  }

  const rating = place.rating ?? null
  const count = place.userRatingCount ?? null
  await payload.updateGlobal({
    slug: 'site-settings',
    data: { googleRating: rating, googleReviewCount: count, googleSyncedAt: fetchedAt },
  })
  return { status: 'synced', rating, count, reviews: kept.size, removed: stale.length }
}
