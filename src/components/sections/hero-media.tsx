'use client'

import { Pause, Play } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import { useReducedMotion } from '@/components/use-reduced-motion'
import { cn } from '@/lib/utils'

export type HeroImage = { url: string; alt: string }

const INTERVAL = 6000

/**
 * Hero photos that cross-fade every 6 seconds. A pause button satisfies WCAG 2.2.2; reduced
 * motion turns rotation off. Only the first photo loads with high priority (LCP).
 */
export function HeroMedia({ images }: { images: HeroImage[] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reducedMotion = useReducedMotion()

  const rotating = images.length > 1 && !paused && !reducedMotion
  useEffect(() => {
    if (!rotating) return
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % images.length), INTERVAL)
    return () => window.clearInterval(timer)
  }, [rotating, images.length])

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-surface shadow-xl lg:aspect-[5/4]">
      {images.map((image, i) => (
        <Image
          key={image.url}
          src={image.url}
          alt={i === index ? image.alt : ''}
          aria-hidden={i !== index}
          fill
          priority={i === 0}
          sizes="(min-width: 1024px) 560px, 100vw"
          className={cn(
            'object-cover transition-opacity duration-1000',
            i === index ? 'opacity-100' : 'opacity-0',
          )}
        />
      ))}
      {images.length > 1 && !reducedMotion && (
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
          className="absolute right-3 bottom-3 inline-flex size-11 items-center justify-center rounded-full bg-ink/70 text-white hover:bg-ink"
        >
          {paused ? (
            <Play aria-hidden className="size-5" />
          ) : (
            <Pause aria-hidden className="size-5" />
          )}
        </button>
      )}
    </div>
  )
}
