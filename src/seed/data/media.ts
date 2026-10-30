import type { Season } from '@/config/catalog'

/**
 * The owner's job photos (src/seed/media/*.jpg), supplied 2026-10-21. Baked-in "before/after"
 * labels were cropped off, side-by-side shots split, and license plates blurred. No captions
 * name a city, because the photos weren't tagged with one.
 */
export const mediaFiles = {
  'pavers-before': 'Brick paver path with green moss and dark grime spreading across the bricks',
  'pavers-after': 'The same paver path after cleaning, with even, bright bricks',
  'side-path-before': 'Gray, stained concrete side path between two brick walls',
  'side-path-after': 'The same concrete path after pressure washing, much lighter and even',
  'brick-steps-before': 'Brick steps darkened by grime and algae',
  'brick-steps-after':
    'The same brick steps after cleaning, with bright red brick and clean joints',
  'siding-before': 'Light siding streaked with green and black algae',
  'siding-after': 'The same siding after a soft wash, clean and bright',
  'siding-split': 'Side-by-side view of siding before and after a soft wash',
  'gutter-before': 'Roof edge with moss on the shingles and debris in the gutter',
  'gutter-after': 'The same gutter cleaned out, with the roof edge clear',
  'gutter-2-before': 'Gutter packed with pine needles, leaves and moss',
  'gutter-2-after': 'The same gutter emptied and flushed clean',
  'roof-before': 'Shingle roof with clumps of moss along the rows',
  'roof-after': 'The same roof after cleaning, with the moss cleared',
  'railing-before': 'Black metal railing covered in yellow and gray lichen',
  'railing-after': 'The same railing after cleaning, glossy black',
  'skylight-before': 'Glass skylight covered with leaves, seeds and water stains',
  'skylight-after': 'The same skylight after cleaning, with clear glass',
  'brick-steps-half':
    'Brick steps half cleaned, with dirty brick on the left and bright brick on the right',
  'window-cleaning-pole': 'Technician cleaning high windows on a tall house with a water-fed pole',
  'skylights-roof': 'Two clean skylights on a dark shingle roof',
  'roof-moss-leaves': 'Roof section covered in moss and fallen leaves under a tree',
} as const satisfies Record<string, string>

export type MediaKey = keyof typeof mediaFiles

export const gallery: {
  caption: string
  service: string
  before: MediaKey
  after: MediaKey
  featured?: boolean
}[] = [
  {
    caption: 'Paver path: moss and grime lifted',
    service: 'pressure-washing',
    before: 'pavers-before',
    after: 'pavers-after',
    featured: true,
  },
  {
    caption: 'Siding cleared of green and black streaks',
    service: 'soft-washing',
    before: 'siding-before',
    after: 'siding-after',
    featured: true,
  },
  {
    caption: 'Gutter cleared and flushed',
    service: 'gutter-cleaning',
    before: 'gutter-before',
    after: 'gutter-after',
    featured: true,
  },
  {
    caption: 'Brick steps restored',
    service: 'pressure-washing',
    before: 'brick-steps-before',
    after: 'brick-steps-after',
    featured: true,
  },
  {
    caption: 'Shingle roof cleared of moss',
    service: 'roof-cleaning',
    before: 'roof-before',
    after: 'roof-after',
    featured: true,
  },
  {
    caption: 'Concrete side path brightened',
    service: 'pressure-washing',
    before: 'side-path-before',
    after: 'side-path-after',
    featured: true,
  },
  {
    caption: 'Packed gutter cleaned out by hand',
    service: 'gutter-cleaning',
    before: 'gutter-2-before',
    after: 'gutter-2-after',
  },
  {
    caption: 'Lichen washed off a metal railing',
    service: 'patio-balcony-cleaning',
    before: 'railing-before',
    after: 'railing-after',
  },
  {
    caption: 'Skylight glass cleared of debris',
    service: 'window-cleaning',
    before: 'skylight-before',
    after: 'skylight-after',
  },
]

/** Hero photos, filled in only where the page has none yet. */
export const serviceHeroImages: Record<string, MediaKey> = {
  'pressure-washing': 'brick-steps-half',
  'soft-washing': 'siding-split',
  'house-washing': 'siding-after',
  'patio-balcony-cleaning': 'pavers-after',
  'gutter-cleaning': 'gutter-after',
  'roof-cleaning': 'roof-after',
  // 'window-cleaning-pole' shows high windows; not used as a hero until heights are confirmed.
  'exterior-surface-cleaning': 'railing-after',
  'glass-awning-cleaning': 'skylights-roof',
  'commercial-gutter-cleaning': 'gutter-2-after',
}

export const solutionHeroImages: Record<string, MediaKey> = {
  'roof-moss-and-algae-removal': 'roof-moss-leaves',
  'overflowing-gutters': 'gutter-2-before',
  'green-algae-on-siding': 'siding-split',
}

export const homeHeroImages: Partial<Record<Season, MediaKey>> = {
  spring: 'siding-after',
  summer: 'pavers-after',
  fall: 'gutter-after',
  'all-year': 'brick-steps-half',
}

/** "Why choose us" card photos by card title. The cards lead with icons until real photos exist. */
export const whyChooseUsImages: Record<string, MediaKey> = {}

/** Home page service explorer tabs. */
export const featuredServices = [
  'house-cleaning',
  'commercial-cleaning',
  'post-construction-cleaning',
  'soft-washing',
  'snow-removal',
  'christmas-light-installation',
]
