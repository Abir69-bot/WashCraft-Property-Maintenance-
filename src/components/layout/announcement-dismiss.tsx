'use client'

import { X } from 'lucide-react'

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000

export function AnnouncementDismiss({ id, storageKey }: { id: string; storageKey: string }) {
  return (
    <button
      type="button"
      aria-label="Dismiss announcement"
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white"
      onClick={() => {
        try {
          localStorage.setItem(storageKey, JSON.stringify({ id, until: Date.now() + SEVEN_DAYS }))
        } catch {
          // Storage blocked (private mode): hide for this page view only.
        }
        document.documentElement.setAttribute('data-announcement-hidden', '')
      }}
    >
      <X aria-hidden className="size-4" />
    </button>
  )
}
