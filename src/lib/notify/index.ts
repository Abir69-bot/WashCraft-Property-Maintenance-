import { env } from '@/lib/env'

export type SmsMessage = { to: string; body: string }
export type EmailMessage = { to: string[]; subject: string; text: string; replyTo?: string }

/**
 * Outgoing messages (brief §11). Twilio for SMS and Resend for email when their keys are set;
 * otherwise the message is written to the server log, so every flow still works in development.
 * Both send over plain HTTPS: no SDKs in the bundle.
 */
export interface Notifier {
  readonly sms: 'twilio' | 'console'
  readonly email: 'resend' | 'console'
  sendSms(message: SmsMessage): Promise<void>
  sendEmail(message: EmailMessage): Promise<void>
}

type Fetch = typeof fetch

async function check(response: Response, service: string) {
  if (response.ok) return
  const detail = await response.text().catch(() => '')
  throw new Error(`${service} returned ${response.status}: ${detail.slice(0, 300)}`)
}

export function twilioSms(
  { sid, token, from }: { sid: string; token: string; from: string },
  fetcher: Fetch = fetch,
) {
  return async ({ to, body }: SmsMessage) => {
    const response = await fetcher(
      `https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(sid)}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ From: from, To: to, Body: body }),
        signal: AbortSignal.timeout(10_000),
      },
    )
    await check(response, 'Twilio')
  }
}

export function resendEmail(
  { apiKey, from }: { apiKey: string; from: string },
  fetcher: Fetch = fetch,
) {
  return async ({ to, subject, text, replyTo }: EmailMessage) => {
    const response = await fetcher('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, subject, text, ...(replyTo && { reply_to: replyTo }) }),
      signal: AbortSignal.timeout(10_000),
    })
    await check(response, 'Resend')
  }
}

export function getNotifier(): Notifier {
  const twilio =
    env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN && env.TWILIO_FROM
      ? twilioSms({
          sid: env.TWILIO_ACCOUNT_SID,
          token: env.TWILIO_AUTH_TOKEN,
          from: env.TWILIO_FROM,
        })
      : null
  const resend =
    env.RESEND_API_KEY && env.EMAIL_FROM
      ? resendEmail({ apiKey: env.RESEND_API_KEY, from: env.EMAIL_FROM })
      : null
  return {
    sms: twilio ? 'twilio' : 'console',
    email: resend ? 'resend' : 'console',
    sendSms:
      twilio ??
      (async (message) => {
        console.info(`[notify] SMS to ${message.to} (Twilio not configured):\n${message.body}`)
      }),
    sendEmail:
      resend ??
      (async (message) => {
        console.info(
          `[notify] Email to ${message.to.join(', ')} (Resend not configured): ${message.subject}\n${message.text}`,
        )
      }),
  }
}
