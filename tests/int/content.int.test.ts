import { getPayload, type Migration, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { createApplication, createLeadFromBackup } from '@/lib/leads/create'
import { newFileKey, verifyUploads } from '@/lib/leads/lead-files'
import { failedLeadRecord } from '@/lib/leads/save'
import { syncGoogleReviews, type PlaceResponse } from '@/lib/reviews/google'
import { privateStore } from '@/lib/storage'
import { migrations } from '@/migrations'
import config from '@/payload.config'

let payload: Payload
const APPLICANT = 'Integration Applicant'
const PDF = new TextEncoder().encode('%PDF-1.4\n%test résumé\n')

beforeAll(async () => {
  payload = await getPayload({ config })
  await payload.db.migrate({ migrations: migrations as unknown as Migration[] })
}, 300_000)

afterAll(async () => {
  await payload.delete({ collection: 'applications', where: { name: { equals: APPLICANT } } })
  await payload.delete({ collection: 'lead-files', where: { filename: { equals: 'cv.pdf' } } })
  await payload.delete({ collection: 'google-reviews', where: { id: { exists: true } } })
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      googlePlaceId: null,
      googleRating: null,
      googleReviewCount: null,
      googleSyncedAt: null,
    },
  })
  await payload.destroy()
})

describe('job applications', () => {
  const application = {
    name: APPLICANT,
    email: 'applicant@example.com',
    phone: '(303) 555-0123',
    message: 'Ready for snow season.',
    consent: true,
    status: 'new' as const,
  }

  async function uploadResume() {
    const key = newFileKey('application/pdf')
    await privateStore().put(key, PDF, 'application/pdf')
    return verifyUploads([{ key, name: 'cv.pdf' }], 'document')
  }

  it('saves an application with its résumé', async () => {
    const files = await uploadResume()
    const saved = await createApplication(payload, application, files)
    const stored = await payload.findByID({ collection: 'applications', id: saved.id, depth: 1 })
    expect(stored.resume).toEqual(
      expect.objectContaining({ filename: 'cv.pdf', mimeType: 'application/pdf' }),
    )
  })

  it('rolls back the résumé when the application fails', async () => {
    const files = await uploadResume()
    const before = await payload.count({ collection: 'lead-files' })
    await expect(
      createApplication(payload, { ...application, email: 'not-an-email' }, files),
    ).rejects.toThrow()
    expect((await payload.count({ collection: 'lead-files' })).totalDocs).toBe(before.totalDocs)
  })

  it('re-imports a backed-up application into Job applications, not Leads', async () => {
    const files = await uploadResume()
    const record = {
      ...failedLeadRecord(application, files, 'connect ECONNREFUSED'),
      collection: 'applications' as const,
    }
    const leadsBefore = await payload.count({ collection: 'leads' })
    const created = await createLeadFromBackup(payload)(record)
    expect(await payload.findByID({ collection: 'applications', id: created.id })).toMatchObject({
      name: APPLICANT,
      email: 'applicant@example.com',
    })
    expect((await payload.count({ collection: 'leads' })).totalDocs).toBe(leadsBefore.totalDocs)
  })
})

describe('Google reviews sync', () => {
  const review = (id: string, rating = 5): PlaceResponse['reviews'][number] => ({
    name: `places/test/reviews/${id}`,
    rating,
    text: { text: `Review ${id}` },
    authorAttribution: { displayName: `Reviewer ${id}` },
    publishTime: '2026-09-01T12:00:00Z',
    googleMapsUri: `https://maps.google.com/review/${id}`,
  })
  const google = (place: Partial<PlaceResponse>) =>
    (async () => Response.json(place)) as unknown as typeof fetch

  it('does nothing without an API key or Place ID', async () => {
    expect(await syncGoogleReviews({ payload, apiKey: undefined })).toEqual({
      status: 'skipped',
      reason: 'GOOGLE_PLACES_API_KEY is not set',
    })
    await payload.updateGlobal({ slug: 'site-settings', data: { googlePlaceId: null } })
    expect(await syncGoogleReviews({ payload, apiKey: 'key', fetcher: google({}) })).toMatchObject({
      status: 'skipped',
    })
  })

  it('copies the rating and reviews, keeps hidden ones and drops the rest', async () => {
    await payload.updateGlobal({ slug: 'site-settings', data: { googlePlaceId: 'ChIJtest' } })
    const first = await syncGoogleReviews({
      payload,
      apiKey: 'key',
      fetcher: google({ rating: 4.8, userRatingCount: 37, reviews: [review('a'), review('b', 4)] }),
      now: new Date('2026-10-20T10:00:00Z'),
    })
    expect(first).toEqual({ status: 'synced', rating: 4.8, count: 37, reviews: 2, removed: 0 })

    const settings = await payload.findGlobal({ slug: 'site-settings' })
    expect(settings).toMatchObject({ googleRating: 4.8, googleReviewCount: 37 })
    expect(settings.googleSyncedAt).toBe('2026-10-20T10:00:00.000Z')

    // Staff hide review "b"; the next day Google returns only "c".
    const { docs } = await payload.find({
      collection: 'google-reviews',
      where: { reviewId: { equals: 'places/test/reviews/b' } },
    })
    await payload.update({ collection: 'google-reviews', id: docs[0].id, data: { hidden: true } })
    const second = await syncGoogleReviews({
      payload,
      apiKey: 'key',
      fetcher: google({ rating: 4.9, userRatingCount: 38, reviews: [review('c')] }),
    })
    expect(second).toMatchObject({ reviews: 1, removed: 1 })
    const left = await payload.find({ collection: 'google-reviews', sort: 'reviewId' })
    expect(left.docs.map((doc) => [doc.reviewId, doc.hidden ?? false])).toEqual([
      ['places/test/reviews/b', true],
      ['places/test/reviews/c', false],
    ])
  })

  it('updates a review that changed instead of duplicating it', async () => {
    await syncGoogleReviews({
      payload,
      apiKey: 'key',
      fetcher: google({ reviews: [{ ...review('c'), text: { text: 'Edited' } }] }),
    })
    const { docs } = await payload.find({
      collection: 'google-reviews',
      where: { reviewId: { equals: 'places/test/reviews/c' } },
    })
    expect(docs).toHaveLength(1)
    expect(docs[0].text).toBe('Edited')
  })
})
