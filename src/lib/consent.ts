/**
 * The visitor's cookie choice (brief §8, §14), kept in localStorage. The banner saves it and
 * announces it with the `wc-consent` event; the analytics loader listens for it.
 */
export const CONSENT_KEY = 'wc-consent'
export const CONSENT_EVENT = 'wc-consent'
export const OPEN_CONSENT_EVENT = 'wc-open-consent'

export type ConsentChoice = { analytics: boolean; at: string }

export function readConsent(): ConsentChoice | null {
  try {
    return JSON.parse(localStorage.getItem(CONSENT_KEY) ?? 'null')
  } catch {
    return null
  }
}

export function saveConsent(analytics: boolean): ConsentChoice {
  const choice: ConsentChoice = { analytics, at: new Date().toISOString() }
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(choice))
  } catch {
    // Storage blocked: the choice applies to this page view only.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: choice }))
  return choice
}
