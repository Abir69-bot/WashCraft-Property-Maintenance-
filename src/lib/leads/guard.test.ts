import { describe, expect, it, vi } from 'vitest'

import { createRateLimiter, verifyTurnstile } from './guard'

describe('rate limiter', () => {
  it('allows a set number of hits per window, per key', () => {
    const allow = createRateLimiter()
    const start = 1_000_000
    expect([1, 2, 3].map((i) => allow('a', 2, 60_000, start + i))).toEqual([true, true, false])
    expect(allow('b', 2, 60_000, start)).toBe(true)
    expect(allow('a', 2, 60_000, start + 60_002)).toBe(true)
  })
})

describe('verifyTurnstile', () => {
  const reply = (body: unknown, status = 200) => vi.fn(async () => Response.json(body, { status }))

  it('passes when Turnstile is not configured', async () => {
    expect(await verifyTurnstile(undefined, null, { secret: undefined })).toBe(true)
  })

  it('needs a token once configured', async () => {
    expect(await verifyTurnstile(undefined, null, { secret: 's', fetcher: reply({}) })).toBe(false)
  })

  it('follows Cloudflare’s answer', async () => {
    const yes = reply({ success: true })
    expect(await verifyTurnstile('token', '203.0.113.9', { secret: 's', fetcher: yes })).toBe(true)
    expect(String((yes.mock.calls[0] as unknown as [string, RequestInit])[1].body)).toBe(
      'secret=s&response=token&remoteip=203.0.113.9',
    )
    expect(
      await verifyTurnstile('token', null, { secret: 's', fetcher: reply({ success: false }) }),
    ).toBe(false)
  })

  it('lets submissions through when Cloudflare is unreachable', async () => {
    const down = vi.fn(async () => {
      throw new Error('network down')
    })
    expect(await verifyTurnstile('token', null, { secret: 's', fetcher: down })).toBe(true)
  })
})

describe('lead tokens', async () => {
  const { leadToken, verifyLeadToken } = await import('./token')

  it('only verify for the lead they were made for', () => {
    const token = leadToken(42)
    expect(verifyLeadToken(42, token)).toBe(true)
    expect(verifyLeadToken(43, token)).toBe(false)
    expect(verifyLeadToken(42, '')).toBe(false)
    expect(verifyLeadToken(42, token.slice(1))).toBe(false)
  })
})
