import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { HolidayLightsForm } from '@/components/quote/flows/holiday-lights-form'
import { QuotePage } from '@/components/quote/quote-page'
import { consentText } from '@/config/consent'
import { FLOW_SERVICES, ROOFLINE_ESTIMATES } from '@/config/quote'
import { getLayoutData } from '@/lib/data/layout'
import { getQuoteServices } from '@/lib/pricing/load'
import { routes } from '@/lib/routes'
import { pageMetadata } from '@/lib/seo/metadata'

const title = 'Christmas Light Installation Booking'
const intro =
  'Tell us about your home and the look you want. We design, install, take down in January and can store your lights.'

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getLayoutData()
  return pageMetadata({
    path: routes.quoteHolidayLights,
    title,
    description: intro,
    siteName: site.shortName,
  })
}

/** Holiday lighting booking (brief §10.5). */
export default async function HolidayLightsPage() {
  // Off until switched on under Feature switches (Dedicated quote forms); the quote form covers it.
  if (!(await getLayoutData()).quote.dedicatedForms) redirect(routes.quote)
  const [{ site }, services] = await Promise.all([getLayoutData(), getQuoteServices()])
  const install = services.find((service) => service.slug === FLOW_SERVICES.lights)

  return (
    <QuotePage
      crumb={{ label: 'Holiday lights', href: routes.quoteHolidayLights }}
      title={title}
      intro={intro}
      site={site}
    >
      <HolidayLightsForm
        questions={install?.questions ?? []}
        homeSizes={Object.keys(ROOFLINE_ESTIMATES)}
        consentLabel={consentText(site.country, site.shortName)}
      />
    </QuotePage>
  )
}
