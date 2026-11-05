import { ExternalLink, MapPin } from 'lucide-react'
import Link from 'next/link'

import type { AreaCity } from '@/lib/data/layout'
import { routes } from '@/lib/routes'
import type { City } from '@/payload-types'

import { Section } from './section'

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
          <li key={stat.id ?? stat.label} className="rounded-card border border-border bg-card p-6">
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
              className="flex min-h-12 items-center gap-2 rounded-card border border-border bg-card px-4 font-semibold no-underline hover:border-primary"
            >
              <MapPin aria-hidden className="size-4 shrink-0 text-secondary-strong" />
              {city.name}
            </Link>
          </li>
        ))}
      </ul>
      <Link href={routes.areas} className="mt-6 inline-block font-semibold">
        All service areas and postal code checker
      </Link>
    </Section>
  )
}
