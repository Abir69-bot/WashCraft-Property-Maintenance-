import type { Metadata } from 'next'
import Link from 'next/link'

import { areaPhotos } from '@/assets/area-photos'
import { QuickQuoteCard } from '@/components/quote/quick-quote-card'
import { AreaHero } from '@/components/sections/area-hero'
import { FaqList } from '@/components/sections/areas-and-faq'
import { ServiceGrid } from '@/components/sections/category-hub'
import { LocalConditions, NearbyAreas } from '@/components/sections/city-blocks'
import { FinalCta, HowItWorks, TrustStrip, WhyChooseUs } from '@/components/sections/home-blocks'
import { BeforeAfter } from '@/components/sections/proof'
import { Section } from '@/components/sections/section'
import { ZipChecker } from '@/components/sections/zip-checker'
import { areaSummaries } from '@/config/areas'
import { consentText } from '@/config/consent'
import { getLayoutData } from '@/lib/data/layout'
import { loadCity } from '@/lib/data/load'
import { getSharedBlocks } from '@/lib/data/pages'
import { seasonNow } from '@/lib/data/season'
import { notFoundUnlessMoved } from '@/lib/data/redirects'
import { generalCta } from '@/lib/quote/flow'
import { routes } from '@/lib/routes'
import { inSeasonNow } from '@/lib/seasons'
import { excerpt, pageMetadata } from '@/lib/seo/metadata'
import { cityTitle } from '@/lib/seo/titles'
import { asMedia, serviceGroups } from '@/lib/view'

export async function generateStaticParams() {
  const { cities } = await getLayoutData()
  return cities.map((city) => ({ city: city.slug }))
}

export async function generateMetadata({ params }: PageProps<'/areas/[city]'>): Promise<Metadata> {
  const { layout, page } = await loadCity((await params).city)
  if (!page) return {}
  const { city } = page
  return pageMetadata({
    path: routes.city(city.slug),
    title: cityTitle(city.name),
    description: areaSummaries[city.slug] ?? city.intro,
    seo: city.meta,
    image: asMedia(city.heroImage),
    siteName: layout.site.shortName,
    eyebrow: 'Service area',
    context: { city: city.slug },
  })
}

/** City landing page (brief §9.4). Shared copy is filled in with the city's name. */
export default async function CityPage({ params }: PageProps<'/areas/[city]'>) {
  const { city: slug } = await params
  const { layout, page } = await loadCity(slug)
  if (!page) return notFoundUnlessMoved(routes.city(slug))
  const shared = await getSharedBlocks()
  const { site, categories, services, cities, quote } = layout
  const { city } = page
  const local = city.name
  const neighborhoods = (city.neighborhoods ?? []).map((item) => item.name)
  const { active } = seasonNow(layout)

  return (
    <>
      <AreaHero
        crumbs={[
          { label: 'Service areas', href: routes.areas },
          { label: city.name, href: routes.city(city.slug) },
        ]}
        eyebrow={`${city.name}, ${city.state}`}
        title={cityTitle(city.name)}
        summary={city.meta?.description || areaSummaries[city.slug] || excerpt(city.intro)}
        neighborhoods={neighborhoods}
        cta={generalCta(quote)}
        site={site}
        city={city.name}
        cities={cities.map(({ name, lat, lng, slug: other }) => ({
          name,
          lat,
          lng,
          href: routes.city(other),
        }))}
        photo={areaPhotos[city.slug] ?? null}
      />
      {/* The quick form belongs to the instant-price flow (Feature switches). */}
      {quote.instantPricing && (
        <Section id="instant-estimate" title={`Get an instant estimate in ${city.name}`}>
          <div className="max-w-xl">
            <QuickQuoteCard
              groups={serviceGroups(categories)}
              consentLabel={consentText(site.country, site.shortName)}
            />
          </div>
        </Section>
      )}
      <TrustStrip site={site} />
      <LocalConditions city={city} />
      <ServiceGrid
        id="services"
        services={inSeasonNow(services, active).slice(0, 6)}
        region={local}
        eyebrow="In season now"
        title={`Popular services in ${city.name}`}
        intro={
          <p>
            Every service is available in {city.name}.{' '}
            <Link href={routes.services}>See all services</Link>.
          </p>
        }
      />
      <HowItWorks
        steps={shared.howItWorks}
        upsell={quote.instantPricing ? shared.recurringUpsell : null}
        tone="surface"
      />
      <BeforeAfter items={page.gallery} title={`Our work in ${city.name}`} />
      {/* Shared cards keep the region: they make claims about the business, not this city. */}
      <WhyChooseUs
        cards={shared.whyChooseUs}
        region={site.region}
        intro={city.whyChooseUs}
        tone="surface"
      />
      {/* The map is in the hero; this section keeps the postal code check. */}
      <Section id="map" eyebrow="Service area" title={`Do we serve your part of ${city.name}?`}>
        <div className="max-w-xl">
          <ZipChecker cities={cities} />
        </div>
      </Section>
      <FaqList
        faqs={(city.faqs ?? []).map((faq, index) => ({
          id: faq.id ?? `city-${index}`,
          question: faq.question,
          answer: faq.answer,
        }))}
        region={local}
        title={`${city.name} questions`}
        tone="surface"
      />
      <NearbyAreas cities={cities} current={city.id} />
      <FinalCta region={local} cta={generalCta(quote)} />
    </>
  )
}
