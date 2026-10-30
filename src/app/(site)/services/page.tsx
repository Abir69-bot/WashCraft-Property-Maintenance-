import type { Metadata } from 'next'

import { FinalCta } from '@/components/sections/home-blocks'
import { PageHero, QuoteActions } from '@/components/sections/page-hero'
import { Section } from '@/components/sections/section'
import { ServiceCard } from '@/components/service-card'
import { ServicesDirectory } from '@/components/services-directory'
import { getLayoutData } from '@/lib/data/layout'
import { generalCta } from '@/lib/quote/flow'
import { categoryHref, routes } from '@/lib/routes'
import { pageMetadata } from '@/lib/seo/metadata'
import { fillTokens } from '@/lib/text'

const title = (region: string) => `Property Maintenance Services in ${region}`
const intro = (region: string) =>
  `Interior, commercial, restaurant and post-construction cleaning, exterior cleaning, snow removal and holiday lighting for homes and businesses in ${region}. Filter by category or search for what you need.`

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getLayoutData()
  return pageMetadata({
    path: routes.services,
    title: title(site.region),
    description: intro(site.region),
    siteName: site.shortName,
  })
}

/** All services, grouped by category, with filter chips and search (brief §9.7). */
export default async function ServicesPage() {
  const { site, categories, services, quote } = await getLayoutData()
  const region = site.region
  const categorySlug = new Map(categories.map((category) => [category.id, category.slug]))

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
        <ServicesDirectory
          categories={categories.map((category) => ({
            slug: category.slug,
            title: category.title,
            href: categoryHref(category),
          }))}
          services={services.map((service) => ({
            slug: service.slug,
            category: categorySlug.get(service.category) ?? '',
            text: `${service.title} ${fillTokens(service.summary, { region })}`.toLowerCase(),
          }))}
          cards={Object.fromEntries(
            services.map((service) => [
              service.slug,
              <ServiceCard
                key={service.slug}
                slug={service.slug}
                title={service.title}
                summary={fillTokens(service.summary, { region })}
                icon={service.icon}
                outcomeLabel={service.outcomeLabel}
                className="h-full"
              />,
            ]),
          )}
        />
      </Section>
      <FinalCta region={region} cta={generalCta(quote)} />
    </>
  )
}
