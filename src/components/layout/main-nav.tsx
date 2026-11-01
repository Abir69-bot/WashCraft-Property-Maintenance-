'use client'

import { ArrowRight, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { NavigationMenu } from 'radix-ui'

import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils'

export type NavLink = { label: string; href: string }

const triggerClass =
  'nav-top group inline-flex min-h-11 items-center gap-1 rounded-full px-3 font-semibold text-ink transition-colors hover:bg-surface hover:text-primary data-[state=open]:bg-surface data-[state=open]:text-primary xl:px-4'
const panelClass =
  'absolute top-full z-50 mt-2 animate-fade-in rounded-card border border-border bg-white p-6 text-ink shadow-xl [--focus-ring:var(--primary)]'
const linkClass =
  'block rounded-md px-2 py-1.5 text-small text-ink no-underline hover:bg-surface hover:text-primary'

function Trigger({ children }: { children: React.ReactNode }) {
  return (
    <NavigationMenu.Trigger className={triggerClass}>
      {children}
      <ChevronDown
        aria-hidden
        className="size-4 transition-transform group-data-[state=open]:rotate-180"
      />
    </NavigationMenu.Trigger>
  )
}

function MenuLink({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <NavigationMenu.Link asChild>
      <Link href={href} className={cn(linkClass, className)}>
        {children}
      </Link>
    </NavigationMenu.Link>
  )
}

function LinkList({ links }: { links: NavLink[] }) {
  return (
    <ul className="grid gap-0.5">
      {links.map((link) => (
        <li key={link.href}>
          <MenuLink href={link.href}>{link.label}</MenuLink>
        </li>
      ))}
    </ul>
  )
}

/**
 * Desktop navigation (lg and up). Radix handles hover (the panel stays open while the pointer
 * moves into it), click and tap, Escape, outside clicks and keyboard focus.
 */
export function MainNav({
  services,
  areaLinks,
  pageLinks,
}: {
  /** The Services menu's two columns (lib/services-menu.ts); the last link is All Services. */
  services: NavLink[][]
  areaLinks: NavLink[]
  /** Plain top-level links (About, FAQs, Contact…), set under Navigation in the admin. */
  pageLinks: NavLink[]
}) {
  const last = services.at(-1)?.at(-1)
  return (
    <NavigationMenu.Root aria-label="Main" className="hidden lg:block">
      <NavigationMenu.List className="flex items-center gap-0.5">
        <NavigationMenu.Item className="relative">
          <Trigger>Services</Trigger>
          {/* Dark two-column panel, opening right under the Services button. */}
          <NavigationMenu.Content className="absolute top-full left-0 z-50 mt-3 w-[min(38rem,calc(100vw-3rem))] animate-menu-in rounded-xl border border-white/10 bg-night p-3 text-white shadow-2xl [--focus-ring:var(--cta)]">
            <div className="grid grid-cols-2 gap-x-2">
              {services.map((column, index) => (
                <ul key={index} className="grid content-start gap-0.5">
                  {column.map((link) => {
                    const all = link === last
                    return (
                      <li key={link.label}>
                        <NavigationMenu.Link asChild>
                          <Link
                            href={link.href}
                            className={cn(
                              'group/item flex min-h-12 items-center justify-between gap-3 rounded-lg px-4 py-3 font-semibold no-underline transition-colors duration-200 hover:bg-white/[0.07] focus-visible:bg-white/[0.07]',
                              all
                                ? 'mt-1 border-t border-white/10 text-cta'
                                : 'text-white/90 hover:text-white',
                            )}
                          >
                            {link.label}
                            <ArrowRight
                              aria-hidden
                              className={cn(
                                'size-4 shrink-0 text-cta transition duration-200',
                                !all &&
                                  '-translate-x-1 opacity-0 group-hover/item:translate-x-0 group-hover/item:opacity-100 group-focus-visible/item:translate-x-0 group-focus-visible/item:opacity-100',
                              )}
                            />
                          </Link>
                        </NavigationMenu.Link>
                      </li>
                    )
                  })}
                </ul>
              ))}
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item className="relative">
          <Trigger>Service Areas</Trigger>
          <NavigationMenu.Content className={cn(panelClass, 'left-0 w-64')}>
            <LinkList links={[...areaLinks, { label: 'All service areas', href: routes.areas }]} />
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        {pageLinks.map((link) => (
          <NavigationMenu.Item key={link.href}>
            <NavigationMenu.Link asChild>
              <Link href={link.href} className={cn(triggerClass, 'px-3 no-underline')}>
                {link.label}
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        ))}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  )
}
