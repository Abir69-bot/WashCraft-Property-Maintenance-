'use client'

import { ArrowRight, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { NavigationMenu } from 'radix-ui'

import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils'

export type NavLink = { label: string; href: string }

/**
 * Top-level items stay on one line ("Service Areas", "Before & After"); padding and size step
 * down a little on narrower desktops so the whole row still fits beside the logo and button.
 */
const triggerClass =
  'nav-top group inline-flex min-h-11 items-center gap-1 rounded-full px-2 text-[0.9375rem] font-semibold whitespace-nowrap text-ink transition-colors hover:bg-surface hover:text-primary data-[state=open]:bg-surface data-[state=open]:text-primary xl:px-3 xl:text-base'
/** Dropdown panels (Services, Service Areas): the home page's night background and gold accent. */
const panelClass =
  'absolute top-full left-0 z-50 mt-3 animate-menu-in rounded-xl border border-white/10 bg-night p-3 text-white shadow-2xl [--focus-ring:var(--cta)]'

function Trigger({ children }: { children: React.ReactNode }) {
  return (
    <NavigationMenu.Trigger className={triggerClass}>
      {children}
      <ChevronDown
        aria-hidden
        className="size-4 shrink-0 transition-transform group-data-[state=open]:rotate-180"
      />
    </NavigationMenu.Trigger>
  )
}

/**
 * A dropdown link: a gold arrow slides in on hover and focus. `all` marks the closing
 * "All …" link, set apart by a divider and shown in gold.
 */
function MenuLink({ link, all = false }: { link: NavLink; all?: boolean }) {
  return (
    <li>
      <NavigationMenu.Link asChild>
        <Link
          href={link.href}
          className={cn(
            'group/item flex min-h-12 items-center justify-between gap-3 rounded-lg px-4 py-3 font-semibold no-underline transition-colors duration-200 hover:bg-white/[0.07] focus-visible:bg-white/[0.07]',
            all ? 'mt-1 border-t border-white/10 text-cta' : 'text-white/90 hover:text-white',
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
        <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
            <Link href={routes.home} className={cn(triggerClass, 'no-underline')}>
              Home
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Item className="relative">
          <Trigger>Services</Trigger>
          {/* Dark two-column panel, opening right under the Services button. */}
          <NavigationMenu.Content className={cn(panelClass, 'w-[min(38rem,calc(100vw-3rem))]')}>
            <div className="grid grid-cols-2 gap-x-2">
              {services.map((column, index) => (
                <ul key={index} className="grid content-start gap-0.5">
                  {column.map((link) => (
                    <MenuLink key={link.label} link={link} all={link === last} />
                  ))}
                </ul>
              ))}
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item className="relative">
          <Trigger>Service Areas</Trigger>
          {/* Same dark panel as Services, one column. */}
          <NavigationMenu.Content className={cn(panelClass, 'w-72')}>
            <ul className="grid gap-0.5">
              {areaLinks.map((link) => (
                <MenuLink key={link.href} link={link} />
              ))}
              <MenuLink link={{ label: 'All service areas', href: routes.areas }} all />
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        {pageLinks.map((link) => (
          <NavigationMenu.Item key={link.href}>
            <NavigationMenu.Link asChild>
              <Link href={link.href} className={cn(triggerClass, 'no-underline')}>
                {link.label}
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        ))}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  )
}
