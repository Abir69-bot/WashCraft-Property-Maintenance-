import { LEAD_TYPE_LABELS, type LeadType } from '@/config/leads'
import { isPlaceholder, type SiteConfig } from '@/config/site'

/**
 * Message text for new-lead alerts, customer confirmations and review requests (brief §11).
 * Plain text: it reads well in any email client and SMS. Every SMS to a customer ends with an
 * opt-out line.
 */

export type LeadSummary = {
  id?: number | string
  type: LeadType
  name: string
  phone: string
  email?: string | null
  address?: string | null
  postalCode?: string | null
  cityName?: string | null
  outOfArea?: boolean | null
  services: string[]
  totalLow?: number | null
  totalHigh?: number | null
  preferredDates?: string | null
  notes?: string | null
  details?: Record<string, unknown> | null
  files?: { name: string; url: string }[]
}

type Site = Pick<SiteConfig, 'name' | 'shortName' | 'phone' | 'email' | 'responseTimePromise'>

const money = (value: number) => `$${Math.round(value).toLocaleString('en-US')}`

export function priceRange(low?: number | null, high?: number | null) {
  return low && high ? `${money(low)}–${money(high)}` : null
}

const known = (value?: string | null) => (value && !isPlaceholder(value) ? value : null)
const firstName = (name: string) => name.trim().split(/\s+/)[0]
const where = (lead: LeadSummary) =>
  lead.cityName ?? (lead.postalCode ? `postal code ${lead.postalCode}` : null)

const nextStep = (site: Site) =>
  known(site.responseTimePromise)
    ? `We’ll get back to you ${site.responseTimePromise}.`
    : 'We’ll be in touch to confirm the details.'

function contactLine(site: Site) {
  const phone = known(site.phone)
  const email = known(site.email)
  if (phone && email) return `Questions? Call or text ${phone}, or reply to this email.`
  if (phone) return `Questions? Call or text ${phone}.`
  return email ? 'Questions? Reply to this email.' : null
}

const label = (value: string) =>
  value
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .replace(/^./, (c) => c.toUpperCase())

const show = (value: unknown): string =>
  Array.isArray(value)
    ? value.map(show).join(', ')
    : typeof value === 'boolean'
      ? value
        ? 'Yes'
        : 'No'
      : String(value)

/** "Label: value" lines, skipping empty values. */
const detailLines = (rows: [string, unknown][]) =>
  rows
    .filter(
      ([, value]) =>
        value !== null &&
        value !== undefined &&
        value !== '' &&
        !(Array.isArray(value) && !value.length),
    )
    .map(([name, value]) => `${name}: ${show(value)}`)

/** Owner alert, kept short for SMS: who, what, where, how much, and the admin link. */
export function ownerSms(lead: LeadSummary, link: string | null) {
  const parts = [
    lead.name,
    lead.services.join(', ') || null,
    where(lead),
    priceRange(lead.totalLow, lead.totalHigh),
  ].filter(Boolean)
  const outside = lead.outOfArea ? ' (outside your area)' : ''
  return `New ${LEAD_TYPE_LABELS[lead.type]} lead: ${parts.join(', ')}${outside}${link ? ` — ${link}` : ''}`
}

/** Owner email with everything the customer sent. */
export function ownerEmail(lead: LeadSummary, link: string | null) {
  const rows: [string, unknown][] = [
    ['Name', lead.name],
    ['Phone', lead.phone],
    ['Email', lead.email],
    ['Address', lead.address],
    ['Postal code', lead.postalCode],
    ['City', lead.cityName ?? (lead.outOfArea ? 'Outside your service area' : null)],
    ['Services', lead.services.join(', ')],
    ['Estimate', priceRange(lead.totalLow, lead.totalHigh)],
    ['Preferred dates', lead.preferredDates],
    ['Notes', lead.notes],
    ...Object.entries(lead.details ?? {}).map(
      ([key, value]) => [label(key), value] as [string, unknown],
    ),
  ]
  const lines = detailLines(rows)
  const files = (lead.files ?? []).map((file) => `- ${file.name}: ${file.url}`)
  return {
    subject: `New ${LEAD_TYPE_LABELS[lead.type]} lead: ${lead.name}${where(lead) ? ` (${where(lead)})` : ''}`,
    text: [
      ...lines,
      ...(files.length ? ['', 'Photos and files (sign in to the admin to open):', ...files] : []),
      ...(link ? ['', `Open in the admin: ${link}`] : []),
    ].join('\n'),
  }
}

/** Confirmation email to the customer: we got it, what happens next, how to reach us. */
export function customerEmail(lead: LeadSummary, site: Site, estimateNote?: string | null) {
  const range = priceRange(lead.totalLow, lead.totalHigh)
  return {
    subject: `We got your request – ${site.shortName}`,
    text: [
      `Hi ${firstName(lead.name)},`,
      '',
      `Thanks for contacting ${site.name}. We got your ${LEAD_TYPE_LABELS[lead.type]} request${lead.services.length ? ` for ${lead.services.join(', ')}` : ''}.`,
      ...(range ? ['', `Your estimate: ${range}.${estimateNote ? ` ${estimateNote}` : ''}`] : []),
      '',
      nextStep(site),
      ...(contactLine(site) ? [contactLine(site)!] : []),
      '',
      site.name,
    ].join('\n'),
  }
}

