import type { SiteConfig } from '@/config/site'
import type {
  City,
  Footer,
  Homepage,
  Navigation,
  SeasonalSetting,
  Service,
  ServiceCategory,
} from '@/payload-types'
import { getSite } from '@/lib/site-settings'

import { cachedQuery, getPayloadClient } from './cache'

export type NavService = Pick<
  Service,
  | 'id'
  | 'title'
  | 'slug'
  | 'icon'
  | 'summary'
  | 'seasons'
  | 'quoteMode'
  | 'dedicatedFlow'
  | 'outcomeLabel'
  | 'cardBullets'
> & { category: number }

export type NavCategory = Pick<
  ServiceCategory,
  'id' | 'title' | 'slug' | 'icon' | 'tone' | 'menuLabel' | 'summary' | 'outcomeLabel'
> & { services: NavService[] }

export type AreaCity = Pick<City, 'id' | 'name' | 'slug' | 'state' | 'zipPrefixes' | 'lat' | 'lng'>

export type LayoutData = {
  site: SiteConfig
  categories: NavCategory[]
  services: NavService[]
  cities: AreaCity[]
  navigation: Navigation
  footer: Footer
  seasonal: SeasonalSetting
  heroVariants: NonNullable<Homepage['heroVariants']>
}

/** Everything the header, footer and global bars need. One cached query for every page. */
export const getLayoutData = cachedQuery('layout', async (): Promise<LayoutData> => {
  const payload = await getPayloadClient()
  const [site, categories, services, cities, navigation, footer, seasonal, homepage] =
    await Promise.all([
      getSite(payload),
      payload.find({
        collection: 'service-categories',
        overrideAccess: false,
        sort: 'order',
        pagination: false,
        depth: 0,
        select: {
          title: true,
          slug: true,
          icon: true,
          tone: true,
          menuLabel: true,
          summary: true,
          outcomeLabel: true,
        },
      }),
      payload.find({
        collection: 'services',
        overrideAccess: false,
        where: { enabled: { equals: true } },
        sort: 'order',
        pagination: false,
        depth: 0,
        select: {
          title: true,
          slug: true,
          icon: true,
          category: true,
          summary: true,
          seasons: true,
          quoteMode: true,
          dedicatedFlow: true,
          outcomeLabel: true,
          cardBullets: true,
        },
      }),
      payload.find({
        collection: 'cities',
        overrideAccess: false,
        sort: 'order',
        pagination: false,
        depth: 0,
        select: { name: true, slug: true, state: true, zipPrefixes: true, lat: true, lng: true },
      }),
      payload.findGlobal({ slug: 'navigation', depth: 0 }),
      payload.findGlobal({ slug: 'footer', depth: 0 }),
      payload.findGlobal({ slug: 'seasonal-settings', depth: 0 }),
      payload.findGlobal({ slug: 'homepage', depth: 0 }),
    ])

  const navServices = services.docs.map((service) => ({
    ...service,
    category: typeof service.category === 'object' ? service.category.id : service.category,
  })) as NavService[]

  return {
    site,
    categories: (categories.docs as Omit<NavCategory, 'services'>[]).map((category) => ({
      ...category,
      services: navServices.filter((service) => service.category === category.id),
    })),
    services: navServices,
    cities: cities.docs as AreaCity[],
    navigation,
    footer,
    seasonal,
    heroVariants: homepage.heroVariants ?? [],
  }
})
