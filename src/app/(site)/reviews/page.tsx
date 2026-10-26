import { ExternalLink } from 'lucide-react'
import type { Metadata } from 'next'

import { FilteredList } from '@/components/filtered-list'
import { FinalCta } from '@/components/sections/home-blocks'
import { PageHero, QuoteActions } from '@/components/sections/page-hero'
import { SampleBadge } from '@/components/sample-badge'
import { TestimonialCard } from '@/components/sections/proof'
import { Section } from '@/components/sections/section'
import { Stars } from '@/components/stars'
import { Button } from '@/components/ui/button'
import type { SiteConfig } from '@/config/site'
import { getReviews } from '@/lib/data/content'
import { getLayoutData } from '@/lib/data/layout'
import { shownRating } from '@/lib/proof'
import { routes } from '@/lib/routes'
import { pageMetadata } from '@/lib/seo/metadata'
import { formatDate } from '@/lib/view'
import type { GoogleReview, Service } from '@/payload-types'

const title = (region: string) => `Customer Reviews from ${region}`
const intro = 'What customers say about our work, in their own words.'

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getLayoutData()
  return pageMetadata({
    path: routes.reviews,
    title: title(site.region),
    description: intro,
    siteName: site.shortName,
  })
}

function LeaveReview({ site }: { site: SiteConfig }) {
  if (!site.googleReviewUrl) return null
  return (
    <Button asChild size="lg" variant="outline">
      <a href={site.googleReviewUrl} target="_blank" rel="noopener" data-track="review_link_click">
        Leave us a review <ExternalLink aria-hidden />
        <span className="sr-only">(opens Google in a new tab)</span>
      </a>
    </Button>
  )
}

/** A review copied from Google, with the attribution Google requires. */
function GoogleReviewCard({ review }: { review: GoogleReview }) {
  return (
    <figure className="h-full rounded-card border border-border bg-white p-6">
      <Stars rating={review.rating} />
      {review.text && <blockquote className="mt-3 whitespace-pre-line">{review.text}</blockquote>}
      <figcaption className="mt-4 text-small">
        <p className="font-semibold text-ink">{review.authorName}</p>
        <p className="text-muted">
          Google review
          {review.publishedAt && (
            <>
              {' · '}
              <time dateTime={review.publishedAt}>{formatDate(review.publishedAt)}</time>
            </>
          )}
        </p>
        {review.reviewUrl && (
          <a
            href={review.reviewUrl}
            target="_blank"
            rel="noopener"
            data-track="review_link_click"
            className="mt-1 inline-flex items-center gap-1 py-1"
          >
            See it on Google <ExternalLink aria-hidden className="size-3.5" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}
      </figcaption>
    </figure>
  )
}

/**
 * Reviews page (brief §9.7): the Google rating, reviews copied from Google, testimonials
 * collected by the owner (samples never on the live site), a service filter and a link to
 * leave a review. With nothing real to show, it says so plainly.
 */
export default async function ReviewsPage() {
  const [{ site }, { testimonials, google }] = await Promise.all([getLayoutData(), getReviews()])
  const rated = shownRating(site)
  const serviceOf = (value: number | Service | null | undefined) =>
    value && typeof value === 'object' ? value : null
  const services = [
    ...new Map(
      testimonials.flatMap((testimonial) => {
        const service = serviceOf(testimonial.service)
        return service ? [[service.slug, { value: service.slug, label: service.title }]] : []
      }),
    ).values(),
  ]
  const items = [
    ...google.map((review) => ({
      key: `google-${review.id}`,
      tags: [],
      card: <GoogleReviewCard review={review} />,
    })),
    ...testimonials.map((testimonial) => ({
      key: `testimonial-${testimonial.id}`,
      tags: [serviceOf(testimonial.service)?.slug].filter((slug): slug is string => !!slug),
      card: <TestimonialCard testimonial={testimonial} />,
    })),
  ]

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Reviews', href: routes.reviews }]}
        eyebrow="Reviews"
        title={title(site.region)}
        intro={
          rated ? (
            <p className="flex flex-wrap items-center gap-2 font-semibold text-ink">
              <Stars rating={Math.round(rated.rating)} /> {rated.rating.toFixed(1)} out of 5 from{' '}
              {rated.reviewCount} Google reviews
              <SampleBadge show={rated.sample} />
            </p>
          ) : (
            intro
          )
        }
        actions={
          <>
            <QuoteActions
              cta={{ href: routes.quoteInstant, label: 'Get instant price' }}
              phone={site.phone}
            />
            <LeaveReview site={site} />
          </>
        }
      />
      <Section id="reviews-list" title="What customers say">
        {items.length > 0 ? (
          <FilteredList
            label="Filter by service"
            noun={['review', 'reviews']}
            options={services}
            items={items.map(({ key, tags }) => ({ key, tags }))}
            cards={Object.fromEntries(items.map(({ key, card }) => [key, card]))}
            listClassName="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          />
        ) : (
          <div className="max-w-2xl rounded-card bg-surface p-6">
            <p>
              We’re just getting started with online reviews. If we’ve worked for you, we’d love to
              hear how it went.
            </p>
            <div className="mt-4">
              <LeaveReview site={site} />
            </div>
          </div>
        )}
      </Section>
      <FinalCta region={site.region} />
    </>
  )
}
