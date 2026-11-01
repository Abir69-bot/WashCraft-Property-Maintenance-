import type { Media } from '@/payload-types'

import { cachedQuery, getPayloadClient } from './cache'

/** Service photos set in the admin (each service's hero image), by service slug. */
export const getServicePhotos = cachedQuery(
  'service-photos',
  async (): Promise<Record<string, Media>> => {
    const payload = await getPayloadClient()
    const services = await payload.find({
      collection: 'services',
      overrideAccess: false,
      pagination: false,
      where: { heroImage: { exists: true } },
      depth: 1,
      select: { slug: true, heroImage: true },
    })
    return Object.fromEntries(
      services.docs.flatMap((service) =>
        service.heroImage && typeof service.heroImage === 'object'
          ? [[service.slug, service.heroImage]]
          : [],
      ),
    )
  },
)
