import {
  ArrowRight,
  BadgeCheck,
  CalendarRange,
  Camera,
  Check,
  FileText,
  HeartHandshake,
  Layers,
  MapPin,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import type { StockPhoto } from '@/assets/photos'
import { CmsImage } from '@/components/cms-image'
import { PhotoCredits as Credits } from '@/components/photo-credits'
import { JsonLd } from '@/components/json-ld'
import { SampleBadge } from '@/components/sample-badge'
import { ServiceIcon } from '@/components/service-icon'
import { Stars } from '@/components/stars'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Season } from '@/config/catalog'
import type { SiteConfig } from '@/config/site'
import type { AreaCity } from '@/lib/data/layout'
import type { FaqEntry } from '@/lib/faqs'
import type { Photo } from '@/lib/photos'
import { shownRating, type ShownGuarantee } from '@/lib/proof'
import type { QuoteCta } from '@/lib/quote/flow'
import { routes } from '@/lib/routes'
import { faqPage } from '@/lib/seo/json-ld'
import { fillTokens, telHref } from '@/lib/text'
import { cn } from '@/lib/utils'
import { asMedia, mediaSrc } from '@/lib/view'
import type { City, GalleryItem, Homepage, Service, Testimonial } from '@/payload-types'

import { BeforeAfterSlider } from './before-after-slider'
import { credentials } from './commercial-blocks'
import { proofPoints } from './hero'
import { MarqueePause } from './marquee-pause'
import { ServiceAreaMap } from './service-area-map'
import { ZipChecker } from './zip-checker'

/**
 * The home page's night theme (brief §9.1 sections, restyled 2026-11): full-bleed photo hero,
 * photo service cards, large drag sliders, outlined step numbers and a closing quote panel.
 * Inner pages keep the light sections in home-blocks.tsx.
 */

export const pill =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-6 font-semibold whitespace-nowrap text-white no-underline transition-colors hover:border-white hover:bg-white/5'

const landscape = (photo: Photo) =>
  Boolean(photo.width && photo.height && photo.width > photo.height)

/** A photo at its own proportions when it's landscape (never cropped), otherwise 3:2. */
function FramedPhoto({ photo, sizes }: { photo: Photo; sizes: string }) {
  const natural = landscape(photo)
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg bg-night-raised',
        !natural && 'aspect-[3/2]',
      )}
      style={natural ? { aspectRatio: `${photo.width} / ${photo.height}` } : undefined}
    >
      <Image src={photo.src} alt={photo.alt} fill sizes={sizes} className="object-cover" />
    </div>
  )
}

function NightSection({
  id,
  title,
  intro,
  action,
  raised = false,
  children,
}: {
  id: string
  title: string
  intro?: React.ReactNode
  action?: { href: string; label: string }
  raised?: boolean
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn('section-y', raised ? 'border-y border-white/5 bg-night-raised' : 'bg-night')}
    >
      <div className="container">
        <header className="mb-10 flex reveal flex-wrap items-end justify-between gap-6 lg:mb-12">
          <div className="max-w-3xl">
            <h2 id={`${id}-heading`} className="display-type display-h2">
              {title}
            </h2>
            {intro && <div className="mt-4 text-lg text-night-muted">{intro}</div>}
          </div>
          {action && (
            <Link href={action.href} className={pill}>
              {action.label}
            </Link>
          )}
        </header>
        {children}
      </div>
    </section>
  )
}

type Variant = NonNullable<Homepage['heroVariants']>[number]

