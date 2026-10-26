import { sql, type PostgresAdapter } from '@payloadcms/db-postgres'
import { Banner } from '@payloadcms/ui'
import Link from 'next/link'
import type { Payload, ServerProps, WidgetServerProps, Where } from 'payload'

import { LEAD_TYPE_LABELS, type LeadStatus, type LeadType } from '@/config/leads'
import { env } from '@/lib/env'
import { pendingFailedLeads } from '@/lib/leads/save'
import { privateStore } from '@/lib/storage'
import { cn } from '@/lib/utils'

import { ReimportButton } from './reimport-button'

/** Statuses where the customer is still waiting to hear back. */
export const NEEDS_REPLY: LeadStatus[] = ['new', 'estimate_viewed', 'booking_requested']

const statusLabel = (status: string | null | undefined) => (status ?? 'new').replaceAll('_', ' ')

/** `?where…` for the Leads list, filtered to some statuses. */
export const leadsWithStatus = (adminRoute: string, statuses: LeadStatus[]) =>
  `${adminRoute}/collections/leads?${statuses
    .map((status, index) => `where[status][in][${index}]=${status}`)
    .join('&')}`

/** Monday 00:00 of the current week (server time). */
function weekStart(now = new Date()) {
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7))
  return start
}

const RELATIVE = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' })

/** "3 hours ago", "yesterday", "5 days ago". */
function ago(date: string, now = Date.now()) {
  const minutes = Math.round((new Date(date).getTime() - now) / 60_000)
  if (Math.abs(minutes) < 60) return RELATIVE.format(minutes, 'minute')
  const hours = Math.round(minutes / 60)
  if (Math.abs(hours) < 24) return RELATIVE.format(hours, 'hour')
  return RELATIVE.format(Math.round(hours / 24), 'day')
}

/** Placeholder prices the owner still has to review (brief §10.4). */
export async function pricingToReview(payload: Payload) {
  const where = { needsReview: { equals: true } }
  const [rules, discounts, plans] = await Promise.all([
    payload.count({ collection: 'pricing-rules', where }),
    payload.count({ collection: 'discounts', where }),
    payload.count({ collection: 'plans', where }),
  ])
  return rules.totalDocs + discounts.totalDocs + plans.totalDocs
}

export async function databaseSizeMb(payload: Payload): Promise<number | null> {
  try {
    const result = await (payload.db as unknown as PostgresAdapter).drizzle.execute(
      sql`select pg_database_size(current_database())::bigint as size`,
    )
    const size = Number((result.rows[0] as { size: string | number }).size)
    return Math.round((size / 1024 / 1024) * 10) / 10
  } catch {
    return null
  }
}

/**
 * Above the dashboard widgets: anything that needs the owner now (backed-up leads, placeholder
 * prices, a nearly full database). Not a widget, so it can't be removed by accident.
 */
export async function DashboardAlerts({ payload, user }: ServerProps) {
  if (!user) return null
  const [toReview, failed, sizeMb] = await Promise.all([
    pricingToReview(payload),
    pendingFailedLeads(privateStore()).catch(() => []),
    databaseSizeMb(payload),
  ])
  const limit = env.DB_STORAGE_LIMIT_MB
  const share = sizeMb === null ? null : sizeMb / limit
  const admin = payload.config.routes.admin

  if (!failed.length && !toReview && !(share !== null && share >= 0.8)) return null
  return (
    <div className="wc-alerts">
      {failed.length > 0 && (
        <Banner type="error">
          {failed.length} lead{failed.length === 1 ? ' was' : 's were'} saved to backup while the
          database was unreachable. <ReimportButton />
        </Banner>
      )}
      {toReview > 0 && (
        <Banner type="warning">
          {toReview} price{toReview === 1 ? '' : 's'} still use placeholder numbers, so the live
          site shows “Custom quote” instead.{' '}
          <Link href={`${admin}/collections/pricing-rules?where[needsReview][equals]=true`}>
            Review pricing
          </Link>
        </Banner>
      )}
      {share !== null && share >= 0.8 && (
        <Banner type="error">
          The database is {Math.round(share * 100)}% full ({sizeMb} of {limit} MB). Delete old leads
          or upgrade the Neon plan.
        </Banner>
      )}
    </div>
  )
}

