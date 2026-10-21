import type { Metadata } from 'next'

import { FinalCta } from '@/components/sections/home-blocks'
import { PageHero, QuoteActions } from '@/components/sections/page-hero'
import { PlanCards, PlanTable } from '@/components/sections/plans'
import { getLayoutData } from '@/lib/data/layout'
import { getPlans } from '@/lib/data/pages'
import { routes } from '@/lib/routes'
import { pageMetadata } from '@/lib/seo/metadata'

const title = (region: string) => `Maintenance Plans in ${region}`
const intro =
  'Pick a plan and we’ll book every visit for you, season after season. Or choose a package for the season ahead.'

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getLayoutData()
  return pageMetadata({
    path: routes.maintenancePlans,
    title: title(site.region),
    description: intro,
    siteName: site.shortName,
  })
}

/** Maintenance plans and seasonal packages, from the Plans collection (brief §9.6). */
export default async function MaintenancePlansPage() {
  const [{ site }, plans] = await Promise.all([getLayoutData(), getPlans()])
  const tiers = plans.filter((plan) => plan.kind === 'tier')
  const packages = plans.filter((plan) => plan.kind === 'package')

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Maintenance plans', href: routes.maintenancePlans }]}
        eyebrow="Plans & packages"
        icon="sparkles"
        title={title(site.region)}
        intro={intro}
        actions={
          <QuoteActions
            cta={{ href: routes.quoteInstant, label: 'Get instant price' }}
            phone={site.phone}
          />
        }
      />
      <PlanCards
        id="plans"
        plans={tiers}
        eyebrow="Year-round plans"
        title="Choose your plan"
        intro="Each plan covers the visits your property needs through the year."
      />
      <PlanTable id="compare-plans" plans={tiers} title="Compare plans" tone="surface" />
      <PlanCards
        id="packages"
        plans={packages}
        eyebrow="Seasonal packages"
        title="Packages for each season"
        intro="One season at a time, for when you don’t need a full plan."
      />
      <PlanTable
        id="compare-packages"
        plans={packages}
        title="Compare seasonal packages"
        tone="surface"
      />
      <FinalCta region={site.region} />
    </>
  )
}