/** Full-bleed photo with the headline over it; on phones the photo sits under the text. */
export function NightHero({
  variant,
  site,
  cta,
  photo,
}: {
  variant: Variant
  site: SiteConfig
  cta: QuoteCta
  photo: Photo
}) {
  const region = site.region
  const rated = shownRating(site)
  const points = proofPoints(site)
  const callHref = telHref(site.phone)

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate flex flex-col overflow-hidden bg-night lg:min-h-[calc(100svh-4.5rem)] lg:justify-end"
    >
      <div className="relative z-10 container pt-10 pb-8 lg:pt-40 lg:pb-24">
        <p className="mb-3 flex items-center gap-1.5 text-small font-semibold text-white/80">
          <MapPin aria-hidden className="size-4 text-cta" />
          Serving {region}
        </p>
        {/* The rating when it's real, otherwise the season's eyebrow, right above the headline. */}
        {rated ? (
          <p className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-small font-semibold">
            <Stars rating={Math.round(rated.rating)} />
            {rated.rating.toFixed(1)} from {rated.reviewCount} reviews
          </p>
        ) : (
          variant.eyebrow && (
            <p className="mb-5 text-small font-semibold tracking-wide text-secondary-on-dark uppercase">
              {fillTokens(variant.eyebrow, { region })}
            </p>
          )
        )}
        <h1 id="hero-heading" className="max-w-5xl display-type display-hero text-balance">
          {fillTokens(variant.headline, { region })}
        </h1>
        <p className="mt-5 max-w-3xl font-heading text-xl leading-snug font-semibold text-balance text-white sm:text-2xl">
          {fillTokens(variant.subline, { region })}
        </p>
        {points.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-small font-semibold">
            {points.map((point) => (
              <li key={point} className="flex items-center gap-1.5">
                <Check aria-hidden className="size-4 text-cta" /> {point}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-9 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href={cta.href}>{cta.label}</Link>
          </Button>
          {callHref && (
            <a href={callHref} data-track="call_click" className={cn(pill, 'h-14 px-8 text-lg')}>
              Call {site.phone}
            </a>
          )}
          <Link href={routes.services} className={cn(pill, 'h-14 px-8 text-lg')}>
            Explore Our Services <ArrowRight aria-hidden className="size-5" />
          </Link>
        </div>
      </div>
      <div className="relative mx-4 mb-12 aspect-[4/3] overflow-hidden rounded-lg sm:mx-6 lg:absolute lg:inset-0 lg:m-0 lg:aspect-auto lg:rounded-none">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgb(6_27_35/0.94)_0%,rgb(6_27_35/0.7)_45%,rgb(6_27_35/0.2)_100%),linear-gradient(0deg,rgb(6_27_35/0.95)_0%,transparent_50%)] lg:block"
        />
      </div>
      <span
        aria-hidden
        className="absolute right-8 bottom-24 z-10 hidden flex-col items-center gap-3 text-xs tracking-[0.3em] text-white/60 uppercase [writing-mode:vertical-rl] lg:flex"
      >
        Scroll
        <span className="h-16 w-px bg-white/30" />
      </span>
    </section>
  )
}

/** Short introduction under the hero, on a raised band. */
export function NightIntro({ intro, region }: { intro: Homepage['introduction']; region: string }) {
  if (!intro?.title || !intro.body) return null
  return (
    <section aria-labelledby="intro-heading" className="border-y border-white/5 bg-night-raised">
      <div className="container grid reveal gap-6 py-14 lg:grid-cols-[1fr_1.3fr] lg:gap-16 lg:py-20">
        <h2 id="intro-heading" className="display-type display-h2 text-balance">
          {fillTokens(intro.title, { region })}
        </h2>
        <div className="grid content-start gap-4 text-lg text-night-muted">
          {fillTokens(intro.body, { region })
            .split(/\n\s*\n/)
            .map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
        </div>
      </div>
    </section>
  )
}

export type ServiceTile = {
  slug: string
  title: string
  summary: string
  icon: Service['icon']
  photo: Photo | null
}

/** Photo cards for the main services; a service without a photo gets an icon tile. */
export function NightServices({ tiles, region }: { tiles: ServiceTile[]; region: string }) {
  if (tiles.length === 0) return null
  return (
    <NightSection
      id="services"
      title="Services for every season"
      intro={`Interior, commercial and post-construction cleaning, exterior cleaning, snow removal and holiday lighting for homes and businesses in ${region}.`}
      action={{ href: routes.services, label: 'Explore all services' }}
    >
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => (
          <li
            key={tile.slug}
            className="group relative flex night-card reveal flex-col overflow-hidden"
          >
            <div className="relative aspect-video overflow-hidden bg-night">
              {tile.photo ? (
                <Image
                  src={tile.photo.src}
                  alt={tile.photo.alt}
                  fill
                  sizes="(min-width: 1024px) 290px, (min-width: 480px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
                />
              ) : (
                <div
                  aria-hidden
                  className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgb(44_177_188/0.35),transparent_60%),linear-gradient(135deg,var(--primary),var(--night))] text-secondary-on-dark"
                >
                  <ServiceIcon name={tile.icon} className="size-16" />
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="display-type display-h3">
                <Link
                  href={routes.service(tile.slug)}
                  className="text-white no-underline after:absolute after:inset-0"
                >
                  {tile.title}
                </Link>
              </h3>
              <p className="mt-2 line-clamp-3 text-small text-night-muted">
                {fillTokens(tile.summary, { region })}
              </p>
              <span
                aria-hidden
                className="mt-auto inline-flex items-center gap-2 pt-5 text-small font-semibold text-cta"
              >
                See details
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </li>
        ))}
      </ul>
    </NightSection>
  )
}

