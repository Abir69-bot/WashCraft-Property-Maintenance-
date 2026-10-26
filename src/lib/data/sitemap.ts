import type { CollectionSlug, Where } from 'payload'

import type { SitemapData } from '@/lib/seo/sitemap'

import { cachedQuery, getPayloadClient } from './cache'
import { getFeatureFlags } from './pages'

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
  const [categories, services, cities, posts, solutions, team, jobs, flags] = await Promise.all([
    list('service-categories'),
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
  ])
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
  }
})
