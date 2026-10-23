import type { Metadata } from 'next'
import Link from 'next/link'

import { ServiceGrid } from '@/components/sections/category-hub'
import { SiteSearch } from '@/components/site-search'
import { Button } from '@/components/ui/button'
import { getPostList, getSolutionList } from '@/lib/data/content'
import { getLayoutData } from '@/lib/data/layout'
import { seasonNow } from '@/lib/data/season'
import { routes } from '@/lib/routes'
import type { SearchEntry } from '@/lib/search'
import { inSeasonNow } from '@/lib/seasons'
import { fillTokens } from '@/lib/text'

export const metadata: Metadata = { title: 'Page not found' }

const PAGES: SearchEntry[] = [
  { title: 'All services', href: routes.services, kind: 'Page', text: 'services list' },
  {
    title: 'Get instant price',
    href: routes.quoteInstant,
    kind: 'Page',
    text: 'quote estimate price cost',
  },
  {
    title: 'Request a custom quote',
    href: routes.quoteCustom,
    kind: 'Page',
    text: 'quote large job',
  },
  {
    title: 'Commercial & HOA',
    href: routes.commercial,
    kind: 'Page',
    text: 'business property manager bid',
  },
  {
    title: 'Maintenance plans',
    href: routes.maintenancePlans,
    kind: 'Page',
    text: 'plans packages subscription',
  },
  { title: 'Service areas', href: routes.areas, kind: 'Page', text: 'cities zip code area' },
  {
    title: 'Before & after',
    href: routes.beforeAndAfter,
    kind: 'Page',
    text: 'photos gallery results',
  },
  { title: 'Reviews', href: routes.reviews, kind: 'Page', text: 'testimonials google rating' },
  { title: 'About us', href: routes.about, kind: 'Page', text: 'company team founder' },
  { title: 'Careers', href: routes.careers, kind: 'Page', text: 'jobs hiring work apply' },
  { title: 'Blog', href: routes.blog, kind: 'Page', text: 'articles tips guides' },
  { title: 'FAQ', href: routes.faq, kind: 'Page', text: 'questions answers help' },
  { title: 'Contact', href: routes.contact, kind: 'Page', text: 'phone email hours address' },
]

/**
 * 404 for site pages (brief §9.7): search, popular services and a quote CTA. Unknown URLs at
 * any depth land here (see [...missing]/page.tsx).
 */
export default async function NotFound() {
  const [layout, posts, solutions] = await Promise.all([
    getLayoutData(),
    getPostList(),
    getSolutionList(),
  ])
  const { active } = seasonNow(layout)
  const region = layout.site.region
  const fill = (text: string) => fillTokens(text, { region })
  const entries: SearchEntry[] = [
    ...layout.services.map((service) => ({
      title: service.title,
      href: routes.service(service.slug),
      kind: 'Service',
      text: fill(service.summary),
    })),
    ...layout.cities.map((city) => ({
      title: city.name,
      href: routes.city(city.slug),
      kind: 'Service area',
      text: city.zipPrefixes?.join(' ') ?? '',
    })),
    ...solutions.map((solution) => ({
      title: fill(solution.title),
      href: routes.solution(solution.slug),
      kind: 'Solution',
      text: fill(solution.problem),
    })),
    ...posts.map((post) => ({
      title: fill(post.title),
      href: routes.post(post.slug),
      kind: 'Article',
      text: fill(post.excerpt),
    })),
    ...PAGES,
  ]

  return (
    <>
      <section aria-labelledby="page-heading" className="bg-surface">
        <div className="container section-y">
          <p className="mb-3 text-small font-semibold tracking-wide text-secondary-strong uppercase">
            Page not found
          </p>
          <h1 id="page-heading">We couldn’t find that page</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            It may have moved, or the address may have a typo. Search for what you need, or try one
            of these.
          </p>
          <div className="mt-8">
            <SiteSearch entries={entries} />
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
        </div>
      </section>
      <ServiceGrid
        id="popular"
        services={inSeasonNow(layout.services, active).slice(0, 6)}
        region={region}
        eyebrow="In season now"
        title="Popular services"
      />
    </>
  )
}
