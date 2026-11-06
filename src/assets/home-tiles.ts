import residentialCleaning from '../../public/images/home/residential-cleaning.jpg'

import type { Photo } from '@/lib/photos'

/**
 * Home page service cards that stand for a whole category instead of one service (owner,
 * 2026-11-06). The card replaces the named service's card and links to the category page, so it
 * only shows while that category has a page. Keyed by the service slug it replaces.
 */
export const categoryTiles: Record<string, { category: string; summary: string; photo: Photo }> = {
  'house-cleaning': {
    category: 'interior-cleaning',
    summary:
      'Interior house cleaning, deep cleaning, move-in and move-out cleaning, and regular home cleaning, with the checklist agreed in your written estimate.',
    photo: {
      src: residentialCleaning,
      alt: 'A WashCraft worker pressure washing the driveway of a stone house',
    },
  },
}
