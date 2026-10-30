import { routes } from '@/lib/routes'
import type { Service } from '@/payload-types'

export type QuoteCta = { href: string; label: string }

/**
 * How quote buttons behave, from Site settings (quote policy) and Feature switches. With both
 * switches off (the default) every button goes to the quote request form at /quote.
 */
export type QuoteSettings = {
  /** Instant-price wizard and maintenance plans. */
  instantPricing: boolean
  /** Snow contract, holiday lights, junk removal and commercial bid forms. */
  dedicatedForms: boolean
  /** True when the owner confirmed quotes are free. */
  freeQuotes: boolean
}

export const QUOTE_DEFAULTS: QuoteSettings = {
  instantPricing: false,
  dedicatedForms: false,
  freeQuotes: false,
}

type Quotable = Pick<Service, 'slug' | 'quoteMode' | 'dedicatedFlow'> & {
  parentService?: number | Quotable | null
}

/** "Request a Free Quote" only when the owner confirmed quotes are free. */
export const quoteLabel = (settings: QuoteSettings) =>
  settings.freeQuotes ? 'Request a Free Quote' : 'Request a Quote'

/** The quote request form, with a service picked when one is given. */
export const quoteFormHref = (service?: string) =>
  service ? `${routes.quote}?service=${encodeURIComponent(service)}` : routes.quote

/** The site-wide quote button (header, page heroes, closing calls to action). */
export function generalCta(settings: QuoteSettings): QuoteCta {
  return settings.instantPricing
    ? { href: routes.quoteInstant, label: 'Get instant price' }
    : { href: routes.quote, label: quoteLabel(settings) }
}

/**
 * Where a service's quote button goes (brief §9.3.15, §10). By default, the quote request form
 * with the service picked. When switched on, seasonal services use their own forms and
 * instant-price services the wizard; add-ons use their parent service's flow.
 */
export function quoteCta(service: Quotable, settings: QuoteSettings): QuoteCta {
  const form = { href: quoteFormHref(service.slug), label: quoteLabel(settings) }
  if (settings.dedicatedForms) {
    if (service.dedicatedFlow === 'holiday-lights') {
      return { href: routes.quoteHolidayLights, label: 'Book holiday lights' }
    }
    if (service.dedicatedFlow === 'junk-removal') {
      return { href: routes.quoteJunkRemoval, label: 'Get a junk removal quote' }
    }
    if (service.quoteMode === 'contract') {
      return { href: routes.quoteSnowContract, label: 'Sign up for a snow contract' }
    }
    if (service.quoteMode === 'bid') return { href: routes.quoteCommercial, label: 'Request a bid' }
  }
  if (
    service.quoteMode === 'addon' &&
    service.parentService &&
    typeof service.parentService === 'object'
  ) {
    return quoteCta(service.parentService, settings)
  }
  if (
    settings.instantPricing &&
    (service.quoteMode === 'instant' || service.quoteMode === 'subscription')
  ) {
    return {
      href: `${routes.quoteInstant}?service=${encodeURIComponent(service.slug)}`,
      label: 'Get instant price',
    }
  }
  return form
}

/** Main quote button on a category hub, by the category's accent (brief §9.2). */
export function categoryCta(tone: string, settings: QuoteSettings): QuoteCta {
  if (settings.dedicatedForms) {
    if (tone === 'winter') {
      return { href: routes.quoteSnowContract, label: 'Sign up for a snow contract' }
    }
    if (tone === 'holiday') return { href: routes.quoteHolidayLights, label: 'Book holiday lights' }
    if (tone === 'commercial') return { href: routes.quoteCommercial, label: 'Request a bid' }
  }
  return generalCta(settings)
}
