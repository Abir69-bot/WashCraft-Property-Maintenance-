import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

import { JsonLd } from '@/components/json-ld'
import { env } from '@/lib/env'
import { routes } from '@/lib/routes'
import { breadcrumbList } from '@/lib/seo/json-ld'
import { cn } from '@/lib/utils'

export type Crumb = { label: string; href: string }

/** Breadcrumb trail for inner pages, with BreadcrumbList structured data (brief §8, §13). */
export function Breadcrumbs({ items, tone }: { items: Crumb[]; tone?: 'night' }) {
  const trail = [{ label: 'Home', href: routes.home }, ...items]

  return (
    <nav aria-label="Breadcrumb" className="container pt-6 text-small">
      <ol
        className={cn(
          'flex flex-wrap items-center gap-1',
          tone === 'night' ? 'text-night-muted' : 'text-muted',
        )}
      >
        {trail.map((crumb, index) => {
          const current = index === trail.length - 1
          return (
            <li key={crumb.href} className="flex items-center gap-1">
              {index > 0 && <ChevronRight aria-hidden className="size-4" />}
              {current ? (
                <span
                  aria-current="page"
                  className={cn('font-medium', tone === 'night' ? 'text-white' : 'text-ink')}
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className={cn('py-1', tone === 'night' && 'text-white hover:text-cta')}
                >
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
