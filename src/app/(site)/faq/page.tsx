import type { Metadata } from 'next'

import { FaqSearch } from '@/components/faq-search'
import { JsonLd } from '@/components/json-ld'
import { FinalCta } from '@/components/sections/home-blocks'
import { PageHero, QuoteActions } from '@/components/sections/page-hero'
import { FAQ_CATEGORIES } from '@/config/content'
import { getFaqList } from '@/lib/data/content'
import { getLayoutData } from '@/lib/data/layout'
import { generalCta } from '@/lib/quote/flow'
import { routes } from '@/lib/routes'
import { faqPage } from '@/lib/seo/json-ld'
import { pageMetadata } from '@/lib/seo/metadata'
import { fillTokens } from '@/lib/text'

const title = 'Frequently Asked Questions'
const intro =
  'Pricing, booking, what to expect on the day and how each service works. Search, or browse by topic.'

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getLayoutData()
  return pageMetadata({ path: routes.faq, title, description: intro, siteName: site.shortName })
}

/** Every FAQ, grouped by topic, with search (brief §9.7). */
export default async function FaqPage() {
  const [{ site, quote }, faqs] = await Promise.all([getLayoutData(), getFaqList()])
  const region = site.region
  const groups = FAQ_CATEGORIES.map((category) => ({
    value: category.value,
    label: category.label,
    faqs: faqs
      .filter((faq) => faq.category === category.value)
      .map((faq) => ({
        id: faq.id,
        question: fillTokens(faq.question, { region }),
        answer: fillTokens(faq.answer, { region }),
      })),
  })).filter((group) => group.faqs.length > 0)

  return (
    <>
      <JsonLd data={faqPage(groups.flatMap((group) => group.faqs))} />
      <PageHero
        crumbs={[{ label: 'FAQ', href: routes.faq }]}
        eyebrow="FAQ"
        title={title}
        intro={intro}
        actions={<QuoteActions cta={generalCta(quote)} phone={site.phone} />}
      />
      <section aria-label="Questions and answers" className="section-y">
        <div className="container">
          <FaqSearch groups={groups} />
        </div>
      </section>
      <FinalCta
        cta={generalCta(quote)}
        region={region}
        title="Still have a question?"
        text="Send us your question with a quote request, or browse our services."
      />
    </>
  )
}
