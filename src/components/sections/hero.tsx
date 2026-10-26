import { Star } from 'lucide-react'
import Link from 'next/link'

import { CallLink } from '@/components/layout/contact-links'
import { SampleBadge } from '@/components/sample-badge'
import { Button } from '@/components/ui/button'
import { PhotoPlaceholder } from '@/components/ui/photo-placeholder'
import type { SiteConfig } from '@/config/site'
import { shownRating } from '@/lib/proof'
import { fillTokens, telHref } from '@/lib/text'
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

export function Hero({
  variant,
  site,
  images,
}: {
  variant: Variant
  site: SiteConfig
  images: HeroImage[]
}) {
  const rated = shownRating(site)
  const points = proofPoints(site)

  return (
    <section aria-labelledby="hero-heading" className="overflow-hidden bg-surface">
      <div className="container grid items-center gap-10 py-12 lg:grid-cols-[1.05fr_1fr] lg:py-20">
        <div>
          {rated ? (
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-small font-semibold shadow-sm">
              <Star aria-hidden className="size-4 fill-cta text-cta" />
              {rated.rating.toFixed(1)} from {rated.reviewCount} reviews
              <SampleBadge show={rated.sample} />
            </p>
          ) : (
            variant.eyebrow && (
              <p className="mb-3 text-small font-semibold tracking-wide text-secondary-strong uppercase">
                {variant.eyebrow}
              </p>
            )
          )}
          <h1 id="hero-heading">{fillTokens(variant.headline, { region: site.region })}</h1>
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
              <Link href={variant.cta.href}>{variant.cta.label}</Link>
            </Button>
            {telHref(site.phone) && (
              <Button asChild size="lg" variant="outline">
                <CallLink phone={site.phone} label={`Call ${site.phone}`} />
              </Button>
            )}
          </div>
        </div>
        {images.length > 0 ? (
          <HeroMedia images={images} />
        ) : (
          <PhotoPlaceholder label={variant.imageLabel || 'Hero photo'} ratio="4/3" />
        )}
      </div>
    </section>
  )
}