/** Confirmation text to the customer. Only sent when they agreed to texts. */
export function customerSms(lead: LeadSummary, site: Site) {
  const phone = known(site.phone)
  return `${site.shortName}: Thanks ${firstName(lead.name)}, we got your request. ${nextStep(site)}${phone ? ` Questions? Call ${phone}.` : ''} Reply STOP to opt out.`
}

/** Sent once when a lead is marked won (feature switch "Review requests"). */
export function reviewRequest(lead: Pick<LeadSummary, 'name'>, site: Site, reviewUrl: string) {
  return {
    sms: `${site.shortName}: Thanks for choosing us, ${firstName(lead.name)}! If you have a minute, a Google review helps a lot: ${reviewUrl} Reply STOP to opt out.`,
    email: {
      subject: `How did we do? – ${site.shortName}`,
      text: [
        `Hi ${firstName(lead.name)},`,
        '',
        `Thanks for choosing ${site.name}. If you have a minute, a short Google review helps other homeowners find us:`,
        reviewUrl,
        '',
        site.name,
      ].join('\n'),
    },
  }
}

/** The full lead, for the owner, when the database couldn't save it (brief §3.5). */
export function backupEmail(lead: LeadSummary, record: unknown) {
  const { text } = ownerEmail(lead, null)
  return {
    subject: `New ${LEAD_TYPE_LABELS[lead.type]} lead (saved to backup): ${lead.name}`,
    text: [
      'The database was unreachable, so this lead was saved to the backup folder instead.',
      'It will appear in the admin after you click “Re-import backed-up leads” on the Leads page.',
      '',
      text,
      '',
      'Full record:',
      JSON.stringify(record, null, 2),
    ].join('\n'),
  }
}

/** Owner alert when a visitor books their estimate or asks for a call-back. */
export function quoteUpdate(
  lead: Pick<LeadSummary, 'name' | 'type' | 'phone'>,
  action: 'book' | 'callback',
  link: string,
) {
  const what = action === 'book' ? 'wants to book' : 'asked for a call-back about'
  const text = `${lead.name} ${what} their ${LEAD_TYPE_LABELS[lead.type]} estimate. Phone: ${lead.phone} — ${link}`
  return { sms: text, email: { subject: `${lead.name} ${what} their estimate`, text } }
}

/** A job application, for the owner's alerts and the applicant's confirmation. */
export type ApplicationSummary = {
  name: string
  email: string
  phone: string
  /** The job's title, or null for "any role". */
  role: string | null
  message?: string | null
  files?: { name: string; url: string }[]
}

const roleLabel = (application: ApplicationSummary) => application.role ?? 'any role'

export function applicationOwnerSms(application: ApplicationSummary, link: string | null) {
  return `New job application: ${application.name}, ${roleLabel(application)}${link ? ` — ${link}` : ''}`
}

export function applicationOwnerEmail(application: ApplicationSummary, link: string | null) {
  const files = (application.files ?? []).map((file) => `- ${file.name}: ${file.url}`)
  return {
    subject: `New job application: ${application.name} (${roleLabel(application)})`,
    text: [
      ...detailLines([
        ['Name', application.name],
        ['Phone', application.phone],
        ['Email', application.email],
        ['Role', roleLabel(application)],
        ['Message', application.message],
      ]),
      ...(files.length ? ['', 'Résumé (sign in to the admin to open):', ...files] : []),
      ...(link ? ['', `Open in the admin: ${link}`] : []),
    ].join('\n'),
  }
}

/** Confirmation to the applicant. No promises about a reply time or outcome. */
export function applicantEmail(application: ApplicationSummary, site: Site) {
  return {
    subject: `We got your application – ${site.shortName}`,
    text: [
      `Hi ${firstName(application.name)},`,
      '',
      `Thanks for applying to ${site.name}${application.role ? ` for the ${application.role} role` : ''}. We read every application and will contact you if there’s a good fit.`,
      ...(contactLine(site) ? ['', contactLine(site)!] : []),
      '',
      site.name,
    ].join('\n'),
  }
}

export function applicationBackupEmail(application: ApplicationSummary, record: unknown) {
  return {
    subject: `New job application (saved to backup): ${application.name}`,
    text: [
      'The database was unreachable, so this application was saved to the backup folder instead.',
      'It will appear in the admin after you click “Re-import backed-up leads” on the Leads page.',
      '',
      applicationOwnerEmail(application, null).text,
      '',
      'Full record:',
      JSON.stringify(record, null, 2),
    ].join('\n'),
  }
}
