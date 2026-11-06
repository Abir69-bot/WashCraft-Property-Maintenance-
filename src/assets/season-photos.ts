import fall from '../../public/images/seasons/fall.jpg'
import summer from '../../public/images/seasons/summer.jpg'
import winter from '../../public/images/seasons/winter.jpg'

import type { Photo } from '@/lib/photos'

/**
 * Photos the owner supplied for the home page's season tabs. They come first, ahead of the
 * season's hero photo and its services' photos. Keyed by season.
 */
export const seasonPhotos: Partial<Record<string, Photo>> = {
  // Supplied by the owner (2026-11-06).
  summer: {
    src: summer,
    alt: 'A surface cleaner on a freshly washed backyard stone patio, with steps, a covered grill and outdoor dining chairs',
  },
  // Supplied by the owner (2026-11-06).
  fall: {
    src: fall,
    alt: 'A gloved WashCraft worker on a ladder pulling wet autumn leaves out of a house gutter',
  },
  // Supplied by the owner (2026-11-06): the same driveway before and after clearing, side by side.
  winter: {
    src: winter,
    alt: 'A brick house’s driveway side by side: covered in snow on the left, and cleared to wet pavement with snow banked along the edges on the right',
  },
}
