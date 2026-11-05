import type { StaticImageData } from 'next/image'

import softWashingAfter from '../../public/images/services/soft-washing-after.jpg'
import softWashingBefore from '../../public/images/services/soft-washing-before.jpg'
import windowCleaningAfter from '../../public/images/services/window-cleaning-after.jpg'
import windowCleaningBefore from '../../public/images/services/window-cleaning-before.jpg'

import type { StockPhoto } from './photos'

/**
 * Licensed before-and-after examples for service pages, used where the owner has no pair of
 * their own. Each is a genuine pair: one photo of the same surface before and after the same
 * kind of work, published together by the photographer and split into its two halves here. They
 * are labelled as examples from another company's job, never as WashCraft's work, and credited
 * on the Photo Credits page. A service with no verified pair has no entry (see DECISIONS.md for
 * the search and what was rejected). Keyed by service slug.
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

export const beforeAfterExamples: Record<string, BeforeAfterExample[]> = {
  'soft-washing': [
    {
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
  ],
  'window-cleaning': [
    {
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
  ],
}
