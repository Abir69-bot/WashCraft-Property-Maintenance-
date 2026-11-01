'use client'

import Link from 'next/link'

import { Logo } from '@/components/brand/logo'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { routes } from '@/lib/routes'

import type { NavLink } from './main-nav'

const linkClass = 'block rounded-md px-2 py-2.5 text-ink no-underline hover:bg-surface'

export type MobileMenuProps = {
  /** The Services menu's columns (lib/services-menu.ts): stacked on phones, side by side from sm. */
  services: NavLink[][]
  areaLinks: NavLink[]
  pageLinks: NavLink[]
  cta: NavLink
  callHref: string | null
  textHref: string | null
}

/**
 * The mobile menu itself, loaded the first time the menu button is pressed (mobile-menu.tsx).
 * Full screen below lg; closes itself after navigation and returns focus to the button.
 */
export function MobileMenuPanel({
  services,
  areaLinks,
  pageLinks,
  cta,
  callHref,
  textHref,
  open,
  onOpenChange,
  returnFocus,
}: MobileMenuProps & {
  open: boolean
  onOpenChange: (open: boolean) => void
  returnFocus: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        side="full"
        closeLabel="Close menu"
        aria-describedby={undefined}
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          returnFocus()
        }}
        // Any link inside closes the menu as it navigates.
        onClick={(event) => {
          if ((event.target as HTMLElement).closest('a')) onOpenChange(false)
        }}
      >
        <DialogTitle className="sr-only">Menu</DialogTitle>
        <div className="mx-auto flex max-w-xl flex-col gap-6 pb-10">
          <Link
            href={routes.home}
            aria-label="WashCraft Property Maintenance, home"
            className="w-fit"
          >
            <Logo variant="horizontal" height={48} />
          </Link>
          <Button asChild size="lg">
            <Link href={cta.href}>{cta.label}</Link>
          </Button>
          <Accordion type="multiple">
            <AccordionItem value="services">
              <AccordionTrigger>Services</AccordionTrigger>
              <AccordionContent>
                <div className="grid sm:grid-cols-2 sm:gap-x-4">
                  {services.map((column, index) => (
                    <ul key={index}>
                      {column.map((link) => (
                        <li key={link.label}>
                          <Link href={link.href} className={linkClass}>
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="areas">
              <AccordionTrigger>Service Areas</AccordionTrigger>
              <AccordionContent>
                <ul>
                  {[...areaLinks, { label: 'All service areas', href: routes.areas }].map(
                    (link) => (
                      <li key={link.href}>
                        <Link href={link.href} className={linkClass}>
                          {link.label}
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <ul className="-mt-4 divide-y divide-border border-b border-border">
            {pageLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex min-h-14 items-center font-heading text-lg font-bold text-primary no-underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          {(callHref || textHref) && (
            <div className="grid grid-cols-2 gap-3">
              {callHref && (
                <Button asChild variant="outline">
                  <a href={callHref} data-track="call_click">
                    Call us
                  </a>
                </Button>
              )}
              {textHref && (
                <Button asChild variant="outline">
                  <a href={textHref} data-track="sms_click">
                    Text us
                  </a>
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
