import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { CommercialBidForm } from '@/components/quote/flows/commercial-bid-form'
import { QuotePage } from '@/components/quote/quote-page'
import { consentText } from '@/config/consent'
import { getLayoutData } from '@/lib/data/layout'
import { routes } from '@/lib/routes'
import { pageMetadata } from '@/lib/seo/metadata'

const title = 'Commercial & HOA Bid Request'
const intro =
  'For property managers, HOA boards and businesses. Tell us about the property and we’ll arrange a site walk and a written proposal.'

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getLayoutData()
  return pageMetadata({
    path: routes.quoteCommercial,
    title,
    description: intro,
    siteName: site.shortName,
  })
}

/** Commercial / HOA bid request (brief §10.5). Commercial services are listed first. */
export default async function CommercialBidPage() {
  // Off until switched on under Feature switches (Dedicated quote forms); the quote form covers it.
  if (!(await getLayoutData()).quote.dedicatedForms) redirect(routes.quote)
  const { site, categories } = await getLayoutData()
  const ordered = [
    ...categories.filter((category) => category.tone === 'commercial'),
    ...categories.filter((category) => category.tone !== 'commercial'),
  ]
  return (
    <QuotePage
      crumb={{ label: 'Commercial bid', href: routes.quoteCommercial }}
      title={title}
      intro={intro}
      site={site}
    >
      <CommercialBidForm
        groups={ordered.map((category) => ({
          title: category.title,
          services: category.services.map(({ slug, title: name }) => ({ slug, title: name })),
        }))}
        consentLabel={consentText(site.country, site.shortName)}
      />
    </QuotePage>
  )
}
