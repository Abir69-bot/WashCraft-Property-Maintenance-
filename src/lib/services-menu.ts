import type { NavLink } from '@/components/layout/main-nav'
import { categoryHref, routes } from '@/lib/routes'

/** Where a menu item goes: a service or category by slug, or a fixed page. */
export type MenuTarget = { service: string } | { category: string } | { path: string }

export type ServicesMenuItem = { label: string; targets: MenuTarget[] }

/**
 * The Services menu, in two columns, as the owner listed it (2026-11-01). Labels without a page
 * of their own point at the closest one: the first target that's live wins, and an item with
 * no live target is left out, so the menu never links to a missing or unpublished page.
 */
export const SERVICES_MENU: ServicesMenuItem[][] = [
  [
    { label: 'Exterior Cleaning', targets: [{ category: 'exterior-cleaning' }] },
    {
      label: 'Property Maintenance',
      targets: [{ service: 'commercial-property-maintenance' }, { path: routes.services }],
    },
    { label: 'Snow Removal', targets: [{ service: 'snow-removal' }] },
    { label: 'Pressure Washing', targets: [{ service: 'pressure-washing' }] },
    { label: 'Window Cleaning', targets: [{ service: 'window-cleaning' }] },
    { label: 'Gutter Cleaning', targets: [{ service: 'gutter-cleaning' }] },
  ],
  [
    { label: 'Soft Washing', targets: [{ service: 'soft-washing' }] },
    { label: 'Roof Cleaning', targets: [{ service: 'roof-cleaning' }] },
    { label: 'Commercial Cleaning', targets: [{ service: 'commercial-cleaning' }] },
    // The home page's season tabs list what's booked in each season.
    { label: 'Seasonal Services', targets: [{ path: `${routes.home}#in-season` }] },
    // Interlock patios and other hard surfaces, cleaned with a method set for the material.
    { label: 'Interlock / Surface Care', targets: [{ service: 'patio-balcony-cleaning' }] },
    { label: 'All Services', targets: [{ path: routes.services }] },
  ],
]

/**
 * Categories shown in the Services menu as a group: the category's name as a heading (linking to
 * its page) with its services listed under it (owner, 2026-11-06).
 */
export type ServicesMenuGroup = { heading: ServicesMenuItem; items: ServicesMenuItem[] }

export const SERVICES_MENU_GROUPS: ServicesMenuGroup[] = [
  {
    heading: { label: 'Residential Cleaning', targets: [{ category: 'interior-cleaning' }] },
    items: [
      { label: 'Interior House Cleaning', targets: [{ service: 'house-cleaning' }] },
      { label: 'Deep Cleaning', targets: [{ service: 'deep-cleaning' }] },
      { label: 'Move-In & Move-Out Cleaning', targets: [{ service: 'move-in-move-out-cleaning' }] },
      { label: 'Regular Home Cleaning', targets: [{ service: 'regular-home-cleaning' }] },
    ],
  },
]

/** A menu group with live links: its heading and the links under it. */
export type MenuGroup = { heading: NavLink; links: NavLink[] }

type MenuCategory = { slug: string; services: { slug: string }[] }

/** Turns menu items into live links: the first target that's live wins, items with none drop. */
function linker(categories: MenuCategory[], services: { slug: string }[]) {
  const href = (target: MenuTarget): string | null => {
    if ('path' in target) return target.path
    if ('service' in target) {
      return services.some((service) => service.slug === target.service)
        ? routes.service(target.service)
        : null
    }
    const category = categories.find(
      (item) => item.slug === target.category && item.services.length > 0,
    )
    return category ? categoryHref(category) : null
  }
  return (item: ServicesMenuItem): NavLink[] => {
    const link = item.targets.map(href).find((value) => value !== null)
    return link ? [{ label: item.label, href: link }] : []
  }
}

/** The menu's columns with each item's live link (published services and categories only). */
export function servicesMenu(
  categories: MenuCategory[],
  services: { slug: string }[],
  menu: ServicesMenuItem[][] = SERVICES_MENU,
): NavLink[][] {
  const link = linker(categories, services)
  return menu.map((column) => column.flatMap(link))
}

/** The menu's category groups with live links; a group with no live heading or links is left out. */
export function servicesMenuGroups(
  categories: MenuCategory[],
  services: { slug: string }[],
  groups: ServicesMenuGroup[] = SERVICES_MENU_GROUPS,
): MenuGroup[] {
  const link = linker(categories, services)
  return groups.flatMap((group) => {
    const [heading] = link(group.heading)
    const links = group.items.flatMap(link)
    return heading && links.length > 0 ? [{ heading, links }] : []
  })
}
