import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarCheck,
  Check,
  ClipboardList,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'

import { TONE_BORDER } from '@/components/category-tone'
import { CmsImage } from '@/components/cms-image'
import { CallLink, TextLink } from '@/components/layout/contact-links'
import { QuickQuoteForm, type ServiceGroup } from '@/components/quote/quick-quote-form'
import { SampleBadge } from '@/components/sample-badge'
import { ServiceCard } from '@/components/service-card'
import { ServiceIcon } from '@/components/service-icon'
import { Badge, type BadgeTone } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SEASON_LABELS, type Season } from '@/config/catalog'
import type { SiteConfig } from '@/config/site'
import type { NavCategory, NavService } from '@/lib/data/layout'
import { planPrice } from '@/lib/pricing/plans'
import type { QuoteCta } from '@/lib/quote/flow'
import { routes } from '@/lib/routes'
import { fillTokens, smsHref, telHref } from '@/lib/text'
import { formatDate } from '@/lib/view'
import type { ClientLogo, Homepage, Plan, Post, TeamMember } from '@/payload-types'

import { credentials } from './commercial-blocks'
import { Section, type SectionTone } from './section'
import { ServiceExplorer, type ExplorerService } from './service-explorer'

export function QuickQuoteStrip({
  groups,
  consentLabel,
}: {
  groups: ServiceGroup[]
  consentLabel: string
}) {
  return (
    <section aria-labelledby="quick-quote-heading" className="border-y border-border bg-white">
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
            {logos.map((logo) => (
              <li
                key={logo.id}
                className="flex items-center gap-2 font-heading font-bold whitespace-nowrap text-muted"
              >
                {logo.name}
                <SampleBadge show={logo.isSample} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  )
}

/** Up to four checkmarks, each only when site settings back it up (brief §9.1.4, §9.3.8). */
export function TrustStrip({ site }: { site: SiteConfig }) {
  const items = [
    site.insuranceCoverage && `Insured: ${site.insuranceCoverage}`,
    site.workersCompRegistration && 'Workers’ comp registered',
    site.licenceNumbers.length > 0 && 'Licensed',
    site.guarantee && 'Satisfaction guarantee',
    site.responseTimePromise && `Replies ${site.responseTimePromise}`,
    site.stats.rating &&
      site.stats.reviewCount &&
      `${site.stats.rating.toFixed(1)}★ from ${site.stats.reviewCount} reviews`,
  ].filter(Boolean) as string[]
  if (items.length === 0) return null
  return (
    <section aria-label="Why customers trust us" className="bg-surface">
      <ul className="container grid gap-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.slice(0, 4).map((item) => (
          <li key={item} className="flex items-center gap-2 font-semibold text-ink">
            <BadgeCheck aria-hidden className="size-6 shrink-0 text-success-strong" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}

export function ServiceCategories({
  categories,
  explorer,
  region,
}: {
  categories: NavCategory[]
  explorer: ExplorerService[]
  region: string
}) {
  return (
    <Section
      id="services"
      eyebrow="What we do"
      title="Every season, one team"
      intro={`Cleaning, snow and ice, holiday lighting and yard care for homes and businesses across ${region}.`}
    >
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <li
            key={category.id}
            className={`flex flex-col rounded-card border border-t-4 border-border bg-white p-6 ${TONE_BORDER[category.tone] ?? ''}`}
          >
            <div className="flex items-center gap-3">
              <ServiceIcon name={category.icon} className="size-8 text-secondary-strong" />
              <h3 className="text-h3">
                <Link
                  href={routes.category(category.slug)}
                  className="text-primary no-underline hover:underline"
                >
                  {category.title}
                </Link>
              </h3>
            </div>
            <p className="mt-3 text-muted">{category.summary}</p>
            <Link
              href={routes.category(category.slug)}
              className="mt-auto inline-flex min-h-11 items-center gap-2 pt-4 font-semibold"
            >
              {category.outcomeLabel} <ArrowRight aria-hidden className="size-4" />
            </Link>
          </li>
        ))}
      </ul>
      <ServiceExplorer services={explorer} />
    </Section>
  )
}

export function SeasonalSpotlight({
  season,
  services,
}: {
  season: Season
  services: NavService[]
}) {
  if (services.length === 0) return null
  return (
    <Section
      id="in-season"
      tone="surface"
      eyebrow={`${SEASON_LABELS[season]} spotlight`}
      title="In season right now"
      intro="Book these while the timing is right. Popular dates fill up fast."
    >
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.slice(0, 6).map((service) => (
          <li key={service.id}>
            <ServiceCard
              slug={service.slug}
              title={service.title}
              summary={service.summary}
              icon={service.icon}
              outcomeLabel={service.outcomeLabel}
              className="h-full"
            />
          </li>
        ))}
      </ul>
    </Section>
  )
}

