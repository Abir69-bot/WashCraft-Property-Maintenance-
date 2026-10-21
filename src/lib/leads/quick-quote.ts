'use server'

import { consentText } from '@/config/consent'
import { getPayloadClient } from '@/lib/data/cache'
import { getLayoutData } from '@/lib/data/layout'
import {
  quickQuoteSchema,
  trackingSchema,
  type QuickQuoteInput,
  type Tracking,
} from '@/lib/schemas/quick-quote'
import { matchCity, normalizeZip } from '@/lib/service-area'

export type FormResult =
  { ok: true } | { ok: false; message: string; fieldErrors?: Partial<Record<string, string>> }

/**
 * Saves a quick quote request as a lead. Spam checks (Turnstile, rate limit), the retry with
 * R2 fallback and owner notifications are added with the full quote system (Phase 5).
 */
export async function submitQuickQuote(
  input: QuickQuoteInput,
  rawTracking: Tracking,
): Promise<FormResult> {
  const parsed = quickQuoteSchema.safeParse(input)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message
    return { ok: false, message: 'Please check the highlighted fields.', fieldErrors }
  }
  const form = parsed.data
  // A filled honeypot means a bot: pretend it worked and save nothing.
  if (form.fax) return { ok: true }

  const tracking = trackingSchema.safeParse(rawTracking).data ?? { utm: {} }
  const { site, cities, services } = await getLayoutData()
  const service = services.find((candidate) => candidate.slug === form.service)
  const zip = normalizeZip(form.zip)!
  const city = matchCity(zip, cities)

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'leads',
      overrideAccess: true,
      data: {
        type: 'quick',
        status: 'new',
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        postalCode: zip,
        city: city?.id,
        cityName: city?.name,
        outOfArea: !city,
        services: service ? [service.id] : [],
        lineItems: service ? [{ service: service.id, serviceName: service.title }] : [],
        consent: form.consent,
        consentAt: form.consent ? new Date().toISOString() : undefined,
        consentText: form.consent ? consentText(site.country, site.shortName) : undefined,
        utm: tracking.utm,
        referrer: tracking.referrer,
        landingPage: tracking.landingPage,
        device: tracking.device,
      },
    })
  } catch (error) {
    console.error('Quick quote could not be saved', error)
    return {
      ok: false,
      message: 'Sorry, we couldn’t send that just now. Please try again, or call or text us.',
    }
  }

  return { ok: true }
}