const nameOf = (value: number | City | Service | null | undefined) =>
  value && typeof value === 'object' ? ('name' in value ? value.name : value.title) : null

function ReviewCard({ testimonial }: { testimonial: Testimonial }) {
  const details = [nameOf(testimonial.city), nameOf(testimonial.service)].filter(Boolean)
  return (
    <figure className="flex h-full night-card flex-col p-6">
      <figcaption className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary-strong font-bold text-white"
        >
          {testimonial.name.replace(/^Sample customer,\s*/, '').charAt(0)}
        </span>
        <span className="min-w-0">
          <span className="block truncate font-semibold">{testimonial.name}</span>
          {details.length > 0 && (
            <span className="block truncate text-small text-night-muted">
              {details.join(' · ')}
            </span>
          )}
        </span>
        <SampleBadge show={testimonial.isSample} className="ml-auto shrink-0" />
      </figcaption>
      <Stars rating={testimonial.rating} className="mt-4" />
      <blockquote className="mt-3 line-clamp-5 text-night-muted">{testimonial.quote}</blockquote>
      {testimonial.source === 'google' && testimonial.sourceUrl && (
        <a
          href={testimonial.sourceUrl}
          data-track="review_link_click"
          rel="noopener"
          target="_blank"
          className="mt-auto inline-flex min-h-11 items-center pt-3 text-small font-semibold text-secondary-on-dark"
        >
          Verified Google review<span className="sr-only"> (opens in a new tab)</span>
        </a>
      )}
    </figure>
  )
}

/** Each scrolling track holds at least this many cards so it always fills a wide screen. */
const TRACK_MIN = 8

/**
 * Reviews in two slowly scrolling rows. Only the first copy of each review is in the
 * accessibility tree; the repeats that keep the loop seamless are inert. With reduced motion
 * the rows stop and wrap instead.
 */
