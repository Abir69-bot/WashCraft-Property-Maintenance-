'use client'

import { useEffect, useState } from 'react'

/** Sticky header that gets a shadow and shrinks once the page scrolls. */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <header
      data-scrolled={scrolled ? '' : undefined}
      className="group sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur transition-shadow data-[scrolled]:shadow-md"
    >
      {children}
    </header>
  )
}
