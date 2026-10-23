import type { Metadata } from 'next'

import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Prose } from '@/components/rich-text'
import { getLegalPages } from '@/lib/data/content'
import { getLayoutData } from '@/lib/data/layout'
import type { RichContent } from '@/lib/rich-text'
import { pageMetadata } from '@/lib/seo/metadata'
import { formatDate } from '@/lib/view'

/** Privacy, terms and accessibility: one template, text from the Legal pages global. */
export const LEGAL_PAGES = {
  privacy: {
    title: 'Privacy Policy',
    description:
      'What information this website collects when you ask for a quote or contact us, why we collect it, who helps us process it and your choices.',
  },
  terms: {
    title: 'Terms of Use',
    description:
      'The terms for using this website, including how online price estimates work, what sending a request means and how we handle your uploads.',
  },
  accessibility: {
    title: 'Accessibility Statement',
    description:
      'Our goal of meeting WCAG 2.2 AA, what we do to make this website easy for everyone to use, known limitations and how to get help.',
  },
} as const

type LegalKey = keyof typeof LEGAL_PAGES

export async function legalMetadata(key: LegalKey, path: string): Promise<Metadata> {
  const { site } = await getLayoutData()
  return pageMetadata({ path, ...LEGAL_PAGES[key], siteName: site.shortName })
}

/** No quote CTA on legal pages (brief §3.4); the slide-in quote is hidden here too. */
export async function LegalDocument({ page, path }: { page: LegalKey; path: string }) {
  const legal = await getLegalPages()
  const { title } = LEGAL_PAGES[page]
  const updated = legal[`${page}Updated`]
  return (
    <article aria-labelledby="page-heading">
      <div className="bg-surface">
        <Breadcrumbs items={[{ label: title, href: path }]} />
        <header className="container pt-6 pb-10">
          <h1 id="page-heading">{title}</h1>
          <p className="mt-3 text-muted">
            Last updated <time dateTime={updated}>{formatDate(updated)}</time>
          </p>
        </header>
      </div>
      <div className="container section-y">
        <Prose content={legal[page] as RichContent} />
      </div>
    </article>
  )
}
