import type { Metadata } from 'next'

import { CmsImage } from '@/components/cms-image'
import { JsonLd } from '@/components/json-ld'
import { FaqList } from '@/components/sections/areas-and-faq'
import { ArticleBody } from '@/components/sections/article'
import { FinalCta } from '@/components/sections/home-blocks'
import { PageHero, QuoteActions } from '@/components/sections/page-hero'
import { RelatedLinks } from '@/components/sections/service-blocks'
import { getSolutionList } from '@/lib/data/content'
import { loadSolution } from '@/lib/data/load'
import { notFoundUnlessMoved } from '@/lib/data/redirects'
import { env } from '@/lib/env'
import { quoteCta } from '@/lib/quote/flow'
import { fillContentTokens, type RichContent } from '@/lib/rich-text'
import { routes } from '@/lib/routes'
import { articleLd } from '@/lib/seo/json-ld'
import { pageMetadata } from '@/lib/seo/metadata'
import { ogCardPath } from '@/lib/seo/og'
import { fillTokens } from '@/lib/text'
import { asMedia, mediaSrc } from '@/lib/view'
import type { Service } from '@/payload-types'

export async function generateStaticParams() {
  const solutions = await getSolutionList()
  return solutions.map((solution) => ({ slug: solution.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<'/solutions/[slug]'>): Promise<Metadata> {
  const { layout, page } = await loadSolution((await params).slug)
  if (!page) return {}
  const region = layout.site.region
  return pageMetadata({
    path: routes.solution(page.slug),
    title: fillTokens(page.title, { region }),
    description: `${fillTokens(page.problem, { region })} What causes it, what you can do and when to call us.`,
    seo: page.meta,
    image: asMedia(page.heroImage),
    siteName: layout.site.shortName,
    eyebrow: 'Problem & fix',
  })
}

/** Solution page (brief §9.7): the problem, the fix, FAQs and the services that solve it. */
export default async function SolutionPage({ params }: PageProps<'/solutions/[slug]'>) {
  const { slug } = await params
  const { layout, page: solution } = await loadSolution(slug)
  if (!solution) return notFoundUnlessMoved(routes.solution(slug))
  const { site } = layout
  const region = site.region
  const services = (solution.relatedServices ?? []).filter(
    (service): service is Service => typeof service === 'object' && service.enabled !== false,
  )
  const cta = services[0]
    ? quoteCta(services[0])
    : { href: routes.quoteCustom, label: 'Request a quote' }

  const title = fillTokens(solution.title, { region })
  const hero = asMedia(solution.heroImage)

  return (
    <>
      <JsonLd
        data={articleLd({
          headline: title,
          description: fillTokens(solution.problem, { region }),
          path: routes.solution(solution.slug),
          origin: env.NEXT_PUBLIC_SITE_URL,
          image: hero ? mediaSrc(hero) : ogCardPath({ title, eyebrow: 'Problem & fix' }),
          datePublished: solution.createdAt,
          dateModified: solution.updatedAt,
          author: null,
          site,
        })}
      />
      <PageHero
        crumbs={[
          { label: 'Solutions', href: routes.solutions },
          { label: solution.title, href: routes.solution(solution.slug) },
        ]}
        eyebrow="Problem & fix"
        title={title}
        intro={fillTokens(solution.problem, { region })}
        actions={<QuoteActions cta={cta} phone={site.phone} />}
        aside={
          <CmsImage
            media={solution.heroImage}
            label={solution.heroImageLabel}
            ratio="3/2"
            sizes="(min-width: 1024px) 560px, 100vw"
            priority
          />
        }
      />
      <ArticleBody
        content={fillContentTokens(solution.content as RichContent, { region })}
        cta={cta}
        phone={site.phone}
        topic={services[0]?.title}
      />
      <FaqList
        faqs={(solution.faqs ?? []).map((faq, index) => ({
          id: faq.id ?? `solution-${index}`,
          question: faq.question,
          answer: faq.answer,
        }))}
        region={region}
        title="Questions about this problem"
        tone="surface"
      />
      <RelatedLinks
        services={services}
        solutions={solution.relatedSolutions}
        region={region}
        title="Services that fix it"
        tone="default"
      />
      <FinalCta region={region} cta={cta} />
    </>
  )
}
