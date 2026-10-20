import type { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'

import { site } from '@/config/site'
import { env } from '@/lib/env'
import { DOC_PATHS } from '@/lib/routes'

import { documentTitle } from './titles'

/** "Generate" button in the admin SEO tab: the same title the page uses by default. */
export const generateSeoTitle: GenerateTitle = async ({ collectionConfig, doc, req }) => {
  const settings = await req.payload.findGlobal({ slug: 'site-settings', depth: 0, req })
  const region = settings.region || site.region
  return `${documentTitle(collectionConfig?.slug, doc, { region })} | ${settings.shortName || site.shortName}`
}

export const generateSeoUrl: GenerateURL = ({ collectionConfig, doc }) => {
  const slug = collectionConfig?.slug
  const path =
    slug && slug in DOC_PATHS && typeof doc?.slug === 'string'
      ? DOC_PATHS[slug as keyof typeof DOC_PATHS](doc.slug)
      : '/'
  return `${env.NEXT_PUBLIC_SITE_URL}${path}`
}
