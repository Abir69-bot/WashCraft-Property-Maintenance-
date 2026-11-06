import type { StaticImageData } from 'next/image'

import heroHoliday from './home/hero-holiday.jpg'
import heroHome from './home/hero-home.jpg'
import heroWinter from './home/hero-winter.jpg'
import snowShoveling from './home/snow-shoveling.jpg'
import drivewaySealing from './services/driveway-sealing.jpg'
import houseCleaning from './services/house-cleaning.jpg'
import restaurantKitchen from './services/restaurant-cleaning.jpg'

/**
 * Licensed stock photos for the site, used only where the owner has no photo of their own.
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
  houseCleaning: {
    src: houseCleaning,
    alt: 'A vacuum cleaner gliding over a patterned rug on a wood floor at home',
    credit: {
      title: 'Cleaning the floor with a vacuum cleaner in a home setting',
      author: 'Shixart1985',
      license: 'CC BY 2.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
      source: commons('Cleaning_the_floor_with_a_vacuum_cleaner_in_a_home_setting.jpg'),
      changes: 'Cropped and resized',
    },
  },
  restaurantKitchen: {
    src: restaurantKitchen,
    alt: 'A worker in gloves washing up at the sink of a stainless steel restaurant kitchen',
    credit: {
      title: 'Restaurant cleaning lady in kitchen, Sai Ying Pun',
      author: 'EahJoseph',
      license: 'CC BY-SA 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
      source: commons(
        'HK_Sai_Ying_Pun_Lin_Heung_Kui_restaurant_cleaning_lady_n_kitchen_Aug-2012.JPG',
      ),
      changes: 'Cropped and resized',
    },
  },
  drivewaySealing: {
    src: drivewaySealing,
    alt: 'A worker spreading fresh sealcoat across an asphalt driveway with a squeegee',
    credit: {
      title: 'A fresh layer of sealcoat being applied to an asphalt driveway',
      author: 'Famartin',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
      source: commons(
        '2026-10-06_13_38_02_A_fresh_layer_of_sealcoat_being_applied_to_an_asphalt_driveway_along_Seven_Oaks_Lane_in_the_Mountainview_section_of_Ewing_Township,_Mercer_County,_New_Jersey.jpg',
      ),
      changes: 'Cropped and resized',
    },
  },
} satisfies Record<string, StockPhoto>

/**
 * Card photos for services the owner has no card-friendly photo of yet (lib/photos.ts). An admin
 * photo replaces them, unless it's a wide before/after pair (snow removal) a card would crop.
 */
export const stockByService: Record<string, StockPhoto> = {
  'house-cleaning': stockPhotos.houseCleaning,
  'restaurant-cleaning': stockPhotos.restaurantKitchen,
  'driveway-sealing': stockPhotos.drivewaySealing,
  'snow-removal': stockPhotos.snowShoveling,
  'christmas-light-installation': stockPhotos.heroHoliday,
}
