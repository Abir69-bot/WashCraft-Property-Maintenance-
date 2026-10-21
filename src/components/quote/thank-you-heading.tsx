'use client'

import { useSearchParams } from 'next/navigation'

/** The thank-you heading, worded for a booking or a call-back request. */
export function ThankYouHeading() {
  const params = useSearchParams()
  const text = params.has('booked')
    ? 'Thanks, we’ve got your booking request'
    : params.has('callback')
      ? 'Thanks, we’ll call you back'
      : 'Thanks, we’ve got your request'
  return <h1 id="page-heading">{text}</h1>
}
