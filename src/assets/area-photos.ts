import etobicoke from '../../public/images/service-areas/etobicoke.jpg'
import markham from '../../public/images/service-areas/markham.jpg'
import mississauga from '../../public/images/service-areas/mississauga.jpg'
import northYork from '../../public/images/service-areas/north-york.jpg'
import richmondHill from '../../public/images/service-areas/richmond-hill.jpg'
import scarborough from '../../public/images/service-areas/scarborough.jpg'
import vaughan from '../../public/images/service-areas/vaughan.jpg'

import type { StockPhoto } from './photos'

/**
 * A licensed photo of a well-known place in each service area, shown on its city page under the
 * map. They show the place, never WashCraft’s work, and each is credited on the Photo Credits
 * page (linked from the footer) as its license requires (see DECISIONS.md). Keyed by city slug;
 * a city without one shows the map only.
 */
export type AreaPhoto = StockPhoto & { place: string }

const commons = (file: string) => `https://commons.wikimedia.org/wiki/File:${file}`
const CHANGES = 'Cropped to 16:9 and resized'
const CC_BY_4 = { license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/' }
const CC0 = { license: 'CC0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/' }
const CC_BY_SA_4 = {
  license: 'CC BY-SA 4.0',
  licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
}

export const areaPhotos: Record<string, AreaPhoto> = {
  // The owner swapped the Bluffs for a residential street (2026-11-05).
  scarborough: {
    src: scarborough,
    place: 'Townhomes in Steeles, Scarborough',
    alt: 'A row of three-storey townhomes with tidy gardens and parked cars along a tree-lined street in Scarborough',
    credit: {
      title: 'Townhomes in Steeles, Toronto',
      author: 'ChadPerez49',
      ...CC_BY_SA_4,
      source: commons('Townhomes_in_Steeles,_Toronto_jul162014.jpg'),
      changes: CHANGES,
    },
  },
  'north-york': {
    src: northYork,
    place: 'Yonge Street in downtown North York',
    alt: 'Office and condo towers along Yonge Street in downtown North York on a sunny day',
    credit: {
      title: 'Downtown North York',
      author: 'PFHLai',
      license: 'CC BY-SA 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
      source: commons('DowntownNorthYork20150914.jpg'),
      changes: CHANGES,
    },
  },
  etobicoke: {
    src: etobicoke,
    place: 'Humber Bay Shores, Etobicoke',
    alt: 'The curving condo towers of Humber Bay Shores behind a pond and autumn trees',
    credit: {
      title: 'Humber Bay Shores in Toronto 2026-05-15',
      author: 'Janusz Sobolewski',
      ...CC_BY_4,
      source: commons('Humber_Bay_Shores_in_Toronto_2026-05-15.jpg'),
      changes: CHANGES,
    },
  },
  markham: {
    src: markham,
    place: 'Markham Civic Centre',
    alt: 'Markham Civic Centre’s round council chamber beside its reflecting pond',
    credit: {
      title: 'Markham Civic Centre',
      author: 'Raysonho @ Open Grid Scheduler / Grid Engine',
      ...CC0,
      source: commons('MarkhamCivicCenter11.JPG'),
      changes: CHANGES,
    },
  },
  vaughan: {
    src: vaughan,
    place: 'Vaughan Metropolitan Centre',
    alt: 'Aerial view of the new towers of the Vaughan Metropolitan Centre on a clear winter day',
    credit: {
      title: 'Vaughan Metropolitan Centre aerial view 2022',
      author: 'Canmenwalker',
      ...CC_BY_4,
      source: commons('Vaughan_Metropolitan_Centre_aerial_view_2022.jpg'),
      changes: CHANGES,
    },
  },
  'richmond-hill': {
    src: richmondHill,
    place: 'Richmond Hill Centre for the Performing Arts',
    alt: 'The glass front of the Richmond Hill Centre for the Performing Arts on Yonge Street',
    credit: {
      title: 'Richmond Hill Centre for the Performing Arts',
      author: 'Raysonho @ Open Grid Scheduler / Grid Engine',
      ...CC0,
      source: commons('RichmondHillCentreForThePerformingArts.JPG'),
      changes: CHANGES,
    },
  },
  mississauga: {
    src: mississauga,
    place: 'Mississauga City Centre',
    alt: 'The Mississauga City Centre skyline with the curving Absolute World towers',
    credit: {
      title: 'Skyline of Mississauga, Ontario',
      author: 'K2HWY',
      ...CC_BY_4,
      source: commons('Skyline_of_Mississauga,_Ontario.jpg'),
      changes: CHANGES,
    },
  },
}
