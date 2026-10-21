import { describe, expect, it, vi } from 'vitest'

import { resendEmail, twilioSms } from './index'

const ok = () => new Response('{}', { status: 201 })

describe('twilioSms', () => {
  it('posts the message with basic auth', async () => {
    const fetcher = vi.fn(async () => ok())
    await twilioSms(
      { sid: 'AC123', token: 'secret', from: '+17205550100' },
      fetcher,
    )({
      to: '+17205550142',
      body: 'Hello',
    })
    const [url, init] = fetcher.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe('https://api.twilio.com/2010-04-01/Accounts/AC123/Messages.json')
    expect((init.headers as Record<string, string>).Authorization).toBe(
      `Basic ${Buffer.from('AC123:secret').toString('base64')}`,
    )
    expect(String(init.body)).toBe('From=%2B17205550100&To=%2B17205550142&Body=Hello')
  })

  it('throws with the service response when sending fails', async () => {
    const fetcher = vi.fn(async () => new Response('bad number', { status: 400 }))
    await expect(
      twilioSms({ sid: 'AC1', token: 't', from: '+1' }, fetcher)({ to: 'x', body: 'y' }),
    ).rejects.toThrow('Twilio returned 400: bad number')
  })
})

describe('resendEmail', () => {
  it('posts JSON with the sender and reply-to address', async () => {
    const fetcher = vi.fn(async () => ok())
    await resendEmail(
      { apiKey: 're_key', from: 'WashCraft <q@example.com>' },
      fetcher,
    )({
      to: ['owner@example.com'],
      subject: 'New lead',
      text: 'Details',
      replyTo: 'customer@example.com',
    })
    const [url, init] = fetcher.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe('https://api.resend.com/emails')
    expect(JSON.parse(String(init.body))).toEqual({
      from: 'WashCraft <q@example.com>',
      to: ['owner@example.com'],
      subject: 'New lead',
      text: 'Details',
      reply_to: 'customer@example.com',
    })
  })
})
