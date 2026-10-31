import { mkdtemp, readFile, rm } from 'fs/promises'
import os from 'os'
import path from 'path'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { LocalObjectStore } from '@/lib/storage/object-store'

import { checkUpload, newFileKey, safeFilename, sniffType, verifyUploads } from './lead-files'

const bytes = (...values: (number | string)[]) =>
  new Uint8Array(
    values.flatMap((value) =>
      typeof value === 'string' ? [...value].map((char) => char.charCodeAt(0)) : [value],
    ),
  )

const JPEG = bytes(0xff, 0xd8, 0xff, 0xe0, 0, 0x10, 'JFIF', 0, 0, 0, 0, 0, 0)
const PNG = bytes(0x89, 'PNG', 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0, 0, 0, 0, 0)
const PDF = bytes('%PDF-1.7', 0, 0, 0, 0, 0, 0, 0, 0)

describe('sniffType', () => {
  it('recognizes allowed files by their content', () => {
    expect(sniffType(JPEG)).toBe('image/jpeg')
    expect(sniffType(PNG)).toBe('image/png')
    expect(sniffType(bytes('RIFF', 0, 0, 0, 0, 'WEBPVP8 '))).toBe('image/webp')
    expect(sniffType(bytes(0, 0, 0, 0x18, 'ftypheic', 0, 0, 0, 0))).toBe('image/heic')
    expect(sniffType(PDF)).toBe('application/pdf')
  })

  it('recognizes JPEGs whatever marker follows the start of image', () => {
    for (const marker of [0xe0, 0xe1, 0xdb, 0xee]) {
      expect(sniffType(bytes(0xff, 0xd8, 0xff, marker, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0))).toBe(
        'image/jpeg',
      )
    }
  })

  it('rejects everything else, whatever it is called', () => {
    expect(sniffType(bytes('<svg xmlns="ht'))).toBeNull()
    expect(sniffType(bytes('MZ', 0x90, 0, 3, 0, 0, 0, 4, 0, 0, 0, 0xff, 0xff, 0, 0))).toBeNull()
  })
})

describe('checkUpload', () => {
  it('allows photos up to 10 MB, and PDFs only for documents', () => {
    expect(checkUpload({ type: 'image/jpeg', size: 2_000_000 }, 'photo')).toBeNull()
    expect(checkUpload({ type: 'image/heif', size: 2_000_000 }, 'photo')).toBeNull()
    expect(checkUpload({ type: 'application/pdf', size: 1000 }, 'photo')).toMatch(/Photos must/)
    expect(checkUpload({ type: 'application/pdf', size: 1000 }, 'document')).toBeNull()
    expect(checkUpload({ type: 'image/png', size: 11 * 1024 * 1024 }, 'photo')).toMatch(/10 MB/)
    expect(checkUpload({ type: 'image/png', size: 0 }, 'photo')).toMatch(/empty/)
  })
})

describe('safeFilename', () => {
  it('drops folders and odd characters', () => {
    expect(safeFilename(String.raw`C:\Users\me\driveway (1).jpg`)).toBe('driveway (1).jpg')
    expect(safeFilename('../../etc/passwd')).toBe('passwd')
    expect(safeFilename('<script>.pdf')).toBe('_script_.pdf')
  })
})

describe('verifyUploads', () => {
  let root: string
  let store: LocalObjectStore

  beforeEach(async () => {
    root = await mkdtemp(path.join(os.tmpdir(), 'washcraft-files-'))
    store = new LocalObjectStore(root, () => 'unused')
  })
  afterEach(() => rm(root, { recursive: true, force: true }))

  it('keeps real files and deletes disguised or unknown ones', async () => {
    const photo = newFileKey('image/jpeg')
    const fake = newFileKey('image/jpeg')
    await store.put(photo, JPEG, 'image/jpeg')
    await store.put(fake, bytes('<html><script>alert(1)'), 'image/jpeg')

    const checked = await verifyUploads(
      [
        { key: photo, name: 'front yard.jpg' },
        { key: fake, name: 'not really.jpg' },
        { key: 'lead-files/../secret', name: 'x' },
        { key: newFileKey('image/png'), name: 'never uploaded.png' },
      ],
      'photo',
      store,
    )

    expect(checked).toEqual([
      { key: photo, filename: 'front yard.jpg', mimeType: 'image/jpeg', size: JPEG.length },
    ])
    expect(await store.head(fake)).toBeNull()
  })

  it('accepts real JPEG and PNG photos, and says why it rejects a disguised one', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const fixture = (name: string) => readFile(path.resolve('e2e', 'fixtures', name))
    const jpeg = newFileKey('image/jpeg')
    const png = newFileKey('image/png')
    const fake = newFileKey('image/jpeg')
    await store.put(jpeg, await fixture('photo.jpg'), 'image/jpeg')
    await store.put(png, await fixture('photo.png'), 'image/png')
    await store.put(fake, await fixture('not-a-photo.jpg'), 'image/jpeg')

    const checked = await verifyUploads(
      [
        { key: jpeg, name: 'driveway.jpeg' },
        { key: png, name: 'patio.png' },
        { key: fake, name: 'not-a-photo.jpg' },
      ],
      'photo',
      store,
    )

    expect(checked.map((file) => [file.filename, file.mimeType])).toEqual([
      ['driveway.jpeg', 'image/jpeg'],
      ['patio.png', 'image/png'],
    ])
    expect(warn).toHaveBeenCalledOnce()
    expect(warn.mock.calls[0][0]).toBe(
      `[lead-files] rejected upload ${fake}: content is not a JPEG, PNG, WebP, HEIC or PDF`,
    )
    warn.mockRestore()
  })

  it('logs a missing or oversized upload as such, not as an unknown type', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const missing = newFileKey('image/jpeg')
    const large = newFileKey('image/jpeg')
    await store.put(
      large,
      new Uint8Array([...JPEG, ...new Uint8Array(10 * 1024 * 1024)]),
      'image/jpeg',
    )

    expect(
      await verifyUploads(
        [
          { key: missing, name: 'gone.jpg' },
          { key: large, name: 'huge.jpg' },
        ],
        'photo',
        store,
      ),
    ).toEqual([])
    expect(warn.mock.calls.map(([message]) => message)).toEqual([
      `[lead-files] rejected upload ${missing}: not found in storage`,
      `[lead-files] rejected upload ${large}: larger than 10 MB`,
    ])
    expect(await store.head(large)).toBeNull()
    warn.mockRestore()
  })

  it('only accepts PDFs where documents are allowed', async () => {
    const pdf = newFileKey('application/pdf')
    await store.put(pdf, PDF, 'application/pdf')
    expect(await verifyUploads([{ key: pdf, name: 'rfp.pdf' }], 'photo', store)).toEqual([])
    await store.put(pdf, PDF, 'application/pdf')
    expect(await verifyUploads([{ key: pdf, name: 'rfp.pdf' }], 'document', store)).toHaveLength(1)
  })
})
