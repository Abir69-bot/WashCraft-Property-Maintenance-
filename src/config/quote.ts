/** Choices on the dedicated quote forms (brief §10.5). Labels are what the owner sees on the lead. */

export const RESIDENTIAL_PROPERTY_TYPES = [
  { value: 'house', label: 'House' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'condo', label: 'Condo unit' },
] as const

export const SNOW_ADD_ONS = ['salting-de-icing', 'ice-control', 'snowbank-removal'] as const

export const HOLIDAY_STYLES = ['Warm white', 'Multicolor', 'Custom design'] as const
export const INSTALL_WINDOWS = [
  'Late October',
  'Early November',
  'Late November',
  'Early December',
] as const
export const REMOVAL_WINDOWS = ['Early January', 'Mid January', 'Late January'] as const

/**
 * Rough roofline length by home size, used when a customer doesn't know theirs. A starting
 * point for the estimate only; listed in CONTENT_TODO.md for the owner to check.
 */
export const ROOFLINE_ESTIMATES: Record<string, number> = {
  'Under 1,500 sq ft': 120,
  '1,500–2,500 sq ft': 160,
  '2,500–3,500 sq ft': 200,
  'Over 3,500 sq ft': 240,
}

export const JUNK_LOADS = [
  'A few items',
  '1/4 truck',
  '1/2 truck',
  '3/4 truck',
  'Full truck',
  'Not sure',
] as const
export const JUNK_ACCESS = ['Curbside', 'Garage', 'Inside the home', 'Yard or driveway'] as const

export const TIMELINES = [
  'As soon as possible',
  'Within 2 weeks',
  'Within a month',
  'Flexible',
] as const
export const BUDGETS = [
  'Under $500',
  '$500–$1,000',
  '$1,000–$2,500',
  '$2,500–$5,000',
  'Over $5,000',
  'Not sure yet',
] as const

export const COMMERCIAL_PROPERTY_TYPES = [
  { value: 'hoa', label: 'HOA or condo community' },
  { value: 'retail', label: 'Retail' },
  { value: 'office', label: 'Office' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'parking-garage', label: 'Parking garage' },
  { value: 'multi-site', label: 'Several sites' },
] as const
export const BID_FREQUENCIES = [
  'One time',
  'Monthly',
  'Quarterly',
  'Twice a year',
  'Year-round contract',
  'Not sure yet',
] as const

/**
 * Services the dedicated forms are built around, by slug. If one of these slugs changes in the
 * admin, change it here too.
 */
export const FLOW_SERVICES = {
  snow: 'snow-removal',
  lights: 'christmas-light-installation',
  lightRemoval: 'christmas-light-removal',
  lightStorage: 'christmas-light-storage',
  junk: 'junk-removal',
} as const

/** Snow trigger choices until the owner sets their own in Seasonal settings. */
export const DEFAULT_SNOW_TRIGGERS = ['1 inch', '2 inches', '3 inches'] as const
