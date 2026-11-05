import Link from 'next/link'

import { TONE_BORDER } from '@/components/category-tone'
import { CallLink } from '@/components/layout/contact-links'
import { Breadcrumbs, type Crumb } from '@/components/layout/breadcrumbs'
import { ServiceIcon } from '@/components/service-icon'
import { Button } from '@/components/ui/button'
import type { QuoteCta } from '@/lib/quote/flow'
import { telHref } from '@/lib/text'
import { cn } from '@/lib/utils'

/**
 * Hero buttons on the night theme: the primary quote button plus a call button once a phone
 * number is set. `label` and `callLabel` replace the default wording.
 */
export function QuoteActions({
  cta,
  phone,
  label = cta.label,
  callLabel = `Call ${phone}`,
}: {
  cta: QuoteCta
  phone: string
  label?: string
  callLabel?: string
}) {
  return (
    <>
      <Button asChild size="lg">
        <Link href={cta.href}>{label}</Link>
      </Button>
      {telHref(phone) && (
        <Button asChild size="lg" variant="night">
          <CallLink phone={phone} label={callLabel} />
        </Button>
      )}
    </>
  )
}

/** White text, plain links and a gold focus ring for text on a night background. */
export const NIGHT_TEXT = 'text-white [--focus-ring:var(--cta)] [&_a:not([class])]:text-white'

/**
 * Hero for inner pages, in the home page's night theme: breadcrumbs, eyebrow, the page's only H1
 * in the display face, intro text, actions and a right-hand column (photo or quick quote form).
 * `tone` adds the category accent.
 */
export function PageHero({
  crumbs,
  eyebrow,
  icon,
  title,
  lead,
  intro,
  badge,
  actions,
  aside,
  tone,
}: {
  crumbs: Crumb[]
  eyebrow?: string
  icon?: string | null
  title: string
  lead?: string
  intro?: React.ReactNode
  badge?: React.ReactNode
  actions?: React.ReactNode
  aside?: React.ReactNode
  tone?: string
}) {
  return (
    <section
      aria-labelledby="page-heading"
      className={cn('hero-night', tone && ['border-t-4', TONE_BORDER[tone]])}
    >
      <Breadcrumbs items={crumbs} tone="night" />
      <div
        className={cn(
          'container grid items-start gap-10 pt-6 pb-12 lg:pb-16',
          aside && 'lg:grid-cols-[1.1fr_1fr]',
        )}
      >
        {/* Night colours on the text only: cards in the right-hand column keep their own. */}
        <div className={cn(NIGHT_TEXT, aside && 'lg:pt-10')}>
          {eyebrow && (
            <p className="mb-3 inline-flex items-center gap-2 text-small font-semibold tracking-wide text-secondary-on-dark uppercase">
              {icon && <ServiceIcon name={icon} className="size-5" />}
              {eyebrow}
            </p>
          )}
          <h1 id="page-heading" className="display-type display-page text-balance text-white">
            {title}
          </h1>
          {lead && <p className="mt-4 text-h3 font-heading text-white">{lead}</p>}
          {intro && <div className="mt-4 max-w-2xl text-lg text-night-muted">{intro}</div>}
          {badge && <div className="mt-5">{badge}</div>}
          {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
        </div>
        {aside}
      </div>
    </section>
  )
}
