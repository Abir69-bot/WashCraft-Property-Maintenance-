/**
 * Analytics events (brief §14). Pushed to Google Tag Manager's dataLayer, which only exists once
 * the visitor has accepted analytics cookies (Phase 7); before that this does nothing.
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

export function track(event: EventName, params: Record<string, string | number | undefined> = {}) {
  try {
    const layer = (window as unknown as { dataLayer?: Record<string, unknown>[] }).dataLayer
    layer?.push({ event, ...params })
  } catch {
    // Analytics must never break a form.
  }
}
