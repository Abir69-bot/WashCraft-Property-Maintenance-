import type { Metadata } from 'next'

import { CmsImage } from '@/components/cms-image'
import { FaqList } from '@/components/sections/areas-and-faq'
import { ServiceGrid } from '@/components/sections/category-hub'
import { CaseStudies, ManagerPoints } from '@/components/sections/commercial-blocks'
import { FinalCta, NeedUsNow } from '@/components/sections/home-blocks'
import { PageHero, QuoteActions } from '@/components/sections/page-hero'
import { Section } from '@/components/sections/section'
import { getLayoutData } from '@/lib/data/layout'
import { getCommercialData } from '@/lib/data/pages'
import { categoryCta } from '@/lib/quote/flow'
import { routes } from '@/lib/routes'
import { pageMetadata } from '@/lib/seo/metadata'
import { fillTokens } from '@/lib/text'
import { asMedia } from '@/lib/view'
import type { Service } from '@/payload-types'

const defaultTitle = (region: string) => `HOA & Condo Property Maintenance in ${region}`

export async function generateMetadata(): Promise<Metadata> {
  const [{ site }, { pages }] = await Promise.all([getLayoutData(), getCommercialData()])
  const { hoa } = pages
  return pageMetadata({
    path: routes.hoa,
    title: hoa.metaTitle || defaultTitle(site.region),
    description: hoa.metaDescription || fillTokens(hoa.intro, { region: site.region }),
    image: asMedia(hoa.heroImage),
    siteName: site.shortName,
  })
}

/** HOA & condo page (brief §9.5 "/commercial/strata", renamed for the US market). */
export default async function HoaPage() {
  const [layout, commercial] = await Promise.all([getLayoutData(), getCommercialData()])
  const { site, categories } = layout
  const region = site.region
  const { hoa, points } = commercial.pages
  const cta = categoryCta('commercial')
  const commercialCategory = categories.find((category) => category.tone === 'commercial')
  const services = (hoa.services ?? []).filter(
    (service): service is Service => typeof service === 'object' && service.enabled !== false,
  )

  return (
    <>
      <PageHero
        crumbs={[
          { label: commercialCategory?.title ?? 'Commercial', href: routes.commercial },
          { label: 'HOA & condo', href: routes.hoa },
        ]}
        eyebrow="HOA & condo boards"
        icon="building"
        title={defaultTitle(region)}
        lead={fillTokens(hoa.headline, { region })}
        intro={fillTokens(hoa.intro, { region })}
        tone="commercial"
        actions={<QuoteActions cta={cta} phone={site.phone} />}
        aside={
          <CmsImage
            media={hoa.heroImage}
            label={hoa.heroImageLabel}
            ratio="4/3"
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
          />
        }
      />
      {(hoa.sections ?? []).length > 0 && (
        <Section id="how-we-work" eyebrow="How we work" title="Built for boards and residents">
          <ul className="grid gap-6 md:grid-cols-2">
            {hoa.sections!.map((section) => (
              <li
                key={section.id ?? section.title}
                className="rounded-card border border-border p-6"
              >
                <h3>{section.title}</h3>
                <p className="mt-2 text-muted">{fillTokens(section.body, { region })}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}
      <ServiceGrid
        id="services"
        tone="surface"
        services={services}
        region={region}
        eyebrow="Services"
        title="Services for HOA communities"
      />
      <ManagerPoints points={points} site={site} />
      <CaseStudies items={commercial.caseStudies.filter((study) => study.propertyType === 'hoa')} />
      <NeedUsNow phone={site.phone} />
      <FaqList
        faqs={(hoa.faqs ?? []).map((faq, index) => ({
          id: faq.id ?? `hoa-${index}`,
          question: faq.question,
          answer: faq.answer,
        }))}
        region={region}
        title="HOA and condo questions"
      />
      <FinalCta
        region={region}
        cta={cta}
        title="Request a bid for your community"
        text="Tell us about the buildings, the services and the schedule. We’ll walk the site and send a written proposal."
      />
    </>
  )
}
