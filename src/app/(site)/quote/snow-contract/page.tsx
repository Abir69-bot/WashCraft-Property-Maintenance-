import type { Metadata } from 'next'

import { SnowContractForm } from '@/components/quote/flows/snow-contract-form'
import { QuotePage } from '@/components/quote/quote-page'
import { consentText } from '@/config/consent'
import { DEFAULT_SNOW_TRIGGERS, FLOW_SERVICES, SNOW_ADD_ONS } from '@/config/quote'
import { getLayoutData } from '@/lib/data/layout'
import { getQuoteServices } from '@/lib/pricing/load'
import { routes } from '@/lib/routes'
import { pageMetadata } from '@/lib/seo/metadata'
import { formatDate } from '@/lib/view'

const title = 'Snow Removal Contract Sign-Up'
const intro =
  'Get on a route for the season: we clear your driveway and walks every time snowfall reaches your chosen depth.'

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getLayoutData()
  return pageMetadata({
    path: routes.quoteSnowContract,
    title,
    description: intro,
    siteName: site.shortName,
  })
}

/** Seasonal snow contract sign-up (brief §10.5). */
export default async function SnowContractPage() {
  const [{ site, seasonal }, services] = await Promise.all([getLayoutData(), getQuoteServices()])
  const snow = services.find((service) => service.slug === FLOW_SERVICES.snow)
  const triggers = seasonal.snowTriggers?.length
    ? seasonal.snowTriggers
    : [...DEFAULT_SNOW_TRIGGERS]

  return (
    <QuotePage
      crumb={{ label: 'Snow contract', href: routes.quoteSnowContract }}
      title={title}
      intro={intro}
      site={site}
    >
      <SnowContractForm
        questions={snow?.questions ?? []}
        addOns={SNOW_ADD_ONS.flatMap((slug) => {
          const service = services.find((item) => item.slug === slug)
          return service ? [{ slug, title: service.title }] : []
        })}
        triggers={triggers}
        deadline={seasonal.snowSignupDeadline ? formatDate(seasonal.snowSignupDeadline) : null}
        routesRemaining={seasonal.routesRemaining ?? null}
        paymentNote={seasonal.snowPaymentNote || null}
        consentLabel={consentText(site.country, site.shortName)}
      />
    </QuotePage>
  )
}