export function NightTestimonials({
  testimonials,
  site,
}: {
  testimonials: Testimonial[]
  site: SiteConfig
}) {
  if (testimonials.length === 0) return null
  const rated = shownRating(site)
  const rows = (
    testimonials.length >= 6
      ? [
          testimonials.filter((_, index) => index % 2 === 0),
          testimonials.filter((_, index) => index % 2 === 1),
        ]
      : [testimonials]
  ).filter((row) => row.length > 0)

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
      data-marquee
      className="group/marquee overflow-hidden border-y border-white/5 bg-night-raised section-y"
    >
      <div className="container mb-10 flex reveal flex-wrap items-end justify-between gap-6 lg:mb-12">
        <div>
          <h2 id="reviews-heading" className="display-type display-h2">
            What customers say
          </h2>
          {rated && (
            <p className="mt-3 flex flex-wrap items-center gap-3">
              <span className="display-type text-4xl">{rated.rating.toFixed(1)}</span>
              <Stars rating={Math.round(rated.rating)} />
              <span className="text-small text-night-muted">
                from {rated.reviewCount} Google reviews
              </span>
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          <MarqueePause label="reviews" />
          {site.googleReviewUrl && (
            <a href={site.googleReviewUrl} data-track="review_link_click" className={pill}>
              Read them on Google
            </a>
          )}
          <Link href={routes.reviews} className={pill}>
            All reviews
          </Link>
        </div>
      </div>
      <div className="grid gap-5">
        {rows.map((row, rowIndex) => {
          const track = Array.from({ length: Math.ceil(TRACK_MIN / row.length) }, () => row).flat()
          return (
            <div
              key={rowIndex}
              className="flex [mask-image:linear-gradient(90deg,transparent,#000_5%,#000_95%,transparent)] motion-reduce:container motion-reduce:[mask-image:none]"
            >
              {[0, 1].map((copy) => (
                <ul
                  key={copy}
                  inert={copy === 1}
                  className={cn(
                    'flex shrink-0 animate-marquee gap-5 pr-5 [animation-duration:80s] group-focus-within/marquee:[animation-play-state:paused] group-hover/marquee:[animation-play-state:paused] group-data-[paused]/marquee:[animation-play-state:paused] motion-reduce:shrink motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:pr-0',
                    rowIndex === 1 && '[animation-direction:reverse]',
                    copy === 1 && 'motion-reduce:hidden',
                  )}
                >
                  {track.map((testimonial, index) => (
                    <li
                      key={`${testimonial.id}-${index}`}
                      inert={copy === 0 && index >= row.length}
                      className={cn(
                        'w-[min(22rem,80vw)]',
                        index >= row.length && 'motion-reduce:hidden',
                      )}
                    >
                      <ReviewCard testimonial={testimonial} />
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          )
        })}
      </div>
    </section>
  )
}

/** One large slider and two smaller ones, from the owner's own before/after photos. */
export function NightBeforeAfter({ items }: { items: GalleryItem[] }) {
  const pairs = items.flatMap((item) => {
    const before = asMedia(item.before)
    const after = asMedia(item.after)
    return before && after ? [{ item, before, after }] : []
  })
  if (pairs.length === 0) return null
  // The widest pair leads, so the large 16:10 frame crops it least.
  const shape = (pair: (typeof pairs)[number]) => (pair.after.width ?? 1) / (pair.after.height ?? 1)
  const feature = pairs.reduce((best, pair) => (shape(pair) > shape(best) ? pair : best))
  const rest = pairs.filter((pair) => pair !== feature).slice(0, 2)

  const slide = (pair: (typeof pairs)[number], large: boolean) => (
    <figure className="reveal">
      <BeforeAfterSlider
        before={{ url: mediaSrc(pair.before), alt: pair.before.alt }}
        after={{ url: mediaSrc(pair.after), alt: pair.after.alt }}
        caption={pair.item.caption}
        ratio={large ? '16/10' : '4/3'}
        tone="night"
        sizes={large ? '(min-width: 1280px) 1200px, 100vw' : '(min-width: 768px) 600px, 100vw'}
      />
      <figcaption className="mt-3 flex flex-wrap items-center gap-2 text-small">
        <span className="font-semibold text-white">{pair.item.caption}</span>
        <SampleBadge show={pair.item.isSample} />
      </figcaption>
    </figure>
  )

  return (
    <NightSection
      id="before-after"
      title="Before and after"
      intro="Drag the handle, or use the arrow keys, to compare."
      action={{ href: routes.beforeAndAfter, label: 'See more before and after photos' }}
    >
      {slide(feature, true)}
      {rest.length > 0 && (
        <ul className="mt-8 grid gap-8 md:grid-cols-2">
          {rest.map((pair) => (
            <li key={pair.item.id}>{slide(pair, false)}</li>
          ))}
        </ul>
      )}
    </NightSection>
  )
}

/** Big numbers, each shown only when site settings back it up (brief §3.3). */
export function NightStats({ site }: { site: SiteConfig }) {
  const rated = shownRating(site)
  const count = (value: number) => value.toLocaleString('en-CA')
  const items = [
    site.stats.jobsCompleted !== null && {
      value: count(site.stats.jobsCompleted),
      label: 'Jobs completed',
    },
    site.stats.happyClients !== null && {
      value: count(site.stats.happyClients),
      label: 'Happy clients',
    },
    rated && {
      value: rated.rating.toFixed(1),
      label: 'Average rating',
      note: `from ${rated.reviewCount} reviews`,
    },
    site.foundedYear && { value: String(site.foundedYear), label: `Serving ${site.region} since` },
    site.insuranceCoverage && { value: 'Insured', label: site.insuranceCoverage },
  ].filter(Boolean) as { value: string; label: string; note?: string; sample?: boolean }[]
  if (items.length === 0) return null
  return (
    <section aria-label="WashCraft at a glance" className="border-y border-white/5 bg-night-raised">
      <ul className="container grid sm:grid-cols-2 lg:grid-cols-4">
        {items.slice(0, 4).map((item) => (
          <li
            key={item.label}
            className="reveal border-white/10 py-10 not-first:border-t sm:px-6 sm:not-first:border-t-0 sm:first:pl-0 lg:not-first:border-l"
          >
            <p className="display-type text-5xl">{item.value}</p>
            <span aria-hidden className="mt-3 block h-0.5 w-8 bg-cta" />
            <p className="mt-4 flex items-center gap-2 font-semibold">
              {item.label} <SampleBadge show={item.sample} />
            </p>
            {item.note && <p className="text-small text-night-muted">{item.note}</p>}
          </li>
        ))}
      </ul>
    </section>
  )
}

export function NightGuarantee({ guarantee }: { guarantee: ShownGuarantee }) {
  if (!guarantee) return null
  return (
    <section aria-labelledby="guarantee-heading" className="bg-night">
      <div className="container flex reveal flex-col items-start gap-4 py-12 md:flex-row md:items-center md:gap-6">
        <BadgeCheck aria-hidden className="size-12 shrink-0 text-cta" />
        <div>
          <h2 id="guarantee-heading" className="flex items-center gap-3 text-h3">
            Our guarantee <SampleBadge show={guarantee.sample} />
          </h2>
          <p className="mt-1 text-night-muted">{guarantee.text}</p>
        </div>
      </div>
    </section>
  )
}

/** Map with dark tiles beside the list of cities served, plus the postal code checker. */
export function NightServiceAreas({ cities, region }: { cities: AreaCity[]; region: string }) {
  if (cities.length === 0) return null
  return (
    <NightSection
      id="service-areas"
      title="Where we work"
      intro={`We currently serve these communities in ${region}. Not on the list? Send a quote request anyway and we’ll tell you honestly whether we can help.`}
      action={{ href: routes.areas, label: 'Areas we serve' }}
    >
      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div className="reveal map-night lg:min-h-[28rem] [&>div]:border-white/10">
          <ServiceAreaMap cities={cities.map(({ name, lat, lng }) => ({ name, lat, lng }))} />
        </div>
        <div className="grid content-start gap-8">
          <ul className="border-t border-white/10">
            {cities.map((city) => (
              <li key={city.id} className="border-b border-white/10">
                <Link
                  href={routes.city(city.slug)}
                  className="group flex min-h-14 items-center justify-between gap-4 py-3 font-heading text-xl font-bold text-night-muted no-underline transition-colors hover:text-white"
                >
                  {city.name}
                  <ArrowRight
                    aria-hidden
                    className="size-5 text-cta opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </Link>
              </li>
            ))}
          </ul>
          <ZipChecker cities={cities} />
        </div>
      </div>
    </NightSection>
  )
}

const COMMERCIAL_POINTS = [
  'Commercial, restaurant and post-construction cleaning through one company',
  'Exterior and seasonal work for the same property when you need it',
  'A written estimate that sets out the scope, exclusions and conditions',
  'Visit times agreed with you before any work is booked',
]

/** Numbered points beside a large photo, for commercial and restaurant customers. */
export function NightCommercial({
  site,
  cta,
  servicesHref,
  photo,
}: {
  site: SiteConfig
  cta: QuoteCta
  servicesHref: string
  photo: Photo
}) {
  const proof = credentials(site)
  return (
    <NightSection
      id="commercial"
      raised
      title="Cleaning for businesses, restaurants and rental properties"
      action={{ href: servicesHref, label: 'Commercial services' }}
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-start">
        <div className="reveal">
          <ol className="border-t border-white/10">
            {COMMERCIAL_POINTS.map((point, index) => (
              <li key={point} className="flex gap-4 border-b border-white/10 py-5">
                <span aria-hidden className="pt-1 text-small font-bold text-cta">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="font-heading text-lg font-bold">{point}</span>
              </li>
            ))}
          </ol>
          {proof.length > 0 && (
            <ul className="mt-6 grid gap-1 text-small text-night-muted">
              {proof.map((credential) => (
                <li key={credential}>✓ {credential}</li>
              ))}
            </ul>
          )}
          <Button asChild size="lg" className="mt-8">
            <Link href={cta.href}>{cta.label}</Link>
          </Button>
        </div>
        <div className="reveal shadow-2xl">
          <FramedPhoto photo={photo} sizes="(min-width: 1024px) 700px, 100vw" />
        </div>
      </div>
    </NightSection>
  )
}

export type SeasonPanel = {
  season: Season
  label: string
  title: string
  current: boolean
  services: { slug: string; title: string }[]
  photo: Photo | null
}

/** Season tabs (this season open first), each with a photo and the services booked then. */
export function NightSeasons({ panels, cta }: { panels: SeasonPanel[]; cta: QuoteCta }) {
  if (panels.length === 0) return null
  const current = panels.find((panel) => panel.current) ?? panels[0]
  return (
    <NightSection
      id="in-season"
      title="In season right now"
      intro="Book these while the timing is right. Popular dates fill up fast."
      action={{ href: cta.href, label: cta.label }}
    >
      <Tabs defaultValue={current.season}>
        <TabsList
          aria-label="Seasons"
          className="flex w-full flex-wrap gap-0 rounded-none border-y border-white/10 bg-transparent p-0"
        >
          {panels.map((panel) => (
            <TabsTrigger
              key={panel.season}
              value={panel.season}
              className="min-h-14 flex-1 justify-start rounded-none border-b-2 border-transparent px-4 font-heading text-lg font-bold text-night-muted hover:text-white data-[state=active]:border-cta data-[state=active]:bg-white/5 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              {panel.label}
              {panel.current && <span className="text-small font-semibold text-cta">Now</span>}
            </TabsTrigger>
          ))}
        </TabsList>
        {panels.map((panel) => (
          <TabsContent
            key={panel.season}
            value={panel.season}
            className={cn('mt-10 grid items-center gap-10', panel.photo && 'lg:grid-cols-2')}
          >
            {panel.photo && (
              <FramedPhoto photo={panel.photo} sizes="(min-width: 1024px) 600px, 100vw" />
            )}
            <div>
              <h3 className="display-type text-3xl">{panel.title}</h3>
              <p className="mt-4 text-lg text-night-muted">
                What we book in {panel.label.toLowerCase()}. Open one to see what’s included, or
                send one request for several.
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {panel.services.map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={routes.service(service.slug)}
                      className="inline-flex min-h-11 items-center rounded-full border border-white/20 px-4 text-small font-semibold text-white no-underline transition-colors hover:border-cta hover:text-cta"
                    >
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </NightSection>
  )
}

const STEP_COLUMNS: Record<number, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-2 lg:grid-cols-4',
  5: 'md:grid-cols-2 lg:grid-cols-5',
}

/** The quote process: outlined numbers in one ruled panel, arrows between the steps. */
export function NightHowItWorks({
  steps,
  upsell,
  cta,
}: {
  steps: Homepage['howItWorks']
  upsell?: string | null
  cta: QuoteCta
}) {
  if (!steps?.length) return null
  const oneRow = steps.length <= 3
  return (
    <NightSection
      id="how-it-works"
      raised
      title="How getting a quote works"
      action={{ href: cta.href, label: cta.label }}
    >
      <ol
        className={cn(
          'grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10',
          STEP_COLUMNS[steps.length],
        )}
      >
        {steps.map((step, index) => (
          <li key={step.id ?? step.title} className="relative reveal bg-night p-8 lg:p-10">
            <span aria-hidden className="display-type text-6xl outline-number">
              {String(index + 1).padStart(2, '0')}
            </span>
            {index > 0 && (
              <span
                aria-hidden
                className={cn(
                  'absolute top-1/2 -left-5 z-10 hidden size-10 items-center justify-center rounded-full bg-cta text-ink shadow-lg',
                  oneRow ? 'md:flex' : 'lg:flex',
                )}
              >
                <ArrowRight className="size-5" />
              </span>
            )}
            <h3 className="mt-6 display-type display-h3">
              <span className="sr-only">Step {index + 1}: </span>
              {step.title}
            </h3>
            <p className="mt-3 text-night-muted">{step.body}</p>
            {index === steps.length - 1 && upsell && (
              <Link href={routes.maintenancePlans} className="mt-3 inline-block font-semibold">
                {upsell}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </NightSection>
  )
}

const REASON_ICONS = [Layers, CalendarRange, FileText, MapPin, HeartHandshake]

export function NightWhyChooseUs({
  cards,
  region,
}: {
  cards: Homepage['whyChooseUs']
  region: string
}) {
  if (!cards?.length) return null
  return (
    <NightSection id="why-choose-us" title="Why choose WashCraft">
      <ul className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => {
          const Icon = REASON_ICONS[index % REASON_ICONS.length]
          return (
            <li key={card.id ?? card.title} className="reveal border-t border-white/10 pt-6">
              {asMedia(card.image) ? (
                <CmsImage
                  media={card.image}
                  ratio="3/2"
                  sizes="(min-width: 1024px) 380px, (min-width: 480px) 50vw, 100vw"
                  className="mb-6 rounded-lg"
                />
              ) : (
                <Icon aria-hidden className="size-7 text-cta" />
              )}
              <h3 className="mt-4 display-type display-h3">{card.title}</h3>
              <p className="mt-2 text-night-muted">{fillTokens(card.body, { region })}</p>
            </li>
          )
        })}
      </ul>
    </NightSection>
  )
}

/** Heading on the left, questions on the right. Answers stay in the HTML for search engines. */
export function NightFaq({ faqs, region }: { faqs: FaqEntry[]; region: string }) {
  if (faqs.length === 0) return null
  const filled = faqs.map((faq) => ({
    id: faq.id,
    question: fillTokens(faq.question, { region }),
    answer: fillTokens(faq.answer, { region }),
  }))
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="border-y border-white/5 bg-night-raised section-y"
    >
      <div className="container grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <div className="reveal">
          <h2 id="faq-heading" className="display-type display-h2">
            Questions people ask
          </h2>
          <p className="mt-4 text-night-muted">
            Quick answers about quotes, visits and the areas we cover.
          </p>
          <Link href={routes.faq} className={cn(pill, 'mt-8')}>
            More questions and answers
          </Link>
        </div>
        <div>
          <JsonLd data={faqPage(filled)} />
          <Accordion type="multiple" className="border-t border-white/10">
            {filled.map((faq) => (
              <AccordionItem key={faq.id} value={String(faq.id)} className="border-white/10">
                <AccordionTrigger className="py-5 text-white hover:text-secondary-on-dark [&>svg]:text-cta">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-night-muted">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}

/** A tilted wall of the owner's job photos. Decorative: the gallery page has the real list. */
function PhotoWall({ urls }: { urls: string[] }) {
  const tiles = Array.from({ length: 18 }, (_, index) => urls[index % urls.length])
  return (
    <figure className="relative overflow-hidden pt-16">
      <figcaption className="container flex items-center gap-2 text-small text-night-muted">
        <Camera aria-hidden className="size-4 shrink-0 text-cta" />
        <span>
          Photos from WashCraft jobs. Compare them side by side on our{' '}
          <Link href={routes.beforeAndAfter}>before and after page</Link>.
        </span>
      </figcaption>
      <div
        aria-hidden
        className="relative mt-6 h-72 overflow-hidden [mask-image:linear-gradient(180deg,transparent,#000_15%,#000_80%,transparent)] sm:h-96"
      >
        <div className="absolute top-1/2 left-1/2 grid w-[160%] [transform:translate(-50%,-50%)_rotate(-8deg)_skewX(8deg)] grid-cols-6 gap-3">
          {tiles.map((url, index) => (
            <div key={index} className="relative aspect-[4/3] overflow-hidden rounded-md">
              <Image src={url} alt="" fill sizes="280px" className="object-cover opacity-75" />
            </div>
          ))}
        </div>
      </div>
    </figure>
  )
}

/** Closing call to action: the photo wall, a big heading and a light quote panel. */
export function NightFinalCta({
  region,
  cta,
  email,
  phone,
  wall,
}: {
  region: string
  cta: QuoteCta
  email: string | null
  phone: string
  wall: string[]
}) {
  const callHref = telHref(phone)
  return (
    <section aria-labelledby="final-cta-heading" className="bg-night">
      {wall.length >= 4 && <PhotoWall urls={wall} />}
      <div className="border-t border-white/5 bg-night-raised">
        <div className="container section-y text-center">
          <h2
            id="final-cta-heading"
            className="mx-auto max-w-5xl reveal display-type display-hero text-balance"
          >
            Tell us about your property
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-night-muted">
            Send a few details about the job in {region}. We’ll review your request and contact you
            with a written estimate.
          </p>
          <div className="mx-auto mt-10 max-w-xl reveal rounded-lg bg-surface p-8 text-left text-ink shadow-2xl sm:p-10">
            <p className="text-h3 font-heading font-bold text-primary">What to send us</p>
            <ul className="mt-5 grid gap-3">
              {[
                'Your address and the type of property',
                'The services you need, and when',
                'A few photos, if you have them',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check aria-hidden className="mt-1 size-5 shrink-0 text-success-strong" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={cta.href}>{cta.label}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={routes.services}>Explore Our Services</Link>
              </Button>
            </div>
          </div>
          {(email || callHref) && (
            <p className="mt-8 text-night-muted">
              Prefer to reach us directly?{' '}
              {callHref && (
                <a href={callHref} data-track="call_click">
                  Call {phone}
                </a>
              )}
              {callHref && email && ' or '}
              {email && <a href={`mailto:${email}`}>{email}</a>}
            </p>
          )}
          <p className="mt-4 inline-flex items-center gap-2 text-small text-night-muted">
            <MapPin aria-hidden className="size-4 text-cta" />
            Serving {region}
          </p>
        </div>
      </div>
    </section>
  )
}

/** Credits for the licensed stock photos on the page, as their licenses require. */
export function PhotoCredits({ photos }: { photos: StockPhoto[] }) {
  if (photos.length === 0) return null
  return (
    <div className="bg-night-raised">
      <Credits photos={photos} className="container pb-10 text-night-muted" />
    </div>
  )
}
