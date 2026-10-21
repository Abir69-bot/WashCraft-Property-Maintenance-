import { mkdtemp, rm } from 'fs/promises'
import os from 'os'
import path from 'path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { localUploadUrl, verifyLocalUpload } from './index'
import { isSafeKey, LocalObjectStore } from './object-store'

describe('isSafeKey', () => {
  it('accepts server-made keys only', () => {
    expect(isSafeKey('lead-files/2026-10/3f2a-photo.jpg')).toBe(true)
    expect(isSafeKey('failed-leads/2026-10-21t10-00-00z-ab12.json')).toBe(true)
    expect(isSafeKey('../etc/passwd')).toBe(false)
    expect(isSafeKey('lead-files/../../secret')).toBe(false)
    expect(isSafeKey('/absolute/path.jpg')).toBe(false)
    expect(isSafeKey('lead-files/Photo.JPG')).toBe(false)
    expect(isSafeKey('no-folder.jpg')).toBe(false)
  })
})

describe('LocalObjectStore', () => {
  let root: string
  let store: LocalObjectStore

  beforeEach(async () => {
    root = await mkdtemp(path.join(os.tmpdir(), 'washcraft-store-'))
    store = new LocalObjectStore(root, () => 'unused')
  })
  afterEach(() => rm(root, { recursive: true, force: true }))

  it('stores, reads, lists and deletes objects with their content type', async () => {
    await store.put('failed-leads/a.json', '{"a":1}', 'application/json')
    await store.put('lead-files/x/b.pdf', new Uint8Array([37, 80, 68, 70]), 'application/pdf')

    expect(await store.head('lead-files/x/b.pdf')).toEqual({
      size: 4,
      contentType: 'application/pdf',
    })
    expect(await store.readStart('lead-files/x/b.pdf', 2)).toEqual(new Uint8Array([37, 80]))
    const json = await store.get('failed-leads/a.json')
    expect(new TextDecoder().decode(json!.body)).toBe('{"a":1}')
    expect(json!.contentType).toBe('application/json')
    expect(await store.list('failed-leads/')).toEqual(['failed-leads/a.json'])

    await store.delete('failed-leads/a.json')
    expect(await store.get('failed-leads/a.json')).toBeNull()
    expect(await store.list('failed-leads/')).toEqual([])
  })

  it('refuses keys that could escape the folder', async () => {
    await expect(store.put('../outside/x.json', '{}', 'application/json')).rejects.toThrow(
      /Unsafe storage key/,
    )
  })
})

describe('local upload links', () => {
  const now = Date.parse('2026-10-21T12:00:00Z')

  it('round-trips a signed upload', () => {
    const url = new URL(localUploadUrl('lead-files/x/a.jpg', 'image/jpeg', 1234, now), 'http://x')
    expect(verifyLocalUpload(url.searchParams, now)).toEqual({
      key: 'lead-files/x/a.jpg',
      type: 'image/jpeg',
      size: 1234,
    })
  })

  it('rejects tampered or expired links', () => {
    const url = new URL(localUploadUrl('lead-files/x/a.jpg', 'image/jpeg', 1234, now), 'http://x')
    const bigger = new URLSearchParams(url.searchParams)
    bigger.set('size', '99999999')
    expect(verifyLocalUpload(bigger, now)).toBeNull()
    expect(verifyLocalUpload(url.searchParams, now + 11 * 60 * 1000)).toBeNull()
  })
})
