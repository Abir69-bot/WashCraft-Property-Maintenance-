'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { routes } from '@/lib/routes'

/** Desktop mice only, and never for visitors who prefer reduced motion. */
const QUERY =
  '(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'

/**
 * Effect 4 (owner, 2026-11-23): on the home page, the hero photo shifts a few pixels against the
 * mouse so it feels like a layer behind the headline. The hero component is untouched: the
 * engine finds the photo in the page. Nothing changes until a mouse moves over the hero, and the
 * photo eases back to exactly today's look when it leaves.
 */
export function HeroParallax() {
  const home = usePathname() === routes.home

  useEffect(() => {
    if (!home) return
    const query = window.matchMedia(QUERY)
    let stop: (() => void) | undefined
    let loading = false
    let cancelled = false
    const update = () => {
      if (query.matches && !stop && !loading) {
        loading = true
        import('./hero-parallax-engine')
          .then(({ startHeroParallax }) => {
            loading = false
            if (!cancelled && query.matches && !stop) stop = startHeroParallax()
          })
          .catch(() => {
            loading = false
          })
      } else if (!query.matches && stop) {
        stop()
        stop = undefined
      }
    }
    update()
    query.addEventListener('change', update)
    return () => {
      cancelled = true
      query.removeEventListener('change', update)
      stop?.()
    }
  }, [home])

  return null
}
