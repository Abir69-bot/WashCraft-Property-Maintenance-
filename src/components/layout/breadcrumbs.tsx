import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

import { JsonLd } from '@/components/json-ld'
import { env } from '@/lib/env'
import { routes } from '@/lib/routes'
import { breadcrumbList } from '@/lib/seo/json-ld'

export type Crumb = { label: string; href: string }

/** Breadcrumb trail for inner pages, with BreadcrumbList structured data (brief §8, §13). */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail = [{ label: 'Home', href: routes.home }, ...items]

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
      <JsonLd data={breadcrumbList(trail, env.NEXT_PUBLIC_SITE_URL)} />
    </nav>
  )
}
