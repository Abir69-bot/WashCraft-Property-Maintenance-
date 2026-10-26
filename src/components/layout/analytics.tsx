'use client'

import { useEffect } from 'react'

import { track, type EventName } from '@/lib/analytics'
import { CONSENT_EVENT, readConsent, type ConsentChoice } from '@/lib/consent'
import { CLARITY_ID, GTM_ID } from '@/lib/public-env'

type Gtag = (...args: unknown[]) => void
type AnalyticsWindow = Window & {
  dataLayer?: unknown[]
  gtag?: Gtag
  clarity?: ((...args: unknown[]) => void) & { q?: unknown[] }
}

const TRACKED = new Set<EventName>(['call_click', 'sms_click', 'email_click', 'review_link_click'])
const ANALYTICS_COOKIES = /^(_ga|_gid|_gat|_clck|_clsk|CLID|MUID)/

/** Scripts are added once per page load; declining later pauses them instead. */
let state: 'off' | 'on' | 'paused' = 'off'

function addScript(src: string) {
  const script = document.createElement('script')
  script.async = true
  script.src = src
  document.head.appendChild(script)
}

/** Clicks on links marked `data-track="call_click"` and the like (brief §14). */
function onClick(event: MouseEvent) {
  const link = (event.target as Element | null)?.closest<HTMLElement>('[data-track]')
  const name = link?.dataset.track as EventName | undefined
  if (link && name && TRACKED.has(name)) track(name, { link_url: link.getAttribute('href') ?? '' })
}

/** Google Tag Manager (with Consent Mode) and Clarity, once the visitor has said yes. */
function load() {
  const w = window as AnalyticsWindow
  if (state === 'on') return
  if (state === 'paused') {
    w.gtag?.('consent', 'update', { analytics_storage: 'granted' })
    w.clarity?.('consentv2', { ad_Storage: 'denied', analytics_Storage: 'granted' })
    document.addEventListener('click', onClick, { capture: true })
    state = 'on'
    return
  }
  state = 'on'
  w.dataLayer = w.dataLayer || []
  w.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params -- gtag expects the arguments object
    w.dataLayer!.push(arguments)
  }
  // Consent Mode v2: the visitor allowed analytics; there is no advertising consent to give.
  w.gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  })
  if (GTM_ID) {
    w.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
    addScript(`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`)
  }
  if (CLARITY_ID) {
    w.clarity =
      w.clarity ||
      function clarity() {
        // eslint-disable-next-line prefer-rest-params -- Clarity's queue expects arguments
        ;(w.clarity!.q = w.clarity!.q || []).push(arguments)
      }
    addScript(`https://www.clarity.ms/tag/${CLARITY_ID}`)
    w.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'granted' })
  }
  document.addEventListener('click', onClick, { capture: true })
}

/** "Decline" after accepting: tell both tools to stop and remove their cookies. */
function revoke() {
  const w = window as AnalyticsWindow
  w.gtag?.('consent', 'update', { analytics_storage: 'denied' })
  w.clarity?.('consentv2', { ad_Storage: 'denied', analytics_Storage: 'denied' })
  document.removeEventListener('click', onClick, { capture: true })
  const domain = window.location.hostname.replace(/^www\./, '')
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.split('=')[0].trim()
    if (!ANALYTICS_COOKIES.test(name)) continue
    for (const scope of ['', `; domain=${domain}`, `; domain=.${domain}`]) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${scope}`
    }
  }
  state = 'paused'
}

/**
 * Loads analytics only after cookie consent (brief §14), and only when an ID is set
 * (NEXT_PUBLIC_GTM_ID, NEXT_PUBLIC_CLARITY_ID). Renders nothing.
 */
export function Analytics() {
  useEffect(() => {
    if (!GTM_ID && !CLARITY_ID) return
    if (readConsent()?.analytics) load()
    const onConsent = (event: Event) => {
      const choice = (event as CustomEvent<ConsentChoice>).detail
      if (choice.analytics) load()
      else if (state === 'on') revoke()
    }
    window.addEventListener(CONSENT_EVENT, onConsent)
    return () => window.removeEventListener(CONSENT_EVENT, onConsent)
  }, [])
  return null
}
