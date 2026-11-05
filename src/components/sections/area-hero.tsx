import { MapPin } from 'lucide-react'
import Image from 'next/image'

import type { AreaPhoto } from '@/assets/area-photos'
import { Breadcrumbs, type Crumb } from '@/components/layout/breadcrumbs'
import type { SiteConfig } from '@/config/site'
import type { QuoteCta } from '@/lib/quote/flow'
import { cn } from '@/lib/utils'

import { ContactDetails } from './contact-details'
import { NIGHT_TEXT, QuoteActions } from './page-hero'
import { ServiceAreaMap, type MapCity } from './service-area-map'

/**
 * City page hero in the night theme: heading, summary, quote and call buttons and the business's
 * details on the left; a dark map of the areas served and a photo of a local landmark on the
 * right. The map sits outside the night text colours, so Leaflet's white popups and attribution
 * keep their own.
 */
export function AreaHero({
  crumbs,
  eyebrow,
  title,
  summary,
  neighborhoods,
  cta,
  site,
  city,
  cities,
  photo,
}: {
  crumbs: Crumb[]
  eyebrow: string
  title: string
  summary: string
  neighborhoods: string[]
  cta: QuoteCta
  site: SiteConfig
  city: string
  cities: MapCity[]
  photo: AreaPhoto | null
}) {
  return (
    <section aria-labelledby="page-heading" className="hero-night">
      <Breadcrumbs items={crumbs} tone="night" />
      <div className="container grid items-start gap-10 pt-6 pb-12 lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:pb-16">
        <div className={cn(NIGHT_TEXT, 'lg:pt-6')}>
          <p className="mb-3 inline-flex items-center gap-2 text-small font-semibold tracking-wide text-secondary-on-dark uppercase">
            <MapPin aria-hidden className="size-5 text-cta" />
            {eyebrow}
          </p>
          <h1 id="page-heading" className="display-type display-page text-balance text-white">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-night-muted">{summary}</p>
          {neighborhoods.length > 0 && (
            <p className="mt-3 max-w-2xl text-night-muted">
              Serving {neighborhoods.join(', ')} and every neighborhood in {city}.
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <QuoteActions
              cta={cta}
              phone={site.phone}
              label={site.freeQuotes ? 'Get Your Free Quote' : cta.label}
              callLabel="Call Us"
            />
          </div>
          <div className="mt-10 night-card p-6">
            <h2 className="text-h3 text-white">
              {site.shortName} in {city}
            </h2>
            <div className="mt-5">
              <ContactDetails site={site} area={city} />
            </div>
          </div>
        </div>

        <div className="grid gap-5 motion-safe:animate-slide-in-up">
          <div className="map-night">
            <ServiceAreaMap
              cities={cities}
              focus={city}
              className="h-72 border-white/10 sm:h-80 lg:h-80 lg:min-h-0"
            />
          </div>
          {photo && (
            <figure>
              <div className="group relative aspect-video overflow-hidden rounded-card bg-night-raised">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  placeholder="blur"
                  fill
                  sizes="(min-width: 1200px) 600px, (min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
                />
              </div>
              <figcaption className={cn(NIGHT_TEXT, 'mt-2 text-small text-night-muted')}>
                {photo.place}. Photo: <a href={photo.credit.source}>{photo.credit.author}</a>,{' '}
                {photo.credit.licenseUrl ? (
                  <a href={photo.credit.licenseUrl}>{photo.credit.license}</a>
                ) : (
                  photo.credit.license
                )}
                , {photo.credit.changes.toLowerCase()}.
              </figcaption>
            </figure>
          )}
        </div>
      </div>
    </section>
  )
}
