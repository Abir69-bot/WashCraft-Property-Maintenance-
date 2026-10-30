import type { Payload } from 'payload'

import { site, type DemoField, type SiteConfig, type SocialNetwork } from '@/config/site'
import type { SiteSetting } from '@/payload-types'

const blank = (value: string | null | undefined) => !value || value.trim() === ''
const optional = (value: string | null | undefined) => (blank(value) ? null : value!.trim())
/** A cleared required field becomes a placeholder again, so check-config flags it. */
const required = (value: string | null | undefined, field: string) =>
  blank(value) ? `[${field.toUpperCase()}]` : value!.trim()

const SOCIAL: SocialNetwork[] = [
  'facebook',
  'instagram',
  'linkedin',
  'youtube',
  'tiktok',
  'nextdoor',
]

/** Maps the saved `site-settings` global (plus the city names) to the SiteConfig shape. */
export function toSiteConfig(settings: SiteSetting, cityNames: string[]): SiteConfig {
  return {
    name: settings.name,
    shortName: settings.shortName,
    tagline: required(settings.tagline, 'tagline'),
    phone: required(settings.phone, 'phone'),
    email: required(settings.email, 'email'),
    address: optional(settings.address),
    hours: required(settings.hours, 'hours'),
    country: settings.country,
    currency: settings.currency,
    locale: settings.locale,
    region: required(settings.region, 'region'),
    serviceAreas: cityNames,
    freeQuotes: settings.freeQuotes ?? false,
    foundedYear: settings.foundedYear ?? null,
    insuranceCoverage: optional(settings.insuranceCoverage),
    workersCompRegistration: optional(settings.workersCompRegistration),
    licenceNumbers: settings.licenceNumbers ?? [],
    googlePlaceId: optional(settings.googlePlaceId),
    googleReviewUrl: optional(settings.googleReviewUrl),
    responseTimePromise: optional(settings.responseTimePromise),
    guarantee: optional(settings.guarantee),
    social: Object.fromEntries(
      SOCIAL.map((network) => [network, optional(settings.social?.[network])]),
    ) as SiteConfig['social'],
    stats: {
      jobsCompleted: settings.stats?.jobsCompleted ?? null,
      happyClients: settings.stats?.happyClients ?? null,
      // Google's own numbers (synced daily) win over anything typed in by hand.
      rating: settings.googleRating ?? settings.stats?.rating ?? null,
      reviewCount: settings.googleReviewCount ?? settings.stats?.reviewCount ?? null,
    },
    demo: (settings.demo ?? []) as DemoField[],
  }
}

/**
 * The live business facts: the admin's Site settings once they have been saved, otherwise
 * src/config/site.ts. Service areas come from the Cities collection.
 */
export async function getSite(payload: Payload): Promise<SiteConfig> {
  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
  if (!settings.updatedAt) return site

  const cities = await payload.find({
    collection: 'cities',
    depth: 0,
    pagination: false,
    sort: 'order',
    where: { _status: { equals: 'published' } },
    select: { name: true },
  })
  return toSiteConfig(
    settings,
    cities.docs.map((city) => city.name),
  )
}
