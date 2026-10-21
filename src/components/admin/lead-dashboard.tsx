import { sql, type PostgresAdapter } from '@payloadcms/db-postgres'
import { Banner } from '@payloadcms/ui'
import Link from 'next/link'
import type { Payload, ServerProps } from 'payload'

import { LEAD_TYPE_LABELS, type LeadType } from '@/config/leads'
import { env } from '@/lib/env'
import { pendingFailedLeads } from '@/lib/leads/save'
import { privateStore } from '@/lib/storage'

import { ReimportButton } from './reimport-button'

const box: React.CSSProperties = {
  border: '1px solid var(--theme-elevation-150)',
  borderRadius: 'var(--style-radius-m)',
  padding: 'calc(var(--base) * 0.8)',
}

const count = <T,>(items: T[], key: (item: T) => string) =>
  Object.entries(
    items.reduce<Record<string, number>>((totals, item) => {
      totals[key(item)] = (totals[key(item)] ?? 0) + 1
      return totals
    }, {}),
  ).sort((a, b) => b[1] - a[1])

/** Monday 00:00 of the current week (server time). */
function weekStart(now = new Date()) {
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7))
  return start
}

function Tally({ title, rows }: { title: string; rows: [string, number][] }) {
  return (
    <div style={box}>
      <h4 style={{ margin: 0 }}>{title}</h4>
      {rows.length ? (
        <table style={{ width: '100%', marginTop: 8 }}>
          <tbody>
            {rows.map(([label, total]) => (
              <tr key={label}>
                <td>{label}</td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>{total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ margin: '8px 0 0' }}>No leads yet this week.</p>
      )}
    </div>
  )
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

async function databaseSizeMb(payload: Payload): Promise<number | null> {
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
 * Admin dashboard (brief §11, §4A): this week's leads by source and status, anything waiting
 * for the owner, and database size against the Neon free-plan limit.
 */
export async function LeadDashboard({ payload, user }: ServerProps) {
  if (!user) return null
  const [leads, toReview, failed, sizeMb] = await Promise.all([
    payload.find({
      collection: 'leads',
      where: { createdAt: { greater_than_equal: weekStart().toISOString() } },
      pagination: false,
      depth: 0,
      select: { type: true, status: true, utm: true },
    }),
    pricingToReview(payload),
    pendingFailedLeads(privateStore()).catch(() => []),
    databaseSizeMb(payload),
  ])
  const limit = env.DB_STORAGE_LIMIT_MB
  const share = sizeMb === null ? null : sizeMb / limit

  return (
    <div style={{ display: 'grid', gap: 'var(--base)', marginBottom: 'calc(var(--base) * 2)' }}>
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
          <Link href="/admin/collections/pricing-rules?where[needsReview][equals]=true">
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
      <h3 style={{ margin: 0 }}>This week’s leads ({leads.docs.length})</h3>
      <div
        style={{
          display: 'grid',
          gap: 'var(--base)',
          gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))',
        }}
      >
        <Tally
          title="By type"
          rows={count(leads.docs, (lead) => LEAD_TYPE_LABELS[lead.type as LeadType] ?? lead.type)}
        />
        <Tally title="By source" rows={count(leads.docs, (lead) => lead.utm?.source || 'direct')} />
        <Tally
          title="By status"
          rows={count(leads.docs, (lead) => (lead.status ?? 'new').replaceAll('_', ' '))}
        />
        <div style={box}>
          <h4 style={{ margin: 0 }}>Database</h4>
          <p style={{ margin: '8px 0 0' }}>
            {sizeMb === null
              ? 'Size unavailable.'
              : `${sizeMb} MB of ${limit} MB (${Math.round((share ?? 0) * 100)}%)`}
          </p>
          <p style={{ margin: '8px 0 0' }}>
            <Link href="/admin/collections/leads">All leads</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
