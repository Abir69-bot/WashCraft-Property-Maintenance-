import type {
  Article,
  BreadcrumbList,
  DayOfWeek,
  FAQPage,
  HomeAndConstructionBusiness,
  OpeningHoursSpecification,
  Organization,
  Person,
  PostalAddress,
  Service,
  WebSite,
  WithContext,
} from 'schema-dts'

import { isPlaceholder, type SiteConfig } from '@/config/site'
import { e164 } from '@/lib/text'

/**
 * Structured data (brief §13), typed with schema-dts. Every value comes from site settings or
 * page content; unset facts are left out rather than guessed. Review and rating markup is not
 * used: Google treats reviews a business publishes about itself as "self-serving" and ignores
 * them for local businesses.
 */

const CONTEXT = 'https://schema.org' as const

const absolute = (origin: string, path: string) => new URL(path, origin).toString()
const known = (value: string | null | undefined) =>
  value && !isPlaceholder(value) ? value : undefined

/** The business node every other item points to. */
export const businessId = (origin: string) => `${absolute(origin, '/')}#business`

type Place = { name: string; state: string }

const DAYS: Record<string, DayOfWeek> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
}
const ORDER = Object.keys(DAYS)

function time(text: string): string | null {
  const match = /^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i.exec(text.trim())
  if (!match) return null
  const hour = Number(match[1])
  if (hour < 1 || hour > 12) return null
  const hours24 = (hour % 12) + (match[3].toLowerCase() === 'pm' ? 12 : 0)
  return `${String(hours24).padStart(2, '0')}:${match[2] ?? '00'}`
}

/**
 * Opening hours from the settings text, e.g. "Mon–Sat 7am–6pm" or "Mon–Fri 8am–6pm, Sat
 * 9am–1pm". Anything it can't read exactly returns null, and the hours are left out.
 */
export function parseHours(text: string): OpeningHoursSpecification[] | null {
  if (!known(text)) return null
  const parts = text.split(/[,;]/).map((part) => part.trim())
  const specs: OpeningHoursSpecification[] = []
  for (const part of parts) {
    const match =
      /^([a-z]+)(?:\s*[–—-]\s*([a-z]+))?\s+(\d{1,2}(?::\d{2})?\s*[ap]m)\s*[–—-]\s*(\d{1,2}(?::\d{2})?\s*[ap]m)$/i.exec(
        part,
      )
    if (!match) return null
    const from = ORDER.indexOf(match[1].slice(0, 3).toLowerCase())
    const to = match[2] ? ORDER.indexOf(match[2].slice(0, 3).toLowerCase()) : from
    const opens = time(match[3])
    const closes = time(match[4])
    if (from < 0 || to < from || !opens || !closes) return null
    specs.push({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ORDER.slice(from, to + 1).map((day) => DAYS[day]),
      opens,
      closes,
    })
  }
  return specs.length ? specs : null
}

/**
 * The business address. A full "street, city, ON M1B 2K3" (or "street, city, ST 12345") address
 * is split into its parts; a service-area business without a public address gives only the
 * province or state and the country it works in.
 */
export function postalAddress(
  address: string | null,
  places: Place[],
  country: string,
): PostalAddress | undefined {
  const addressCountry = known(country)
  const street = known(address)
  if (street) {
    const match =
      /^(.+?),\s*([^,]+),\s*([A-Z]{2})\s+(\d{5}(?:-\d{4})?|[A-Z]\d[A-Z] ?\d[A-Z]\d)$/.exec(street)
    return match
      ? {
          '@type': 'PostalAddress',
          streetAddress: match[1],
          addressLocality: match[2],
          addressRegion: match[3],
          postalCode: match[4],
          addressCountry,
        }
      : { '@type': 'PostalAddress', streetAddress: street, addressCountry }
  }
  const states = [...new Set(places.map((place) => place.state))]
  if (states.length !== 1) return undefined
  return { '@type': 'PostalAddress', addressRegion: states[0], addressCountry }
}

