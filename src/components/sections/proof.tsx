import { ArrowRight, ExternalLink, Quote } from 'lucide-react'
import Link from 'next/link'

import { CmsImage } from '@/components/cms-image'
import { SampleBadge } from '@/components/sample-badge'
import { Stars } from '@/components/stars'
import type { SiteConfig } from '@/config/site'
import { shownRating } from '@/lib/proof'
import { routes } from '@/lib/routes'
import { asMedia, mediaSrc } from '@/lib/view'
import type { City, GalleryItem, Service, Testimonial } from '@/payload-types'

import { BeforeAfterSlider } from './before-after-slider'
import { Section, type SectionTone } from './section'

const nameOf = (value: number | City | Service | null | undefined) =>
  value && typeof value === 'object' ? ('name' in value ? value.name : value.title) : null

function Attribution({ testimonial }: { testimonial: Testimonial }) {
  const details = [nameOf(testimonial.city), nameOf(testimonial.service)].filter(Boolean)
  return (
    <footer className="mt-4 text-small">
      <p className="font-semibold text-ink">{testimonial.name}</p>
      {details.length > 0 && <p className="text-muted">{details.join(' · ')}</p>}
      {testimonial.source === 'google' && testimonial.sourceUrl && (
        <a
          href={testimonial.sourceUrl}
          data-track="review_link_click"
          className="mt-1 inline-flex items-center gap-1 py-1"
          rel="noopener"
          target="_blank"
        >
          Verified Google review <ExternalLink aria-hidden className="size-3.5" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      )}
    </footer>
  )
}

/** A testimonial: its photo if any, stars, quote, who said it, and the Google source link. */
export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const photo = asMedia(testimonial.photo)
  return (
    <figure className="h-full overflow-hidden rounded-card border border-border bg-white">
      {photo && (
        <CmsImage
          media={photo}
          ratio="16/9"
          sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
          className="rounded-none"
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between gap-2">
          <Stars rating={testimonial.rating} />
          <SampleBadge show={testimonial.isSample} />
        </div>
        <blockquote className="mt-3">{testimonial.quote}</blockquote>
        <Attribution testimonial={testimonial} />
      </div>
    </figure>
  )
}

/** Featured testimonial plus cards, with the Google rating when it's real (brief §9.1.11). */
export function Testimonials({
  testimonials,
  site,
}: {
  testimonials: Testimonial[]
  site: SiteConfig
}) {
  if (testimonials.length === 0) return null
  const featured = testimonials.find((item) => item.featured) ?? testimonials[0]
  const rest = testimonials.filter((item) => item.id !== featured.id).slice(0, 6)
  const rated = shownRating(site)

  return (
    <Section
      id="reviews"
      tone="surface"
      eyebrow="Reviews"
      title="What customers say"
      intro={
        rated ? (
          <p className="flex flex-wrap items-center gap-2 font-semibold text-ink">
            <Stars rating={Math.round(rated.rating)} /> {rated.rating.toFixed(1)} from{' '}
            {rated.reviewCount} Google reviews
            <SampleBadge show={rated.sample} />
            {site.googleReviewUrl && (
              <a
                href={site.googleReviewUrl}
                data-track="review_link_click"
                className="font-semibold"
              >
                Read them on Google
              </a>
            )}
          </p>
        ) : undefined
      }
    >
      <figure className="grid items-center gap-8 rounded-card bg-white p-6 md:grid-cols-[16rem_1fr] md:p-10">
        <CmsImage
          media={featured.photo}
          label={featured.photoLabel || `Photo of ${featured.name} at their home`}
          ratio="1/1"
          sizes="(min-width: 768px) 256px, 100vw"
        />
        <div>
          <SampleBadge show={featured.isSample} className="mb-3" />
          <Quote aria-hidden className="size-8 text-secondary" />
          <blockquote className="mt-2 text-h3 font-heading text-primary">
            {featured.quote}
          </blockquote>
          <div className="mt-4">
            <Stars rating={featured.rating} />
          </div>
          <Attribution testimonial={featured} />
        </div>
      </figure>
      {rest.length > 0 && (
        <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((testimonial) => (
            <li key={testimonial.id}>
              <TestimonialCard testimonial={testimonial} />
            </li>
          ))}
        </ul>
      )}
      <Link
        href={routes.reviews}
        className="mt-8 inline-flex min-h-11 items-center gap-2 font-semibold"
      >
        All reviews <ArrowRight aria-hidden className="size-4" />
      </Link>
    </Section>
  )
}

/** Before/after sliders (brief §9.1.8). Pairs without both photos are skipped. */
export function BeforeAfter({
  items,
  title = 'Before and after',
  tone,
}: {
  items: GalleryItem[]
  title?: string
  tone?: SectionTone
}) {
  const pairs = items
    .map((item) => ({ item, before: asMedia(item.before), after: asMedia(item.after) }))
    .filter((pair) => pair.before && pair.after)
  if (pairs.length === 0) return null

  return (
    <Section
      id="before-after"
      tone={tone}
      eyebrow="Our work"
      title={title}
      intro="Drag the handle, or use the arrow keys, to compare."
    >
      <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {pairs.map(({ item, before, after }) => (
          <li key={item.id}>
            <figure>
              <BeforeAfterSlider
                before={{ url: mediaSrc(before!), alt: before!.alt }}
                after={{ url: mediaSrc(after!), alt: after!.alt }}
                caption={item.caption}
                sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
              />
              <figcaption className="mt-3 flex items-center gap-2 font-semibold text-ink">
                {item.caption}
                <SampleBadge show={item.isSample} />
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <Link
        href={routes.beforeAndAfter}
        className="mt-8 inline-flex min-h-11 items-center gap-2 font-semibold"
      >
        See more before and after photos <ArrowRight aria-hidden className="size-4" />
      </Link>
    </Section>
  )
}
