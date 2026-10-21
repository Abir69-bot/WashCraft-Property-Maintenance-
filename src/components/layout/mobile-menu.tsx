'use client'

import { Menu } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { Logo } from '@/components/brand/logo'
import { ServiceIcon } from '@/components/service-icon'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import type { NavCategory } from '@/lib/data/layout'
import { routes } from '@/lib/routes'

import type { NavLink } from './main-nav'

const linkClass = 'block rounded-md px-2 py-2.5 text-ink no-underline hover:bg-surface'

/** Full-screen menu below lg. Closes itself after navigation. */
export function MobileMenu({
  categories,
  areaLinks,
  companyLinks,
  commercialLinks,
  cta,
  callHref,
  textHref,
}: {
  categories: NavCategory[]
  areaLinks: NavLink[]
  companyLinks: NavLink[]
  commercialLinks: NavLink[]
  cta: NavLink
  callHref: string | null
  textHref: string | null
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
          <Menu aria-hidden />
        </Button>
      </DialogTrigger>
      <DialogContent
        side="full"
        closeLabel="Close menu"
        aria-describedby={undefined}
        // Any link inside closes the menu as it navigates.
        onClick={(event) => {
          if ((event.target as HTMLElement).closest('a')) setOpen(false)
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
          <Accordion type="multiple">
            {categories.map((category) => (
              <AccordionItem key={category.id} value={category.slug}>
                <AccordionTrigger>
                  <span className="flex items-center gap-2">
                    <ServiceIcon name={category.icon} className="size-5 text-secondary-strong" />
                    {category.menuLabel || category.title}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <ul>
                    <li>
                      <Link
                        href={routes.category(category.slug)}
                        className={`${linkClass} font-semibold`}
                      >
                        {category.title} overview
                      </Link>
                    </li>
                    {category.services.map((service) => (
                      <li key={service.id}>
                        <Link href={routes.service(service.slug)} className={linkClass}>
                          {service.title}
                        </Link>
                      </li>
                    ))}
                    {category.slug === 'commercial' &&
                      commercialLinks.map((link) => (
                        <li key={link.href}>
                          <Link href={link.href} className={linkClass}>
                            {link.label}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
            <AccordionItem value="areas">
              <AccordionTrigger>Areas we serve</AccordionTrigger>
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
            <AccordionItem value="company">
              <AccordionTrigger>Company</AccordionTrigger>
              <AccordionContent>
                <ul>
                  {companyLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className={linkClass}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="grid gap-3">
            <Button asChild size="lg">
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
