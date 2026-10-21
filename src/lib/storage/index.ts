import path from 'path'

import { env, r2Config } from '@/lib/env'
import { sign, verify } from '@/lib/signing'

import { LocalObjectStore, S3ObjectStore, type ObjectStore } from './object-store'

export { isSafeKey, type ObjectStore } from './object-store'

export const LOCAL_UPLOAD_ROUTE = '/next/upload'
const UPLOAD_TTL = 10 * 60 * 1000

const uploadPayload = (key: string, type: string, size: number, expires: number) =>
  `upload|${key}|${type}|${size}|${expires}`

/** Signed URL for the development upload route, valid for 10 minutes. */
export function localUploadUrl(key: string, type: string, size: number, now = Date.now()) {
  const expires = now + UPLOAD_TTL
  const params = new URLSearchParams({
    key,
    type,
    size: String(size),
    expires: String(expires),
    sig: sign(uploadPayload(key, type, size, expires)),
  })
  return `${LOCAL_UPLOAD_ROUTE}?${params}`
}

/** The upload a local URL allows, or null if it was tampered with or has expired. */
export function verifyLocalUpload(params: URLSearchParams, now = Date.now()) {
  const key = params.get('key') ?? ''
  const type = params.get('type') ?? ''
  const size = Number(params.get('size'))
  const expires = Number(params.get('expires'))
  const sig = params.get('sig') ?? ''
  if (!Number.isFinite(size) || !Number.isFinite(expires) || expires < now) return null
  return verify(uploadPayload(key, type, size, expires), sig) ? { key, type, size } : null
}

let store: ObjectStore | undefined

/** Private storage: R2 when its keys are set, otherwise PRIVATE_UPLOADS_DIR on disk. */
export function privateStore(): ObjectStore {
  if (!store) {
    const r2 = r2Config(env, 'private')
    store = r2
      ? new S3ObjectStore(r2)
      : new LocalObjectStore(path.resolve(process.cwd(), env.PRIVATE_UPLOADS_DIR), localUploadUrl)
  }
  return store
}
