import { ExternalLink } from 'lucide-react'
import Image from 'next/image'

import { SampleBadge } from '@/components/sample-badge'
import { Stars } from '@/components/stars'
import type { SiteConfig } from '@/config/site'
import { shownRating } from '@/lib/proof'
import { initials, type ReviewView } from '@/lib/reviews/view'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/view'

import { MarqueePause } from './marquee-pause'

/** Google's "G", shown where a review came from Google (the attribution Google asks for). */
export function GoogleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={cn('size-5 shrink-0', className)}>
      <path
        fill="#FFC107"
        d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"
      />
      <path
        fill="#FF3D00"
        d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z"
      />
    </svg>
  )
}

/** The button to WashCraft's Google Business Profile, shown only once the link is set. */
function GoogleProfileLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      data-track="review_link_click"
      className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-cta px-6 font-semibold whitespace-nowrap text-brand-ink no-underline shadow-raised transition-transform hover:-translate-y-0.5"
    >
      <span className="flex size-7 items-center justify-center rounded-full bg-white">
        <GoogleMark className="size-4" />
      </span>
      Read Our Google Reviews
      <ExternalLink aria-hidden className="size-4" />
      <span className="sr-only">(opens Google in a new tab)</span>
    </a>
  )
}

function Avatar({ review }: { review: ReviewView }) {
  return (
    <span className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-secondary-strong to-brand-primary font-bold text-white ring-2 ring-white/10">
      {review.photoUrl ? (
        <Image src={review.photoUrl} alt="" fill sizes="48px" className="object-cover" />
      ) : (
        <span aria-hidden>{initials(review.name)}</span>
      )}
    </span>
  )
}

function ReviewCard({ review }: { review: ReviewView }) {
  const meta = review.date ? formatDate(review.date) : review.detail
  return (
    <figure className="flex h-full night-card flex-col p-6 transition-colors hover:border-white/25">
      <figcaption className="flex items-center gap-3">
        <Avatar review={review} />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold text-white">{review.name}</span>
          {meta && <span className="block truncate text-small text-night-muted">{meta}</span>}
        </span>
        <SampleBadge show={review.isSample} className="shrink-0" />
        {review.fromGoogle && (
          <span className="shrink-0" title="Google review">
            <GoogleMark className="size-6" />
            <span className="sr-only">Google review</span>
          </span>
        )}
      </figcaption>
      <Stars rating={review.rating} className="mt-4" />
      <blockquote className="mt-3 line-clamp-5 text-night-muted">{review.text}</blockquote>
      {review.url && (
        <a
          href={review.url}
          target="_blank"
          rel="noopener"
          data-track="review_link_click"
          className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-3 text-small font-semibold text-secondary-on-dark"
        >
          Read on Google <ExternalLink aria-hidden className="size-3.5" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      )}
    </figure>
  )
}

/** Each scrolling track holds at least this many cards so it always fills a wide screen. */
const TRACK_MIN = 8
/** Fewer reviews than this sit in a still grid: a short loop would show the same card twice. */
const MARQUEE_MIN = 4

/** Two rows scrolling in opposite directions, faded at both edges. */
function ReviewRows({ reviews }: { reviews: ReviewView[] }) {
  const rows = [
    reviews.filter((_, index) => index % 2 === 0),
    reviews.filter((_, index) => index % 2 === 1),
  ]
  return (
    <div className="grid gap-5">
      {rows.map((row, rowIndex) => {
        const track = Array.from({ length: Math.ceil(TRACK_MIN / row.length) }, () => row).flat()
        return (
          <div
            key={rowIndex}
            className="flex [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] motion-reduce:container motion-reduce:[mask-image:none]"
          >
            {[0, 1].map((copy) => (
              <ul
                key={copy}
                inert={copy === 1}
                className={cn(
                  'flex shrink-0 animate-marquee gap-5 pr-5 [animation-duration:90s] group-focus-within/marquee:[animation-play-state:paused] group-hover/marquee:[animation-play-state:paused] group-data-[paused]/marquee:[animation-play-state:paused] motion-reduce:shrink motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:pr-0',
                  rowIndex === 1 && '[animation-direction:reverse]',
                  copy === 1 && 'motion-reduce:hidden',
                )}
              >
                {track.map((review, index) => (
                  <li
                    key={`${review.key}-${index}`}
                    inert={copy === 0 && index >= row.length}
                    className={cn(
                      'w-[min(23rem,82vw)]',
                      index >= row.length && 'motion-reduce:hidden',
                    )}
                  >
                    <ReviewCard review={review} />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        )
      })}
    </div>
  )
}

/**
 * The home page's review section: genuine reviews only, from Google (the daily sync) and from the
 * owner. The rating and the profile link show only once the owner has set them in Site
 * settings. With no reviews yet it says so plainly instead of hiding, so the section is ready the
 * day the first review arrives. Only the first copy of each scrolling review is in the
 * accessibility tree; with reduced motion the rows stop and wrap.
 */
export function GoogleReviews({ reviews, site }: { reviews: ReviewView[]; site: SiteConfig }) {
  const rated = shownRating(site)
  const profile = site.googleReviewUrl
  const scrolling = reviews.length >= MARQUEE_MIN

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
      data-marquee={scrolling ? '' : undefined}
      className="group/marquee relative overflow-hidden border-y border-white/5 bg-night-raised section-y"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,rgb(44_177_188/0.16),transparent_70%)]"
      />
      <div className="relative container mb-10 flex reveal flex-col items-center text-center lg:mb-14">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-small font-semibold tracking-wide text-night-muted uppercase">
          <GoogleMark className="size-4" />
          Google reviews
        </p>
        <h2 id="reviews-heading" className="mt-5 display-type display-h2 text-balance">
          What Our Customers Say
        </h2>
        {rated && (
          <p className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <span className="display-type text-5xl text-white">{rated.rating.toFixed(1)}</span>
            <span className="flex flex-col items-start gap-1">
              <Stars rating={Math.round(rated.rating)} />
              <span className="text-small text-night-muted">
                Based on {rated.reviewCount} Google reviews
              </span>
            </span>
          </p>
        )}
        {(profile || scrolling) && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {profile && <GoogleProfileLink href={profile} />}
            {scrolling && <MarqueePause label="reviews" />}
          </div>
        )}
      </div>

      {scrolling ? (
        <ReviewRows reviews={reviews} />
      ) : reviews.length > 0 ? (
        <ul className="relative container flex flex-wrap justify-center gap-5">
          {reviews.map((review) => (
            <li key={review.key} className="w-full sm:w-[min(23rem,calc(50%-0.625rem))]">
              <ReviewCard review={review} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="relative container">
          <div className="mx-auto flex max-w-2xl night-card flex-col items-center p-8 text-center sm:p-10">
            <span className="flex size-14 items-center justify-center rounded-full bg-white">
              <GoogleMark className="size-8" />
            </span>
            <p className="mt-5 text-h3 text-white">Reviews will appear here</p>
            <p className="mt-3 text-night-muted">
              We only show genuine reviews from {site.shortName} customers. As customers post
              reviews on Google, they will show up here.
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
