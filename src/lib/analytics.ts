/**
 * Analytics events (brief §14). Pushed to Google Tag Manager's dataLayer, which only exists once
 * the visitor has accepted analytics cookies (components/layout/analytics.tsx); before that this
 * does nothing. Every event carries the service, category and city of the page it happened on
 * (from the page's `wc:` meta tags, see pageMetadata), unless the event sets its own.
 */
export type EventName =
  | 'quick_form_submit'
  | 'quote_start'
  | 'quote_step'
  | 'quote_contact_submitted'
  | 'quote_estimate_viewed'
  | 'booking_requested'
  | 'snow_contract_submit'
  | 'holiday_lights_submit'
  | 'junk_quote_submit'
  | 'commercial_bid_submit'
  | 'call_click'
  | 'sms_click'
  | 'email_click'
  | 'review_link_click'
  | 'careers_apply'
  | 'contact_submit'

export type EventParams = Record<string, string | number | undefined>

/** The meta tags pages use to say which service, category and city they are about. */
export const CONTEXT_KEYS = ['service', 'category', 'city'] as const
export type PageContext = Partial<Record<(typeof CONTEXT_KEYS)[number], string>>

export const contextMeta = (context: PageContext) =>
  Object.fromEntries(
    Object.entries(context)
      .filter(([, value]) => value)
      .map(([key, value]) => [`wc:${key}`, value as string]),
  )

function pageContext(): PageContext {
  return Object.fromEntries(
    CONTEXT_KEYS.flatMap((key) => {
      const value = document.querySelector(`meta[name="wc:${key}"]`)?.getAttribute('content')
      return value ? [[key, value]] : []
    }),
  )
}

export function track(event: EventName, params: EventParams = {}) {
  try {
    const layer = (window as unknown as { dataLayer?: Record<string, unknown>[] }).dataLayer
    layer?.push({ event, ...pageContext(), ...params })
  } catch {
    // Analytics must never break a form.
  }
}
