import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import { cache } from 'react'

import { CONTENT_TAG } from '@/hooks/revalidate'

export const getPayloadClient = () => getPayload({ config })

/**
 * A content query cached across requests and daily page rebuilds, and cleared whenever content
 * is saved in the admin (hooks/revalidate.ts). Rebuilding a page for a new season therefore
 * reuses cached data and never wakes the database.
 */
export function cachedQuery<T>(key: string, query: () => Promise<T>): () => Promise<T> {
  return cache(unstable_cache(query, ['content', key], { tags: [CONTENT_TAG] }))
}
