'use server'

import { after } from 'next/server'
import type { z } from 'zod'

import { FREQUENCIES } from '@/config/catalog'
import {
  COMMERCIAL_PROPERTY_TYPES,
  FLOW_SERVICES,
  ROOFLINE_ESTIMATES,
  SNOW_ADD_ONS,
} from '@/config/quote'
import { getPayloadClient } from '@/lib/data/cache'
import { getLayoutData, type LayoutData } from '@/lib/data/layout'
import { getPlans } from '@/lib/data/pages'
import { env } from '@/lib/env'
import { getNotifier } from '@/lib/notify'
import type { Answers, QuoteResult } from '@/lib/pricing/engine'
import {
  estimate,
  getPricingData,
  getQuoteServices,
  type PricingData,
  type QuoteService,
} from '@/lib/pricing/load'
import { planPrice } from '@/lib/pricing/plans'
import { answersSchema } from '@/lib/quote/questions'
import { isWizardService, sharedFrequencies } from '@/lib/quote/services'
import type { FileRef } from '@/lib/schemas/fields'
import { quickQuoteSchema, trackingSchema, type Tracking } from '@/lib/schemas/quick-quote'
import {
  commercialBidSchema,
  customQuoteSchema,
  holidayLightsSchema,
  instantQuoteSchema,
  junkRemovalSchema,
  quoteUpdateSchema,
  snowContractSchema,
  uploadCheckSchema,
  uploadRequestSchema,
} from '@/lib/schemas/quote'
import { privateStore } from '@/lib/storage'

import { clientIp, guardSubmission, withinLimit } from './guard'
import { checkUpload, newFileKey, normalizeType, verifyUploads, type FileKind } from './lead-files'
import { quoteUpdate } from './messages'
import {
  baseLeadData,
  getLeadAlerts,
  submitLead,
  type LeadData,
  type SubmitOutcome,
} from './pipeline'
import { leadToken, verifyLeadToken } from './token'
import type { EstimateView, FormResult, QuoteReceipt } from './types'

/**
 * Server actions for every quote form (brief §10). Each one validates with the form's shared
 * Zod schema, runs the spam checks, checks uploads, prices the job where the form shows a price,
 * and saves the lead through `submitLead` (database first, retry, then backup).
 */

const CHECK_FIELDS = 'Please check the highlighted fields.'
const SERVER_ERROR = 'Sorry, we couldn’t send that just now. Please try again, or call or text us.'

type Fields = Record<string, string>

function fieldErrors(error: z.ZodError, prefix = ''): Fields {
  const errors: Fields = {}
  for (const issue of error.issues) errors[prefix + issue.path.join('.')] ??= issue.message
  return errors
}

const invalid = (errors: Fields) => ({
  ok: false as const,
  message: CHECK_FIELDS,
  fieldErrors: errors,
})

const readTracking = (raw: unknown): Tracking => trackingSchema.safeParse(raw).data ?? { utm: {} }

/** Checks a service's answers; errors are keyed `<prefix><questionId>`. */
function checkAnswers(service: QuoteService, raw: unknown, prefix: string) {
  const result = answersSchema(service.questions).safeParse(raw ?? {})
  return result.success
    ? { answers: result.data as Answers, errors: {} }
    : { answers: {} as Answers, errors: fieldErrors(result.error, prefix) }
}

async function pricing(): Promise<PricingData | null> {
  try {
    return await getPricingData()
  } catch (error) {
    console.error('[quote] pricing unavailable, saving without an estimate', error)
    return null
  }
}

function view(result: QuoteResult | null, data: PricingData | null): EstimateView | null {
  if (!result || !data || !result.lines.some((line) => line.status === 'priced')) return null
  return {
    lines: result.lines.map((line) =>
      line.status === 'priced'
        ? {
            name: line.name,
            status: 'priced',
            low: line.low,
            high: line.high,
            placeholder: line.placeholder,
            minimumApplied: line.minimumApplied,
          }
        : { name: line.name, status: 'custom' },
    ),
    bundle: result.bundle,
    frequency: result.frequency,
    low: result.low,
    high: result.high,
    complete: result.complete,
    placeholder: result.placeholder,
    taxNote: data.settings.taxNote,
    estimateNote: data.settings.estimateNote,
  }
}

