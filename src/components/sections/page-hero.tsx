import Link from 'next/link'

import { TONE_BORDER } from '@/components/category-tone'
import { CallLink } from '@/components/layout/contact-links'
import { Breadcrumbs, type Crumb } from '@/components/layout/breadcrumbs'
import { ServiceIcon } from '@/components/service-icon'
import { Button } from '@/components/ui/button'
import type { QuoteCta } from '@/lib/quote/flow'
import { telHref } from '@/lib/text'
import { cn } from '@/lib/utils'

/** Primary quote button plus "Call (phone)" when a phone number is set. */
export function QuoteActions({ cta, phone }: { cta: QuoteCta; phone: string }) {
  return (
    <>
      <Button asChild size="lg">
        <Link href={cta.href}>{cta.label}</Link>
      </Button>
      {telHref(phone) && (
        <Button asChild size="lg" variant="outline">
          <CallLink phone={phone} label={`Call ${phone}`} />
        </Button>
      )}
    </>
  )
}

/**
 * Hero for inner pages: breadcrumbs, eyebrow, the page's only H1, intro text, actions and a
 * right-hand column (photo or quick quote form). `tone` adds the category accent.
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
      className={cn('hero-surface', tone && ['border-t-4', TONE_BORDER[tone]])}
    >
      <Breadcrumbs items={crumbs} />
      <div
        className={cn(
          'container grid items-start gap-10 pt-6 pb-12 lg:pb-16',
          aside && 'lg:grid-cols-[1.1fr_1fr]',
        )}
      >
        <div className={cn(aside && 'lg:pt-10')}>
          {eyebrow && (
            <p className="mb-3 inline-flex items-center gap-2 text-small font-semibold tracking-wide text-secondary-strong uppercase">
              {icon && <ServiceIcon name={icon} className="size-5" />}
              {eyebrow}
            </p>
          )}
          <h1 id="page-heading">{title}</h1>
          {lead && <p className="mt-4 text-h3 font-heading text-primary">{lead}</p>}
          {intro && <div className="mt-4 max-w-2xl text-lg text-muted">{intro}</div>}
          {badge && <div className="mt-5">{badge}</div>}
          {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
        </div>
        {aside}
      </div>
    </section>
  )
}
