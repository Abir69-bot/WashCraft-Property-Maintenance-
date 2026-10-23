import { randomUUID } from 'crypto'

import type { ObjectStore } from '@/lib/storage'

import type { CheckedFile } from './lead-files'

/**
 * "Leads are never lost" (brief §3.5, §4A): save to the database first; on a connection error
 * (Neon waking from scale-to-zero) wait and retry once; if it still fails, write the full lead
 * to private storage under failed-leads/ and email it to the owner. The owner re-imports
 * backed-up leads from the admin once the database is back.
 */

/** Errors that mean "couldn't reach the database", worth one retry. */
const CONNECTION_CODES = new Set([
  'ECONNREFUSED',
  'ECONNRESET',
  'ETIMEDOUT',
  'ENOTFOUND',
  'EAI_AGAIN',
  'EPIPE',
  '57P01', // admin shutdown (Neon suspending the compute)
  '57P03', // cannot connect now
  '08000',
  '08001',
  '08003',
  '08004',
  '08006',
  '53300', // too many connections
])
const CONNECTION_MESSAGE = /connect|connection|timeout|timed out|terminated|socket|ECONNRESET/i

export function isConnectionError(error: unknown): boolean {
  let current: unknown = error
  for (let depth = 0; current && depth < 6; depth++) {
    const { code, message, cause } = current as {
      code?: unknown
      message?: unknown
      cause?: unknown
    }
    if (typeof code === 'string' && CONNECTION_CODES.has(code)) return true
    if (typeof message === 'string' && CONNECTION_MESSAGE.test(message)) return true
    current = cause
  }
  return false
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export type PersistResult<T> =
  { saved: true; result: T } | { saved: false; backedUp: boolean; error: string }

/** Saves with one retry on connection errors, then falls back to `backup`. */
export async function persistLead<T>({
  save,
  backup,
  retryDelayMs = 1500,
  wait = sleep,
}: {
  save: () => Promise<T>
  backup: (error: string) => Promise<void>
  retryDelayMs?: number
  wait?: (ms: number) => Promise<void>
}): Promise<PersistResult<T>> {
  let lastError: unknown
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      return { saved: true, result: await save() }
    } catch (error) {
      lastError = error
      console.error(`[lead] save attempt ${attempt} failed`, error)
      if (attempt === 1 && isConnectionError(error)) await wait(retryDelayMs)
      else break
    }
  }
  const message = lastError instanceof Error ? lastError.message : String(lastError)
  try {
    await backup(message)
    return { saved: false, backedUp: true, error: message }
  } catch (backupError) {
    console.error('[lead] backup failed too', backupError)
    return { saved: false, backedUp: false, error: message }
  }
}

export const FAILED_PREFIX = 'failed-leads/'
const IMPORTED_PREFIX = 'failed-leads/imported/'

/**
 * What a backed-up lead looks like in storage. `lead` is the data for `leads.create`, or for
 * `applications.create` when `collection` says so (job applications use the same safety net).
 */
export type FailedLeadRecord = {
  version: 1
  id: string
  receivedAt: string
  error: string
  collection?: 'applications'
  lead: Record<string, unknown>
  files: CheckedFile[]
}

export function failedLeadRecord(
  lead: Record<string, unknown>,
  files: CheckedFile[],
  error: string,
  now = new Date(),
): FailedLeadRecord {
  return { version: 1, id: randomUUID(), receivedAt: now.toISOString(), error, lead, files }
}

export const failedLeadKey = (record: FailedLeadRecord) =>
  `${FAILED_PREFIX}${record.receivedAt.slice(0, 10)}-${record.id}.json`

/**
 * Writes the record to storage and emails it to the owner. Succeeds if either works; if both
 * fail, the full record goes to the server log as the last resort.
 */
export async function backupLead(
  record: FailedLeadRecord,
  store: ObjectStore,
  emailOwner: () => Promise<void>,
) {
  const results = await Promise.allSettled([
    store.put(failedLeadKey(record), JSON.stringify(record, null, 2), 'application/json'),
    emailOwner(),
  ])
  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error(`[lead] backup ${index === 0 ? 'to storage' : 'email'} failed`, result.reason)
    }
  })
  if (results.every((result) => result.status === 'rejected')) {
    console.error(`[lead] FULL LEAD (not saved anywhere else): ${JSON.stringify(record)}`)
    throw new Error('Lead backup failed')
  }
}

/** Backed-up leads waiting to be re-imported. */
export async function pendingFailedLeads(store: ObjectStore) {
  const keys = await store.list(FAILED_PREFIX)
  return keys.filter((key) => key.endsWith('.json') && !key.startsWith(IMPORTED_PREFIX))
}

/**
 * Re-imports backed-up leads: creates each lead (and its files) with `create`, then moves the
 * JSON to failed-leads/imported/ so nothing is imported twice. Unreadable files are reported and
 * left in place.
 */
export async function reimportFailedLeads(
  store: ObjectStore,
  create: (record: FailedLeadRecord) => Promise<unknown>,
) {
  const imported: string[] = []
  const failed: string[] = []
  for (const key of await pendingFailedLeads(store)) {
    try {
      const object = await store.get(key)
      if (!object) continue
      const record = JSON.parse(new TextDecoder().decode(object.body)) as FailedLeadRecord
      if (record.version !== 1 || !record.lead) throw new Error('Not a backed-up lead')
      await create(record)
      await store.put(key.replace(FAILED_PREFIX, IMPORTED_PREFIX), object.body, object.contentType)
      await store.delete(key)
      imported.push(key)
    } catch (error) {
      console.error(`[lead] could not re-import ${key}`, error)
      failed.push(key)
    }
  }
  return { imported, failed }
}
