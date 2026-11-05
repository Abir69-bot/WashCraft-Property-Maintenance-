import {
  ArrowRight,
  CalendarRange,
  Check,
  FileText,
  HeartHandshake,
  Layers,
  MapPin,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { CmsImage } from '@/components/cms-image'
import { CallLink, TextLink } from '@/components/layout/contact-links'
import { QuickQuoteForm, type ServiceGroup } from '@/components/quote/quick-quote-form'
import { SampleBadge } from '@/components/sample-badge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { planPrice } from '@/lib/pricing/plans'
import type { QuoteCta } from '@/lib/quote/flow'
import { routes } from '@/lib/routes'
import { fillTokens, smsHref, telHref } from '@/lib/text'
import { cn } from '@/lib/utils'
import { asMedia, mediaSrc } from '@/lib/view'
import type { ClientLogo, Homepage, Plan, Post } from '@/payload-types'

import { PostCard } from './article'
import { Section, type SectionTone } from './section'

export function QuickQuoteStrip({
  groups,
  consentLabel,
}: {
  groups: ServiceGroup[]
  consentLabel: string
}) {
  return (
    <section aria-labelledby="quick-quote-heading" className="border-y border-border bg-card">
      <div className="container py-10">
        <h2 id="quick-quote-heading" className="text-h3">
          Get a quick quote
        </h2>
        <p className="mt-1 mb-6 text-muted">
          Four quick details and we’ll get back to you with a price.
        </p>
        <QuickQuoteForm groups={groups} consentLabel={consentLabel} layout="wide" />
      </div>
    </section>
  )
}

/** Client logos in a marquee (brief §9.1.3); the name stands in for a missing logo file. */
export function ClientLogos({ logos }: { logos: ClientLogo[] }) {
  if (logos.length === 0) return null
  return (
    <section
      aria-label="Clients we work with"
      className="group overflow-hidden border-b border-border py-8"
    >
      <div className="flex">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1}
            className="flex shrink-0 animate-marquee items-center gap-12 pr-12 group-hover:[animation-play-state:paused] motion-reduce:animate-none"
          >
            {logos.map((client) => {
              const logo = asMedia(client.logo)
              return (
                <li
                  key={client.id}
                  className="flex items-center gap-2 font-heading font-bold whitespace-nowrap text-muted"
                >
                  {logo?.width && logo.height ? (
                    <Image
                      src={mediaSrc(logo)}
                      alt={client.name}
                      width={logo.width}
                      height={logo.height}
                      sizes="240px"
                      className="h-10 w-auto opacity-80 grayscale"
                    />
                  ) : (
                    client.name
                  )}
                  <SampleBadge show={client.isSample} />
                </li>
              )
            })}
          </ul>
        ))}
      </div>
    </section>
  )
}

