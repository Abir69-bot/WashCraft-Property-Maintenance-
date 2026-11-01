import type { StaticImageData } from 'next/image'

import floorMopping from './floor-mopping.jpg'
import heroHoliday from './hero-holiday.jpg'
import heroHome from './hero-home.jpg'
import heroWinter from './hero-winter.jpg'
import snowShoveling from './snow-shoveling.jpg'
import windowSqueegee from './window-squeegee.jpg'

/**
 * Licensed stock photos for the home page, used only where the owner has no photo of their own.
 * They illustrate a kind of work and never stand in for WashCraft's jobs: the alt text describes
 * the scene, and before/after sections use the owner's photos only. Each one is credited on the
 * page as its license requires (see DECISIONS.md). Files were resized; edits are noted.
 */
export type StockPhoto = {
  src: StaticImageData
  alt: string
  credit: {
    title: string
    author: string
    license: string
    licenseUrl: string | null
    source: string
    changes: string
  }
}

const commons = (file: string) => `https://commons.wikimedia.org/wiki/File:${file}`

export const stockPhotos = {
  heroWinter: {
    src: heroWinter,
    alt: 'A two-storey house at dusk with a freshly cleared driveway between banks of snow',
    credit: {
      title: 'A house and shoveled driveway on the night after a winter storm',
      author: 'Famartin',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
      source: commons(
        '2026-01-26_21_12_21_A_house_and_shoveled_driveway_along_Aquetong_Lane_on_the_night_after_a_winter_storm_in_the_Mountainview_section_of_Ewing_Township,_Mercer_County,_New_Jersey.jpg',
      ),
      changes: 'Resized; licence plates blurred',
    },
  },
  heroHome: {
    src: heroHome,
    alt: 'Red brick homes with trimmed lawns along a quiet residential street',
    credit: {
      title: 'Windsor Walkerville Houses 3',
      author: 'jodelli',
      license: 'CC BY 2.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
      source: commons('Windsor_Walkerville_Houses_3.jpg'),
      changes: 'Resized',
    },
  },
  heroHoliday: {
    src: heroHoliday,
    alt: 'A house and front yard decorated with holiday lights at night',
    credit: {
      title: 'Christmas Lights house display',
      author: 'Anthony92931',
      license: 'CC BY-SA 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
      source: commons('Christmas_Lights_house_display.JPG'),
      changes: 'Resized',
    },
  },
  snowShoveling: {
    src: snowShoveling,
    alt: 'A person shoveling snow off a driveway in front of a garage at night',
    credit: {
      title: 'Shovelling Snow',
      author: 'U.S. Air Force photo / Senior Airman Justin Weaver',
      license: 'Public domain',
      licenseUrl: null,
      source: commons('Shovelling_Snow,_USAF.jpg'),
      changes: 'Resized',
    },
  },
  windowSqueegee: {
    src: windowSqueegee,
    alt: 'Close-up of a squeegee drawing water down a window pane',
    credit: {
      title: 'Cleaning windows',
      author: 'Andrés Nieto Porras',
      license: 'CC BY-SA 2.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
      source: commons('Cleaning_windows.jpg'),
      changes: 'Resized',
    },
  },
  floorMopping: {
    src: floorMopping,
    alt: 'A cleaner in an apron mopping the shiny floor of a bright shopping concourse',
    credit: {
      title: 'Regular cleaning service',
      author: 'Arayabee',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
      source: commons('บริการแม่บ้านทำความสะอาด_แบบประจำ.jpg'),
      changes: 'Cropped and resized',
    },
  },
} satisfies Record<string, StockPhoto>

/**
 * Card photos for services the owner has no card-friendly photo of yet. An admin photo replaces
 * them, unless it's a wide before/after pair (snow removal) that a 4:3 card would crop.
 */
export const stockByService: Record<string, StockPhoto> = {
  'snow-removal': stockPhotos.snowShoveling,
  'christmas-light-installation': stockPhotos.heroHoliday,
  'window-cleaning': stockPhotos.windowSqueegee,
  'commercial-cleaning': stockPhotos.floorMopping,
}