function lineItems(
  items: { service: QuoteService; answers: Answers }[],
  result: QuoteResult | null,
) {
  return items.map(({ service, answers }, index) => {
    const line = result?.lines[index]
    return {
      service: service.id,
      serviceName: service.title,
      answers,
      ...(line?.status === 'priced' && { priceLow: line.low, priceHigh: line.high }),
    }
  })
}

const totals = (result: QuoteResult | null) =>
  result && result.low > 0 ? { totalLow: result.low, totalHigh: result.high } : {}

function leadBase(
  type: LeadData['type'],
  form: Parameters<typeof baseLeadData>[0]['form'] & { zip: string },
  tracking: unknown,
  layout: LayoutData,
) {
  return baseLeadData({
    type,
    form,
    zip: form.zip,
    tracking: readTracking(tracking),
    cities: layout.cities,
    country: layout.site.country,
    shortName: layout.site.shortName,
  })
}

/** Turns a save outcome into the visitor's answer. */
function receipt(
  outcome: SubmitOutcome,
  layout: LayoutData,
  estimateView: EstimateView | null = null,
  plan?: QuoteReceipt['plan'],
): FormResult<QuoteReceipt> {
  if (!outcome.saved && !outcome.backedUp) {
    return {
      ok: false,
      message: `Sorry, we couldn’t save your request. Please call or text us at ${layout.site.phone}.`,
    }
  }
  return {
    ok: true,
    leadId: outcome.saved ? outcome.id : null,
    token: outcome.saved ? leadToken(outcome.id) : null,
    estimate: estimateView,
    ...(plan && { plan }),
  }
}

const IGNORED: FormResult<QuoteReceipt> = { ok: true, leadId: null, token: null, estimate: null }

async function guard(form: { fax: string; turnstile?: string }) {
  const result = await guardSubmission(form)
  if (result.ok) return null
  return result.silent ? IGNORED : { ok: false as const, message: result.message }
}

async function checkedFiles(refs: FileRef[], kind: FileKind) {
  try {
    return await verifyUploads(refs, kind)
  } catch (error) {
    // Storage unreachable: keep the request, note the files in the lead instead.
    console.error('[quote] could not check uploads', error)
    return []
  }
}

/** Quick quote: name, phone, ZIP, service (brief §10.1). */
export async function submitQuickQuote(input: unknown, tracking: unknown): Promise<FormResult> {
  const parsed = quickQuoteSchema.safeParse(input)
  if (!parsed.success) return invalid(fieldErrors(parsed.error))
  const form = parsed.data
  const blocked = await guard(form)
  if (blocked) return blocked
  try {
    const layout = await getLayoutData()
    const service = layout.services.find((candidate) => candidate.slug === form.service)
    const outcome = await submitLead({
      data: {
        ...leadBase('quick', form, tracking, layout),
        services: service ? [service.id] : [],
        lineItems: service ? [{ service: service.id, serviceName: service.title }] : [],
      },
      serviceNames: service ? [service.title] : [],
    })
    const result = receipt(outcome, layout)
    return result.ok ? { ok: true } : result
  } catch (error) {
    console.error('[quote] quick quote failed', error)
    return { ok: false, message: SERVER_ERROR }
  }
}

