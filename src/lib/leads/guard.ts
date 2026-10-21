import { createHash } from 'crypto'
import { headers } from 'next/headers'

import { env } from '@/lib/env'

/**
 * Spam protection for every form (brief §10.1): a honeypot field, Cloudflare Turnstile and a
 * per-IP rate limit. The limit is kept in memory per server instance: cheap, no database or
 * extra service, and good enough alongside Turnstile.
 */

export function createRateLimiter() {
  const hits = new Map<string, number[]>()
  return function allow(key: string, limit: number, windowMs: number, now = Date.now()) {
    const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs)
    const allowed = recent.length < limit
    if (allowed) recent.push(now)
    hits.set(key, recent)
    if (hits.size > 10_000) {
      for (const [entry, times] of hits) {
        if (!times.some((time) => now - time < windowMs)) hits.delete(entry)
      }
    }
    return allowed
  }
}

const allow = createRateLimiter()

export const LIMITS = {
  /** Form submissions per visitor. */
  submit: { limit: 6, windowMs: 10 * 60 * 1000 },
  /** File uploads per visitor (10 per form, a few forms). */
  upload: { limit: 40, windowMs: 10 * 60 * 1000 },
  /** Book / call-back clicks on an estimate. */
  update: { limit: 20, windowMs: 10 * 60 * 1000 },
} as const

/** The visitor's IP from the proxy headers (Vercel sets x-forwarded-for). */
export async function clientIp(): Promise<string | null> {
  const list = await headers()
  return list.get('x-forwarded-for')?.split(',')[0]?.trim() || list.get('x-real-ip') || null
}

const hashIp = (ip: string) =>
  createHash('sha256').update(`${env.PAYLOAD_SECRET}|${ip}`).digest('hex')

const LOOPBACK = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1'])

/**
 * True while the visitor is under the limit. Local requests (no IP, or this machine: development
 * and the browser tests) are never limited; on Vercel every visitor has a real IP.
 */
export function withinLimit(ip: string | null, bucket: keyof typeof LIMITS) {
  if (!ip || LOOPBACK.has(ip)) return true
  const { limit, windowMs } = LIMITS[bucket]
  return allow(`${bucket}:${hashIp(ip)}`, limit, windowMs)
}

/**
 * Checks a Turnstile token with Cloudflare. Passes when Turnstile isn't configured. If
 * Cloudflare can't be reached the submission is let through: losing a real lead is worse than
 * the odd spam message getting past.
 */
export async function verifyTurnstile(
  token: string | undefined,
  ip: string | null,
  {
    secret = env.TURNSTILE_SECRET_KEY,
    fetcher = fetch,
  }: { secret?: string; fetcher?: typeof fetch } = {},
): Promise<boolean> {
  if (!secret) return true
  if (!token) return false
  try {
    const response = await fetcher('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret, response: token, ...(ip ? { remoteip: ip } : {}) }),
      signal: AbortSignal.timeout(8000),
    })
    if (!response.ok) return true
    const result = (await response.json()) as { success?: boolean }
    return result.success === true
  } catch (error) {
    console.warn('[guard] Turnstile unreachable, letting the submission through', error)
    return true
  }
}

export type GuardResult =
  | { ok: true }
  /** A bot filled the honeypot: report success, save nothing. */
  | { ok: false; silent: true }
  | { ok: false; silent: false; message: string }

/** Runs the spam checks for one submission. */
export async function guardSubmission(
  { fax, turnstile }: { fax: string; turnstile?: string },
  bucket: keyof typeof LIMITS = 'submit',
): Promise<GuardResult> {
  if (fax) return { ok: false, silent: true }
  const ip = await clientIp()
  if (!withinLimit(ip, bucket)) {
    return {
      ok: false,
      silent: false,
      message:
        'That’s a lot of requests in a short time. Please wait a few minutes, or call or text us.',
    }
  }
  if (!(await verifyTurnstile(turnstile, ip))) {
    return {
      ok: false,
      silent: false,
      message: 'Please complete the “I’m human” check, then send again.',
    }
  }
  return { ok: true }
}
