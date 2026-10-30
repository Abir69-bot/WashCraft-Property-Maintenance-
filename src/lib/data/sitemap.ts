import type { CollectionSlug, Where } from 'payload'

import type { SitemapData } from '@/lib/seo/sitemap'
import { publishedServices } from '@/lib/view'

import { cachedQuery, getPayloadClient } from './cache'
import { getLayoutData } from './layout'
import { getCommercialData, getFeatureFlags } from './pages'

/** Slugs and last-changed dates of every public document (published, no samples on the live site). */
export const getSitemapData = cachedQuery('sitemap', async (): Promise<SitemapData> => {
  const payload = await getPayloadClient()
  const list = async (collection: CollectionSlug, where?: Where) => {
    const { docs } = await payload.find({
      collection,
      where,
      overrideAccess: false,
      pagination: false,
      depth: 0,
      select: { slug: true, updatedAt: true },
    })
    return docs as unknown as { slug: string; updatedAt: string }[]
  }
  const [layout, services, cities, posts, solutions, team, jobs, flags, testimonials, commercial] =
    await Promise.all([
      getLayoutData(),
      list('services', { enabled: { equals: true } }),
      payload.find({
        collection: 'cities',
        overrideAccess: false,
        pagination: false,
        depth: 1,
        select: { slug: true, updatedAt: true, servicePages: true },
        populate: { services: { slug: true } },
      }),
      list('posts'),
      list('solutions'),
      list('team-members'),
      list('job-openings', { active: { equals: true } }),
      getFeatureFlags(),
      payload.count({ collection: 'testimonials', overrideAccess: false }),
      getCommercialData(),
    ])
  // A category with a single service redirects to it, so only real hubs are listed.
  const categories = layout.categories
    .filter((category) => category.services.length > 1)
    .map((category) => ({ slug: category.slug }))
  return {
    categories,
    services,
    cities: cities.docs.map((city) => ({
      slug: city.slug,
      updatedAt: city.updatedAt,
      servicePages: (city.servicePages ?? []).flatMap((service) =>
        typeof service === 'object' ? [service.slug] : [],
      ),
    })),
    posts,
    solutions,
    team,
    jobs,
    cityServicePages: Boolean(flags.cityServicePages),
    optional: {
      instantPricing: layout.quote.instantPricing,
      dedicatedForms: layout.quote.dedicatedForms,
      gallery: layout.hasGallery,
      reviews: testimonials.totalDocs > 0 || layout.site.stats.reviewCount !== null,
      hoa: publishedServices(commercial.pages.hoa.services).length > 0,
    },
  }
})