/** The instant-price wizard (brief §10.2): saved before the price is shown. */
export async function submitInstantQuote(
  input: unknown,
  tracking: unknown,
): Promise<FormResult<QuoteReceipt>> {
  const parsed = instantQuoteSchema.safeParse(input)
  if (!parsed.success) return invalid(fieldErrors(parsed.error))
  const form = parsed.data
  const blocked = await guard(form)
  if (blocked) return blocked
  try {
    const [layout, all, priceData] = await Promise.all([
      getLayoutData(),
      getQuoteServices(),
      pricing(),
    ])
    const services = form.services.map((slug) =>
      all.find((service) => service.slug === slug && isWizardService(service)),
    )
    if (services.some((service) => !service)) {
      return {
        ok: false,
        message: 'One of those services can’t be priced online. Please choose again.',
      }
    }
    const chosen = services as QuoteService[]
    const errors: Fields = {}
    const items = chosen.map((service) => {
      const checked = checkAnswers(service, form.answers[service.slug], `answers.${service.slug}.`)
      Object.assign(errors, checked.errors)
      return { service, answers: checked.answers }
    })
    if (Object.keys(errors).length) return invalid(errors)

    const offered = priceData?.settings.frequencies ?? [...FREQUENCIES]
    const frequency = sharedFrequencies(chosen, offered).includes(form.frequency)
      ? form.frequency
      : 'one-time'
    const plan = form.plan ? (await getPlans()).find((item) => item.id === form.plan) : undefined
    const result = priceData ? estimate(priceData, items, frequency) : null
    const subscription =
      Boolean(plan) || chosen.some((service) => service.quoteMode === 'subscription')

    const outcome = await submitLead({
      data: {
        ...leadBase(subscription ? 'subscription' : 'instant', form, tracking, layout),
        status: 'estimate_viewed',
        address: form.address,
        propertyType: form.propertyType,
        frequency,
        services: chosen.map((service) => service.id),
        plan: plan?.id,
        lineItems: lineItems(items, result),
        ...totals(result),
        preferredDates: form.preferredDates || undefined,
        notes: form.notes || undefined,
        ...(plan && { details: { plan: plan.name } }),
      },
      serviceNames: chosen.map((service) => service.title),
    })
    return receipt(
      outcome,
      layout,
      view(result, priceData),
      plan && { name: plan.name, price: planPrice(plan) },
    )
  } catch (error) {
    console.error('[quote] instant quote failed', error)
    return { ok: false, message: SERVER_ERROR }
  }
}

/** "Book this" or "Request a call-back" on an estimate the visitor just received. */
export async function updateQuote(input: unknown): Promise<FormResult> {
  const parsed = quoteUpdateSchema.safeParse(input)
  if (!parsed.success || !verifyLeadToken(parsed.data.leadId, parsed.data.token)) {
    return { ok: false, message: 'That link has expired. Please call or text us to book.' }
  }
  if (!withinLimit(await clientIp(), 'update')) {
    return { ok: false, message: 'Please wait a moment, then try again.' }
  }
  const { leadId, action } = parsed.data
  try {
    const payload = await getPayloadClient()
    const lead = await payload.findByID({
      collection: 'leads',
      id: leadId,
      depth: 0,
      overrideAccess: true,
    })
    const early = lead.status === 'new' || lead.status === 'estimate_viewed'
    // Column-level write, so it can't overwrite the notification log written at the same time.
    const change =
      action === 'book'
        ? early
          ? { status: 'booking_requested' }
          : null
        : { callbackRequested: true }
    if (change) await payload.db.updateOne({ collection: 'leads', id: leadId, data: change })
    after(async () => {
      const alerts = await getLeadAlerts()
      const message = quoteUpdate(
        lead,
        action,
        `${env.NEXT_PUBLIC_SITE_URL}/admin/collections/leads/${leadId}`,
      )
      const notifier = getNotifier()
      const sends = [
        ...alerts.phones.map((to) => notifier.sendSms({ to, body: message.sms })),
        ...(alerts.emails.length
          ? [notifier.sendEmail({ to: alerts.emails, ...message.email })]
          : []),
      ]
      const results = await Promise.allSettled(sends)
      results
        .filter((result) => result.status === 'rejected')
        .forEach((result) => console.error('[quote] update alert failed', result.reason))
    })
    return { ok: true }
  } catch (error) {
    console.error('[quote] could not update lead', error)
    return { ok: false, message: SERVER_ERROR }
  }
}

