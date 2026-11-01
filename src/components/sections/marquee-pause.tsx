'use client'

import { Pause, Play } from 'lucide-react'
import { useState } from 'react'

/**
 * Stops and restarts the scrolling rows in the surrounding `[data-marquee]` element. Moving
 * content needs a way to pause it (WCAG 2.2.2); hover and keyboard focus also pause it.
 */
export function MarqueePause({ label }: { label: string }) {
  const [paused, setPaused] = useState(false)
  return (
    <button
      type="button"
      aria-pressed={paused}
      onClick={(event) => {
        const next = !paused
        event.currentTarget.closest('[data-marquee]')?.toggleAttribute('data-paused', next)
        setPaused(next)
      }}
      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 px-4 text-small font-semibold text-white transition-colors hover:border-white motion-reduce:hidden"
    >
      {paused ? <Play aria-hidden className="size-4" /> : <Pause aria-hidden className="size-4" />}
      {paused ? 'Play' : 'Pause'} {label}
    </button>
  )
}
