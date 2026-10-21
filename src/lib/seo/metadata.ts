import type { Metadata } from 'next'

import type { SiteConfig } from '@/config/site'
import { routes } from '@/lib/routes'
import { fillTokens } from '@/lib/text'
import { asMedia, mediaSrc } from '@/lib/view'
import type { Media, ServiceCategory } from '@/payload-types'

import { categoryTitle } from './titles'

/** The SEO tab (`meta`) on page documents. */
export type SeoFields =
  | { title?: string | null; description?: string | null; image?: number | Media | null }
  | null
  | undefined

/** Shortens text for a search-result description, cutting at a word boundary. */
export function excerpt(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max - 1)
  const end = clean[max - 1] === ' ' ? cut.length : cut.lastIndexOf(' ')
  return `${cut.slice(0, end).replace(/[\s,.:;–-]+$/, '')}…`
}

/**
 * Metadata for a content page (brief §13): the page-type title pattern unless the SEO tab sets
 * one, a canonical URL and Open Graph tags. The site layout's title template adds the
 * " | WashCraft" suffix; SEO-tab titles already include it.
 */
export function pageMetadata({
  path,
  title,
  description,
  seo,
  image,
  siteName,
}: {
  path: string
  title: string
  description: string
  seo?: SeoFields
  image?: Media | null
  siteName: string
}): Metadata {
  const summary = seo?.description || excerpt(description)
  const ogImage = asMedia(seo?.image) ?? image ?? null
  return {
    title: seo?.title ? { absolute: seo.title } : title,
    description: summary,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName,
      url: path,
      title: seo?.title || `${title} | ${siteName}`,
      description: summary,
      ...(ogImage && { images: [{ url: mediaSrc(ogImage), alt: ogImage.alt }] }),
    },
  }
}

/** Category hubs, including /commercial (brief §13: "[Category] Services in [Region]"). */
export function categoryMetadata(site: SiteConfig, category: ServiceCategory): Metadata {
  return pageMetadata({
    path: routes.category(category.slug),
    title: categoryTitle(category.title, { region: site.region }),
    description: fillTokens(category.intro, { region: site.region }),
    seo: category.meta,
    image: asMedia(category.heroImage),
    siteName: site.shortName,
  })
}
