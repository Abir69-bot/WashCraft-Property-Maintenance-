'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { OPEN_CONSENT_EVENT, readConsent, saveConsent } from '@/lib/consent'
import { routes } from '@/lib/routes'

/**
 * Cookie choice (brief §8, §14). Analytics and Clarity load only after "Accept"
 * (components/layout/analytics.tsx); "Cookie settings" in the footer reopens the banner.
 */

export function CookieConsent() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Reading localStorage must wait for the browser, so the banner appears after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!readConsent()) setOpen(true)
    const reopen = () => setOpen(true)
    window.addEventListener(OPEN_CONSENT_EVENT, reopen)
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen)
  }, [])

  function choose(analytics: boolean) {
    saveConsent(analytics)
    setOpen(false)
  }

  if (!open) return null
  return (
    <section
      aria-label="Cookie choices"
      className="fixed inset-x-3 bottom-[4.25rem] z-50 mx-auto max-w-2xl animate-slide-in-up rounded-card border border-border bg-white p-5 text-small text-ink shadow-xl md:bottom-4"
    >
      <p>
        We&apos;d like to use cookies to see how visitors use this site, so we can improve it.
        They&apos;re only set if you accept. <Link href={routes.privacy}>Privacy policy</Link>
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button size="sm" onClick={() => choose(true)}>
          Accept
        </Button>
        <Button size="sm" variant="outline" onClick={() => choose(false)}>
          Decline
        </Button>
      </div>
    </section>
  )
}

export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
    >
      Cookie settings
    </button>
  )
}
