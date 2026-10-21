import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import { cache } from 'react'

import { CONTENT_TAG } from '@/hooks/revalidate'
import { CONTENT_CACHE_VERSION } from '@/lib/env'

export const getPayloadClient = () => getPayload({ config })

/**
 * A content query cached across requests and daily page rebuilds, and cleared whenever content
 * is saved in the admin (hooks/revalidate.ts). Rebuilding a page for a new season therefore
 * reuses cached data and never wakes the database. Keys include the build's cache version, so
 * a deploy always starts fresh (e.g. after a seed or restore). Arguments are part of the key;
 * draft mode skips the cache entirely.
 */
export function cachedQuery<A extends unknown[], T>(
  key: string,
  query: (...args: A) => Promise<T>,
): (...args: A) => Promise<T> {
  return cache(
    unstable_cache(query, ['content', CONTENT_CACHE_VERSION, key], { tags: [CONTENT_TAG] }),
  )
}

/**
 * Query options for page content. Visitors get published, non-sample documents (`publicRead`);
 * staff previewing from the admin get the latest drafts, samples included.
 */
export const readAs = (draft: boolean) =>
  draft ? ({ draft: true, overrideAccess: true } as const) : ({ overrideAccess: false } as const)
