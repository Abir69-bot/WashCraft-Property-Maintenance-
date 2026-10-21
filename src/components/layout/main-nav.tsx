'use client'

import { ArrowRight, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { NavigationMenu } from 'radix-ui'

import { ServiceIcon } from '@/components/service-icon'
import type { NavCategory } from '@/lib/data/layout'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils'

export type NavLink = { label: string; href: string }
export type FeaturedCard = {
  eyebrow?: string | null
  title: string
  text: string
  href: string
  cta: string
}

const MAX_PER_CATEGORY = 6

const triggerClass =
  'group inline-flex min-h-11 items-center gap-1 rounded-full px-4 font-semibold text-ink hover:bg-surface hover:text-primary data-[state=open]:bg-surface data-[state=open]:text-primary'
const panelClass =
  'absolute top-full z-50 mt-2 animate-fade-in rounded-card border border-border bg-white p-6 text-ink shadow-xl'
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

/** Desktop navigation (lg and up). Radix handles hover, keyboard, Escape and focus. */
export function MainNav({
  categories,
  commercialLinks,
  areaLinks,
  companyLinks,
  featured,
}: {
  categories: NavCategory[]
  commercialLinks: NavLink[]
  areaLinks: NavLink[]
  companyLinks: NavLink[]
  featured: FeaturedCard | null
}) {
  const commercial = categories.find((category) => category.slug === 'commercial')

  return (
    <NavigationMenu.Root aria-label="Main" className="hidden lg:block">
      <NavigationMenu.List className="flex items-center gap-1">
        <NavigationMenu.Item>
          <Trigger>Services</Trigger>
          <NavigationMenu.Content className={cn(panelClass, 'right-0 left-0')}>
            <div className="grid grid-cols-[repeat(3,minmax(0,1fr))_17rem] gap-x-6 gap-y-5">
              {categories.map((category) => (
                <div key={category.id}>
                  <MenuLink
                    href={routes.category(category.slug)}
                    className="mb-1 flex items-center gap-2 font-heading text-base font-bold text-primary"
                  >
                    <ServiceIcon name={category.icon} className="size-5 text-secondary-strong" />
                    {category.menuLabel || category.title}
                  </MenuLink>
                  <ul className="grid gap-0.5">
                    {category.services.slice(0, MAX_PER_CATEGORY).map((service) => (
                      <li key={service.id}>
                        <MenuLink href={routes.service(service.slug)}>{service.title}</MenuLink>
                      </li>
                    ))}
                    {category.services.length > MAX_PER_CATEGORY && (
                      <li>
                        <MenuLink
                          href={routes.category(category.slug)}
                          className="font-semibold text-secondary-strong"
                        >
                          All {(category.menuLabel || category.title).toLowerCase()} →
                        </MenuLink>
                      </li>
                    )}
                  </ul>
                </div>
              ))}
              {featured && (
                <div className="row-span-2 flex flex-col rounded-card bg-surface p-5">
                  {featured.eyebrow && (
                    <p className="text-small font-semibold tracking-wide text-secondary-strong uppercase">
                      {featured.eyebrow}
                    </p>
                  )}
                  <p className="mt-1 font-heading text-lg font-bold text-primary">
                    {featured.title}
                  </p>
                  <p className="mt-2 text-small text-muted">{featured.text}</p>
                  <NavigationMenu.Link asChild>
                    <Link
                      href={featured.href}
                      className="mt-auto inline-flex min-h-11 items-center gap-2 pt-4 font-semibold"
                    >
                      {featured.cta} <ArrowRight aria-hidden className="size-4" />
                    </Link>
                  </NavigationMenu.Link>
                  <NavigationMenu.Link asChild>
                    <Link href={routes.services} className="mt-1 text-small font-semibold">
                      Browse all services
                    </Link>
                  </NavigationMenu.Link>
                </div>
              )}
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item className="relative">
          <Trigger>Commercial</Trigger>
          <NavigationMenu.Content className={cn(panelClass, 'left-0 w-80')}>
            <MenuLink
              href={routes.category('commercial')}
              className="mb-1 font-heading text-base font-bold text-primary"
            >
              Commercial & HOA overview
            </MenuLink>
            <LinkList
              links={[
                ...(commercial?.services ?? []).map((service) => ({
                  label: service.title,
                  href: routes.service(service.slug),
                })),
                ...commercialLinks,
              ]}
            />
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item className="relative">
          <Trigger>Areas</Trigger>
          <NavigationMenu.Content className={cn(panelClass, 'left-0 w-64')}>
            <LinkList links={[...areaLinks, { label: 'All service areas', href: routes.areas }]} />
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item className="relative">
          <Trigger>Company</Trigger>
          <NavigationMenu.Content className={cn(panelClass, 'left-0 w-60')}>
            <LinkList links={companyLinks} />
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  )
}
