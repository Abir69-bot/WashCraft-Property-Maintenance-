import type { MetadataRoute } from 'next'

import { routes } from '@/lib/routes'

/** Indexable pages without a document behind them. The thank-you page and styleguide are not. */
export const STATIC_PATHS = [
  routes.home,
  routes.services,
  routes.areas,
  routes.quote,
  routes.about,
  routes.careers,
  routes.blog,
  routes.solutions,
  routes.faq,
  routes.contact,
  routes.privacy,
  routes.terms,
  routes.accessibility,
]

/** Pages that only exist while a feature switch is on or there is real content to show. */
export const OPTIONAL_PATHS = {
  instantPricing: [routes.quoteInstant, routes.maintenancePlans],
  dedicatedForms: [
    routes.quoteSnowContract,
    routes.quoteHolidayLights,
    routes.quoteJunkRemoval,
    routes.quoteCommercial,
  ],
  gallery: [routes.beforeAndAfter],
  reviews: [routes.reviews],
  hoa: [routes.hoa],
} as const

type Doc = { slug: string; updatedAt?: string | null }

export type SitemapData = {
  categories: Doc[]
  services: Doc[]
  cities: (Doc & { servicePages: string[] })[]
  posts: Doc[]
  solutions: Doc[]
  team: Doc[]
  jobs: Doc[]
  cityServicePages: boolean
  optional: Record<keyof typeof OPTIONAL_PATHS, boolean>
}

/** Every public page, with the date its document last changed where there is one. */
export function sitemapEntries(data: SitemapData, origin: string): MetadataRoute.Sitemap {
  const entry = (path: string, lastModified?: string | null) => ({
    url: new URL(path, origin).toString(),
    ...(lastModified && { lastModified }),
  })
  const docs = (items: Doc[], path: (slug: string) => string) =>
    items.map((doc) => entry(path(doc.slug), doc.updatedAt))
  const serviceSlugs = new Set(data.services.map((service) => service.slug))

  return [
    ...STATIC_PATHS.map((path) => entry(path)),
    ...(Object.keys(OPTIONAL_PATHS) as (keyof typeof OPTIONAL_PATHS)[])
      .filter((key) => data.optional[key])
      .flatMap((key) => OPTIONAL_PATHS[key].map((path) => entry(path))),
    ...docs(data.categories, routes.category),
    ...docs(data.services, routes.service),
    ...docs(data.cities, routes.city),
    ...(data.cityServicePages
      ? data.cities.flatMap((city) =>
          city.servicePages
            .filter((slug) => serviceSlugs.has(slug))
            .map((slug) => entry(routes.cityService(city.slug, slug), city.updatedAt)),
        )
      : []),
    ...docs(data.posts, routes.post),
    ...docs(data.solutions, routes.solution),
    ...docs(data.team, routes.teamMember),
    ...docs(data.jobs, routes.job),
  ]
}