const areaServed = (places: Place[]) =>
  places.map((place) => ({
    '@type': 'City' as const,
    name: place.name,
    containedInPlace: { '@type': 'State' as const, name: place.state },
  }))

/** Site-wide LocalBusiness (HomeAndConstructionBusiness). */
export function localBusiness({
  site,
  origin,
  places,
  logo,
  image,
}: {
  site: SiteConfig
  origin: string
  places: Place[]
  logo: string
  image: string
}): WithContext<HomeAndConstructionBusiness> {
  const sameAs = Object.values(site.social).filter((url): url is string => Boolean(known(url)))
  return {
    '@context': CONTEXT,
    '@type': 'HomeAndConstructionBusiness',
    '@id': businessId(origin),
    name: site.name,
    url: absolute(origin, '/'),
    logo: absolute(origin, logo),
    image: absolute(origin, image),
    description: known(site.tagline),
    telephone: e164(site.phone) ?? undefined,
    email: known(site.email),
    address: postalAddress(site.address, places, site.country),
    areaServed: places.length ? areaServed(places) : known(site.region),
    openingHoursSpecification: parseHours(site.hours) ?? undefined,
    ...(sameAs.length > 0 && { sameAs }),
  }
}

export function webSite({
  site,
  origin,
}: {
  site: SiteConfig
  origin: string
}): WithContext<WebSite> {
  return {
    '@context': CONTEXT,
    '@type': 'WebSite',
    name: site.name,
    alternateName: site.shortName,
    url: absolute(origin, '/'),
    publisher: { '@id': businessId(origin) },
  }
}

export function breadcrumbList(
  trail: { label: string; href: string }[],
  origin: string,
): WithContext<BreadcrumbList> {
  return {
    '@context': CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: absolute(origin, crumb.href),
    })),
  }
}

export function faqPage(faqs: { question: string; answer: string }[]): WithContext<FAQPage> {
  return {
    '@context': CONTEXT,
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
}

type ServiceLink = { title: string; path: string; description: string }

/**
 * A service page, or a category hub with its services as an OfferCatalog. No prices: the
 * offers only say which services are available.
 */
export function serviceLd({
  name,
  description,
  path,
  origin,
  places,
  category,
  catalog,
}: {
  name: string
  description: string
  path: string
  origin: string
  places: Place[]
  category?: string
  catalog?: ServiceLink[]
}): WithContext<Service> {
  return {
    '@context': CONTEXT,
    '@type': 'Service',
    name,
    serviceType: name,
    description,
    url: absolute(origin, path),
    provider: { '@id': businessId(origin) },
    ...(places.length > 0 && { areaServed: areaServed(places) }),
    ...(category && { category }),
    ...(catalog?.length && {
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name,
        itemListElement: catalog.map((service) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: service.title,
            description: service.description,
            url: absolute(origin, service.path),
          },
        })),
      },
    }),
  }
}

/** Blog posts and solutions. Without a public author, the business is the author. */
export function articleLd({
  headline,
  description,
  path,
  origin,
  image,
  datePublished,
  dateModified,
  author,
  site,
}: {
  headline: string
  description: string
  path: string
  origin: string
  image: string
  datePublished: string
  dateModified?: string | null
  author: { name: string; path: string } | null
  site: Pick<SiteConfig, 'name'>
}): WithContext<Article> {
  const writer: Person | Organization = author
    ? { '@type': 'Person', name: author.name, url: absolute(origin, author.path) }
    : { '@type': 'Organization', name: site.name, url: absolute(origin, '/') }
  return {
    '@context': CONTEXT,
    '@type': 'Article',
    headline: headline.length > 110 ? `${headline.slice(0, 109)}…` : headline,
    description,
    url: absolute(origin, path),
    mainEntityOfPage: absolute(origin, path),
    image: [absolute(origin, image)],
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: writer,
    publisher: { '@id': businessId(origin) },
  }
}
