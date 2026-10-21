/** Lead vocabulary shared by the Leads collection, notifications and the admin (brief §11). */

export const LEAD_TYPES = [
  'quick',
  'instant',
  'custom',
  'snow_contract',
  'holiday_lights',
  'junk',
  'commercial_bid',
  'subscription',
  'contact',
] as const
export type LeadType = (typeof LEAD_TYPES)[number]

export const LEAD_TYPE_LABELS: Record<LeadType, string> = {
  quick: 'quick quote',
  instant: 'instant price',
  custom: 'custom quote',
  snow_contract: 'snow contract',
  holiday_lights: 'holiday lights',
  junk: 'junk removal',
  commercial_bid: 'commercial bid',
  subscription: 'subscription',
  contact: 'contact',
}

export const LEAD_STATUSES = [
  'new',
  'estimate_viewed',
  'booking_requested',
  'contacted',
  'quoted',
  'booked',
  'won',
  'lost',
] as const
export type LeadStatus = (typeof LEAD_STATUSES)[number]
