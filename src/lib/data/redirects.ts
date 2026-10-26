import { notFound, permanentRedirect, redirect } from 'next/navigation'

import { DOC_PATHS } from '@/lib/routes'
import type { Redirect } from '@/payload-types'

import { cachedQuery, getPayloadClient } from './cache'

/**
 * Redirects from the admin (Admin → Redirects, and the ones added when a slug changes). They are
 * only looked up when a page would otherwise be a 404, so real pages never pay for them.
 */

export type SiteRedirect = { from: string; to: string; permanent: boolean }

/** "/Services/Old/", "services/old" or "https://example.com/services/old?x=1" → "/services/old". */
export function normalizePath(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  let path: string
  try {
    path = new URL(trimmed, 'http://local').pathname
  } catch {
    return null
  }
  const clean = decodeURI(path).replace(/\/+$/, '').toLowerCase()
  return clean || '/'
}

/** Where a redirect points: a page in the CMS (by its current slug) or a typed-in URL. */
export function redirectTarget(to: Redirect['to']): string | null {
  if (to?.type === 'reference' && to.reference) {
    const { relationTo, value } = to.reference
    return typeof value === 'object' && value.slug ? DOC_PATHS[relationTo](value.slug) : null
  }
  const url = to?.url?.trim()
  if (!url) return null
  return /^https?:\/\//i.test(url) ? url : normalizePath(url)
}

export function toSiteRedirects(docs: Redirect[]): SiteRedirect[] {
  return docs.flatMap((doc) => {
    const from = normalizePath(doc.from)
    const to = redirectTarget(doc.to)
    if (!from || !to || to === from) return []
    return [{ from, to, permanent: doc.type !== '302' }]
  })
}

const slugOnly = { slug: true } as const

export const getRedirects = cachedQuery('redirects', async (): Promise<SiteRedirect[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'redirects',
    pagination: false,
    depth: 1,
    populate: {
      services: slugOnly,
      'service-categories': slugOnly,
      cities: slugOnly,
      posts: slugOnly,
      solutions: slugOnly,
    },
  })
  return toSiteRedirects(docs)
})

/**
 * Ends a page that has nothing to show: follows a redirect for this path (301 → permanent,
 * 302 → temporary), otherwise shows the 404.
 */
export async function notFoundUnlessMoved(path: string): Promise<never> {
  const from = normalizePath(path)
  const redirects = await getRedirects().catch((error) => {
    console.error('[redirects] could not load redirects', error)
    return []
  })
  const match = redirects.find((item) => item.from === from)
  if (match) {
    if (match.permanent) permanentRedirect(match.to)
    redirect(match.to)
  }
  notFound()
}
