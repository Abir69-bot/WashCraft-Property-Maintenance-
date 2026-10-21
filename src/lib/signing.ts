import { createHmac, timingSafeEqual } from 'crypto'

import { env } from '@/lib/env'

/**
 * HMAC signatures with the Payload secret, for values the browser hands back to us:
 * local upload URLs and the lead token that lets a visitor book the estimate they just got.
 */
export function sign(value: string, secret = env.PAYLOAD_SECRET): string {
  return createHmac('sha256', secret).update(value).digest('base64url')
}

export function verify(value: string, signature: string, secret = env.PAYLOAD_SECRET): boolean {
  const expected = Buffer.from(sign(value, secret))
  const given = Buffer.from(signature)
  return expected.length === given.length && timingSafeEqual(expected, given)
}
