import { after } from 'next/server'

import { consentText } from '@/config/consent'
import { site as configSite, isPlaceholder } from '@/config/site'
import { cachedQuery, getPayloadClient } from '@/lib/data/cache'
import { getLayoutData, type AreaCity } from '@/lib/data/layout'
import { env } from '@/lib/env'
import { getNotifier } from '@/lib/notify'
import { getPricingData } from '@/lib/pricing/load'
import type { Tracking } from '@/lib/schemas/quick-quote'
import { matchCity, normalizeZip } from '@/lib/service-area'
import { privateStore } from '@/lib/storage'
import { e164 } from '@/lib/text'
import type { Lead } from '@/payload-types'

import { createLead, type LeadData } from './create'
import type { CheckedFile } from './lead-files'
import {
  backupEmail,
  customerEmail,
  customerSms,
  ownerEmail,
  ownerSms,
  type LeadSummary,
} from './messages'
import { backupLead, failedLeadRecord, persistLead } from './save'

const adminLink = (id: number) => `${env.NEXT_PUBLIC_SITE_URL}/admin/collections/leads/${id}`
const fileLink = (id: number) => `${env.NEXT_PUBLIC_SITE_URL}/api/lead-files/${id}/download`

/** Who hears about new leads (Site settings → Lead alerts), with the business email as fallback. */
export const getLeadAlerts = cachedQuery('lead-alerts', async () => {
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
  const fallback = settings.email || configSite.email
  const emails = (settings.alertEmails ?? []).filter((email) => email.includes('@'))
  return {
    phones: (settings.alertPhones ?? []).flatMap((phone) => e164(phone) ?? []),
    emails: emails.length ? emails : isPlaceholder(fallback) ? [] : [fallback],
  }
})

async function leadAlerts() {
  try {
    return await getLeadAlerts()
  } catch {
    // Database unreachable and nothing cached: fall back to the configured business email.
    return { phones: [], emails: isPlaceholder(configSite.email) ? [] : [configSite.email] }
  }
}

/** Contact, location, consent and tracking fields every form shares. */
export function baseLeadData({
  type,
  form,
  zip,
  tracking,
  cities,
  country,
  shortName,
}: {
  type: LeadData['type']
  form: { name: string; phone: string; email?: string; consent: boolean }
  zip: string
  tracking: Tracking
  cities: AreaCity[]
  country: string
  shortName: string
}): LeadData {
  const postalCode = normalizeZip(zip) ?? zip
  const city = matchCity(postalCode, cities)
  return {
    type,
    status: 'new',
    name: form.name,
    phone: form.phone,
    email: form.email || undefined,
    postalCode,
    city: city?.id,
    cityName: city?.name,
    outOfArea: !city,
    consent: form.consent,
    consentAt: form.consent ? new Date().toISOString() : undefined,
    consentText: form.consent ? consentText(country, shortName) : undefined,
    utm: tracking.utm,
    referrer: tracking.referrer,
    landingPage: tracking.landingPage,
    device: tracking.device,
  }
}

function summarize(data: LeadData, serviceNames: string[]): LeadSummary {
  return {
    type: data.type,
    name: data.name,
    phone: data.phone,
    email: data.email,
    address: data.address,
    postalCode: data.postalCode,
    cityName: data.cityName,
    outOfArea: data.outOfArea,
    services: serviceNames,
    totalLow: data.totalLow,
    totalHigh: data.totalHigh,
    preferredDates: data.preferredDates,
    notes: data.notes,
    details: (data.details as Record<string, unknown> | undefined) ?? null,
  }
}

type Job = { channel: string; to: string; send: () => Promise<void> }

