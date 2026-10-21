import type { Frequency } from '@/config/catalog'

/**
 * How often each instant-price service can be booked in the wizard. A starting point for the
 * owner to adjust (admin: service → Quote & pricing → Frequencies). Unlisted services are
 * one-time only.
 */
const ONE_TIME: Frequency[] = ['one-time']
const TWICE: Frequency[] = ['one-time', 'twice-yearly']
const SEASONAL: Frequency[] = ['one-time', 'twice-yearly', 'quarterly']

export const serviceFrequencies: Record<string, Frequency[]> = {
  'pressure-washing': TWICE,
  'soft-washing': TWICE,
  'house-washing': TWICE,
  'driveway-cleaning': TWICE,
  'patio-balcony-cleaning': TWICE,
  'deck-cleaning': TWICE,
  'fence-cleaning': ONE_TIME,
  'gutter-cleaning': TWICE,
  'gutter-brightening': ONE_TIME,
  'roof-cleaning': ONE_TIME,
  'window-cleaning': SEASONAL,
  'solar-panel-cleaning': SEASONAL,
  'house-cleaning': ['one-time', 'monthly'],
  'garage-cleaning': TWICE,
  'yard-cleanup': TWICE,
  'garbage-bin-cleaning': ['one-time', 'quarterly', 'monthly'],
  'garage-driveway-pressure-cleaning': TWICE,
}
