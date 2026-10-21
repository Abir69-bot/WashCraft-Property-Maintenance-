import { MapPin } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { FinalCta } from '@/components/sections/home-blocks'
import { PageHero, QuoteActions } from '@/components/sections/page-hero'
import { Section } from '@/components/sections/section'
import { ServiceAreaMap } from '@/components/sections/service-area-map'
import { ZipChecker } from '@/components/sections/zip-checker'
import { getLayoutData } from '@/lib/data/layout'
import { routes } from '@/lib/routes'
import { pageMetadata } from '@/lib/seo/metadata'

const title = (region: string) => `Service Areas in ${region}`
const intro = (region: string) =>
  `We serve homes, HOAs and businesses across ${region}. Find your city, or enter your ZIP code to check.`

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getLayoutData()
  return pageMetadata({
    path: routes.areas,
    title: title(site.region),
    description: intro(site.region),
    siteName: site.shortName,
  })
}

/** Service-area overview with the map and ZIP checker (brief §6). */
export default async function AreasPage() {
  const { site, cities } = await getLayoutData()

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Service areas', href: routes.areas }]}
        eyebrow={`${cities.length} cities`}
        icon="house"
        title={title(site.region)}
        intro={intro(site.region)}
        actions={
          <QuoteActions
            cta={{ href: routes.quoteInstant, label: 'Get instant price' }}
            phone={site.phone}
          />
        }
        aside={<ZipChecker cities={cities} />}
      />
      <Section id="cities" eyebrow="Cities" title="Cities we serve">
        <div className="grid gap-8 lg:grid-cols-2">
          <ul className="grid content-start gap-3 sm:grid-cols-2">
            {cities.map((city) => (
              <li key={city.id}>
                <Link
                  href={routes.city(city.slug)}
                  className="flex min-h-14 items-center gap-3 rounded-card border border-border bg-white px-4 no-underline hover:border-primary"
                >
                  <MapPin aria-hidden className="size-5 shrink-0 text-secondary-strong" />
                  <span>
                    <span className="block font-semibold">{city.name}</span>
                    <span className="block text-small text-muted">{city.state}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <ServiceAreaMap cities={cities.map(({ name, lat, lng }) => ({ name, lat, lng }))} />
        </div>
      </Section>
      <FinalCta region={site.region} />
    </>
  )
}
