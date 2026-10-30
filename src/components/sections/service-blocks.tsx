import {
  ArrowRight,
  CalendarClock,
  Check,
  ClipboardCheck,
  FileText,
  MapPin,
  Plus,
  ShieldCheck,
  TriangleAlert,
  Users,
} from 'lucide-react'
import Link from 'next/link'

import { CmsImage } from '@/components/cms-image'
import { ServiceCard } from '@/components/service-card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SEASON_LABELS, type Season } from '@/config/catalog'
import type { AreaCity } from '@/lib/data/layout'
import type { QuoteCta } from '@/lib/quote/flow'
import { routes } from '@/lib/routes'
import { fillTokens } from '@/lib/text'
import { cn } from '@/lib/utils'
import { asMedia } from '@/lib/view'
import type { Post, Service, Solution } from '@/payload-types'

import { Section, type SectionTone } from './section'

type Titled = { id?: string | null; title: string; body: string }

/** The problem, three benefits, a trust line and the service photo (brief §9.3.2). */
export function ServiceIntro({
  service,
  region,
  trust,
}: {
  service: Service
  region: string
  trust: string[]
}) {
  return (
    <Section id="overview">
      <div
        className={cn('grid items-center gap-10', asMedia(service.heroImage) && 'lg:grid-cols-2')}
      >
        <div>
          <h2>Why it matters</h2>
          <p className="mt-4 text-lg text-muted">{fillTokens(service.problem, { region })}</p>
          <ul className="mt-6 grid gap-3">
            {service.benefits.slice(0, 3).map((benefit) => (
              <li key={benefit.id ?? benefit.title} className="flex items-start gap-3">
                <Check aria-hidden className="mt-1 size-5 shrink-0 text-success-strong" />
                <span>
                  <strong className="text-ink">{benefit.title}.</strong>{' '}
                  {fillTokens(benefit.body, { region })}
                </span>
              </li>
            ))}
          </ul>
          {trust.length > 0 && (
            <p className="mt-6 text-small font-semibold text-ink">{trust.join(' · ')}</p>
          )}
        </div>
        {asMedia(service.heroImage) && (
          <CmsImage
            media={service.heroImage}
            ratio="4/3"
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="shadow-raised"
          />
        )}
      </div>
    </Section>
  )
}

const POINT_LISTS = {
  suitableFor: { icon: Users, eyebrow: 'Who it’s for', iconClass: 'text-secondary-strong' },
  exclusions: {
    icon: TriangleAlert,
    eyebrow: 'Good to know',
    iconClass: 'text-secondary-strong',
  },
  preparation: {
    icon: ClipboardCheck,
    eyebrow: 'Before we arrive',
    iconClass: 'text-success-strong',
  },
} as const

/**
 * A titled list of short points: who the service suits, what it doesn't cover and access
 * limits, or how to prepare. Hidden while the list is empty.
 */
export function PointList({
  kind,
  title,
  items,
  intro,
  tone,
}: {
  kind: keyof typeof POINT_LISTS
  title: string
  items: { id?: string | null; item: string }[] | null | undefined
  intro?: React.ReactNode
  tone?: SectionTone
}) {
  if (!items?.length) return null
  const { icon: Icon, eyebrow, iconClass } = POINT_LISTS[kind]
  return (
    <Section id={kind} tone={tone} eyebrow={eyebrow} title={title} intro={intro}>
      <ul className="grid gap-4 md:grid-cols-2">
        {items.map((point) => (
          <li key={point.id ?? point.item} className="flex items-start gap-3 card-raised p-5">
            <Icon aria-hidden className={cn('mt-0.5 size-5 shrink-0', iconClass)} />
            {point.item}
          </li>
        ))}
      </ul>
    </Section>
  )
}

/** The service hero's side card: what the quote covers and the button to request one. */
export function QuoteCard({ cta, service }: { cta: QuoteCta; service?: string }) {
  return (
    <div className="card-raised p-6 sm:p-8">
      <FileText aria-hidden className="size-8 text-secondary-strong" />
      <h2 className="mt-4 text-h3">Get a written estimate</h2>
      <p className="mt-2 text-muted">
        Tell us about the job and add photos if you can. We review every request and send a written
        estimate with the scope, exclusions, price and conditions before anything is booked.
      </p>
      <Button asChild size="lg" className="mt-6 w-full">
        <Link href={cta.href}>{cta.label}</Link>
      </Button>
      {service && (
        <p className="mt-3 text-center text-small text-muted">
          The form opens with {service} already picked.
        </p>
      )}
    </div>
  )
}