function flowService(all: QuoteService[], slug: string) {
  const service = all.find((item) => item.slug === slug)
  if (!service)
    throw new Error(`Service "${slug}" is missing; see FLOW_SERVICES in src/config/quote.ts`)
  return service
}

/** Seasonal snow contract sign-up (brief §10.5). */
export async function submitSnowContract(
  input: unknown,
  tracking: unknown,
): Promise<FormResult<QuoteReceipt>> {
  const parsed = snowContractSchema.safeParse(input)
  if (!parsed.success) return invalid(fieldErrors(parsed.error))
  const form = parsed.data
  const blocked = await guard(form)
  if (blocked) return blocked
  try {
    const [layout, all, priceData] = await Promise.all([
      getLayoutData(),
      getQuoteServices(),
      pricing(),
    ])
    const snow = flowService(all, FLOW_SERVICES.snow)
    const checked = checkAnswers(snow, form.answers, 'answers.')
    const triggers = layout.seasonal.snowTriggers ?? []
    const errors: Fields = { ...checked.errors }
    if (triggers.length && !triggers.includes(form.trigger))
      errors.trigger = 'Choose when we should come out'
    if (Object.keys(errors).length) return invalid(errors)

    const addOns = SNOW_ADD_ONS.filter((slug) => form.addOns.includes(slug)).flatMap(
      (slug) => all.find((service) => service.slug === slug) ?? [],
    )
    const items = [
      { service: snow, answers: checked.answers },
      ...addOns.map((service) => ({ service, answers: {} })),
    ]
    const result = form.billing === 'seasonal' && priceData ? estimate(priceData, items) : null
    const shown = view(result, priceData)

    const outcome = await submitLead({
      data: {
        ...leadBase('snow_contract', form, tracking, layout),
        status: shown ? 'estimate_viewed' : 'new',
        address: form.address,
        propertyType: form.propertyType,
        services: items.map((item) => item.service.id),
        lineItems: lineItems(items, result),
        ...totals(result),
        preferredDates: `Start ${form.startDate}`,
        notes: form.notes || undefined,
        details: {
          snowTrigger: form.trigger,
          billing: form.billing === 'seasonal' ? 'Seasonal flat rate' : 'Per visit',
          startDate: form.startDate,
          addOns: addOns.map((service) => service.title),
        },
      },
      serviceNames: items.map((item) => item.service.title),
    })
    return receipt(outcome, layout, shown)
  } catch (error) {
    console.error('[quote] snow contract failed', error)
    return { ok: false, message: SERVER_ERROR }
  }
}

/** Christmas light installation, removal and storage (brief §10.5). */
export async function submitHolidayLights(
  input: unknown,
  tracking: unknown,
): Promise<FormResult<QuoteReceipt>> {
  const parsed = holidayLightsSchema.safeParse(input)
  if (!parsed.success) return invalid(fieldErrors(parsed.error))
  const form = parsed.data
  const blocked = await guard(form)
  if (blocked) return blocked
  try {
    const [layout, all, priceData] = await Promise.all([
      getLayoutData(),
      getQuoteServices(),
      pricing(),
    ])
    const install = flowService(all, FLOW_SERVICES.lights)
    const estimated = form.rooflineUnknown ? ROOFLINE_ESTIMATES[form.homeSize] : undefined
    if (form.rooflineUnknown && !estimated) return invalid({ homeSize: 'Choose the home size' })
    const raw = { ...form.answers, ...(estimated && { roofline: estimated }) }
    const checked = checkAnswers(install, raw, 'answers.')
    if (Object.keys(checked.errors).length) return invalid(checked.errors)

    const extras = [
      form.removal ? flowService(all, FLOW_SERVICES.lightRemoval) : null,
      form.storage ? flowService(all, FLOW_SERVICES.lightStorage) : null,
    ].filter((service): service is QuoteService => service !== null)
    const items = [
      { service: install, answers: checked.answers },
      ...extras.map((service) => ({ service, answers: {} })),
    ]
    const result = priceData ? estimate(priceData, items) : null
    const shown = view(result, priceData)

    const outcome = await submitLead({
      data: {
        ...leadBase('holiday_lights', form, tracking, layout),
        status: shown ? 'estimate_viewed' : 'new',
        address: form.address,
        services: items.map((item) => item.service.id),
        lineItems: lineItems(items, result),
        ...totals(result),
        preferredDates: `Install: ${form.installWindow}${form.removal ? `. Take down: ${form.removalWindow}` : ''}`,
        notes: form.notes || undefined,
        details: {
          roofline: `${checked.answers.roofline} ft${estimated ? ' (estimated from home size)' : ''}`,
          railings: Number(form.railings),
          style: form.style,
          installWindow: form.installWindow,
          takeDown: form.removal ? form.removalWindow : 'Not needed',
          storage: form.storage,
        },
      },
      serviceNames: items.map((item) => item.service.title),
    })
    return receipt(outcome, layout, shown)
  } catch (error) {
    console.error('[quote] holiday lights failed', error)
    return { ok: false, message: SERVER_ERROR }
  }
}

