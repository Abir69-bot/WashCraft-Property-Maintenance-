import type { Metadata } from 'next'

import { CustomQuoteForm } from '@/components/quote/flows/custom-quote-form'
import { QuotePage } from '@/components/quote/quote-page'
import { consentText } from '@/config/consent'
import { getLayoutData } from '@/lib/data/layout'
import { routes } from '@/lib/routes'
import { pageMetadata } from '@/lib/seo/metadata'

const title = 'Request a Custom Quote'
const intro =
  'For larger or unusual jobs. Tell us what you need, add photos if you can, and we’ll price it for you.'

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getLayoutData()
  return pageMetadata({
    path: routes.quoteCustom,
    title,
    description: intro,
    siteName: site.shortName,
  })
}

/** Custom quote with photos (brief §10.5). */
export default async function CustomQuotePage() {
  const { site, categories } = await getLayoutData()
  return (
    <QuotePage
      crumb={{ label: 'Custom quote', href: routes.quoteCustom }}
      title={title}
      intro={intro}
      site={site}
    >
      <CustomQuoteForm
        groups={categories.map((category) => ({
          title: category.title,
          services: category.services.map(({ slug, title: name }) => ({ slug, title: name })),
        }))}
        consentLabel={consentText(site.country, site.shortName)}
      />
    </QuotePage>
  )
}
