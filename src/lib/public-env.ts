/**
 * Browser-safe settings: only NEXT_PUBLIC_ values, which Next inlines at build time (so each one
 * must be read as a literal `process.env.NAME`). Everything else is read in src/lib/env.ts.
 */
export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || null
