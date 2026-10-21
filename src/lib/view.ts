import type { ServiceGroup } from '@/components/quote/quick-quote-form'
import type { NavCategory } from '@/lib/data/layout'
import type { Media } from '@/payload-types'

/** Options for the grouped service <select> in quote forms. */
export function serviceGroups(categories: NavCategory[]): ServiceGroup[] {
  return categories
    .filter((category) => category.services.length > 0)
    .map((category) => ({
      label: category.title,
      options: category.services.map((service) => ({ value: service.slug, label: service.title })),
    }))
}

/** An upload field's value once populated (depth ≥ 1), or null. */
export function asMedia(value: number | Media | null | undefined): Media | null {
  return value && typeof value === 'object' && value.url ? value : null
}

/**
 * Image src for next/image. Files Payload serves itself become same-origin paths
 * (allowed by `images.localPatterns`); cloud storage URLs stay absolute.
 */
export function mediaSrc(media: Pick<Media, 'url'>): string {
  const url = media.url ?? ''
  try {
    const parsed = new URL(url, 'http://local')
    return parsed.pathname.startsWith('/api/media/file/') ? parsed.pathname : url
  } catch {
    return url
  }
}

export function formatDate(iso: string | null | undefined, locale = 'en-US') {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
