import { ExternalLink, MapPin } from 'lucide-react'
import Link from 'next/link'

import { CmsImage } from '@/components/cms-image'
import type { AreaCity } from '@/lib/data/layout'
import { routes } from '@/lib/routes'
import type { City } from '@/payload-types'

import { Section, type SectionTone } from './section'

/** Owner-entered local facts, each with its source; hidden when empty (brief §9.4). */
export function LocalConditions({ city }: { city: City }) {
  const stats = city.localStats ?? []
  if (stats.length === 0) return null
  return (
    <Section
      id="local-conditions"
      tone="surface"
      eyebrow="Local conditions"
      title={`Weather and homes in ${city.name}`}
    >
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <li key={stat.id ?? stat.label} className="rounded-card bg-white p-6">
            <p className="text-h2 font-heading font-extrabold text-primary">{stat.value}</p>
            <p className="mt-1 font-semibold text-ink">{stat.label}</p>
            <a
              href={stat.sourceUrl}
              rel="noopener"
              target="_blank"
              className="mt-3 inline-flex items-center gap-1 py-1 text-small"
            >
              Source: {stat.sourceName} <ExternalLink aria-hidden className="size-3.5" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  )
}

/** Neighborhood cards with a photo or placeholder and a short blurb (brief §9.4). */
export function Neighborhoods({ city, tone }: { city: City; tone?: SectionTone }) {
  const neighborhoods = city.neighborhoods ?? []
  if (neighborhoods.length === 0) return null
  return (
    <Section
      id="neighborhoods"
      tone={tone}
      eyebrow="Neighborhoods"
      title={`Where we work in ${city.name}`}
    >
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {neighborhoods.map((neighborhood) => (
          <li
            key={neighborhood.id ?? neighborhood.name}
            className="overflow-hidden rounded-card border border-border bg-white"
          >
            <CmsImage
              media={neighborhood.image}
              label={neighborhood.imageLabel}
              ratio="3/2"
              sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
              className="rounded-none"
            />
            <div className="p-5">
              <h3>{neighborhood.name}</h3>
              <p className="mt-2 text-muted">{neighborhood.blurb}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  )
}

/** Links to the other cities served, for the city ↔ city internal links. */
export function NearbyAreas({ cities, current }: { cities: AreaCity[]; current: number }) {
  const others = cities.filter((city) => city.id !== current)
  if (others.length === 0) return null
  return (
    <Section id="nearby" eyebrow="Service areas" title="Other areas we serve">
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {others.map((city) => (
          <li key={city.id}>
            <Link
              href={routes.city(city.slug)}
              className="flex min-h-12 items-center gap-2 rounded-card border border-border bg-white px-4 font-semibold no-underline hover:border-primary"
            >
              <MapPin aria-hidden className="size-4 shrink-0 text-secondary-strong" />
              {city.name}
            </Link>
          </li>
        ))}
      </ul>
      <Link href={routes.areas} className="mt-6 inline-block font-semibold">
        All service areas and ZIP code checker
      </Link>
    </Section>
  )
}