/** Benefits as tabs (brief §9.3.3). Every panel stays in the HTML for search engines. */
export function BenefitTabs({
  benefits,
  title,
  region,
}: {
  benefits: Titled[]
  title: string
  region: string
}) {
  if (benefits.length === 0) return null
  return (
    <Section id="benefits" tone="surface" eyebrow="Benefits" title={`Why book ${title}`}>
      <Tabs defaultValue="0">
        <TabsList aria-label={`${title} benefits`}>
          {benefits.map((benefit, index) => (
            <TabsTrigger key={benefit.id ?? benefit.title} value={String(index)}>
              {benefit.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {benefits.map((benefit, index) => (
          <TabsContent
            key={benefit.id ?? benefit.title}
            value={String(index)}
            forceMount
            className="max-w-3xl rounded-card bg-white p-6 data-[state=inactive]:hidden md:p-10"
          >
            <h3>{benefit.title}</h3>
            <p className="mt-3 text-lg text-muted">{fillTokens(benefit.body, { region })}</p>
          </TabsContent>
        ))}
      </Tabs>
    </Section>
  )
}

/** "What's included" checklist (brief §9.3.4). */
export function IncludedList({ items }: { items: Service['included'] }) {
  if (items.length === 0) return null
  return (
    <Section id="included" eyebrow="The details" title="What’s included">
      <ul className="grid gap-x-8 gap-y-3 md:grid-cols-2">
        {items.map((item) => (
          <li key={item.id ?? item.item} className="flex items-start gap-3">
            <Check aria-hidden className="mt-1 size-5 shrink-0 text-success-strong" />
            {item.item}
          </li>
        ))}
      </ul>
    </Section>
  )
}

/** "How we do it" and safety notes (brief §9.3.5). */
export function MethodAndSafety({
  method,
  safety,
  region,
}: {
  method: string
  safety?: string | null
  region: string
}) {
  return (
    <Section id="method" tone="surface" eyebrow="Our method" title="How we do it">
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <p className="text-lg text-muted">{fillTokens(method, { region })}</p>
        {safety && (
          <div className="rounded-card border border-border bg-white p-6">
            <h3 className="flex items-center gap-2">
              <ShieldCheck aria-hidden className="size-6 text-success-strong" />
              Safety first
            </h3>
            <p className="mt-3 text-muted">{fillTokens(safety, { region })}</p>
          </div>
        )}
      </div>
    </Section>
  )
}

/** Numbered process steps (brief §9.3.6). */
export function ProcessSteps({
  steps,
  region,
  title = 'Step by step',
  upsell,
}: {
  steps: Titled[]
  region: string
  title?: string
  /** Recurring-plan prompt under the steps (brief §17 #8). */
  upsell?: string | null
}) {
  if (steps.length === 0) return null
  return (
    <Section id="process" eyebrow="The process" title={title}>
      <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <li key={step.id ?? step.title} className="card-raised p-6">
            <span aria-hidden className="step-number">
              {index + 1}
            </span>
            <h3 className="mt-4">
              <span className="sr-only">Step {index + 1}: </span>
              {step.title}
            </h3>
            <p className="mt-2 text-muted">{fillTokens(step.body, { region })}</p>
          </li>
        ))}
      </ol>
      {upsell && (
        <Link
          href={routes.maintenancePlans}
          className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold"
        >
          {upsell} <ArrowRight aria-hidden className="size-4" />
        </Link>
      )}
    </Section>
  )
}

/** Price factors, a "from" price and add-ons; hidden when there's nothing to show (§9.3.7). */
export function PricingGuide({ service, cta }: { service: Service; cta: QuoteCta }) {
  const factors = service.priceFactors ?? []
  const addOns = service.addOns ?? []
  if (service.fromPrice == null && factors.length === 0 && addOns.length === 0) return null
  return (
    <Section
      id="pricing"
      tone="surface"
      eyebrow="Pricing guide"
      title="What affects the price"
      intro="Every property is different, so we price each job on what it needs."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-card bg-white p-6">
          {service.fromPrice != null && (
            <p className="mb-4 text-h3 font-heading font-extrabold text-primary">
              From ${service.fromPrice.toLocaleString('en-US')}
            </p>
          )}
          {factors.length > 0 && (
            <ul className="grid gap-2">
              {factors.map((factor) => (
                <li key={factor.id ?? factor.factor} className="flex items-start gap-2">
                  <Check aria-hidden className="mt-1 size-4 shrink-0 text-success-strong" />
                  {factor.factor}
                </li>
              ))}
            </ul>
          )}
          <Button asChild className="mt-6">
            <Link href={cta.href}>{cta.label}</Link>
          </Button>
        </div>
        {addOns.length > 0 && (
          <div className="rounded-card bg-white p-6">
            <h3>Popular add-ons</h3>
            <ul className="mt-4 grid gap-3">
              {addOns.map((addOn) => (
                <li key={addOn.id ?? addOn.name} className="flex items-start gap-3">
                  <Plus aria-hidden className="mt-1 size-4 shrink-0 text-secondary-strong" />
                  <span>
                    <strong className="text-ink">{addOn.name}</strong>
                    {addOn.description && (
                      <span className="text-muted"> — {addOn.description}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Section>
  )
}

/** Cities served, linking to city pages or service-in-city pages (brief §9.3.12). */
export function AreaLinks({
  cities,
  service,
  cityServicePages,
}: {
  cities: AreaCity[]
  service: Pick<Service, 'id' | 'title' | 'slug'>
  cityServicePages: boolean
}) {
  if (cities.length === 0) return null
  return (
    <Section
      id="areas"
      eyebrow="Service areas"
      title={`Where we offer ${service.title}`}
      intro={
        <>
          We currently serve these communities. Not sure if we cover you?{' '}
          <Link href={routes.areas}>Check your postal code</Link>.
        </>
      }
    >
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {cities.map((city) => {
          const local =
            cityServicePages &&
            (city.servicePages ?? []).some(
              (page) => (typeof page === 'object' ? page.id : page) === service.id,
            )
          return (
            <li key={city.id}>
              <Link
                href={local ? routes.cityService(city.slug, service.slug) : routes.city(city.slug)}
                className="flex min-h-12 card-lift items-center gap-2 card-raised px-4 font-semibold no-underline"
              >
                <MapPin aria-hidden className="size-4 shrink-0 text-secondary-strong" />
                {local ? `${service.title} in ${city.name}` : city.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}

type CardService = Pick<Service, 'id' | 'title' | 'slug' | 'summary' | 'icon' | 'outcomeLabel'>

const related = <T extends { id: number }>(items: (number | T)[] | null | undefined) =>
  (items ?? []).filter((item): item is T => typeof item === 'object')

/** Related services, solutions and articles (brief §9.3.14). */
export function RelatedLinks({
  services,
  solutions,
  posts,
  region,
  title = 'Related services',
  tone = 'surface',
}: {
  services: (number | Service)[] | null | undefined
  solutions?: (number | Solution)[] | null
  posts?: (number | Post)[] | null
  region: string
  title?: string
  tone?: SectionTone
}) {
  const cards = related<Service>(services).filter(
    (service) => service.enabled !== false,
  ) as CardService[]
  const guides = [
    ...related<Solution>(solutions).map((doc) => ({
      id: `solution-${doc.id}`,
      title: doc.title,
      href: routes.solution(doc.slug),
    })),
    ...related<Post>(posts).map((doc) => ({
      id: `post-${doc.id}`,
      title: doc.title,
      href: routes.post(doc.slug),
    })),
  ]
  if (cards.length === 0 && guides.length === 0) return null
  return (
    <Section id="related" tone={tone} eyebrow="Keep exploring" title={title}>
      {cards.length > 0 && (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((service) => (
            <li key={service.id}>
              <ServiceCard
                slug={service.slug}
                title={service.title}
                summary={fillTokens(service.summary, { region })}
                icon={service.icon}
                outcomeLabel={service.outcomeLabel}
                className="h-full"
              />
            </li>
          ))}
        </ul>
      )}
      {guides.length > 0 && (
        <div className="mt-10">
          <h3>Helpful guides</h3>
          <ul className="mt-4 grid gap-2 md:grid-cols-2">
            {guides.map((guide) => (
              <li key={guide.id}>
                <Link
                  href={guide.href}
                  className="inline-flex min-h-11 items-center gap-2 font-semibold"
                >
                  {guide.title} <ArrowRight aria-hidden className="size-4" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  )
}

/** A short note beside the hero actions, e.g. seasonal booking timing. */
export function NoteBadge({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex max-w-xl items-start gap-2 rounded-card bg-white px-4 py-2 text-small font-semibold text-ink shadow-sm">
      <CalendarClock aria-hidden className="mt-0.5 size-4 shrink-0 text-secondary-strong" />
      <span>{children}</span>
    </p>
  )
}

/** "Booking window" badge for seasonal services (brief §9.3.15). */
export function BookingWindow({ seasons, note }: { seasons: Season[]; note?: string | null }) {
  if (seasons.includes('all-year')) return null
  return (
    <NoteBadge>
      Booking window: {note || seasons.map((season) => SEASON_LABELS[season]).join(', ')}
    </NoteBadge>
  )
}
