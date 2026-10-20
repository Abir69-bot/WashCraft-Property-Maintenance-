import type { CollectionAfterChangeHook } from 'payload'

import { DOC_PATHS, type PageCollection } from '@/lib/routes'

/**
 * When a published page's slug changes, add a 301 from the old URL to the new one (brief §6).
 * Also drops any redirect away from the new URL, so changing a slug back can't create a loop.
 */
export function redirectOnSlugChange(collection: PageCollection): CollectionAfterChangeHook {
  const pathFor = DOC_PATHS[collection]

  return async ({ doc, previousDoc, operation, req }) => {
    const oldSlug: unknown = previousDoc?.slug
    if (operation !== 'update' || typeof oldSlug !== 'string' || oldSlug === doc.slug) return doc
    if (doc._status && doc._status !== 'published') return doc

    const from = pathFor(oldSlug)
    const to = pathFor(doc.slug)

    await req.payload.delete({ collection: 'redirects', where: { from: { equals: to } }, req })

    const existing = await req.payload.find({
      collection: 'redirects',
      where: { from: { equals: from } },
      limit: 1,
      req,
    })
    const data = { from, type: '301' as const, to: { type: 'custom' as const, url: to } }
    if (existing.docs[0]) {
      await req.payload.update({ collection: 'redirects', id: existing.docs[0].id, data, req })
    } else {
      await req.payload.create({ collection: 'redirects', data, req })
    }

    // Earlier redirects that pointed at the old URL now go straight to the new one.
    await req.payload.update({
      collection: 'redirects',
      where: { 'to.url': { equals: from } },
      data: { to: { type: 'custom', url: to } },
      req,
    })

    return doc
  }
}