function Stat({
  value,
  label,
  href,
  attention = false,
}: {
  value: number
  label: string
  href: string
  attention?: boolean
}) {
  return (
    <Link href={href} className={cn('wc-stat', attention && value > 0 && 'wc-stat--attention')}>
      <span className="wc-stat__value">{value}</span>
      <span className="wc-stat__label">{label}</span>
    </Link>
  )
}

/**
 * Leads widget (brief §11): who is waiting for a reply, this week's numbers by source, and the
 * latest requests with their status.
 */
export async function LeadsWidget({ req, user }: WidgetServerProps) {
  if (!user) return null
  const { payload } = req
  const admin = payload.config.routes.admin
  const thisWeek: Where = { createdAt: { greater_than_equal: weekStart().toISOString() } }
  const [waiting, bookings, week, latest] = await Promise.all([
    payload.count({ collection: 'leads', where: { status: { in: NEEDS_REPLY } } }),
    payload.count({ collection: 'leads', where: { status: { equals: 'booking_requested' } } }),
    payload.find({
      collection: 'leads',
      where: thisWeek,
      pagination: false,
      depth: 0,
      select: { utm: true },
    }),
    payload.find({
      collection: 'leads',
      sort: '-createdAt',
      limit: 6,
      depth: 0,
      select: { name: true, type: true, status: true, cityName: true, createdAt: true },
    }),
  ])
  const sources = Object.entries(
    week.docs.reduce<Record<string, number>>((totals, lead) => {
      const source = lead.utm?.source || 'direct'
      totals[source] = (totals[source] ?? 0) + 1
      return totals
    }, {}),
  ).sort((a, b) => b[1] - a[1])

  return (
    <section className="wc-widget" aria-labelledby="wc-leads-heading">
      <header className="wc-widget__head">
        <h2 id="wc-leads-heading">Leads</h2>
        <Link href={`${admin}/collections/leads`}>All leads →</Link>
      </header>
      <div className="wc-stats">
        <Stat
          value={waiting.totalDocs}
          label="waiting for a reply"
          href={leadsWithStatus(admin, NEEDS_REPLY)}
          attention
        />
        <Stat
          value={bookings.totalDocs}
          label="asked to book"
          href={leadsWithStatus(admin, ['booking_requested'])}
          attention
        />
        <Stat
          value={week.docs.length}
          label="this week"
          href={`${admin}/collections/leads?where[createdAt][greater_than_equal]=${weekStart().toISOString()}`}
        />
      </div>
      {sources.length > 0 && (
        <p className="wc-muted">
          This week by source: {sources.map(([source, total]) => `${source} ${total}`).join(' · ')}
        </p>
      )}
      <h3 className="wc-subhead">Latest requests</h3>
      {latest.docs.length ? (
        <ul className="wc-list">
          {latest.docs.map((lead) => (
            <li key={lead.id}>
              <Link href={`${admin}/collections/leads/${lead.id}`} className="wc-list__row">
                <span className="wc-list__main">
                  <strong>{lead.name}</strong>
                  <span className="wc-muted">
                    {[LEAD_TYPE_LABELS[lead.type as LeadType] ?? lead.type, lead.cityName]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                </span>
                <span className="wc-list__side">
                  <span className={`wc-pill wc-pill--${lead.status ?? 'new'}`}>
                    {statusLabel(lead.status)}
                  </span>
                  <span className="wc-muted">{ago(lead.createdAt)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="wc-empty">
          No leads yet. They appear here as soon as someone sends a form on the site.
        </p>
      )}
    </section>
  )
}
