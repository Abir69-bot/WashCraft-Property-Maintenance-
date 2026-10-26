import { CircleCheck, CircleDashed } from 'lucide-react'
import Link from 'next/link'
import type { WidgetServerProps } from 'payload'

import { checkSiteConfig } from '@/config/check-site'
import { env } from '@/lib/env'
import { getSite } from '@/lib/site-settings'
import { cn } from '@/lib/utils'

import { databaseSizeMb, pricingToReview } from './lead-dashboard'

type Step = { done: boolean; title: string; hint: string; href: string }

const notSample = { isSample: { not_equals: true } }

/**
 * Go-live checklist: what the owner still has to supply before the site can launch (the same
 * facts CONTENT_TODO.md lists), worked out from the database, plus the storage meter.
 */
export async function ChecklistWidget({ req, user }: WidgetServerProps) {
  if (!user) return null
  const { payload } = req
  const admin = payload.config.routes.admin
  const [site, settings, homepage, toReview, reviews, team, sizeMb] = await Promise.all([
    getSite(payload),
    payload.findGlobal({ slug: 'site-settings', depth: 0 }),
    payload.findGlobal({ slug: 'homepage', depth: 0 }),
    pricingToReview(payload),
    payload.count({ collection: 'testimonials', where: notSample }),
    payload.count({ collection: 'team-members', where: notSample }),
    databaseSizeMb(payload),
  ])
  const problems = checkSiteConfig(site)
  const variants = homepage.heroVariants ?? []
  const withPhoto = variants.filter((variant) => variant.image).length
  const alerts = (settings.alertPhones?.length ?? 0) + (settings.alertEmails?.length ?? 0)
  const google = Boolean(settings.googlePlaceId)

  const steps: Step[] = [
    {
      done: problems.length === 0,
      title: 'Business details',
      hint: problems.length
        ? `${problems.length} still demo or missing (phone, email, hours…)`
        : 'Phone, email, hours and areas are set',
      href: `${admin}/globals/site-settings`,
    },
    {
      done: toReview === 0,
      title: 'Prices',
      hint: toReview ? `${toReview} placeholder prices to check` : 'Every price checked',
      href: `${admin}/collections/pricing-rules?where[needsReview][equals]=true`,
    },
    {
      done: alerts > 0,
      title: 'Lead alerts',
      hint: alerts
        ? 'Someone gets every new lead'
        : 'Choose who gets a text or email (Lead alerts tab)',
      href: `${admin}/globals/site-settings`,
    },
    {
      done: google || reviews.totalDocs > 0,
      title: 'Real reviews',
      hint: google
        ? 'Google reviews connected'
        : reviews.totalDocs
          ? `${reviews.totalDocs} real testimonials`
          : 'Connect Google or add your own testimonials',
      href: `${admin}/collections/testimonials`,
    },
    {
      done: team.totalDocs > 0,
      title: 'Your team',
      hint: team.totalDocs ? `${team.totalDocs} real team members` : 'Replace the sample team',
      href: `${admin}/collections/team-members`,
    },
    {
      done: variants.length > 0 && withPhoto === variants.length,
      title: 'Seasonal hero photos',
      hint: `${withPhoto} of ${variants.length} seasons have a photo`,
      href: `${admin}/globals/homepage`,
    },
  ]
  const done = steps.filter((step) => step.done).length
  const limit = env.DB_STORAGE_LIMIT_MB
  const share = sizeMb === null ? null : Math.min(sizeMb / limit, 1)

  return (
    <section className="wc-widget" aria-labelledby="wc-checklist-heading">
      <header className="wc-widget__head">
        <h2 id="wc-checklist-heading">Before you go live</h2>
        <span className="wc-muted">
          {done} of {steps.length} done
        </span>
      </header>
      <div
        className="wc-meter"
        role="progressbar"
        aria-label="Go-live checklist"
        aria-valuemin={0}
        aria-valuemax={steps.length}
        aria-valuenow={done}
      >
        <span style={{ width: `${(done / steps.length) * 100}%` }} />
      </div>
      <ul className="wc-steps">
        {steps.map((step) => (
          <li key={step.title}>
            <Link href={step.href} className={cn('wc-step', step.done && 'wc-step--done')}>
              {step.done ? (
                <CircleCheck aria-hidden className="wc-step__icon" />
              ) : (
                <CircleDashed aria-hidden className="wc-step__icon" />
              )}
              <span>
                <span className="wc-step__title">
                  {step.title}
                  <span className="wc-sr-only">{step.done ? ' (done)' : ' (to do)'}</span>
                </span>
                <span className="wc-step__hint">{step.hint}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="wc-storage">
        <span className="wc-muted">
          Database:{' '}
          {sizeMb === null
            ? 'size unavailable'
            : `${sizeMb} MB of ${limit} MB (${Math.round((share ?? 0) * 100)}%)`}
        </span>
        {share !== null && (
          <div
            className={cn('wc-meter wc-meter--small', share >= 0.8 && 'wc-meter--warn')}
            role="progressbar"
            aria-label="Database storage used"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(share * 100)}
          >
            <span style={{ width: `${share * 100}%` }} />
          </div>
        )}
      </div>
    </section>
  )
}
