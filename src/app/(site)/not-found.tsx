import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { SiteSearch } from '@/components/site-search'
import { Button } from '@/components/ui/button'
import { getLayoutData } from '@/lib/data/layout'
import { seasonNow } from '@/lib/data/season'
import { routes } from '@/lib/routes'
import { inSeasonNow } from '@/lib/seasons'

export const metadata: Metadata = { title: 'Page not found' }

/**
 * 404 for site pages (brief §9.7): search, popular services and a quote CTA. Unknown URLs at
 * any depth land here (see [...missing]/page.tsx). Next ships this page inside every page's
 * payload, so it stays small: the search index loads only when the search box is used.
 */
export default async function NotFound() {
  const layout = await getLayoutData()
  const { active } = seasonNow(layout)
  const popular = inSeasonNow(layout.services, active).slice(0, 6)

  return (
    <section aria-labelledby="page-heading" className="bg-surface">
      <div className="container section-y">
        <p className="mb-3 text-small font-semibold tracking-wide text-secondary-strong uppercase">
          Page not found
        </p>
        <h1 id="page-heading">We couldn’t find that page</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          It may have moved, or the address may have a typo. Search for what you need, or try one of
          these.
        </p>
        <div className="mt-8">
          <SiteSearch />
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href={routes.quoteInstant}>Get instant price</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href={routes.services}>All services</Link>
          </Button>
          <Button asChild size="lg" variant="ghost">
            <Link href={routes.home}>Home page</Link>
          </Button>
        </div>
        {popular.length > 0 && (
          <nav aria-labelledby="popular-heading" className="mt-12">
            <h2 id="popular-heading" className="text-h3">
              Popular services right now
            </h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {popular.map((service) => (
                <li key={service.id}>
                  <Link
                    href={routes.service(service.slug)}
                    className="flex min-h-11 items-center justify-between gap-2 rounded-card border border-border bg-white px-4 py-3 font-semibold no-underline hover:border-primary"
                  >
                    {service.title}
                    <ArrowRight aria-hidden className="size-4 shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </section>
  )
}
