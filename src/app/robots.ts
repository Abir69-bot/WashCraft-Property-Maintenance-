import type { MetadataRoute } from 'next'

import { env, isProductionSite } from '@/lib/env'

/**
 * /robots.txt (brief §13). Preview and development deployments ask every crawler to stay out;
 * the live site keeps the admin, APIs, internal routes and the thank-you page out of search.
 * Media files and the generated share images stay crawlable.
 */
export default function robots(): MetadataRoute.Robots {
  if (!isProductionSite) return { rules: { userAgent: '*', disallow: '/' } }
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/api/media/', '/next/og'],
      disallow: ['/admin', '/api/', '/next/', '/quote/thank-you'],
    },
    sitemap: new URL('/sitemap.xml', env.NEXT_PUBLIC_SITE_URL).toString(),
  }
}
