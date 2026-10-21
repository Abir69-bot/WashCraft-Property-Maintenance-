import {
  commitTransaction,
  createLocalReq,
  initTransaction,
  killTransaction,
  type BasePayload,
  type RequiredDataFromCollectionSlug,
} from 'payload'

import type { CheckedFile } from './lead-files'
import type { FailedLeadRecord } from './save'

export type LeadData = Omit<
  RequiredDataFromCollectionSlug<'leads'>,
  'files' | 'notificationStatus' | 'notificationLog'
>

/** Creates the lead and its file records in one transaction, so a retry never duplicates them. */
export async function createLead(payload: BasePayload, data: LeadData, files: CheckedFile[]) {
  const req = await createLocalReq({}, payload)
  await initTransaction(req)
  try {
    const fileIds: number[] = []
    for (const file of files) {
      const doc = await payload.create({
        collection: 'lead-files',
        data: file,
        req,
        overrideAccess: true,
      })
      fileIds.push(doc.id)
    }
    const lead = await payload.create({
      collection: 'leads',
      data: { ...data, files: fileIds },
      req,
      overrideAccess: true,
      depth: 0,
    })
    await commitTransaction(req)
    return lead
  } catch (error) {
    await killTransaction(req)
    throw error
  }
}

/** Re-creates a backed-up lead (admin "Re-import" button). */
export const createLeadFromBackup = (payload: BasePayload) => (record: FailedLeadRecord) =>
  createLead(payload, record.lead as LeadData, record.files)
