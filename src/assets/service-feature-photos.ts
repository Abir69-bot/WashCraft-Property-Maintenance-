import commercialCleaning from '../../public/images/services/commercial-cleaning.jpg'
import postConstructionCleaning from '../../public/images/services/post-construction-cleaning.jpg'
import windowCleaning from '../../public/images/services/window-cleaning.jpg'

import type { Photo } from '@/lib/photos'

/**
 * Images the owner supplied for a service: its card photo (lib/photos.ts, unless the admin has
 * one) and, when the service has no before-and-after pair, the photo beside "Why it matters" on
 * its page. Keyed by service slug.
 */
export const serviceFeaturePhotos: Record<string, Photo> = {
  // Supplied by the owner (2026-11-05; replaced 2026-11-06).
  'commercial-cleaning': {
    src: commercialCleaning,
    alt: 'A worker in a WashCraft hoodie cleaning the paved entrance of a glass-fronted commercial building with a surface cleaner, beside a WashCraft trailer',
  },
  // Supplied by the owner (2026-11-06).
  'post-construction-cleaning': {
    src: postConstructionCleaning,
    alt: 'Three WashCraft workers cleaning a newly built open-plan home: one wipes a window, one wipes the kitchen island and one vacuums drywall dust off the floor',
  },
  // Supplied by the owner (2026-11-06).
  'window-cleaning': {
    src: windowCleaning,
    alt: 'A WashCraft worker cleaning the upper windows of a stone house with a water-fed pole, beside a WashCraft van',
  },
}
