import { randomUUID } from 'crypto'
import type { BasePayload, CollectionAfterDeleteHook, PayloadHandler } from 'payload'

import type { FileRef } from '@/lib/schemas/fields'
import { privateStore, type ObjectStore } from '@/lib/storage'

/**
 * Customer uploads (brief §10.5): images (JPEG, PNG, HEIC, WebP) and PDFs, 10 MB each, checked
 * by their content rather than their name, kept in private storage and only ever downloaded by
 * signed-in staff.
 */

export const MAX_FILE_BYTES = 10 * 1024 * 1024

export const FILE_KINDS = {
  photo: ['image/jpeg', 'image/png', 'image/webp', 'image/heic'],
  document: ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf'],
} as const
export type FileKind = keyof typeof FILE_KINDS

const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/heic': 'heic',
  'application/pdf': 'pdf',
}

/** Browsers report HEIC/HEIF inconsistently; treat them as one type. */
export const normalizeType = (type: string) =>
  type === 'image/heif' || type === 'image/heic-sequence' ? 'image/heic' : type.toLowerCase()

const startsWith = (bytes: Uint8Array, signature: number[], offset = 0) =>
  signature.every((byte, index) => bytes[offset + index] === byte)
const ascii = (bytes: Uint8Array, from: number, to: number) =>
  String.fromCharCode(...bytes.slice(from, to))

/** The real type of a file from its first 16 bytes, or null if it isn't one we accept. */
export function sniffType(bytes: Uint8Array): string | null {
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return 'image/jpeg'
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return 'image/png'
  if (ascii(bytes, 0, 4) === 'RIFF' && ascii(bytes, 8, 12) === 'WEBP') return 'image/webp'
  if (ascii(bytes, 0, 5) === '%PDF-') return 'application/pdf'
  const brand = ascii(bytes, 8, 12)
  if (
    ascii(bytes, 4, 8) === 'ftyp' &&
    ['heic', 'heix', 'hevc', 'hevx', 'heim', 'heis', 'mif1', 'msf1'].includes(brand)
  ) {
    return 'image/heic'
  }
  return null
}

/** Storage key for a new upload: lead-files/<yyyy-mm>/<uuid>.<ext>. */
export function newFileKey(type: string, now = new Date()) {
  return `lead-files/${now.toISOString().slice(0, 7)}/${randomUUID()}.${EXTENSIONS[type]}`
}

const FILE_KEY = /^lead-files\/\d{4}-\d{2}\/[0-9a-f-]{36}\.(jpg|png|webp|heic|pdf)$/

/** A display name without folders or odd characters. */
export const safeFilename = (name: string) =>
  name
    .split(/[\\/]/)
    .pop()!
    .replace(/[^\w.\- ()]+/g, '_')
    .slice(-120) || 'file'

/** Checks an upload request before handing out an upload URL. Returns an error message. */
export function checkUpload(file: { type: string; size: number }, kind: FileKind): string | null {
  const type = normalizeType(file.type)
  if (!(FILE_KINDS[kind] as readonly string[]).includes(type)) {
    return kind === 'photo'
      ? 'Photos must be JPEG, PNG, HEIC or WebP.'
      : 'Files must be PDF, JPEG, PNG, HEIC or WebP.'
  }
  if (!Number.isInteger(file.size) || file.size <= 0) return 'That file is empty.'
  if (file.size > MAX_FILE_BYTES) return 'Each file can be up to 10 MB.'
  return null
}

/** What we know about an uploaded file once it has been checked. */
export type CheckedFile = { key: string; filename: string; mimeType: string; size: number }

/**
 * Confirms each uploaded file exists, is under the size limit and really is an allowed type.
 * Anything else is deleted from storage and skipped.
 */
export async function verifyUploads(
  refs: FileRef[],
  kind: FileKind,
  store: ObjectStore = privateStore(),
): Promise<CheckedFile[]> {
  const checked: CheckedFile[] = []
  for (const ref of refs) {
    if (!FILE_KEY.test(ref.key)) continue
    const info = await store.head(ref.key)
    const start = info ? await store.readStart(ref.key, 16) : null
    const type = start ? sniffType(start) : null
    const allowed = type && (FILE_KINDS[kind] as readonly string[]).includes(type)
    if (!info || !allowed || info.size > MAX_FILE_BYTES) {
      if (info) await store.delete(ref.key).catch(() => undefined)
      console.warn(`[lead-files] rejected upload ${ref.key} (${type ?? 'unknown type'})`)
      continue
    }
    checked.push({
      key: ref.key,
      filename: safeFilename(ref.name),
      mimeType: type,
      size: info.size,
    })
  }
  return checked
}

/** Creates the lead-files records for checked uploads and returns their ids. */
export async function createFileRecords(payload: BasePayload, files: CheckedFile[]) {
  const ids: number[] = []
  for (const file of files) {
    const doc = await payload.create({ collection: 'lead-files', overrideAccess: true, data: file })
    ids.push(doc.id)
  }
  return ids
}

/** GET /api/lead-files/:id/download — staff only, always as a download. */
export const downloadLeadFile: PayloadHandler = async (req) => {
  if (!req.user) return Response.json({ error: 'Sign in to download files.' }, { status: 401 })
  const id = Number(req.routeParams?.id)
  if (!Number.isInteger(id)) return Response.json({ error: 'Not found' }, { status: 404 })
  const doc = await req.payload
    .findByID({ collection: 'lead-files', id, req, overrideAccess: false })
    .catch(() => null)
  const object = doc ? await privateStore().get(doc.key) : null
  if (!doc || !object) return Response.json({ error: 'Not found' }, { status: 404 })
  const asciiName = doc.filename.replace(/[^\x20-\x7e]/g, '_').replace(/"/g, '')
  return new Response(object.body as BodyInit, {
    headers: {
      'Content-Type': doc.mimeType,
      'Content-Disposition': `attachment; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(doc.filename)}`,
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}

/** Deleting a lead file in the admin also deletes it from storage. */
export const removeStoredFile: CollectionAfterDeleteHook = async ({ doc }) => {
  try {
    await privateStore().delete(doc.key)
  } catch (error) {
    console.error(`[lead-files] could not delete ${doc.key} from storage`, error)
  }
}