/** The quote process, as numbered steps (Home page → How it works in the admin). */
export function HowItWorks({
  steps,
  upsell,
  tone,
  title = 'How getting a quote works',
}: {
  steps: Homepage['howItWorks']
  /** Link to maintenance plans after the last step (only with instant prices switched on). */
  upsell?: string | null
  tone?: SectionTone
  title?: string
}) {
  if (!steps?.length) return null
  return (
    <Section id="how-it-works" tone={tone} eyebrow="How it works" title={title}>
      <ol
        className={cn(
          'grid gap-5 sm:grid-cols-2',
          steps.length > 3 ? 'lg:grid-cols-5' : 'lg:grid-cols-3',
        )}
      >
        {steps.map((step, index) => (
          <li key={step.id ?? step.title} className="relative card-raised p-6">
            <span aria-hidden className="step-number">
              {index + 1}
            </span>
            <h3 className="mt-4 text-lg">
              <span className="sr-only">Step {index + 1}: </span>
              {step.title}
            </h3>
            <p className="mt-2 text-small text-muted">{step.body}</p>
            {index === steps.length - 1 && upsell && (
              <Link href={routes.maintenancePlans} className="mt-3 inline-block font-semibold">
                {upsell}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </Section>
  )
}

/** Call and text band, shown once a phone number is set. `night` for the home page's theme. */
export function NeedUsNow({ phone, tone }: { phone: string; tone?: 'night' }) {
  if (!telHref(phone)) return null
  const night = tone === 'night'
  return (
    <section
      aria-labelledby="need-us-heading"
      className={night ? 'border-y border-white/5 bg-night-raised' : 'bg-surface'}
    >
      <div className="container flex flex-col items-start justify-between gap-6 py-10 md:flex-row md:items-center">
        <div>
          <h2
            id="need-us-heading"
            className={night ? 'display-type display-h3 text-white' : 'text-h3'}
          >
            Need us now?
          </h2>
          <p className={cn('mt-1', night ? 'text-night-muted' : 'text-muted')}>
            Call or text and we’ll help you plan the job.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" variant={night ? 'cta' : 'primary'}>
            <CallLink phone={phone} label={`Call ${phone}`} />
          </Button>
          {smsHref(phone) && (
            <Button asChild size="lg" variant={night ? 'night' : 'outline'}>
              <TextLink phone={phone} />
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}

const REASON_ICONS = [Layers, CalendarRange, FileText, MapPin, HeartHandshake]

export function WhyChooseUs({
  cards,
  region,
  intro,
  tone,
}: {
  cards: Homepage['whyChooseUs']
  region: string
  /** Local angle on city pages (brief §9.4). */
  intro?: string | null
  tone?: SectionTone
}) {
  if (!cards?.length) return null
  return (
    <Section
      id="why-choose-us"
      tone={tone}
      eyebrow="Why WashCraft"
      title="Why choose WashCraft"
      intro={intro}
    >
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => {
          const Icon = REASON_ICONS[index % REASON_ICONS.length]
          return (
            <li key={card.id ?? card.title} className="card-lift overflow-hidden card-raised">
              {/* Only a real photo is shown; otherwise the card leads with an icon. */}
              {asMedia(card.image) && (
                <CmsImage
                  media={card.image}
                  ratio="3/2"
                  sizes="(min-width: 1024px) 380px, (min-width: 480px) 50vw, 100vw"
                  className="rounded-none"
                />
              )}
              <div className="p-6">
                {!asMedia(card.image) && (
                  <span className="mb-4 icon-chip">
                    <Icon aria-hidden className="size-6" />
                  </span>
                )}
                <h3 className="text-h3">{card.title}</h3>
                <p className="mt-2 text-muted">{fillTokens(card.body, { region })}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}

export function ComparisonTable({
  comparison,
  tone = 'surface',
}: {
  comparison: Homepage['comparison']
  tone?: SectionTone
}) {
  if (!comparison?.rows?.length) return null
  return (
    <Section
      id="compare"
      tone={tone}
      eyebrow="Compare"
      title="How we compare"
      intro="General differences between typical options. Every company is different, so ask questions."
    >
      {/* Focusable so keyboard users can scroll the table on narrow screens (WCAG 2.1.1). */}
      <div
        role="region"
        aria-label="Comparison table"
        tabIndex={0}
        className="overflow-x-auto rounded-card border border-border bg-card"
      >
        <table className="w-full min-w-xl text-left">
          <caption className="sr-only">WashCraft compared with typical alternatives</caption>
          <thead className="bg-brand-primary text-white">
            <tr>
              <th scope="col" className="p-4">
                <span className="sr-only">Criterion</span>
              </th>
              <th scope="col" className="p-4 font-heading">
                {comparison.usLabel}
              </th>
              <th scope="col" className="p-4 font-semibold">
                {comparison.independentLabel}
              </th>
              <th scope="col" className="p-4 font-semibold">
                {comparison.largeLabel}
              </th>
            </tr>
          </thead>
          <tbody>
            {comparison.rows.map((row) => (
              <tr key={row.id ?? row.criterion} className="border-t border-border">
                <th scope="row" className="p-4 font-semibold">
                  {row.criterion}
                </th>
                <td className="bg-surface p-4 font-semibold text-primary">
                  <span className="flex items-start gap-2">
                    <Check aria-hidden className="mt-1 size-4 shrink-0 text-success-strong" />
                    {row.us}
                  </span>
                </td>
                <td className="p-4 text-muted">{row.independent}</td>
                <td className="p-4 text-muted">{row.large}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  )
}

export function PlansTeaser({ plans }: { plans: Plan[] }) {
  if (plans.length === 0) return null
  return (
    <Section
      id="plans"
      tone="surface"
      eyebrow="Maintenance plans"
      title="Put your property on a schedule"
      intro="Pick a plan and we’ll book every visit for you, season after season."
    >
      <ul className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const price = planPrice(plan)
          return (
            <li
              key={plan.id}
              className={`flex flex-col rounded-card border bg-card p-6 ${plan.highlighted ? 'border-2 border-primary shadow-lg' : 'border-border'}`}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-h3">{plan.name}</h3>
                {plan.highlighted && <Badge tone="interior">Recommended</Badge>}
              </div>
              <p className="mt-2 text-muted">{plan.tagline}</p>
              <p className="mt-4 text-h3 font-heading font-extrabold text-primary">
                {price ?? 'Custom quote'}
              </p>
              {price && plan.needsReview && (
                <Badge tone="sample" className="mt-1 w-fit">
                  Placeholder price
                </Badge>
              )}
              <ul className="mt-4 grid gap-2">
                {plan.features.slice(0, 4).map((feature) => (
                  <li key={feature.id ?? feature.text} className="flex items-start gap-2">
                    <Check aria-hidden className="mt-1 size-4 shrink-0 text-success-strong" />
                    {feature.text}
                  </li>
                ))}
              </ul>
            </li>
          )
        })}
      </ul>
      <Button asChild variant="outline" size="lg" className="mt-8">
        <Link href={routes.maintenancePlans}>Compare plans and packages</Link>
      </Button>
    </Section>
  )
}

export function LatestArticles({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null
  return (
    <Section id="articles" eyebrow="From the blog" title="Tips for every season">
      <ul className="grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <li key={post.id}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
      <Link
        href={routes.blog}
        className="mt-8 inline-flex min-h-11 items-center gap-2 font-semibold"
      >
        All articles <ArrowRight aria-hidden className="size-4" />
      </Link>
    </Section>
  )
}

/** Closing call to action. Inner pages pass their own quote button and wording. */
export function FinalCta({
  region,
  cta,
  title = 'Tell us about your property',
  text = `Send a few details about the job in ${region}. We’ll review your request and contact you with a written estimate.`,
}: {
  region: string
  cta: QuoteCta
  title?: string
  text?: string
}) {
  return (
    <section aria-labelledby="final-cta-heading">
      <div className="container section-y">
        <div className="cta-panel text-center">
          <h2 id="final-cta-heading" className="text-white">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">{text}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
            <Button asChild size="lg" variant="inverse">
              <Link href={routes.services}>Explore Our Services</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
