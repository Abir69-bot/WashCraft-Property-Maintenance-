'use client'

import { ChevronsLeftRight } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

export type SliderImage = { url: string; alt: string }

/**
 * Drag (or use arrow keys) to compare before and after. A real range input sits on top, so it
 * works with keyboard and screen readers; its focus ring shows on the handle.
 */
export function BeforeAfterSlider({
  before,
  after,
  caption,
  sizes,
}: {
  before: SliderImage
  after: SliderImage
  caption: string
  sizes: string
}) {
  const [position, setPosition] = useState(50)

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-surface select-none">
      <Image src={after.url} alt={after.alt} fill sizes={sizes} className="object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <Image src={before.url} alt={before.alt} fill sizes={sizes} className="object-cover" />
      </div>
      <span className="absolute top-3 left-3 rounded-full bg-ink/80 px-3 py-1 text-small font-semibold text-white">
        Before
      </span>
      <span className="absolute top-3 right-3 rounded-full bg-ink/80 px-3 py-1 text-small font-semibold text-white">
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
        className="pointer-events-none absolute inset-y-0 w-1 -translate-x-1/2 bg-white shadow peer-focus-visible:bg-cta peer-focus-visible:[&>span]:ring-4"
        style={{ left: `${position}%` }}
      >
        <span className="absolute top-1/2 left-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-primary shadow-lg ring-cta">
          <ChevronsLeftRight className="size-5" />
        </span>
      </div>
    </div>
  )
}
