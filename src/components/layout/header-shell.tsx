'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { routes } from '@/lib/routes'

/**
 * Sticky header that gets a shadow and shrinks once the page scrolls. It is dark on every page,
 * to match the night theme of the home page and page heroes; the home page adds a scroll
 * progress bar.
 */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false)
  const home = usePathname() === routes.home

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <header
      data-scrolled={scrolled ? '' : undefined}
      data-tone="night"
      className="group sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur transition-shadow data-[scrolled]:shadow-md"
    >
      {home && <div aria-hidden className="scroll-progress" />}
      {children}
    </header>
  )
}
