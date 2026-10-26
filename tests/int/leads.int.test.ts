import { getPayload, type Migration, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { createLead, createLeadFromBackup, type LeadData } from '@/lib/leads/create'
import { newFileKey, verifyUploads } from '@/lib/leads/lead-files'
import {
  backupLead,
  failedLeadRecord,
  pendingFailedLeads,
  reimportFailedLeads,
} from '@/lib/leads/save'
import { privateStore } from '@/lib/storage'
import { migrations } from '@/migrations'
import config from '@/payload.config'

let payload: Payload
const NAME = 'Integration Lead'

const JPEG = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0x10, 74, 70, 73, 70, 0, 1, 1, 0, 0, 1])

const lead = (overrides: Partial<LeadData> = {}): LeadData => ({
  type: 'junk',
  status: 'new',
  name: NAME,
  phone: '(303) 555-0199',
  email: 'lead@example.com',
  postalCode: 'M1B 2K3',
  consent: true,
  notes: 'An old couch',
  details: { load: '1/2 truck' },
  ...overrides,
})

async function uploadPhoto() {
  const key = newFileKey('image/jpeg')
  await privateStore().put(key, JPEG, 'image/jpeg')
  return verifyUploads([{ key, name: 'couch.jpg' }], 'photo')
}

beforeAll(async () => {
  payload = await getPayload({ config })
  await payload.db.migrate({ migrations: migrations as unknown as Migration[] })
}, 300_000)

afterAll(async () => {
  await payload.delete({ collection: 'leads', where: { name: { equals: NAME } } })
  await payload.delete({ collection: 'lead-files', where: { filename: { equals: 'couch.jpg' } } })
  await payload.destroy()
})

describe('saving leads', () => {
  it('saves a lead and its files together', async () => {
    const files = await uploadPhoto()
    expect(files).toHaveLength(1)
    const saved = await createLead(payload, lead(), files)
    const stored = await payload.findByID({ collection: 'leads', id: saved.id, depth: 1 })
    expect(stored.files).toEqual([
      expect.objectContaining({ filename: 'couch.jpg', mimeType: 'image/jpeg', size: JPEG.length }),
    ])
    expect(stored.notificationStatus).toBe('pending')
  })

  it('rolls everything back when the lead fails to save', async () => {
    const files = await uploadPhoto()
    const before = await payload.count({ collection: 'lead-files' })
    await expect(
      createLead(payload, lead({ phone: undefined as unknown as string }), files),
    ).rejects.toThrow()
    expect((await payload.count({ collection: 'lead-files' })).totalDocs).toBe(before.totalDocs)
  })

  it('updates single columns without touching the rest of the lead', async () => {
    const saved = await createLead(payload, lead(), [])
    await payload.db.updateOne({
      collection: 'leads',
      id: saved.id,
      data: { notificationStatus: 'sent', notificationLog: [{ channel: 'owner-email' }] },
    })
    await payload.db.updateOne({
      collection: 'leads',
      id: saved.id,
      data: { status: 'booking_requested' },
    })
    const stored = await payload.findByID({ collection: 'leads', id: saved.id, depth: 0 })
    expect(stored).toMatchObject({
      status: 'booking_requested',
      notificationStatus: 'sent',
      notificationLog: [{ channel: 'owner-email' }],
      name: NAME,
      notes: 'An old couch',
      details: { load: '1/2 truck' },
    })
  })
})

describe('backups', () => {
  it('re-imports a lead saved while the database was down, with its files, once', async () => {
    const files = await uploadPhoto()
    const record = failedLeadRecord(
      lead({ type: 'custom' }) as Record<string, unknown>,
      files,
      'down',
    )
    await backupLead(record, privateStore(), async () => undefined)
    expect(await pendingFailedLeads(privateStore())).toHaveLength(1)

    const first = await reimportFailedLeads(privateStore(), createLeadFromBackup(payload))
    expect(first).toEqual({ imported: [expect.stringContaining(record.id)], failed: [] })
    const { docs } = await payload.find({
      collection: 'leads',
      where: { and: [{ name: { equals: NAME } }, { type: { equals: 'custom' } }] },
      depth: 1,
    })
    expect(docs).toHaveLength(1)
    expect(docs[0].files).toHaveLength(1)

    expect(
      (await reimportFailedLeads(privateStore(), createLeadFromBackup(payload))).imported,
    ).toEqual([])
    expect(await pendingFailedLeads(privateStore())).toEqual([])
  })
})

describe('review requests', () => {
  it('records one request when a lead with consent is first marked won', async () => {
    await payload.updateGlobal({ slug: 'feature-flags', data: { reviewRequests: true } })
    await payload.updateGlobal({
      slug: 'site-settings',
      data: { googleReviewUrl: 'https://g.page/r/example/review' },
    })
    const saved = await createLead(payload, lead(), [])
    await payload.update({ collection: 'leads', id: saved.id, data: { status: 'won' } })
    const won = await payload.findByID({ collection: 'leads', id: saved.id, depth: 0 })
    expect(won.reviewRequestedAt).toBeTruthy()

    const noConsent = await createLead(payload, lead({ consent: false }), [])
    await payload.update({ collection: 'leads', id: noConsent.id, data: { status: 'won' } })
    const skipped = await payload.findByID({ collection: 'leads', id: noConsent.id, depth: 0 })
    expect(skipped.reviewRequestedAt).toBeFalsy()

    await payload.updateGlobal({ slug: 'feature-flags', data: { reviewRequests: false } })
  })
})
