import { Check } from 'lucide-react'
import Link from 'next/link'

import { CmsImage } from '@/components/cms-image'
import { JsonLd } from '@/components/json-ld'
import { ServiceCard } from '@/components/service-card'
import type { LayoutData, NavService } from '@/lib/data/layout'
import type { CategoryPage } from '@/lib/data/pages'
import { env } from '@/lib/env'
import type { QuoteCta } from '@/lib/quote/flow'
import { routes } from '@/lib/routes'
import { serviceLd } from '@/lib/seo/json-ld'
import { categoryTitle } from '@/lib/seo/titles'
import { fillTokens } from '@/lib/text'
import { asMedia } from '@/lib/view'
import type { Service, ServiceCategory } from '@/payload-types'

import { FaqList } from './areas-and-faq'
import { FinalCta } from './home-blocks'
import { PageHero, QuoteActions } from './page-hero'
import { BeforeAfter, Testimonials } from './proof'
import { Section, type SectionTone } from './section'
import { NoteBadge } from './service-blocks'

/** Grid of outcome-led service cards. */
export function ServiceGrid({
  id,
  services,
  region,
  title,
  eyebrow,
  intro,
  tone,
}: {
  id: string
  services: Pick<NavService, 'id' | 'slug' | 'title' | 'summary' | 'icon' | 'outcomeLabel'>[]
  region: string
  title: string
  eyebrow?: string
  intro?: React.ReactNode
  tone?: SectionTone
}) {
  if (services.length === 0) return null
  return (
    <Section id={id} tone={tone} eyebrow={eyebrow} title={title} intro={intro}>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <li key={service.id}>
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
    </Section>
  )
}

/** Packages of services in a category (brief §9.2). */
export function Bundles({
  bundles,
  region,
}: {
  bundles: ServiceCategory['bundles']
  region: string
}) {
  // A bundle only shows when every service in it is published: visitors only see services
  // the business has confirmed (unpublished ones come back as bare ids).
  const shown = (bundles ?? []).flatMap((bundle) => {
    const services = (bundle.services ?? []).filter(
      (service): service is Service => typeof service === 'object',
    )
    return services.length > 1 && services.length === (bundle.services ?? []).length
      ? [{ ...bundle, services }]
      : []
  })
  if (shown.length === 0) return null
  return (
    <Section
      id="bundles"
      tone="surface"
      eyebrow="Bundles"
      title="Services that work well together"
      intro="Ask for any of these in one quote request."
    >
      <ul className="grid gap-6 md:grid-cols-2">
        {shown.map((bundle) => {
          const { services } = bundle
          return (
            <li key={bundle.id ?? bundle.title} className="card-raised p-6">
              <h3>{bundle.title}</h3>
              <p className="mt-2 text-muted">{fillTokens(bundle.description, { region })}</p>
              {services.length > 0 && (
                <ul className="mt-4 grid gap-1">
                  {services.map((service) => (
                    <li key={service.id} className="flex items-center gap-2">
                      <Check aria-hidden className="size-4 shrink-0 text-success-strong" />
                      <Link href={routes.service(service.slug)} className="py-1 font-semibold">
                        {service.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </Section>
  )
}

/**
 * Category hub (brief §9.2): hero with the category accent, its services, bundles, proof,
 * FAQs and a quote CTA. `children` adds page-specific sections after the service grid.
 */
export function CategoryHub({
  layout,
  page,
  cta,
  children,
}: {
  layout: LayoutData
  page: CategoryPage
  cta: QuoteCta
  children?: React.ReactNode
}) {
  const { site, categories } = layout
  const region = site.region
  const { category } = page
  const services = categories.find((item) => item.id === category.id)?.services ?? []

  return (
    <>
      <JsonLd
        data={serviceLd({
          name: category.title,
          description: fillTokens(category.intro, { region }),
          path: routes.category(category.slug),
          origin: env.NEXT_PUBLIC_SITE_URL,
          places: layout.cities,
          catalog: services.map((service) => ({
            title: service.title,
            path: routes.service(service.slug),
            description: fillTokens(service.summary, { region }),
          })),
        })}
      />
      <PageHero
        crumbs={[
          { label: 'Services', href: routes.services },
          { label: category.title, href: routes.category(category.slug) },
        ]}
        eyebrow={`${services.length} services`}
        icon={category.icon}
        title={categoryTitle(category.title, { region })}
        lead={fillTokens(category.headline, { region })}
        intro={fillTokens(category.intro, { region })}
        tone={category.tone}
        badge={category.bookingNote && <NoteBadge>{category.bookingNote}</NoteBadge>}
        actions={<QuoteActions cta={cta} phone={site.phone} />}
        aside={
          asMedia(category.heroImage) && (
            <CmsImage
              media={category.heroImage}
              ratio="4/3"
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
            />
          )
        }
      />
      <ServiceGrid
        id="services"
        services={services}
        region={region}
        eyebrow="What we do"
        title={`${category.title} services`}
      />
      {children}
      <Bundles bundles={category.bundles} region={region} />
      <BeforeAfter items={page.gallery} title={`${category.title}: before and after`} />
      <Testimonials testimonials={page.testimonials} site={site} />
      <FaqList faqs={page.faqs} region={region} title={`${category.title} questions`} />
      <FinalCta
        region={region}
        cta={cta}
        title={`Get a quote for ${category.title}`}
        text="Tell us a little about your property. We’ll review it and contact you with a written estimate."
      />
    </>
  )
}
