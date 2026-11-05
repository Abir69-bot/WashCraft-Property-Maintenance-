'use client'

import { ChevronsLeftRight } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

import { cn } from '@/lib/utils'

export type SliderImage = { url: string; alt: string }

/**
 * Drag (or use arrow keys) to compare before and after. A real range input sits on top, so it
 * works with keyboard and screen readers; its focus ring shows on the handle.
 * `night` draws a gold line and handle for the home page's dark theme.
 */
export function BeforeAfterSlider({
  before,
  after,
  caption,
  sizes,
  ratio = '4/3',
  tone = 'light',
}: {
  before: SliderImage
  after: SliderImage
  caption: string
  sizes: string
  ratio?: '4/3' | '16/10'
  tone?: 'light' | 'night'
}) {
  const [position, setPosition] = useState(50)
  const night = tone === 'night'

  return (
    <div
      className={cn(
        'relative overflow-hidden select-none',
        ratio === '16/10' ? 'aspect-[16/10]' : 'aspect-[4/3]',
        night ? 'rounded-lg bg-night-raised' : 'rounded-card bg-surface',
      )}
    >
      <Image src={after.url} alt={after.alt} fill sizes={sizes} className="object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <Image src={before.url} alt={before.alt} fill sizes={sizes} className="object-cover" />
      </div>
      <span
        className={cn(
          'absolute left-3 rounded-full bg-brand-ink/80 px-3 py-1 text-small font-semibold text-white',
          night ? 'bottom-3' : 'top-3',
        )}
      >
        Before
      </span>
      <span
        className={cn(
          'absolute right-3 rounded-full bg-brand-ink/80 px-3 py-1 text-small font-semibold text-white',
          night ? 'bottom-3' : 'top-3',
        )}
      >
        After
      </span>
      <input
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        aria-label={`${caption}: compare before and after`}
        aria-valuetext={`${position}% before`}
        className="peer absolute inset-0 z-10 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0"
      />
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-y-0 -translate-x-1/2 shadow peer-focus-visible:[&>span]:ring-4',
          night
            ? 'w-0.5 bg-cta peer-focus-visible:[&>span]:ring-white'
            : 'w-1 bg-white peer-focus-visible:bg-cta',
        )}
        style={{ left: `${position}%` }}
      >
        <span
          className={cn(
            'absolute top-1/2 left-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-lg',
            night ? 'bg-cta text-brand-ink' : 'bg-white text-brand-primary ring-cta',
          )}
        >
          <ChevronsLeftRight className="size-5" />
        </span>
      </div>
    </div>
  )
}
