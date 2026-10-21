'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { routes } from '@/lib/routes'

import type { ServiceGroup } from './quick-quote-form'

// Loaded only when the panel opens, so pages without a form don't carry its JavaScript.
const QuickQuoteForm = dynamic(() =>
  import('./quick-quote-form').then((module) => module.QuickQuoteForm),
)

const STORAGE_KEY = 'wc-slide-in'
const ONCE_PER = 7 * 24 * 60 * 60 * 1000
const DELAY = 45_000

function shownRecently() {
  try {
    const at = Number(localStorage.getItem(STORAGE_KEY))
    return Boolean(at) && Date.now() - at < ONCE_PER
  } catch {
    return true // Storage blocked: don't risk showing it on every page.
  }
}

function remember() {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()))
  } catch {
    // Storage blocked: nothing to remember.
  }
}

/**
 * Slide-in quick quote (brief §8): desktop only, on exit intent or after 45 seconds, once per
 * visitor per 7 days, never on quote pages, and not while the visitor is filling in a form.
 */
export function SlideInQuote({
  groups,
  consentLabel,
}: {
  groups: ServiceGroup[]
  consentLabel: string
}) {
  const pathname = usePathname()
  const quotePage = pathname === routes.quote || pathname.startsWith(`${routes.quote}/`)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (quotePage || !window.matchMedia('(min-width: 1024px)').matches || shownRecently()) return
    let done = false
    const stop = () => {
      done = true
      cleanup()
    }
    const show = () => {
      if (done) return
      stop()
      remember()
      setOpen(true)
    }
    const onLeave = (event: MouseEvent) => {
      if (event.clientY <= 0) show()
    }
    const onFocus = (event: FocusEvent) => {
      if ((event.target as Element | null)?.closest('form')) stop()
    }
    const timer = window.setTimeout(show, DELAY)
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.addEventListener('focusin', onFocus)
    function cleanup() {
      window.clearTimeout(timer)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('focusin', onFocus)
    }
    return cleanup
  }, [quotePage])

  return (
    <Dialog open={open && !quotePage} onOpenChange={setOpen}>
      <DialogContent side="right" closeLabel="Close the quote form">
        <DialogTitle>Get a quick quote</DialogTitle>
        <DialogDescription>
          Four quick details and we’ll get back to you with a price.
        </DialogDescription>
        <div className="mt-6">
          <QuickQuoteForm groups={groups} consentLabel={consentLabel} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
