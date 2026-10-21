'use client'

import { usePathname } from 'next/navigation'

/** Pages where the call band and mobile action bar stay out of the way (brief §8). */
export const QUOTE_AND_LEGAL = ['/quote', '/privacy', '/terms', '/accessibility']
export const QUOTE_PAGES = ['/quote']

const matches = (pathname: string, prefixes: string[]) =>
  prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))

/** Renders its children except on routes starting with one of `hideOn`. */
export function HideOn({ prefixes, children }: { prefixes: string[]; children: React.ReactNode }) {
  const pathname = usePathname()
  return matches(pathname, prefixes) ? null : children
}
