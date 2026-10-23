import { timingSafeEqual } from 'crypto'

import { revalidateSite } from '@/hooks/revalidate'
import { getPayloadClient } from '@/lib/data/cache'
import { env } from '@/lib/env'
import { syncGoogleReviews } from '@/lib/reviews/google'

export const dynamic = 'force-dynamic'

function authorized(header: string | null) {
  if (!env.CRON_SECRET || !header) return false
  const expected = Buffer.from(`Bearer ${env.CRON_SECRET}`)
  const given = Buffer.from(header)
  return given.length === expected.length && timingSafeEqual(given, expected)
}

/** Daily Google reviews refresh (vercel.json cron). Vercel sends CRON_SECRET as a bearer token. */
export async function GET(request: Request) {
  if (!authorized(request.headers.get('authorization'))) {
    return Response.json({ error: 'Not allowed' }, { status: 401 })
  }
  try {
    const result = await syncGoogleReviews({
      payload: await getPayloadClient(),
      apiKey: env.GOOGLE_PLACES_API_KEY,
    })
    console.info('[google-reviews]', result)
    if (result.status === 'synced') revalidateSite()
    return Response.json(result)
  } catch (error) {
    console.error('[google-reviews] sync failed', error)
    return Response.json({ error: 'Sync failed; see the server log.' }, { status: 502 })
  }
}
