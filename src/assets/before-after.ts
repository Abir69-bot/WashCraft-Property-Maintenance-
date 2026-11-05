import type { StaticImageData } from 'next/image'

import snowRemovalAfter from '../../public/images/services/snow-removal-after.jpg'
import snowRemovalBefore from '../../public/images/services/snow-removal-before.jpg'
import softWashingAfter from '../../public/images/services/soft-washing-after.jpg'
import softWashingBefore from '../../public/images/services/soft-washing-before.jpg'
import windowCleaningAfter from '../../public/images/services/window-cleaning-after.jpg'
import windowCleaningBefore from '../../public/images/services/window-cleaning-before.jpg'

import type { StockPhoto } from './photos'

/**
 * Licensed before-and-after examples, shown beside "Why it matters" on service pages where the
 * owner has no pair of their own. Each is a genuine pair: the same surface or property before and
 * after the same kind of work, published as a pair by the photographer. They are labelled as
 * examples, never as WashCraft's work, and credited on the Photo Credits page. A service with no
 * verified pair has no entry (see DECISIONS.md for the search and what was rejected). Keyed by
 * service slug.
 */
export type BeforeAfterExample = {
  before: StaticImageData
  after: StaticImageData
  /** Describes what each photo shows; both name the same surface. */
  beforeAlt: string
  afterAlt: string
  /** One short line on what the pair shows. */
  caption: string
  credit: StockPhoto['credit']
}

const commons = (file: string) => `https://commons.wikimedia.org/wiki/File:${file}`
const CC_BY_SA_3 = {
  license: 'CC BY-SA 3.0',
  licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
}
const SPLIT = 'Split into separate before and after photos, trimmed and resized'

export const beforeAfterExamples: Record<string, BeforeAfterExample> = {
  'soft-washing': {
    before: softWashingBefore,
    after: softWashingAfter,
    beforeAlt: 'Pale vinyl siding streaked with green algae beside an outdoor electrical box',
    afterAlt: 'The same vinyl siding and electrical box, clean and even in color after washing',
    caption: 'Algae on vinyl siding, before and after a low-pressure wash',
    credit: {
      title: 'Before and after low pressure cleaning',
      author: 'East Coast Powerwashing',
      ...CC_BY_SA_3,
      source: commons('Before_and_after_low_pressure_cleaning.jpg'),
      changes: SPLIT,
    },
  },
  'window-cleaning': {
    before: windowCleaningBefore,
    after: windowCleaningAfter,
    beforeAlt: 'A view of a parking lot through a window spotted with dirt and water marks',
    afterAlt: 'The same view through the window after cleaning, with the cars and posts sharp',
    caption: 'Spotted window glass, before and after cleaning',
    credit: {
      title: 'Before and after window cleaning',
      author: 'Daniel Christensen',
      ...CC_BY_SA_3,
      source: commons('Before_and_after_window_cleaning.jpg'),
      changes: SPLIT,
    },
  },
  // Two photos of one driveway an hour apart, from opposite ends (the photographer's own pair).
  'snow-removal': {
    before: snowRemovalBefore,
    after: snowRemovalAfter,
    beforeAlt: 'A driveway buried in deep snow, with a snow-covered car parked by the house',
    afterAlt:
      'The same driveway after shoveling, seen from the house: a cleared lane beside a tall snowbank',
    caption:
      'One driveway, an hour apart, before and after shoveling (the second photo looks back toward the street)',
    credit: {
      title: 'Before shovelling / After shovelling 1',
      author: 'Ben Babcock',
      license: 'CC BY 2.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
      source: commons('Before_shovelling_(2081155092).jpg'),
      changes: 'Resized',
    },
  },
}
