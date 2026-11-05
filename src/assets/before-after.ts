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
 * examples, never as WashCraft's work, and credited on the Photo Credits page. An image the owner
 * supplied has no credit and its caption says what it is. A service with no pair has no entry
 * (see DECISIONS.md for the search and what was rejected). Keyed by service slug.
 */
export type BeforeAfterExample = {
  before: StaticImageData
  after: StaticImageData
  /** Describes what each photo shows; both name the same surface. */
  beforeAlt: string
  afterAlt: string
  /** One short line on what the pair shows. */
  caption: string
  /** Licensed third-party photos only; none for an image the owner supplied. */
  credit?: StockPhoto['credit']
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
  // Supplied by the owner (2026-11-05) as one image with its own labels; split and trimmed here.
  // Its origin isn't recorded, so the caption calls it an illustration, not a WashCraft job.
  'snow-removal': {
    before: snowRemovalBefore,
    after: snowRemovalAfter,
    beforeAlt:
      'A snow-covered driveway with tire tracks in front of a brick house and dark garage door',
    afterAlt: 'The same driveway cleared down to wet pavement, with snow banked along both edges',
    caption: 'Illustration: a driveway before and after snow clearing',
  },
}
