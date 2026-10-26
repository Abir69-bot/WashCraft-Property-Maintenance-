import type { MetadataRoute } from 'next'

import { getSitemapData } from '@/lib/data/sitemap'
import { env } from '@/lib/env'
import { sitemapEntries } from '@/lib/seo/sitemap'

/** /sitemap.xml (brief §13). Rebuilt daily and whenever content is saved. */
export const revalidate = 86400

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return sitemapEntries(await getSitemapData(), env.NEXT_PUBLIC_SITE_URL)
}
