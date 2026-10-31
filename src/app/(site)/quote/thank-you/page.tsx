import { CalendarDays, CircleCheck } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'

import { CallLink } from '@/components/layout/contact-links'
import { ThankYouHeading } from '@/components/quote/thank-you-heading'
import { Button } from '@/components/ui/button'
import { getLayoutData } from '@/lib/data/layout'
import { getFeatureFlags } from '@/lib/data/pages'
import { routes } from '@/lib/routes'
import { telHref } from '@/lib/text'

export const metadata: Metadata = {
  title: 'Thank you',
  robots: { index: false, follow: false },
}

/** Confirmation after any quote form (brief §9.7). Not indexed. */
export default async function ThankYouPage() {
  const [{ site }, flags] = await Promise.all([getLayoutData(), getFeatureFlags()])
  const calLink = flags.calBooking && flags.calLink ? `https://cal.com/${flags.calLink}` : null

  return (
    <section aria-labelledby="page-heading" className="bg-surface">
      <div className="container section-y">
        <CircleCheck aria-hidden className="mb-4 size-12 text-success-strong" />
        <Suspense fallback={<h1 id="page-heading">Thanks, we’ve got your request</h1>}>
          <ThankYouHeading />
        </Suspense>
        <h2 className="mt-10 text-h3">What happens next</h2>
        <ol className="mt-4 grid max-w-2xl list-decimal gap-3 pl-6 text-lg">
          <li>WashCraft reviews your request and any photos you sent.</li>
          <li>
            {site.responseTimePromise
              ? `We contact you ${site.responseTimePromise}, and may ask for more photos or details.`
              : 'We contact you, and may ask for more photos or details.'}
          </li>
          <li>You receive a written estimate with the scope, exclusions, price and conditions.</li>
          <li>Once you approve it, we confirm a date with you. No payment is taken online.</li>
        </ol>
        {calLink && (
          <div className="mt-8">
            <p className="font-semibold text-ink">Want to talk it through sooner?</p>
            <Button asChild size="lg" className="mt-3">
              <a href={calLink} target="_blank" rel="noopener">
                <CalendarDays aria-hidden />
                Book a call<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </Button>
          </div>
        )}
        {telHref(site.phone) && (
          <p className="mt-8 text-muted">
            Questions in the meantime?{' '}
            <CallLink phone={site.phone} label={`Call ${site.phone}`} className="font-semibold" />
          </p>
        )}
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href={routes.home}>Back to the home page</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href={routes.services}>Browse services</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