/** Owner alerts and the customer confirmation, sent after the visitor already has a reply. */
async function sendNotifications(
  summary: LeadSummary,
  lead: Lead | null,
  consent: boolean,
  files: CheckedFile[],
) {
  const notifier = getNotifier()
  const alerts = await leadAlerts()
  const site = await getLayoutData()
    .then((layout) => layout.site)
    .catch(() => configSite)
  const pricing = await getPricingData().catch(() => null)
  const link = lead ? adminLink(lead.id) : null
  const fileIds = (lead?.files ?? []).map((file) => (typeof file === 'object' ? file.id : file))
  const withFiles = {
    ...summary,
    files: files.map((file, index) => ({
      name: file.filename,
      url: fileIds[index] ? fileLink(fileIds[index]) : '(saved in backup storage)',
    })),
  }

  const jobs: Job[] = alerts.phones.map((to) => ({
    channel: 'owner-sms',
    to,
    send: () => notifier.sendSms({ to, body: ownerSms(withFiles, link) }),
  }))
  // When the lead went to backup, the owner already got the full record by email.
  if (lead && alerts.emails.length) {
    jobs.push({
      channel: 'owner-email',
      to: alerts.emails.join(', '),
      send: () =>
        notifier.sendEmail({
          to: alerts.emails,
          ...ownerEmail(withFiles, link),
          replyTo: summary.email ?? undefined,
        }),
    })
  }
  if (summary.email) {
    jobs.push({
      channel: 'customer-email',
      to: summary.email,
      send: () =>
        notifier.sendEmail({
          to: [summary.email!],
          ...customerEmail(summary, site, pricing?.settings.estimateNote),
          replyTo: alerts.emails[0],
        }),
    })
  }
  const customerPhone = e164(summary.phone)
  if (consent && customerPhone) {
    jobs.push({
      channel: 'customer-sms',
      to: customerPhone,
      send: () => notifier.sendSms({ to: customerPhone, body: customerSms(summary, site) }),
    })
  }

  const results = await Promise.allSettled(jobs.map((job) => job.send()))
  const log = jobs.map((job, index) => {
    const result = results[index]
    return {
      channel: job.channel,
      to: job.to,
      via: job.channel.endsWith('sms') ? notifier.sms : notifier.email,
      ok: result.status === 'fulfilled',
      ...(result.status === 'rejected' && { error: String(result.reason).slice(0, 300) }),
      at: new Date().toISOString(),
    }
  })
  const sent = log.filter((entry) => entry.ok).length
  const status = sent === log.length ? 'sent' : sent > 0 ? 'partial' : 'failed'
  if (status !== 'sent') console.error('[lead] some notifications failed', log)
  if (!lead) return

  try {
    const payload = await getPayloadClient()
    // Column-level write: a full update could overwrite a booking made in the meantime.
    await payload.db.updateOne({
      collection: 'leads',
      id: lead.id,
      data: { notificationStatus: status, notificationLog: log },
    })
  } catch (error) {
    console.error(`[lead] could not record notifications for lead ${lead.id}`, error)
  }
}

export type { LeadData }

export type SubmitOutcome = { saved: true; id: number } | { saved: false; backedUp: boolean }

/**
 * Saves a lead (database first, retry, then backup) and schedules its notifications.
 * `serviceNames` are for the messages; the lead itself stores service relationships.
 */
export async function submitLead({
  data,
  files = [],
  serviceNames,
}: {
  data: LeadData
  files?: CheckedFile[]
  serviceNames: string[]
}): Promise<SubmitOutcome> {
  const summary = summarize(data, serviceNames)
  const result = await persistLead({
    save: async () => createLead(await getPayloadClient(), data, files),
    backup: async (error) => {
      const record = failedLeadRecord(data as Record<string, unknown>, files, error)
      const alerts = await leadAlerts()
      await backupLead(record, privateStore(), () =>
        alerts.emails.length
          ? getNotifier().sendEmail({ to: alerts.emails, ...backupEmail(summary, record) })
          : Promise.reject(new Error('No email address for lead alerts')),
      )
    },
  })

  after(() =>
    sendNotifications(summary, result.saved ? result.result : null, data.consent === true, files),
  )
  return result.saved
    ? { saved: true, id: result.result.id }
    : { saved: false, backedUp: result.backedUp }
}
