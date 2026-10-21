import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CmsImage } from '@/components/cms-image'
import { QuickQuoteCard } from '@/components/quote/quick-quote-card'
import { FaqList } from '@/components/sections/areas-and-faq'
import { ServiceGrid } from '@/components/sections/category-hub'
import { LocalConditions, NearbyAreas, Neighborhoods } from '@/components/sections/city-blocks'
import { FinalCta, HowItWorks, TrustStrip, WhyChooseUs } from '@/components/sections/home-blocks'
import { PageHero, QuoteActions } from '@/components/sections/page-hero'
import { BeforeAfter, Testimonials } from '@/components/sections/proof'
import { Section } from '@/components/sections/section'
import { ServiceAreaMap } from '@/components/sections/service-area-map'
import { ZipChecker } from '@/components/sections/zip-checker'
import { consentText } from '@/config/consent'
import { getLayoutData } from '@/lib/data/layout'
import { loadCity } from '@/lib/data/load'
import { getSharedBlocks } from '@/lib/data/pages'
import { seasonNow } from '@/lib/data/season'
import { routes } from '@/lib/routes'
import { inSeasonNow } from '@/lib/seasons'
import { pageMetadata } from '@/lib/seo/metadata'
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
    description: city.intro,
    seo: city.meta,
    image: asMedia(city.heroImage),
    siteName: layout.site.shortName,
  })
}

/** City landing page (brief §9.4). Shared copy is filled in with the city's name. */
export default async function CityPage({ params }: PageProps<'/areas/[city]'>) {
  const { layout, page } = await loadCity((await params).city)
  if (!page) notFound()
  const shared = await getSharedBlocks()
  const { site, categories, services, cities } = layout
  const { city } = page
  const local = city.name
  const neighborhoods = (city.neighborhoods ?? []).map((item) => item.name)
  const { active } = seasonNow(layout)

  return (
    <>
      <PageHero
        crumbs={[
          { label: 'Service areas', href: routes.areas },
          { label: city.name, href: routes.city(city.slug) },
        ]}
        eyebrow={`${city.name}, ${city.state}`}
        icon="house"
        title={cityTitle(city.name)}
        intro={
          neighborhoods.length > 0 && (
            <p>
              Serving {neighborhoods.join(', ')} and every neighborhood in {city.name}.
            </p>
          )
        }
        actions={
          <QuoteActions
            cta={{ href: routes.quoteInstant, label: 'Get instant price' }}
            phone={site.phone}
          />
        }
        aside={
          <QuickQuoteCard
            groups={serviceGroups(categories)}
            consentLabel={consentText(site.country, site.shortName)}
          />
        }
      />
      <TrustStrip site={site} />
      <Section id="about-city">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2>Caring for homes in {city.name}</h2>
            <p className="mt-4 text-lg text-muted">{city.intro}</p>
          </div>
          <CmsImage
            media={city.heroImage}
            label={city.heroImageLabel}
            ratio="4/3"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
      </Section>
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
      <HowItWorks steps={shared.howItWorks} upsell={shared.recurringUpsell} tone="surface" />
      <BeforeAfter items={page.gallery} title={`Our work in ${city.name}`} />
      <Testimonials testimonials={page.testimonials} site={site} />
      <Neighborhoods city={city} />
      {/* Shared cards keep the region: they make claims about the business, not this city. */}
      <WhyChooseUs
        cards={shared.whyChooseUs}
        region={site.region}
        intro={city.whyChooseUs}
        tone="surface"
      />
      <Section id="map" eyebrow="Service area" title={`Do we serve your part of ${city.name}?`}>
        <div className="grid items-start gap-8 lg:grid-cols-2">
          <ZipChecker cities={cities} />
          <ServiceAreaMap
            cities={cities.map(({ name, lat, lng }) => ({ name, lat, lng }))}
            focus={city.name}
          />
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
      <FinalCta region={local} />
    </>
  )
}
