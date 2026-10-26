/**
 * Browser-safe settings: only NEXT_PUBLIC_ values, which Next inlines at build time (so each one
 * must be read as a literal `process.env.NAME`). Everything else is read in src/lib/env.ts.
 */
export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || null
/** Google Tag Manager container (GA4 is set up inside it), e.g. GTM-ABC1234. */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || null
/** Microsoft Clarity project ID. */
export const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || null
