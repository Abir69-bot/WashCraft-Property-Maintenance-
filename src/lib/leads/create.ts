import {
  commitTransaction,
  createLocalReq,
  initTransaction,
  killTransaction,
  type BasePayload,
  type PayloadRequest,
  type RequiredDataFromCollectionSlug,
} from 'payload'

import type { CheckedFile } from './lead-files'
import type { FailedLeadRecord } from './save'

export type LeadData = Omit<
  RequiredDataFromCollectionSlug<'leads'>,
  'files' | 'notificationStatus' | 'notificationLog'
>

export type ApplicationData = Omit<RequiredDataFromCollectionSlug<'applications'>, 'resume'>

/** Saves file records, then the document that links them, in one transaction. */
async function withFiles<T>(
  payload: BasePayload,
  files: CheckedFile[],
  create: (fileIds: number[], req: PayloadRequest) => Promise<T>,
) {
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
    const result = await create(fileIds, req)
    await commitTransaction(req)
    return result
  } catch (error) {
    await killTransaction(req)
    throw error
  }
}

/** Creates the lead and its file records in one transaction, so a retry never duplicates them. */
export const createLead = (payload: BasePayload, data: LeadData, files: CheckedFile[]) =>
  withFiles(payload, files, (fileIds, req) =>
    payload.create({
      collection: 'leads',
      data: { ...data, files: fileIds },
      req,
      overrideAccess: true,
      depth: 0,
    }),
  )

/** Creates a job application and its résumé record in one transaction. */
export const createApplication = (
  payload: BasePayload,
  data: ApplicationData,
  files: CheckedFile[],
) =>
  withFiles(payload, files, (fileIds, req) =>
    payload.create({
      collection: 'applications',
      data: { ...data, resume: fileIds[0] },
      req,
      overrideAccess: true,
      depth: 0,
    }),
  )

/** Re-creates a backed-up lead or application (admin "Re-import" button). */
export const createLeadFromBackup = (payload: BasePayload) => (record: FailedLeadRecord) =>
  record.collection === 'applications'
    ? createApplication(payload, record.lead as ApplicationData, record.files)
    : createLead(payload, record.lead as LeadData, record.files)
