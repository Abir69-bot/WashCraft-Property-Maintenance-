'use client'

import { Menu } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRef, useState } from 'react'

import { Button } from '@/components/ui/button'

import type { MobileMenuProps } from './mobile-menu-panel'

// The dialog and its contents load on the first press, not with every page.
const MobileMenuPanel = dynamic(
  () => import('./mobile-menu-panel').then((module) => module.MobileMenuPanel),
  { ssr: false },
)

/** Menu button below lg. */
export function MobileMenu(props: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const button = useRef<HTMLButtonElement>(null)

  return (
    <>
      <Button
        ref={button}
        variant="ghost"
        size="icon"
        className="lg:hidden"
        aria-label="Open menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          setLoaded(true)
          setOpen(true)
        }}
      >
        <Menu aria-hidden />
      </Button>
      {loaded && (
        <MobileMenuPanel
          {...props}
          open={open}
          onOpenChange={setOpen}
          returnFocus={() => button.current?.focus()}
        />
      )}
    </>
  )
}
