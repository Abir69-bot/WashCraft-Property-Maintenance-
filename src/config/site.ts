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
  phone: '(416) 555-0142',
  email: 'hello@example.com',
  address: null,
  hours: 'Mon–Sat 7am–6pm',
  country: 'CA',
  currency: 'CAD',
  locale: 'en-CA',
  region: 'the GTA',
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
  // Demo stand-ins chosen at the owner's request (see DECISIONS.md).
  // 555-0100–0199 numbers and example.com are reserved for fiction and never reach anyone.
  demo: ['tagline', 'phone', 'email', 'address', 'hours', 'region'],
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

export function isPlaceholder(value: unknown): value is Placeholder {
  return typeof value === 'string' && /^\[.+\]$/.test(value.trim())
}
