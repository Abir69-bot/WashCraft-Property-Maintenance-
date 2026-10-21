import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

import { env } from '@/lib/env'
import { routes } from '@/lib/routes'

export type Crumb = { label: string; href: string }

/** Breadcrumb trail for inner pages, with BreadcrumbList structured data (brief §8, §13). */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail = [{ label: 'Home', href: routes.home }, ...items]
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: `${env.NEXT_PUBLIC_SITE_URL}${crumb.href}`,
    })),
  }

  return (
    <nav aria-label="Breadcrumb" className="container pt-6 text-small">
      <ol className="flex flex-wrap items-center gap-1 text-muted">
        {trail.map((crumb, index) => {
          const current = index === trail.length - 1
          return (
            <li key={crumb.href} className="flex items-center gap-1">
              {index > 0 && <ChevronRight aria-hidden className="size-4" />}
              {current ? (
                <span aria-current="page" className="font-medium text-ink">
                  {crumb.label}
                </span>
              ) : (
                <Link href={crumb.href} className="py-1">
                  {crumb.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
    </nav>
  )
}
