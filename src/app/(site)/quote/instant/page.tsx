import type { Metadata } from 'next'

import { InstantWizardLoader } from '@/components/quote/instant-wizard-loader'
import { QuotePage } from '@/components/quote/quote-page'
import { consentText } from '@/config/consent'
import { getLayoutData } from '@/lib/data/layout'
import { getPlans } from '@/lib/data/pages'
import { getPricingData, getQuoteServices } from '@/lib/pricing/load'
import { planPrice } from '@/lib/pricing/plans'
import { isWizardService } from '@/lib/quote/services'
import { routes } from '@/lib/routes'
import { pageMetadata } from '@/lib/seo/metadata'
import type { Service } from '@/payload-types'

const title = 'Instant Price Estimate'
const intro =
  'Answer a few questions about your property and see a price range in a couple of minutes.'

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getLayoutData()
  return pageMetadata({
    path: routes.quoteInstant,
    title,
    description: intro,
    siteName: site.shortName,
  })
}

/** The instant-price wizard (brief §10.2). */
export default async function InstantQuotePage() {
  const [layout, services, plans, pricing] = await Promise.all([
    getLayoutData(),
    getQuoteServices(),
    getPlans(),
    getPricingData(),
  ])
  const { site, categories } = layout
  const offered = services.filter(isWizardService)
  const slugOf = (value: number | Service) =>
    typeof value === 'object' ? value.slug : services.find((item) => item.id === value)?.slug

  return (
    <QuotePage
      crumb={{ label: 'Instant price', href: routes.quoteInstant }}
      title={title}
      intro={intro}
      site={site}
    >
      <InstantWizardLoader
        groups={categories
          .map((category) => ({
            title: category.title,
            services: offered
              .filter((service) => service.category === category.id)
              .map((service) => ({
                slug: service.slug,
                title: service.title,
                questions: service.questions,
                frequencies: service.frequencies,
                subscription: service.quoteMode === 'subscription',
              })),
          }))
          .filter((group) => group.services.length > 0)}
        plans={plans.map((plan) => ({
          id: plan.id,
          name: plan.name,
          price: planPrice(plan),
          services: (plan.services ?? []).flatMap((service) => slugOf(service) ?? []),
        }))}
        cities={layout.cities.map(({ name, slug, zipPrefixes }) => ({ name, slug, zipPrefixes }))}
        offeredFrequencies={pricing.settings.frequencies}
        consentLabel={consentText(site.country, site.shortName)}
      />
    </QuotePage>
  )
}
