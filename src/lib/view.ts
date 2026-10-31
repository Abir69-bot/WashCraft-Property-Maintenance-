import type { ServiceGroup } from '@/components/quote/quick-quote-form'
import type { NavCategory } from '@/lib/data/layout'
import type { Media, Service } from '@/payload-types'

/** Options for the grouped service <select> in quote forms. */
export function serviceGroups(categories: NavCategory[]): ServiceGroup[] {
  return categories
    .filter((category) => category.services.length > 0)
    .map((category) => ({
      label: category.title,
      options: category.services.map((service) => ({ value: service.slug, label: service.title })),
    }))
}

/**
 * Services from a relationship list that visitors may see: populated, published and enabled.
 * Globals populate drafts too, so lists picked in the admin (featured services, HOA services,
 * bundles) go through this before they are shown.
 */
export function publishedServices<T extends Pick<Service, 'enabled'> & { _status?: string | null }>(
  list: (number | T)[] | null | undefined,
): T[] {
  return (list ?? []).filter(
    (service): service is T =>
      typeof service === 'object' && service._status === 'published' && service.enabled !== false,
  )
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
