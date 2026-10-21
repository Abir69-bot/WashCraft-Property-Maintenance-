import { mkdtemp, rm } from 'fs/promises'
import os from 'os'
import path from 'path'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { LocalObjectStore } from '@/lib/storage/object-store'

import {
  backupLead,
  failedLeadKey,
  failedLeadRecord,
  isConnectionError,
  pendingFailedLeads,
  persistLead,
  reimportFailedLeads,
} from './save'

const connectionError = () =>
  Object.assign(new Error('Connection terminated due to connection timeout'), {
    code: undefined,
  })
const wrapped = (cause: unknown) => Object.assign(new Error('Query failed'), { cause })

describe('isConnectionError', () => {
  it('recognizes cold starts and dropped connections, including wrapped ones', () => {
    expect(isConnectionError(connectionError())).toBe(true)
    expect(isConnectionError(Object.assign(new Error('x'), { code: 'ECONNREFUSED' }))).toBe(true)
    expect(isConnectionError(wrapped(Object.assign(new Error('x'), { code: '57P01' })))).toBe(true)
  })

  it('does not retry validation and other errors', () => {
    expect(isConnectionError(new Error('The following field is invalid: phone'))).toBe(false)
    expect(isConnectionError(null)).toBe(false)
  })
})

describe('persistLead', () => {
  const wait = vi.fn(async () => undefined)

  it('saves straight away when the database answers', async () => {
    const save = vi.fn(async () => ({ id: 1 }))
    const backup = vi.fn(async () => undefined)
    expect(await persistLead({ save, backup, wait })).toEqual({ saved: true, result: { id: 1 } })
    expect(backup).not.toHaveBeenCalled()
  })

  it('retries once after a connection error (cold start)', async () => {
    const save = vi
      .fn<() => Promise<{ id: number }>>()
      .mockRejectedValueOnce(connectionError())
      .mockResolvedValueOnce({ id: 2 })
    const backup = vi.fn(async () => undefined)
    expect(await persistLead({ save, backup, wait, retryDelayMs: 10 })).toEqual({
      saved: true,
      result: { id: 2 },
    })
    expect(save).toHaveBeenCalledTimes(2)
    expect(wait).toHaveBeenCalledWith(10)
  })

  it('backs the lead up when the retry fails too', async () => {
    const save = vi.fn(async () => {
      throw connectionError()
    })
    const backup = vi.fn(async () => undefined)
    const result = await persistLead({ save, backup, wait })
    expect(result).toEqual({
      saved: false,
      backedUp: true,
      error: 'Connection terminated due to connection timeout',
    })
    expect(save).toHaveBeenCalledTimes(2)
    expect(backup).toHaveBeenCalledOnce()
  })

  it('backs up other errors without retrying', async () => {
    const save = vi.fn(async () => {
      throw new Error('ValidationError')
    })
    const backup = vi.fn(async () => undefined)
    expect((await persistLead({ save, backup, wait })).saved).toBe(false)
    expect(save).toHaveBeenCalledOnce()
  })

  it('reports when even the backup fails', async () => {
    const result = await persistLead({
      save: async () => {
        throw new Error('down')
      },
      backup: async () => {
        throw new Error('also down')
      },
      wait,
    })
    expect(result).toMatchObject({ saved: false, backedUp: false })
  })
})

describe('backups and re-import', () => {
  let root: string
  let store: LocalObjectStore

  beforeEach(async () => {
    root = await mkdtemp(path.join(os.tmpdir(), 'washcraft-backup-'))
    store = new LocalObjectStore(root, () => 'unused')
  })
  afterEach(() => rm(root, { recursive: true, force: true }))

  const record = failedLeadRecord(
    { type: 'quick', name: 'Maria', phone: '3035550199' },
    [],
    'Connection terminated',
    new Date('2026-10-21T12:00:00Z'),
  )

  it('writes the record to storage and emails it to the owner', async () => {
    const emailOwner = vi.fn(async () => undefined)
    await backupLead(record, store, emailOwner)
    expect(emailOwner).toHaveBeenCalledOnce()
    expect(failedLeadKey(record)).toMatch(/^failed-leads\/2026-10-21-[0-9a-f-]{36}\.json$/)
    expect(await pendingFailedLeads(store)).toEqual([failedLeadKey(record)])
  })

  it('succeeds when only one of storage or email works', async () => {
    await expect(
      backupLead(record, store, async () => {
        throw new Error('no email')
      }),
    ).resolves.toBeUndefined()
  })

  it('re-imports each backed-up lead exactly once', async () => {
    await backupLead(record, store, async () => undefined)
    await store.put('failed-leads/2026-10-21-broken.json', 'not json', 'application/json')
    const create = vi.fn(async () => ({ id: 99 }))

    const first = await reimportFailedLeads(store, create)
    expect(first.imported).toEqual([failedLeadKey(record)])
    expect(first.failed).toEqual(['failed-leads/2026-10-21-broken.json'])
    expect(create).toHaveBeenCalledWith(expect.objectContaining({ lead: record.lead }))

    const second = await reimportFailedLeads(store, create)
    expect(second.imported).toEqual([])
    expect(create).toHaveBeenCalledOnce()
    expect(await store.list('failed-leads/imported/')).toHaveLength(1)
  })
})
