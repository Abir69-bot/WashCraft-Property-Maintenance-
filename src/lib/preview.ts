import { DOC_PATHS, type PageCollection } from '@/lib/routes'

export const PREVIEW_ROUTE = '/next/preview'

/** A same-site path only: blocks open redirects such as "//evil.com" or "/\evil.com". */
export const isSafePath = (path: string) => /^\/(?![/\\])/.test(path)

/** Admin "Preview" button for a page collection: opens the page in draft mode. */
export function previewUrl(collection: PageCollection) {
  return (doc: Record<string, unknown>) =>
    typeof doc.slug === 'string' && doc.slug
      ? `${PREVIEW_ROUTE}?path=${encodeURIComponent(DOC_PATHS[collection](doc.slug))}`
      : null
}
