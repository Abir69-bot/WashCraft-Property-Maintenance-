import { env, r2Config } from '@/lib/env'
import { privateStore, verifyLocalUpload } from '@/lib/storage'

/**
 * Development stand-in for a presigned R2 upload: accepts one PUT to a URL signed by
 * `localUploadUrl`. Disabled when R2 is configured (production uploads go straight to R2).
 */
export async function PUT(request: Request) {
  if (r2Config(env, 'private')) return new Response('Not found', { status: 404 })
  const upload = verifyLocalUpload(new URL(request.url).searchParams)
  if (!upload) return new Response('Upload link expired or invalid.', { status: 403 })
  if (request.headers.get('content-type') !== upload.type) {
    return new Response('Unexpected file type.', { status: 400 })
  }
  const body = new Uint8Array(await request.arrayBuffer())
  if (body.byteLength !== upload.size) return new Response('Unexpected size.', { status: 400 })
  await privateStore().put(upload.key, body, upload.type)
  return new Response(null, { status: 204 })
}
