import type { Metadata } from 'next'
import Link from 'next/link'

import { ServiceGrid } from '@/components/sections/category-hub'
import { Button } from '@/components/ui/button'
import { getLayoutData } from '@/lib/data/layout'
import { seasonNow } from '@/lib/data/season'
import { routes } from '@/lib/routes'
import { inSeasonNow } from '@/lib/seasons'

export const metadata: Metadata = { title: 'Page not found' }

/** 404 for site pages: popular services and a way back (search arrives in Phase 6). */
export default async function NotFound() {
  const layout = await getLayoutData()
  const { active } = seasonNow(layout)

  return (
    <>
      <section aria-labelledby="page-heading" className="bg-surface">
        <div className="container section-y">
          <p className="mb-3 text-small font-semibold tracking-wide text-secondary-strong uppercase">
            Page not found
          </p>
          <h1 id="page-heading">We couldn’t find that page</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            It may have moved, or the address may have a typo. Try one of these instead.
          </p>
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
        </div>
      </section>
      <ServiceGrid
        id="popular"
        services={inSeasonNow(layout.services, active).slice(0, 6)}
        region={layout.site.region}
        eyebrow="In season now"
        title="Popular services"
      />
    </>
  )
}
