import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { QuickQuoteCard } from '@/components/quote/quick-quote-card'
import { FaqList } from '@/components/sections/areas-and-faq'
import { LocalConditions, Neighborhoods } from '@/components/sections/city-blocks'
import { FinalCta, NeedUsNow, TrustStrip } from '@/components/sections/home-blocks'
import { PageHero, QuoteActions } from '@/components/sections/page-hero'
import { BeforeAfter } from '@/components/sections/proof'
import {
  BookingWindow,
  IncludedList,
  ProcessSteps,
  RelatedLinks,
  ServiceIntro,
} from '@/components/sections/service-blocks'
import { consentText } from '@/config/consent'
import { getLayoutData } from '@/lib/data/layout'
import { loadCity, loadService } from '@/lib/data/load'
import { getFeatureFlags } from '@/lib/data/pages'
import { mergeFaqs } from '@/lib/faqs'
import { quoteCta } from '@/lib/quote/flow'
import { routes } from '@/lib/routes'
import { pageMetadata } from '@/lib/seo/metadata'
import { fillTokens } from '@/lib/text'
import { asMedia, serviceGroups } from '@/lib/view'

const idOf = (value: number | { id: number }) => (typeof value === 'object' ? value.id : value)

/** Service-in-city pages exist only with the feature flag on, for services picked per city. */
export async function generateStaticParams() {
  const [{ cities, services }, flags] = await Promise.all([getLayoutData(), getFeatureFlags()])
  if (!flags.cityServicePages) return []
  return cities.flatMap((city) =>
    (city.servicePages ?? []).flatMap((page) => {
      const service = services.find((item) => item.id === idOf(page))
      return service ? [{ city: city.slug, service: service.slug }] : []
    }),
  )
}

async function load(citySlug: string, serviceSlug: string) {
  const [cityData, serviceData, flags] = await Promise.all([
    loadCity(citySlug),
    loadService(serviceSlug),
    getFeatureFlags(),
  ])
  const city = cityData.page?.city
  const service = serviceData.page?.service
  const enabled =
    flags.cityServicePages &&
    city &&
    service &&
    (city.servicePages ?? []).some((page) => idOf(page) === service.id)
  return enabled
    ? { layout: cityData.layout, city: cityData.page!, service: serviceData.page! }
    : null
}

export async function generateMetadata({
  params,
}: PageProps<'/areas/[city]/[service]'>): Promise<Metadata> {
  const { city, service } = await params
  const data = await load(city, service)
  if (!data) return {}
  const local = data.city.city.name
  const doc = data.service.service
  return pageMetadata({
    path: routes.cityService(data.city.city.slug, doc.slug),
    title: `${doc.title} in ${local}`,
    description: fillTokens(doc.summary, { region: local }),
    image: asMedia(doc.heroImage),
    siteName: data.layout.site.shortName,
  })
}

/** "[Service] in [City]" (brief §6): the service's content, made local. */
export default async function CityServicePage({ params }: PageProps<'/areas/[city]/[service]'>) {
  const { city: citySlug, service: serviceSlug } = await params
  const data = await load(citySlug, serviceSlug)
  if (!data) notFound()
  const { site, categories } = data.layout
  const { city } = data.city
  const { service } = data.service
  const local = city.name
  const cta = quoteCta(service)
  const gallery = data.city.gallery.filter((item) => idOf(item.service) === service.id)
  const faqs = mergeFaqs(
    (service.faqs ?? []).map((faq, index) => ({
      id: faq.id ?? `service-${index}`,
      question: faq.question,
      answer: faq.answer,
    })),
    (city.faqs ?? []).map((faq, index) => ({
      id: faq.id ?? `city-${index}`,
      question: faq.question,
      answer: faq.answer,
    })),
  )

  return (
    <>
      <PageHero
        crumbs={[
          { label: 'Service areas', href: routes.areas },
          { label: city.name, href: routes.city(city.slug) },
          { label: service.title, href: routes.cityService(city.slug, service.slug) },
        ]}
        eyebrow={`${city.name}, ${city.state}`}
        icon={service.icon}
        title={`${service.title} in ${local}`}
        lead={fillTokens(service.headline, { region: local })}
        intro={
          <p>
            {fillTokens(service.promise, { region: local })}{' '}
            <Link href={routes.service(service.slug)}>More about {service.title}</Link>
          </p>
        }
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
      <TrustStrip site={site} />
      <ServiceIntro service={service} region={local} trust={[]} />
      <LocalConditions city={city} />
      <IncludedList items={service.included} />
      <ProcessSteps steps={service.process} region={local} />
      <BeforeAfter items={gallery} title={`${service.title} in ${local}: before and after`} />
      <Neighborhoods city={city} tone="surface" />
      <NeedUsNow phone={site.phone} />
      <FaqList faqs={faqs} region={local} title={`${service.title} in ${local}: questions`} />
      <RelatedLinks
        services={service.relatedServices}
        solutions={service.relatedSolutions}
        region={local}
      />
      <FinalCta
        region={local}
        cta={cta}
        title={`Book ${service.title} in ${local}`}
        text={`Tell us about your property in ${local} and we’ll take it from there.`}
      />
    </>
  )
}
