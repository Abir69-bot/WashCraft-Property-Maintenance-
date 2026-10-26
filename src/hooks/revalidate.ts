import { revalidatePath, revalidateTag } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionConfig,
  GlobalAfterChangeHook,
  GlobalConfig,
  RequestContext,
} from 'payload'

/** Tag on every cached content query (src/lib/data). */
export const CONTENT_TAG = 'content'

/**
 * Marks cached content stale and every page for regeneration on its next visit. Visitors get
 * the cached page while it rebuilds, so a save never blocks the site. Pass
 * `context: { disableRevalidate: true }` to skip (bulk scripts).
 */
export function revalidateSite(context: RequestContext = {}) {
  if (context.disableRevalidate) return
  try {
    revalidateTag(CONTENT_TAG, 'max')
    revalidatePath('/', 'layout')
  } catch {
    // Outside a Next.js request (seed, CLI, tests) there is no cache to revalidate.
  }
}

const afterChange: CollectionAfterChangeHook = ({ doc, context }) => {
  revalidateSite(context)
  return doc
}

const afterDelete: CollectionAfterDeleteHook = ({ doc, context }) => {
  revalidateSite(context)
  return doc
}

const afterGlobalChange: GlobalAfterChangeHook = ({ doc, context }) => {
  revalidateSite(context)
  return doc
}

/** Hooks that refresh the site, for collections configured elsewhere (e.g. plugin ones). */
export const revalidationHooks = { afterChange: [afterChange], afterDelete: [afterDelete] }

/** Adds site revalidation to a collection that feeds public pages. */
export function withRevalidation(collection: CollectionConfig): CollectionConfig {
  return {
    ...collection,
    hooks: {
      ...collection.hooks,
      afterChange: [...(collection.hooks?.afterChange ?? []), afterChange],
      afterDelete: [...(collection.hooks?.afterDelete ?? []), afterDelete],
    },
  }
}

export function withGlobalRevalidation(global: GlobalConfig): GlobalConfig {
  return {
    ...global,
    hooks: {
      ...global.hooks,
      afterChange: [...(global.hooks?.afterChange ?? []), afterGlobalChange],
    },
  }
}