const STEP_ICONS = [ClipboardList, CalendarCheck, Sparkles]

export function HowItWorks({
  steps,
  upsell,
  tone,
}: {
  steps: Homepage['howItWorks']
  upsell?: string | null
  tone?: SectionTone
}) {
  if (!steps?.length) return null
  return (
    <Section
      id="how-it-works"
      tone={tone}
      eyebrow="How it works"
      title="Three steps to a cleaner property"
      align="center"
    >
      <ol className="grid gap-8 md:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = STEP_ICONS[index] ?? Check
          return (
            <li key={step.id ?? step.title} className="text-center">
              <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-surface text-primary">
                <Icon aria-hidden className="size-7" />
              </span>
              <h3 className="mt-4 text-h3">
                <span className="sr-only">Step {index + 1}: </span>
                {step.title}
              </h3>
              <p className="mt-2 text-muted">{step.body}</p>
              {index === steps.length - 1 && upsell && (
                <Link href={routes.maintenancePlans} className="mt-3 inline-block font-semibold">
                  {upsell}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </Section>
  )
}

export function GuaranteeBand({ guarantee }: { guarantee: string | null }) {
  if (!guarantee) return null
  return (
    <section aria-labelledby="guarantee-heading" className="bg-success-strong text-white">
      <div className="container flex flex-col items-start gap-3 py-10 md:flex-row md:items-center md:gap-6">
        <BadgeCheck aria-hidden className="size-12 shrink-0" />
        <div>
          <h2 id="guarantee-heading" className="text-h3 text-white">
            Our guarantee
          </h2>
          <p className="mt-1 text-white">{guarantee}</p>
        </div>
      </div>
    </section>
  )
}

export function NeedUsNow({ phone }: { phone: string }) {
  if (!telHref(phone)) return null
  return (
    <section aria-labelledby="need-us-heading" className="bg-surface">
      <div className="container flex flex-col items-start justify-between gap-6 py-10 md:flex-row md:items-center">
        <div>
          <h2 id="need-us-heading" className="text-h3">
            Need us now?
          </h2>
          <p className="mt-1 text-muted">Call or text and we’ll help you plan the job.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" variant="primary">
            <CallLink phone={phone} label={`Call ${phone}`} />
          </Button>
          {smsHref(phone) && (
            <Button asChild size="lg" variant="outline">
              <TextLink phone={phone} />
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}

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
      title="Why homeowners and managers choose us"
      intro={intro}
    >
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <li
            key={card.id ?? card.title}
            className="overflow-hidden rounded-card border border-border bg-white"
          >
            <CmsImage
              media={card.image}
              label={card.imageLabel}
              ratio="3/2"
              sizes="(min-width: 1024px) 380px, (min-width: 480px) 50vw, 100vw"
              className="rounded-none"
            />
            <div className="p-6">
              <h3 className="text-h3">{card.title}</h3>
              <p className="mt-2 text-muted">{fillTokens(card.body, { region })}</p>
            </div>
          </li>
        ))}
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
        className="overflow-x-auto rounded-card border border-border bg-white"
      >
        <table className="w-full min-w-xl text-left">
          <caption className="sr-only">WashCraft compared with typical alternatives</caption>
          <thead className="bg-primary text-white">
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

export function CommercialBlock({ site }: { site: SiteConfig }) {
  const proof = credentials(site)
  return (
    <Section
      id="commercial"
      tone="dark"
      eyebrow="Commercial & HOA"
      title="For property managers, HOA boards and businesses"
    >
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <ul className="grid gap-3">
          {[
            'One point of contact for every service and site',
            'Washing, windows, gutters, snow and lighting on one calendar',
            'Volume and multi-site pricing',
            'Insurance certificates and safety documents on request',
          ].map((point) => (
            <li key={point} className="flex items-start gap-3">
              <Building2 aria-hidden className="mt-1 size-5 shrink-0 text-secondary-on-dark" />
              {point}
            </li>
          ))}
        </ul>
        <div className="grid content-start gap-4">
          {proof.length > 0 && (
            <ul className="grid gap-1 text-small text-white/90">
              {proof.map((credential) => (
                <li key={credential}>✓ {credential}</li>
              ))}
            </ul>
          )}
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href={routes.quoteCommercial}>Request a bid</Link>
            </Button>
            <Button asChild size="lg" variant="inverse">
              <Link href={routes.category('commercial')}>Commercial services</Link>
            </Button>
          </div>
        </div>
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
              className={`flex flex-col rounded-card border bg-white p-6 ${plan.highlighted ? 'border-2 border-primary shadow-lg' : 'border-border'}`}
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

export function Founder({ founder, region }: { founder: TeamMember | null; region: string }) {
  if (!founder) return null
  return (
    <Section id="founder" eyebrow="Meet the founder">
      <div className="grid items-center gap-10 md:grid-cols-[minmax(0,22rem)_1fr]">
        <CmsImage
          media={founder.photo}
          label={founder.photoLabel}
          ratio="4/5"
          sizes="(min-width: 768px) 352px, 100vw"
        />
        <div>
          <SampleBadge show={founder.isSample} className="mb-3" />
          <h2 className="text-h2">{founder.name}</h2>
          <p className="mt-1 font-semibold text-secondary-strong">{founder.role}</p>
          <p className="mt-4 max-w-prose text-lg text-muted">
            {fillTokens(founder.shortBio, { region })}
          </p>
          <Link
            href={routes.teamMember(founder.slug)}
            className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold"
          >
            Read {founder.name.split(' ')[0]}’s story <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
      </div>
    </Section>
  )
}

const CATEGORY_TONES: Record<string, BadgeTone> = {
  seasonal: 'winter',
  'how-to': 'exterior',
  guides: 'interior',
  news: 'neutral',
}
const CATEGORY_LABELS: Record<string, string> = {
  seasonal: 'Seasonal tips',
  'how-to': 'How-to',
  guides: 'Guide',
  news: 'News',
}

export function LatestArticles({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null
  return (
    <Section id="articles" eyebrow="From the blog" title="Tips for every season">
      <ul className="grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <li
            key={post.id}
            className="flex flex-col overflow-hidden rounded-card border border-border bg-white"
          >
            <CmsImage
              media={post.heroImage}
              label={post.heroImageLabel}
              ratio="16/9"
              sizes="(min-width: 768px) 33vw, 100vw"
              className="rounded-none"
            />
            <div className="flex flex-1 flex-col p-6">
              <Badge tone={CATEGORY_TONES[post.category]} className="w-fit">
                {CATEGORY_LABELS[post.category]}
              </Badge>
              <h3 className="mt-3 text-h3">
                <Link
                  href={routes.post(post.slug)}
                  className="text-primary no-underline hover:underline"
                >
                  {post.title}
                </Link>
              </h3>
              <p className="mt-2 text-muted">{post.excerpt}</p>
              <p className="mt-auto pt-4 text-small text-muted">
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              </p>
            </div>
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

/** Closing call to action. Inner pages pass their own quote flow and wording. */
export function FinalCta({
  region,
  cta = { href: routes.quoteInstant, label: 'Get instant price' },
  title = 'Ready for a cleaner, safer property?',
  text = `Get a price range in minutes for most homes in ${region}, or tell us about a bigger job.`,
}: {
  region: string
  cta?: QuoteCta
  title?: string
  text?: string
}) {
  return (
    <section aria-labelledby="final-cta-heading" className="bg-surface">
      <div className="container section-y text-center">
        <h2 id="final-cta-heading">{title}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">{text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href={cta.href}>{cta.label}</Link>
          </Button>
          {!cta.href.startsWith(routes.quoteCustom) && (
            <Button asChild size="lg" variant="outline">
              <Link href={routes.quoteCustom}>Request a custom quote</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