/** Photo-based junk removal quote (brief §10.5). */
export async function submitJunkRemoval(input: unknown, tracking: unknown): Promise<FormResult> {
  const parsed = junkRemovalSchema.safeParse(input)
  if (!parsed.success) return invalid(fieldErrors(parsed.error))
  const form = parsed.data
  const blocked = await guard(form)
  if (blocked) return blocked
  try {
    const [layout, all, files] = await Promise.all([
      getLayoutData(),
      getQuoteServices(),
      checkedFiles(form.photos, 'photo'),
    ])
    const junk = all.find((service) => service.slug === FLOW_SERVICES.junk)
    const outcome = await submitLead({
      data: {
        ...leadBase('junk', form, tracking, layout),
        address: form.address,
        services: junk ? [junk.id] : [],
        lineItems: junk ? [{ service: junk.id, serviceName: junk.title }] : [],
        notes: form.description,
        preferredDates: form.preferredDate || undefined,
        details: {
          load: form.load,
          access: form.access,
          stairs: form.stairs,
          photosSent: form.photos.length,
        },
      },
      files,
      serviceNames: junk ? [junk.title] : ['Junk removal'],
    })
    const result = receipt(outcome, layout)
    return result.ok ? { ok: true } : result
  } catch (error) {
    console.error('[quote] junk removal failed', error)
    return { ok: false, message: SERVER_ERROR }
  }
}

/** Custom quote with photos, for large or unusual jobs (brief §10.5). */
export async function submitCustomQuote(input: unknown, tracking: unknown): Promise<FormResult> {
  const parsed = customQuoteSchema.safeParse(input)
  if (!parsed.success) return invalid(fieldErrors(parsed.error))
  const form = parsed.data
  const blocked = await guard(form)
  if (blocked) return blocked
  try {
    const [layout, all, files] = await Promise.all([
      getLayoutData(),
      getQuoteServices(),
      checkedFiles(form.photos, 'photo'),
    ])
    const services = form.services.flatMap(
      (slug) => all.find((service) => service.slug === slug) ?? [],
    )
    const outcome = await submitLead({
      data: {
        ...leadBase('custom', form, tracking, layout),
        address: form.address,
        services: services.map((service) => service.id),
        lineItems: services.map((service) => ({ service: service.id, serviceName: service.title })),
        notes: form.description,
        details: {
          timeline: form.timeline,
          budget: form.budget || 'Not given',
          photosSent: form.photos.length,
        },
      },
      files,
      serviceNames: services.map((service) => service.title),
    })
    const result = receipt(outcome, layout)
    return result.ok ? { ok: true } : result
  } catch (error) {
    console.error('[quote] custom quote failed', error)
    return { ok: false, message: SERVER_ERROR }
  }
}

