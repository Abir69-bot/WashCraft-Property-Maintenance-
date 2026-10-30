import type { Metadata } from 'next'

import { FilteredList } from '@/components/filtered-list'
import { SolutionCard } from '@/components/sections/article'
import { FinalCta } from '@/components/sections/home-blocks'
import { PageHero, QuoteActions } from '@/components/sections/page-hero'
import { Section } from '@/components/sections/section'
import { getSolutionList } from '@/lib/data/content'
import { getLayoutData } from '@/lib/data/layout'
import { generalCta } from '@/lib/quote/flow'
import { routes } from '@/lib/routes'
import { pageMetadata } from '@/lib/seo/metadata'

const title = (region: string) => `Common Property Problems in ${region}, and How to Fix Them`
const intro =
  'Streaks on the roof, ice along the gutters, stains on the driveway: what causes them, what you can do yourself and when to call us.'

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getLayoutData()
  return pageMetadata({
    path: routes.solutions,
    title: title(site.region),
    description: intro,
    siteName: site.shortName,
  })
}

const serviceCategory = (service: unknown) =>
  service && typeof service === 'object' && 'category' in service ? service.category : null

/** Problem-and-fix pages, filtered by the categories of their related services (brief §9.7). */
export default async function SolutionsPage() {
  const [{ site, categories, quote }, solutions] = await Promise.all([
    getLayoutData(),
    getSolutionList(),
  ])
  const region = site.region

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Solutions', href: routes.solutions }]}
        eyebrow="Solutions"
        title={title(region)}
        intro={intro}
        actions={<QuoteActions cta={generalCta(quote)} phone={site.phone} />}
      />
      <Section id="problems" title="Find your problem">
        {solutions.length > 0 ? (
          <FilteredList
            label="Filter by service type"
            noun={['solution', 'solutions']}
            options={categories.map((category) => ({
              value: String(category.id),
              label: category.title,
            }))}
            items={solutions.map((solution) => ({
              key: solution.slug,
              tags: [
                ...new Set(
                  (solution.relatedServices ?? []).map((service) =>
                    String(serviceCategory(service)),
                  ),
                ),
              ],
            }))}
            cards={Object.fromEntries(
              solutions.map((solution) => [
                solution.slug,
                <SolutionCard key={solution.slug} solution={solution} region={region} />,
              ]),
            )}
            listClassName="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          />
        ) : (
          <p className="rounded-card bg-surface p-6">New guides are on the way. Check back soon.</p>
        )}
      </Section>
      <FinalCta region={region} cta={generalCta(quote)} />
    </>
  )
}
