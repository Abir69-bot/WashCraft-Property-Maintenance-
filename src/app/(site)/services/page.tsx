import type { Metadata } from 'next'
import Link from 'next/link'

import { FinalCta } from '@/components/sections/home-blocks'
import { PageHero, QuoteActions } from '@/components/sections/page-hero'
import { Section } from '@/components/sections/section'
import { ServiceCard, ServiceCardCredits } from '@/components/service-card'
import { getLayoutData } from '@/lib/data/layout'
import { generalCta } from '@/lib/quote/flow'
import { categoryHref, routes } from '@/lib/routes'
import { pageMetadata } from '@/lib/seo/metadata'
import { fillTokens } from '@/lib/text'

const title = (region: string) => `Property Maintenance Services in ${region}`
const intro = (region: string) =>
  `Interior, commercial, restaurant and post-construction cleaning, exterior cleaning, snow removal and holiday lighting for homes and businesses in ${region}.`

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getLayoutData()
  return pageMetadata({
    path: routes.services,
    title: title(site.region),
    description: intro(site.region),
    siteName: site.shortName,
  })
}

/**
 * All services on one page, grouped under their category headings in admin order (brief §9.7).
 * The owner asked for every service to show at once, so there are no filters or search here.
 */
export default async function ServicesPage() {
  const { site, categories, services, quote } = await getLayoutData()
  const region = site.region

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Services', href: routes.services }]}
        eyebrow={`${services.length} services`}
        title={title(region)}
        intro={intro(region)}
        actions={<QuoteActions cta={generalCta(quote)} phone={site.phone} />}
      />
      <Section id="all-services">
        {categories.map((category) => (
          <section
            key={category.slug}
            aria-labelledby={`category-${category.slug}`}
            className="mt-10 first:mt-0"
          >
            <h2 id={`category-${category.slug}`} className="text-h3">
              <Link
                href={categoryHref(category)}
                className="text-primary no-underline hover:underline"
              >
                {category.title}
              </Link>
            </h2>
            <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {category.services.map((service) => (
                <li key={service.slug}>
                  <ServiceCard
                    slug={service.slug}
                    title={service.title}
                    summary={fillTokens(service.summary, { region })}
                    icon={service.icon}
                    outcomeLabel={service.outcomeLabel}
                    className="h-full"
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}
        <ServiceCardCredits slugs={services.map((service) => service.slug)} className="mt-10" />
      </Section>
      <FinalCta region={region} cta={generalCta(quote)} />
    </>
  )
}
