import {
  ArrowRight,
  Building2,
  Calculator,
  Camera,
  ClipboardList,
  Gift,
  Snowflake,
  Truck,
} from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { QuotePage } from '@/components/quote/quote-page'
import { getLayoutData } from '@/lib/data/layout'
import { routes } from '@/lib/routes'
import { pageMetadata } from '@/lib/seo/metadata'

const title = 'Get a Quote'
const intro = 'Pick the option that fits your job. Most homes can see a price range in minutes.'

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getLayoutData()
  return pageMetadata({ path: routes.quote, title, description: intro, siteName: site.shortName })
}

const ROUTES = [
  {
    href: routes.quoteInstant,
    icon: Calculator,
    title: 'Instant price',
    text: 'Most homes: answer a few questions and see a price range for washing, windows, gutters, cleaning and yard work.',
  },
  {
    href: routes.quoteCustom,
    icon: Camera,
    title: 'Custom quote',
    text: 'Large or unusual jobs: describe it, add photos and we’ll price it for you.',
  },
  {
    href: routes.quoteSnowContract,
    icon: Snowflake,
    title: 'Snow contract',
    text: 'Seasonal snow and ice clearing for your driveway and walks.',
  },
  {
    href: routes.quoteHolidayLights,
    icon: Gift,
    title: 'Holiday lights',
    text: 'Installation, take-down and storage of your holiday lighting.',
  },
  {
    href: routes.quoteJunkRemoval,
    icon: Truck,
    title: 'Junk removal',
    text: 'Send photos of what needs to go and we’ll quote the haul.',
  },
  {
    href: routes.quoteCommercial,
    icon: Building2,
    title: 'Commercial or HOA bid',
    text: 'Property managers, HOA boards and businesses: request a written bid.',
  },
]

/** Quote hub (brief §9.7): one card per quote route. */
export default async function QuoteHubPage() {
  const { site } = await getLayoutData()
  return (
    <QuotePage title={title} intro={intro} site={site}>
      <ul className="grid gap-5 sm:grid-cols-2">
        {ROUTES.map((route) => (
          <li key={route.href}>
            <Link
              href={route.href}
              className="group flex h-full flex-col rounded-card border border-border bg-white p-6 no-underline transition-shadow hover:shadow-lg"
            >
              <route.icon aria-hidden className="size-8 text-secondary-strong" />
              <span className="mt-4 text-h3 font-heading font-bold text-primary group-hover:underline">
                {route.title}
              </span>
              <span className="mt-2 text-muted">{route.text}</span>
              <span className="mt-auto inline-flex items-center gap-2 pt-4 font-semibold text-secondary-strong">
                Start <ArrowRight aria-hidden className="size-4" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-8 flex items-start gap-2 text-muted">
        <ClipboardList aria-hidden className="mt-1 size-5 shrink-0" />
        Not sure which to pick? Choose the custom quote and tell us what you need.
      </p>
    </QuotePage>
  )
}
