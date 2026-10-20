import type { Access, Where } from 'payload'

import { isProductionSite } from '@/lib/env'

const PUBLISHED: Where = { _status: { equals: 'published' } }
const NOT_SAMPLE: Where = { or: [{ isSample: { equals: false } }, { isSample: { exists: false } }] }

/**
 * Read access for public content. Signed-in users see everything, including drafts and samples.
 * Visitors see published documents only (`drafts`) and, on the live site, never sample content
 * (`samples`, brief §3.2).
 *
 * The local API skips access control by default, so public pages must query with
 * `overrideAccess: false` for these rules to apply.
 */
export function publicRead({
  drafts = false,
  samples = false,
  production = isProductionSite,
}: { drafts?: boolean; samples?: boolean; production?: boolean } = {}): Access {
  return ({ req }) => {
    if (req.user) return true
    const and: Where[] = []
    if (drafts) and.push(PUBLISHED)
    if (samples && production) and.push(NOT_SAMPLE)
    return and.length === 0 ? true : { and }
  }
}
