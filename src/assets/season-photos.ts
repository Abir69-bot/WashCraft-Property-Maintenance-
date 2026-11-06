import fall from '../../public/images/seasons/fall.jpg'

import type { Photo } from '@/lib/photos'

/**
 * Photos the owner supplied for the home page's season tabs. They come first, ahead of the
 * season's hero photo and its services' photos. Keyed by season.
 */
export const seasonPhotos: Partial<Record<string, Photo>> = {
  // Supplied by the owner (2026-11-06).
  fall: {
    src: fall,
    alt: 'A gloved WashCraft worker on a ladder pulling wet autumn leaves out of a house gutter',
  },
}
