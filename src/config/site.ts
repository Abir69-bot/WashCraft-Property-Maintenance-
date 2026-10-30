/**
 * Business facts — the single source of truth (brief §2). Mirrored by the `site-settings`
 * global so the owner can edit them in the admin.
 *
 * Values in [BRACKETS] are placeholders: they render as a yellow TODO chip outside
 * production and `pnpm check-config` blocks production builds until they are set.
 * Fields listed in `demo` hold realistic stand-ins chosen for the demo site. They render
 * normally but also block production builds until the owner confirms or replaces them.
 * Optional facts are `null` and every section that depends on one hides itself.
 */

export type Placeholder = `[${string}]`

export type Country = 'CA' | 'US'
export type Currency = 'CAD' | 'USD'
export type Locale = 'en-CA' | 'en-US'
export type SocialNetwork =
  'facebook' | 'instagram' | 'linkedin' | 'youtube' | 'tiktok' | 'nextdoor'
export type StatKey = 'jobsCompleted' | 'happyClients' | 'rating' | 'reviewCount'

export type SiteConfig = {
  name: string
  shortName: string
  tagline: string
  /** Used for tel: and sms: links. */
  phone: string
  email: string
  /** `null` for a service-area business with no public address. */
  address: string | null
  hours: string
  country: Country | Placeholder
  currency: Currency | Placeholder
  locale: Locale | Placeholder
  region: string
  /** Confirmed service areas. Each entry becomes a city page. */
  serviceAreas: string[]
  /** Quote policy: true only when the owner confirms quotes are free ("Request a Free Quote"). */
  freeQuotes: boolean
  foundedYear: number | null
  insuranceCoverage: string | null
  workersCompRegistration: string | null
  licenceNumbers: string[]
  googlePlaceId: string | null
  googleReviewUrl: string | null
  responseTimePromise: string | null
  guarantee: string | null
  social: Record<SocialNetwork, string | null>
  stats: Record<StatKey, number | null>
  /** Fields holding demo stand-ins. Remove a field from this list once the owner confirms it. */
  demo: DemoField[]
}

export type DemoField = Exclude<keyof SiteConfig, 'demo'>

export const site: SiteConfig = {
  name: 'WashCraft Property Maintenance',
  shortName: 'WashCraft',
  tagline: 'Exterior care, year-round',
  // Not confirmed yet: no phone, email or hours are shown until the owner sets them. The
  // proposed info@washcraft.ca is unconfirmed, so it isn't used (see CONTENT_TODO.md).
  phone: '[PHONE]',
  email: '[EMAIL]',
  // Never publish a home address without the owner's explicit permission.
  address: null,
  hours: '[HOURS]',
  country: 'CA',
  currency: 'CAD',
  locale: 'en-CA',
  // Reads after "in" ("Gutter Cleaning in the Toronto area"). Doesn't claim the whole GTA.
  region: 'the Toronto area',
  // Confirmed by the owner 2026-10-27 (see DECISIONS.md).
  serviceAreas: [
    'Scarborough',
    'North York',
    'Etobicoke',
    'Markham',
    'Vaughan',
    'Richmond Hill',
    'Mississauga',
  ],
  // Confirmed by the owner 2026-10-30 (see DECISIONS.md).
  freeQuotes: true,
  foundedYear: null,
  insuranceCoverage: null,
  workersCompRegistration: null,
  licenceNumbers: [],
  googlePlaceId: null,
  googleReviewUrl: null,
  responseTimePromise: null,
  guarantee: null,
  social: {
    facebook: null,
    instagram: null,
    linkedin: null,
    youtube: null,
    tiktok: null,
    nextdoor: null,
  },
  stats: { jobsCompleted: null, happyClients: null, rating: null, reviewCount: null },
  // The tagline comes from the owner's logo but still needs confirming as search-result copy.
  demo: ['tagline'],
}

/**
 * Sample proof (brief §3.2), so the rating badge, trust strip and guarantee band can be checked
 * in development and preview before the owner has real ones. Used only while the real value is
 * unset, always with a "Sample" badge, and never on the live site (`lib/proof.ts`).
 */
export const sampleProof = {
  rating: 4.9,
  reviewCount: 48,
  guarantee:
    'Sample guarantee. If any part of the job isn’t right, tell us within 7 days and we’ll come back to fix it. Write your own wording in Site settings.',
} as const

/**
 * Areas the owner may serve but hasn't confirmed. Never shown on the site; listed in
 * CONTENT_TODO.md. Add one as a city (with its own page copy) in the admin once confirmed.
 */
export const pendingServiceAreas = ['Toronto', 'East York', 'York', 'Brampton', 'Pickering', 'Ajax']

/**
 * Services the owner confirmed they offer (owner, 2026-10-30). The seed publishes these and
 * saves every other service as an unpublished draft. After seeding, a service's publish status
 * in the admin is what counts: publish one when it's confirmed, unpublish it to withdraw it.
 */
export const confirmedServices = [
  'snow-removal',
  'christmas-light-installation',
  'pressure-washing',
  'soft-washing',
  'window-cleaning',
  'gutter-cleaning',
  'roof-cleaning',
  'driveway-sealing',
  'patio-balcony-cleaning',
  'house-cleaning',
  'post-construction-cleaning',
  'commercial-cleaning',
  'restaurant-cleaning',
]

export function isPlaceholder(value: unknown): value is Placeholder {
  return typeof value === 'string' && /^\[.+\]$/.test(value.trim())
}
