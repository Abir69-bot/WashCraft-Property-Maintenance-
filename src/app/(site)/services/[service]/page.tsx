import type { Metadata } from 'next'

import { JsonLd } from '@/components/json-ld'
import { QuickQuoteCard } from '@/components/quote/quick-quote-card'
import { FaqList } from '@/components/sections/areas-and-faq'
import { proofPoints } from '@/components/sections/hero'
import { ComparisonTable, FinalCta, NeedUsNow, TrustStrip } from '@/components/sections/home-blocks'
import { PageHero, QuoteActions } from '@/components/sections/page-hero'
import { BeforeAfter, Testimonials } from '@/components/sections/proof'
import {
  AreaLinks,
  BenefitTabs,
  BookingWindow,
  IncludedList,
  MethodAndSafety,
  PricingGuide,
  ProcessSteps,
  RelatedLinks,
  ServiceIntro,
} from '@/components/sections/service-blocks'
import { consentText } from '@/config/consent'
import { getLayoutData } from '@/lib/data/layout'
import { loadService } from '@/lib/data/load'
import { getFeatureFlags, getSharedBlocks } from '@/lib/data/pages'
import { notFoundUnlessMoved } from '@/lib/data/redirects'
import { env } from '@/lib/env'
import { mergeFaqs } from '@/lib/faqs'
import { quoteCta } from '@/lib/quote/flow'
import { routes } from '@/lib/routes'
import { serviceLd } from '@/lib/seo/json-ld'
import { pageMetadata } from '@/lib/seo/metadata'
import { serviceTitle } from '@/lib/seo/titles'
import { fillTokens } from '@/lib/text'
import { asMedia, serviceGroups } from '@/lib/view'

export async function generateStaticParams() {
  const { services } = await getLayoutData()
  return services.map((service) => ({ service: service.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<'/services/[service]'>): Promise<Metadata> {
  const { layout, page } = await loadService((await params).service)
  if (!page) return {}
  const { site } = layout
  const { service } = page
  return pageMetadata({
    path: routes.service(service.slug),
    title: serviceTitle(service.title, { region: site.region }),
    description: fillTokens(service.summary, { region: site.region }),
    seo: service.meta,
    image: asMedia(service.heroImage),
    siteName: site.shortName,
    eyebrow: typeof service.category === 'object' ? service.category.title : 'Services',
    context: {
      service: service.slug,
      category: typeof service.category === 'object' ? service.category.slug : undefined,
    },
  })
}

/** Service page (brief §9.3): one template for every service. */
export default async function ServicePage({ params }: PageProps<'/services/[service]'>) {
  const { service: slug } = await params
  const { layout, page } = await loadService(slug)
  if (!page) return notFoundUnlessMoved(routes.service(slug))
  const [shared, flags] = await Promise.all([getSharedBlocks(), getFeatureFlags()])
  const { site, categories, cities } = layout
  const region = site.region
  const { service } = page
  const category = typeof service.category === 'object' ? service.category : null
  const cta = quoteCta(service)
  const faqs = mergeFaqs(
    (service.faqs ?? []).map((faq, index) => ({
      id: faq.id ?? `service-${index}`,
      question: faq.question,
      answer: faq.answer,
    })),
    page.faqs,
  )

  return (
    <>
      <JsonLd
        data={serviceLd({
          name: service.title,
          description: fillTokens(service.summary, { region }),
          path: routes.service(service.slug),
          origin: env.NEXT_PUBLIC_SITE_URL,
          places: cities,
          category: category?.title,
        })}
      />
      <PageHero
        crumbs={[
          { label: 'Services', href: routes.services },
          ...(category ? [{ label: category.title, href: routes.category(category.slug) }] : []),
          { label: service.title, href: routes.service(service.slug) },
        ]}
        eyebrow={category?.title}
        icon={service.icon}
        title={serviceTitle(service.title, { region })}
        lead={fillTokens(service.headline, { region })}
        intro={fillTokens(service.promise, { region })}
        tone={category?.tone}
        badge={<BookingWindow seasons={service.seasons} note={service.bookingWindowNote} />}
        actions={<QuoteActions cta={cta} phone={site.phone} />}
        aside={
          <QuickQuoteCard
            groups={serviceGroups(categories)}
            consentLabel={consentText(site.country, site.shortName)}
            defaultService={service.slug}
          />
        }
      />
      <ServiceIntro service={service} region={region} trust={proofPoints(site)} />
      <BenefitTabs benefits={service.benefits} title={service.title} region={region} />
      <IncludedList items={service.included} />
      <MethodAndSafety method={service.method} safety={service.safety} region={region} />
      <ProcessSteps steps={service.process} region={region} upsell={shared.recurringUpsell} />
      <PricingGuide service={service} cta={cta} />
      <TrustStrip site={site} />
      <ComparisonTable comparison={shared.comparison} tone="default" />
      <NeedUsNow phone={site.phone} />
      <BeforeAfter items={page.gallery} title={`${service.title}: before and after`} />
      <Testimonials testimonials={page.testimonials} site={site} />
      <AreaLinks
        cities={cities}
        service={service}
        cityServicePages={Boolean(flags.cityServicePages)}
      />
      <FaqList faqs={faqs} region={region} title={`${service.title} questions`} tone="surface" />
      <RelatedLinks
        services={service.relatedServices}
        solutions={service.relatedSolutions}
        posts={service.relatedPosts}
        region={region}
        tone="default"
      />
      <FinalCta
        region={region}
        cta={cta}
        title={`Ready to book ${service.title}?`}
        text="Tell us a little about your property and we’ll take it from there."
      />
    </>
  )
}
