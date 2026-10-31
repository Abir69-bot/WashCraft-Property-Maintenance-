import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { GalleryBrowser, type GalleryEntry } from '@/components/gallery-browser'
import { FinalCta } from '@/components/sections/home-blocks'
import { PageHero, QuoteActions } from '@/components/sections/page-hero'
import { Section } from '@/components/sections/section'
import { getGallery } from '@/lib/data/content'
import { getLayoutData } from '@/lib/data/layout'
import { isProductionSite } from '@/lib/env'
import { generalCta } from '@/lib/quote/flow'
import { routes } from '@/lib/routes'
import { pageMetadata } from '@/lib/seo/metadata'
import { asMedia, mediaSrc } from '@/lib/view'
import type { City, Service, ServiceCategory } from '@/payload-types'

const title = (region: string) => `Before and After Photos from ${region} Jobs`
const intro =
  'Real results from our jobs. Drag each slider to compare, or filter by the kind of work you need.'

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getLayoutData()
  return pageMetadata({
    path: routes.beforeAndAfter,
    title: title(site.region),
    description: intro,
    siteName: site.shortName,
  })
}

const doc = <T,>(value: number | T | null | undefined) =>
  value && typeof value === 'object' ? value : null

const unique = <T extends { value: string; label: string }>(options: T[]) =>
  [...new Map(options.map((option) => [option.value, option])).values()].sort((a, b) =>
    a.label.localeCompare(b.label),
  )

/** Filterable before-and-after gallery (brief §9.7). Pairs without both photos are left out. */
export default async function BeforeAndAfterPage() {
  const [{ site, quote }, items] = await Promise.all([getLayoutData(), getGallery()])
  const entries: GalleryEntry[] = items.flatMap((item) => {
    const before = asMedia(item.before)
    const after = asMedia(item.after)
    const service = doc<Service>(item.service)
    if (!before || !after || !service) return []
    const category = doc<ServiceCategory>(item.category)
    const city = doc<City>(item.city)
    return {
      id: item.id,
      caption: item.caption,
      before: { url: mediaSrc(before), alt: before.alt },
      after: { url: mediaSrc(after), alt: after.alt },
      category: category?.slug ?? null,
      service: service.slug,
      serviceName: service.title,
      city: city?.slug ?? null,
      cityName: city?.name ?? null,
      sample: Boolean(item.isSample) && !isProductionSite,
    }
  })
  // Never publish an empty gallery.
  if (entries.length === 0) notFound()
  const categories = unique(
    items.flatMap((item) => {
      const category = doc<ServiceCategory>(item.category)
      return category ? [{ value: category.slug, label: category.title }] : []
    }),
  )
  const services = unique(
    entries.map((entry) => ({
      value: entry.service,
      label: entry.serviceName,
      category: entry.category,
    })),
  )
  const cities = unique(
    entries.flatMap((entry) =>
      entry.city && entry.cityName ? [{ value: entry.city, label: entry.cityName }] : [],
    ),
  )

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Before & after', href: routes.beforeAndAfter }]}
        eyebrow="Our work"
        title={title(site.region)}
        intro={intro}
        actions={<QuoteActions cta={generalCta(quote)} phone={site.phone} />}
      />
      <Section id="gallery" title="Projects">
        {entries.length > 0 ? (
          <GalleryBrowser
            entries={entries}
            categories={categories}
            services={services}
            cities={cities}
          />
        ) : (
          <p className="rounded-card bg-surface p-6">
            We’re adding photos from recent jobs. Check back soon.
          </p>
        )}
      </Section>
      <FinalCta region={site.region} cta={generalCta(quote)} />
    </>
  )
}
