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
  /** Each entry becomes a city page. */
  serviceAreas: string[]
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
  phone: '(720) 555-0142',
  email: 'hello@example.com',
  address: null,
  hours: 'Mon–Sat 7am–6pm',
  country: 'US',
  currency: 'USD',
  locale: 'en-US',
  region: 'Denver Metro',
  serviceAreas: ['Denver', 'Aurora', 'Lakewood', 'Arvada', 'Littleton', 'Centennial'],
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
  // Demo stand-ins chosen 2026-10-21 at the owner's request (see DECISIONS.md).
  // 555-0100–0199 numbers and example.com are reserved for fiction and never reach anyone.
  demo: ['tagline', 'phone', 'email', 'address', 'hours', 'region', 'serviceAreas'],
}

export function isPlaceholder(value: unknown): value is Placeholder {
  return typeof value === 'string' && /^\[.+\]$/.test(value.trim())
}
