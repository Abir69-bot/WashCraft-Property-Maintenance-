import commercialCleaning from '../../public/images/services/commercial-cleaning.jpg'

import type { Photo } from '@/lib/photos'

/**
 * Images the owner supplied for a service page, shown beside "Why it matters" when the service
 * has no before-and-after pair. They take the place of the admin's service photo there. Keyed by
 * service slug.
 */
export const serviceFeaturePhotos: Record<string, Photo> = {
  // Supplied by the owner (2026-11-05).
  'commercial-cleaning': {
    src: commercialCleaning,
    alt: 'A worker in a WashCraft jacket pressure washing the driveway of a stone house',
  },
}
