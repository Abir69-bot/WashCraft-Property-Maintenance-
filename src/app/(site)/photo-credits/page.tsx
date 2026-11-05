import type { Metadata } from 'next'
import Link from 'next/link'

import { areaPhotos } from '@/assets/area-photos'
import { beforeAfterExamples } from '@/assets/before-after'
import { stockPhotos } from '@/assets/photos'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { CreditLine } from '@/components/photo-credits'
import { getLayoutData } from '@/lib/data/layout'
import { routes } from '@/lib/routes'
import { pageMetadata } from '@/lib/seo/metadata'

const TITLE = 'Photo Credits'

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getLayoutData()
  return pageMetadata({
    path: routes.photoCredits,
    title: TITLE,
    description:
      'The photographers, sources and licenses for the licensed photos on this website, and the changes we made to them.',
    siteName: site.shortName,
  })
}

/**
 * Attribution for every licensed photo on the site, as their Creative Commons licenses require
 * (linked from the footer). Service area pages show their photos without a caption, so this is
 * where they are credited. A document page like the legal ones: no quote CTA.
 */
export default async function PhotoCreditsPage() {
  const { cities, services } = await getLayoutData()
  const areas = Object.entries(areaPhotos).flatMap(([slug, photo]) => {
    const city = cities.find((item) => item.slug === slug)
    return city ? [{ slug, name: city.name, photo }] : []
  })
  const stock = [...new Set(Object.values(stockPhotos))]
  const serviceNames = new Map(services.map((service) => [service.slug, service.title]))
  const beforeAfter = Object.entries(beforeAfterExamples).flatMap(([service, { credit }]) =>
    credit ? [{ service, credit }] : [],
  )

  return (
    <article aria-labelledby="page-heading">
      <div className="bg-surface">
        <Breadcrumbs items={[{ label: TITLE, href: routes.photoCredits }]} />
        <header className="container pt-6 pb-10">
          <h1 id="page-heading">{TITLE}</h1>
          <p className="mt-3 max-w-2xl text-muted">
            Some photos on this website are used under Creative Commons and similar licenses. Each
            one is listed here with its photographer, source and license. We cropped and resized
            them to fit the page.
          </p>
        </header>
      </div>
      <div className="container grid gap-12 section-y">
        <section aria-labelledby="area-photos">
          <h2 id="area-photos">Service area photos</h2>
          <ul className="mt-6 grid gap-4">
            {areas.map(({ slug, name, photo }) => (
              <li key={slug} className="rounded-card border border-border bg-card p-5">
                <h3 className="text-body font-semibold">
                  <Link href={routes.city(slug)} className="text-ink underline">
                    {name}
                  </Link>
                </h3>
                <p className="mt-1 text-muted">{photo.place}</p>
                <p className="mt-2">
                  <CreditLine credit={photo.credit} />
                </p>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="before-after-photos">
          <h2 id="before-after-photos">Before and after examples</h2>
          <p className="mt-3 max-w-2xl text-muted">
            Example pairs on our service pages. They show other companies’ jobs, not ours.
          </p>
          <ul className="mt-6 grid gap-2">
            {beforeAfter.map(({ service, credit }) => (
              <li key={credit.source}>
                <Link href={routes.service(service)} className="text-ink underline">
                  {serviceNames.get(service) ?? service}
                </Link>
                : <CreditLine credit={credit} />
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="stock-photos">
          <h2 id="stock-photos">Other photos</h2>
          <p className="mt-3 max-w-2xl text-muted">
            Photos that show a kind of work on our home and service pages. They are not photos of
            our own jobs.
          </p>
          <ul className="mt-6 grid gap-2">
            {stock.map(({ credit }) => (
              <li key={credit.source}>
                <CreditLine credit={credit} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  )
}
