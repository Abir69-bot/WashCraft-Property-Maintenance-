import { ArrowRight, Star } from 'lucide-react'
import Link from 'next/link'

import { SampleBadge } from '@/components/sample-badge'
import { ServiceIcon } from '@/components/service-icon'
import { Button } from '@/components/ui/button'
import type { SiteConfig } from '@/config/site'
import type { NavCategory } from '@/lib/data/layout'
import { shownRating } from '@/lib/proof'
import type { QuoteCta } from '@/lib/quote/flow'
import { routes } from '@/lib/routes'
import { fillTokens } from '@/lib/text'
import type { Homepage } from '@/payload-types'

import { HeroMedia, type HeroImage } from './hero-media'

type Variant = NonNullable<Homepage['heroVariants']>[number]

/** Proof points shown under the subline, each only when backed by site settings (brief §3.3). */
export function proofPoints(site: SiteConfig) {
  return [
    site.insuranceCoverage && 'Insured',
    site.workersCompRegistration && 'Workers’ comp covered',
    site.foundedYear && `Serving since ${site.foundedYear}`,
    site.responseTimePromise && `Replies ${site.responseTimePromise}`,
  ].filter(Boolean) as string[]
}

/**
 * Layered cards naming each service group: the hero's visual when there are no real photos for
 * the season. No stock or generated images stand in for the business's own work.
 */
function ServiceStack({ categories, region }: { categories: NavCategory[]; region: string }) {
  return (
    <div className="hero-stack" aria-hidden>
      {categories.slice(0, 4).map((category, index) => (
        <div key={category.id} className="hero-stack-card" style={{ '--i': index } as never}>
          <span className="icon-chip">
            <ServiceIcon name={category.icon} className="size-6" />
          </span>
          <span>
            <span className="block font-heading text-lg font-bold text-primary">
              {category.title}
            </span>
            <span className="block text-small text-muted">
              {fillTokens(category.summary, { region })}
            </span>
          </span>
        </div>
      ))}
    </div>
  )
}

export function Hero({
  variant,
  site,
  images,
  cta,
  categories,
}: {
  variant: Variant
  site: SiteConfig
  images: HeroImage[]
  cta: QuoteCta
  categories: NavCategory[]
}) {
  const rated = shownRating(site)
  const points = proofPoints(site)

  return (
    <section aria-labelledby="hero-heading" className="overflow-hidden hero-surface">
      <div className="container grid items-center gap-12 py-12 lg:grid-cols-[1.05fr_1fr] lg:py-24">
        <div>
          {rated ? (
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-small font-semibold shadow-sm">
              <Star aria-hidden className="size-4 fill-cta text-cta" />
              {rated.rating.toFixed(1)} from {rated.reviewCount} reviews
              <SampleBadge show={rated.sample} />
            </p>
          ) : (
            variant.eyebrow && (
              <p className="mb-4 inline-flex rounded-full bg-white/80 px-4 py-1.5 text-small font-semibold tracking-wide text-secondary-strong uppercase shadow-sm">
                {fillTokens(variant.eyebrow, { region: site.region })}
              </p>
            )
          )}
          <h1 id="hero-heading" className="text-balance">
            {fillTokens(variant.headline, { region: site.region })}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted">
            {fillTokens(variant.subline, { region: site.region })}
          </p>
          {points.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-small font-semibold text-ink">
              {points.map((point) => (
                <li key={point}>✓ {point}</li>
              ))}
            </ul>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={routes.services}>
                Explore Our Services <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
        {images.length > 0 ? (
          <HeroMedia images={images} />
        ) : (
          <ServiceStack categories={categories} region={site.region} />
        )}
      </div>
    </section>
  )
}
