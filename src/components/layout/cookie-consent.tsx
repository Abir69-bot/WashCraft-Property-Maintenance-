'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { routes } from '@/lib/routes'

/**
 * Cookie choice (brief §8, §14). Analytics and Clarity load only after "Accept"; they listen for
 * the `wc-consent` event and read `wc-consent` from localStorage (Phase 7).
 */
const KEY = 'wc-consent'
const OPEN_EVENT = 'wc-open-consent'

type Choice = { analytics: boolean; at: string }

function readChoice(): Choice | null {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? 'null')
  } catch {
    return null
  }
}

export function CookieConsent() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Reading localStorage must wait for the browser, so the banner appears after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!readChoice()) setOpen(true)
    const reopen = () => setOpen(true)
    window.addEventListener(OPEN_EVENT, reopen)
    return () => window.removeEventListener(OPEN_EVENT, reopen)
  }, [])

  function choose(analytics: boolean) {
    const choice: Choice = { analytics, at: new Date().toISOString() }
    try {
      localStorage.setItem(KEY, JSON.stringify(choice))
    } catch {
      // Storage blocked: the choice applies to this page view only.
    }
    window.dispatchEvent(new CustomEvent('wc-consent', { detail: choice }))
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
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
    >
      Cookie settings
    </button>
  )
}
