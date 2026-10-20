/** Vocabulary shared by the CMS schema, the seed and the site (brief §7). */

export const SEASONS = ['all-year', 'spring', 'summer', 'fall', 'winter', 'holiday'] as const
export type Season = (typeof SEASONS)[number]

export const SEASON_LABELS: Record<Season, string> = {
  'all-year': 'All year',
  spring: 'Spring',
  summer: 'Summer',
  fall: 'Fall',
  winter: 'Winter',
  holiday: 'Holiday season',
}

/**
 * How a service is quoted. `addon` services are sold with their parent service
 * (e.g. salting with a snow contract) and use the parent's quote flow.
 */
export const QUOTE_MODES = [
  'instant',
  'custom',
  'contract',
  'subscription',
  'bid',
  'addon',
] as const
export type QuoteMode = (typeof QUOTE_MODES)[number]

export const QUOTE_MODE_LABELS: Record<QuoteMode, string> = {
  instant: 'Instant price (wizard)',
  custom: 'Custom quote (form + photos)',
  contract: 'Seasonal contract',
  subscription: 'Subscription',
  bid: 'Commercial bid',
  addon: 'Add-on to another service',
}

/** Services with their own quote page instead of the instant wizard or custom form. */
export const DEDICATED_FLOWS = ['holiday-lights', 'junk-removal'] as const
export type DedicatedFlow = (typeof DEDICATED_FLOWS)[number]

/** Category accent, matching the Badge tones in components/ui/badge.tsx. */
export const CATEGORY_TONES = [
  'exterior',
  'interior',
  'winter',
  'holiday',
  'yard',
  'commercial',
] as const
export type CategoryTone = (typeof CATEGORY_TONES)[number]

export const PROPERTY_TYPES = ['house', 'townhouse', 'condo', 'commercial'] as const
export type PropertyType = (typeof PROPERTY_TYPES)[number]

export const FREQUENCIES = ['one-time', 'twice-yearly', 'quarterly', 'monthly'] as const
export type Frequency = (typeof FREQUENCIES)[number]

export const FREQUENCY_LABELS: Record<Frequency, string> = {
  'one-time': 'One time',
  'twice-yearly': 'Twice a year',
  quarterly: 'Every 3 months',
  monthly: 'Monthly',
}
