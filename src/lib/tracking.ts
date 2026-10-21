import type { Tracking } from '@/lib/schemas/quick-quote'

const LANDING_KEY = 'wc-landing'

/** Browser-side: where this visit came from, for attaching to a lead. */
export function collectTracking(): Tracking {
  const params = new URLSearchParams(window.location.search)
  const utm = Object.fromEntries(
    ['source', 'medium', 'campaign', 'term', 'content']
      .map((key) => [key, params.get(`utm_${key}`)?.slice(0, 100)])
      .filter(([, value]) => value),
  )
  let landingPage = window.location.pathname
  try {
    landingPage = sessionStorage.getItem(LANDING_KEY) ?? landingPage
    sessionStorage.setItem(LANDING_KEY, landingPage)
  } catch {
    // Storage blocked: use the current page.
  }
  const width = window.innerWidth
  return {
    utm,
    referrer: document.referrer.slice(0, 500) || undefined,
    landingPage: landingPage.slice(0, 500),
    device: width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop',
  }
}

/** Records the first page of the visit, so the lead shows where the visitor landed. */
export function rememberLandingPage() {
  try {
    if (!sessionStorage.getItem(LANDING_KEY)) {
      sessionStorage.setItem(LANDING_KEY, window.location.pathname + window.location.search)
    }
  } catch {
    // Storage blocked: nothing to remember.
  }
}
