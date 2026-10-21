'use client'

import { CalendarCheck, PhoneCall } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, useTransition } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { track } from '@/lib/analytics'
import { updateQuote } from '@/lib/leads/actions'
import type { QuoteReceipt } from '@/lib/leads/types'
import { routes } from '@/lib/routes'

import { FormAlert } from './fields'

const money = (value: number) => `$${Math.round(value).toLocaleString('en-US')}`
const range = (low?: number, high?: number) =>
  low !== undefined && high !== undefined ? `${money(low)}–${money(high)}` : null

/**
 * The estimate after the contact step (brief §10.2 step 7): a range per service and in total,
 * discounts, the minimum-charge and tax notes, then "Book this" or "Request a call-back".
 */
export function EstimateResult({
  receipt,
  type,
  title = 'Your estimate',
}: {
  receipt: QuoteReceipt
  /** Lead type, passed to the thank-you page. */
  type: string
  title?: string
}) {
  const router = useRouter()
  const heading = useRef<HTMLHeadingElement>(null)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const { estimate, plan, leadId, token } = receipt

  useEffect(() => {
    heading.current?.focus()
    if (estimate) track('quote_estimate_viewed', { type, value: estimate.high })
  }, [estimate, type])

  const act = (action: 'book' | 'callback') => {
    if (!leadId || !token) return
    setError(null)
    startTransition(async () => {
      const result = await updateQuote({ leadId, token, action })
      if (!result.ok) return setError(result.message)
      if (action === 'book') track('booking_requested', { type })
      router.push(
        `${routes.quoteThankYou}?type=${type}&${action === 'book' ? 'booked' : 'callback'}=1`,
      )
    })
  }

  return (
    <section aria-labelledby="estimate-heading" className="grid gap-6">
      <h2 id="estimate-heading" ref={heading} tabIndex={-1} className="focus:outline-none">
        {title}
      </h2>

      {plan && (
        <p className="rounded-card bg-surface p-4">
          <strong className="text-ink">{plan.name} plan:</strong>{' '}
          {plan.price ?? 'Custom quote: we’ll confirm the price with you.'}
        </p>
      )}

      {estimate ? (
        <div className="grid gap-4 rounded-card border border-border bg-white p-6">
          <ul className="grid gap-3">
            {estimate.lines.map((line) => (
              <li
                key={line.name}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border pb-3 last:border-b-0"
              >
                <span className="font-semibold text-ink">{line.name}</span>
                <span className="flex flex-col items-end text-right">
                  <span className="font-semibold text-primary">
                    {line.status === 'priced'
                      ? range(line.low, line.high)
                      : 'We’ll price this with you'}
                  </span>
                  {line.minimumApplied && (
                    <span className="text-small text-muted">Includes our minimum charge</span>
                  )}
                  {line.placeholder && (
                    <Badge tone="sample" className="mt-1">
                      Placeholder price
                    </Badge>
                  )}
                </span>
              </li>
            ))}
          </ul>
          {[estimate.bundle, estimate.frequency].map(
            (discount) =>
              discount && (
                <p key={discount.name} className="flex justify-between gap-4 text-success-strong">
                  <span>
                    {discount.name} ({discount.percent}% off)
                  </span>
                  <span className="shrink-0 whitespace-nowrap">−{money(discount.amount)}</span>
                </p>
              ),
          )}
          <p className="flex flex-wrap items-baseline justify-between gap-2 border-t-2 border-primary pt-4">
            <span className="text-h3 font-heading font-bold text-primary">Estimated total</span>
            <span className="text-h2 font-heading font-extrabold text-primary">
              {range(estimate.low, estimate.high)}
            </span>
          </p>
          {!estimate.complete && (
            <p className="text-muted">Plus the services we’ll price with you.</p>
          )}
          <p className="text-small text-muted">
            {estimate.estimateNote} {estimate.taxNote}
          </p>
        </div>
      ) : (
        <p className="rounded-card bg-surface p-6">
          We have your details. We’ll review them and get back to you with a price.
        </p>
      )}

      {leadId && token ? (
        <div className="flex flex-wrap gap-3">
          <Button size="lg" disabled={pending} onClick={() => act('book')}>
            <CalendarCheck aria-hidden />
            {pending ? 'Sending…' : 'Book this'}
          </Button>
          <Button size="lg" variant="outline" disabled={pending} onClick={() => act('callback')}>
            <PhoneCall aria-hidden />
            Request a call-back
          </Button>
        </div>
      ) : (
        <Button asChild size="lg" className="w-fit">
          <Link href={`${routes.quoteThankYou}?type=${type}`}>Continue</Link>
        </Button>
      )}
      <FormAlert message={error} />
    </section>
  )
}
