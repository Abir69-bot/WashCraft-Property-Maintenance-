import { ArrowRight, Building2, Calculator, Gift, Snowflake, Truck } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { QuotePage } from '@/components/quote/quote-page'
import { QuoteRequestForm } from '@/components/quote/quote-request-form'
import { consentText } from '@/config/consent'
import { getLayoutData } from '@/lib/data/layout'
import { getSharedBlocks } from '@/lib/data/pages'
import { quoteLabel, type QuoteSettings } from '@/lib/quote/flow'
import { routes } from '@/lib/routes'
import { pageMetadata } from '@/lib/seo/metadata'

const description = (settings: QuoteSettings) =>
  `Tell WashCraft what you need and add photos if you like. We review every request and get back to you with a written estimate${settings.freeQuotes ? ', free of charge' : ''}.`

export async function generateMetadata(): Promise<Metadata> {
  const { site, quote } = await getLayoutData()
  return pageMetadata({
    path: routes.quote,
    title: quoteLabel(quote),
    description: description(quote),
    siteName: site.shortName,
  })
}

/** Other quote routes, listed only while their Feature switch is on. */
function otherRoutes(settings: QuoteSettings) {
  return [
    ...(settings.instantPricing
      ? [
          {
            href: routes.quoteInstant,
            icon: Calculator,
            title: 'Instant price',
            text: 'Answer a few questions and see a price range.',
          },
        ]
      : []),
    ...(settings.dedicatedForms
      ? [
          {
            href: routes.quoteSnowContract,
            icon: Snowflake,
            title: 'Snow contract',
            text: 'Seasonal snow and ice clearing.',
          },
          {
            href: routes.quoteHolidayLights,
            icon: Gift,
            title: 'Holiday lights',
            text: 'Installation and take-down.',
          },
          {
            href: routes.quoteJunkRemoval,
            icon: Truck,
            title: 'Junk removal',
            text: 'Send photos of what needs to go.',
          },
          {
            href: routes.quoteCommercial,
            icon: Building2,
            title: 'Commercial bid',
            text: 'For property managers and businesses.',
          },
        ]
      : []),
  ]
}

/** Contact / Request a Quote (brief §7–8): the quote request form and how quoting works. */
export default async function QuoteRequestPage() {
  const [{ site, categories, quote }, shared] = await Promise.all([
    getLayoutData(),
    getSharedBlocks(),
  ])
  const extra = otherRoutes(quote)

  return (
    <QuotePage
      title={quoteLabel(quote)}
      intro={description(quote)}
      site={site}
      steps={shared.howItWorks}
    >
      {extra.length > 0 && (
        <nav aria-label="Other ways to get a price" className="mb-10">
          <ul className="grid gap-3 sm:grid-cols-2">
            {extra.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="group flex items-start gap-3 card-raised p-4">
                  <item.icon aria-hidden className="mt-0.5 size-6 text-secondary-strong" />
                  <span>
                    <span className="flex items-center gap-1 font-semibold text-primary group-hover:underline">
                      {item.title} <ArrowRight aria-hidden className="size-4" />
                    </span>
                    <span className="text-small text-muted">{item.text}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
      <QuoteRequestForm
        groups={categories.map((category) => ({
          title: category.title,
          services: category.services.map(({ slug, title }) => ({ slug, title })),
        }))}
        consentLabel={consentText(site.country, site.shortName)}
        submitLabel={quote.freeQuotes ? 'Send my free quote request' : 'Send my quote request'}
      />
    </QuotePage>
  )
}
