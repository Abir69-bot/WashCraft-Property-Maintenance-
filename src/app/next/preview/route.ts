import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

import { getPayloadClient } from '@/lib/data/cache'
import { isSafePath } from '@/lib/preview'

/**
 * The admin's "Preview" button. Signed-in staff get Next's draft-mode cookie, which bypasses the
 * page cache so they see the latest draft (and sample content) until they exit preview.
 */
export async function GET(request: Request) {
  const path = new URL(request.url).searchParams.get('path') ?? ''
  if (!isSafePath(path)) return new Response('Invalid preview path.', { status: 400 })

  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: request.headers })
  if (!user) return new Response('Sign in to the admin to preview drafts.', { status: 401 })

  ;(await draftMode()).enable()
  redirect(path)
}