/** Commercial / HOA bid request with RFP upload (brief §10.5). */
export async function submitCommercialBid(input: unknown, tracking: unknown): Promise<FormResult> {
  const parsed = commercialBidSchema.safeParse(input)
  if (!parsed.success) return invalid(fieldErrors(parsed.error))
  const form = parsed.data
  const blocked = await guard(form)
  if (blocked) return blocked
  try {
    const [layout, all, files] = await Promise.all([
      getLayoutData(),
      getQuoteServices(),
      checkedFiles(form.files, 'document'),
    ])
    const services = form.services.flatMap(
      (slug) => all.find((service) => service.slug === slug) ?? [],
    )
    const propertyType = COMMERCIAL_PROPERTY_TYPES.find((type) => type.value === form.propertyType)
    const outcome = await submitLead({
      data: {
        ...leadBase('commercial_bid', form, tracking, layout),
        address: form.address,
        propertyType: 'commercial',
        services: services.map((service) => service.id),
        lineItems: services.map((service) => ({ service: service.id, serviceName: service.title })),
        preferredDates: form.walkthroughDate ? `Walkthrough ${form.walkthroughDate}` : undefined,
        notes: form.notes || undefined,
        details: {
          company: form.company,
          role: form.role || undefined,
          propertyType: propertyType?.label,
          size:
            form.size === ''
              ? undefined
              : `${Number(form.size.replace(/,/g, '')).toLocaleString('en-US')} ${form.sizeUnit}`,
          frequency: form.frequency,
          insuranceCertificate: form.insuranceCertificate ? 'Requested' : 'Not requested',
          walkthroughDate: form.walkthroughDate || undefined,
          filesSent: form.files.length,
        },
      },
      files,
      serviceNames: services.map((service) => service.title),
    })
    const result = receipt(outcome, layout)
    return result.ok ? { ok: true } : result
  } catch (error) {
    console.error('[quote] commercial bid failed', error)
    return { ok: false, message: SERVER_ERROR }
  }
}

/** Where the browser uploads one photo or document, before the form is sent. */
export async function prepareUpload(
  input: unknown,
): Promise<FormResult<{ key: string; url: string; headers: Record<string, string> }>> {
  const parsed = uploadRequestSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: 'That file can’t be uploaded.' }
  if (!withinLimit(await clientIp(), 'upload')) {
    return {
      ok: false,
      message: 'That’s a lot of uploads. Please wait a few minutes and try again.',
    }
  }
  const type = normalizeType(parsed.data.type)
  const problem = checkUpload({ type, size: parsed.data.size }, parsed.data.kind)
  if (problem) return { ok: false, message: problem }
  try {
    const key = newFileKey(type)
    const target = await privateStore().uploadTarget(key, type, parsed.data.size)
    return { ok: true, key, url: target.url, headers: target.headers }
  } catch (error) {
    console.error('[quote] could not prepare an upload', error)
    return {
      ok: false,
      message: 'Uploads aren’t working right now. You can send the form without photos.',
    }
  }
}

/** Checks an uploaded file really is what it claims, right after upload. */
export async function confirmUpload(input: unknown): Promise<FormResult> {
  const parsed = uploadCheckSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: 'That file can’t be used.' }
  if (!withinLimit(await clientIp(), 'upload')) {
    return {
      ok: false,
      message: 'That’s a lot of uploads. Please wait a few minutes and try again.',
    }
  }
  const { key, kind } = parsed.data
  try {
    const [file] = await verifyUploads([{ key, name: 'upload' }], kind)
    if (file) return { ok: true }
  } catch (error) {
    console.error('[quote] could not check an upload', error)
    return { ok: true } // Checked again when the form is sent.
  }
  return {
    ok: false,
    message:
      kind === 'photo'
        ? 'That file isn’t a photo we can open. Use JPEG, PNG, HEIC or WebP.'
        : 'That file isn’t a PDF or photo we can open.',
  }
}
