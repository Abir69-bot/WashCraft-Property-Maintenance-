import type { ServiceSeed } from '../types'

import { commercialServices } from './services-commercial'
import { exteriorServices } from './services-exterior'
import { holidayServices } from './services-holiday'
import { interiorServices } from './services-interior'
import { winterServices } from './services-winter'
import { yardServices } from './services-yard'

/** Every service in the brief's catalog (§7), in menu order. */
export const allServices: ServiceSeed[] = [
  ...exteriorServices,
  ...interiorServices,
  ...winterServices,
  ...holidayServices,
  ...yardServices,
  ...commercialServices,
]
