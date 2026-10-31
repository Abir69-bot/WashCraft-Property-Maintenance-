import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { JunkRemovalForm } from '@/components/quote/flows/junk-removal-form'
import { QuotePage } from '@/components/quote/quote-page'
import { consentText } from '@/config/consent'
import { getLayoutData } from '@/lib/data/layout'
import { routes } from '@/lib/routes'
import { pageMetadata } from '@/lib/seo/metadata'

const title = 'Junk Removal Quote'
const intro = 'Describe what needs to go and add a few photos. We’ll send you a price for the haul.'

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getLayoutData()
  return pageMetadata({
    path: routes.quoteJunkRemoval,
    title,
    description: intro,
    siteName: site.shortName,
  })
}

/** Photo-based junk removal quote (brief §10.5). */
export default async function JunkRemovalPage() {
  // Off until switched on under Feature switches (Dedicated quote forms); the quote form covers it.
  if (!(await getLayoutData()).quote.dedicatedForms) redirect(routes.quote)
  const { site } = await getLayoutData()
  return (
    <QuotePage
      crumb={{ label: 'Junk removal', href: routes.quoteJunkRemoval }}
      title={title}
      intro={intro}
      site={site}
    >
      <JunkRemovalForm consentLabel={consentText(site.country, site.shortName)} />
    </QuotePage>
  )
}
