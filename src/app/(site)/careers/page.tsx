import { Check } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { ApplySection, OpenRoles } from '@/components/sections/careers'
import { FinalCta } from '@/components/sections/home-blocks'
import { PageHero } from '@/components/sections/page-hero'
import { Section } from '@/components/sections/section'
import { getCareersPage, getJobs } from '@/lib/data/content'
import { getLayoutData } from '@/lib/data/layout'
import { generalCta } from '@/lib/quote/flow'
import { routes } from '@/lib/routes'
import { pageMetadata } from '@/lib/seo/metadata'
import { fillTokens } from '@/lib/text'

const title = (company: string, region: string) => `Careers at ${company} in ${region}`

export async function generateMetadata(): Promise<Metadata> {
  const [{ site }, page] = await Promise.all([getLayoutData(), getCareersPage()])
  return pageMetadata({
    path: routes.careers,
    title: title(site.shortName, site.region),
    description: fillTokens(page.intro, { region: site.region }),
    siteName: site.shortName,
  })
}

/** Careers (brief §9.7): why work here, benefits, open roles and the application form. */
export default async function CareersPage() {
  const [{ site, quote }, page, jobs] = await Promise.all([
    getLayoutData(),
    getCareersPage(),
    getJobs(),
  ])
  const region = site.region
  const fill = (text: string) => fillTokens(text, { region })
  const reasons = page.whyWorkHere ?? []
  const benefits = page.benefits ?? []

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Careers', href: routes.careers }]}
        eyebrow="Join the team"
        title={title(site.shortName, region)}
        lead={fill(page.headline)}
        intro={fill(page.intro)}
        actions={
          <>
            <Button asChild size="lg">
              <Link href="#apply">Apply now</Link>
            </Button>
            {jobs.length > 0 && (
              <Button asChild size="lg" variant="outline">
                <Link href="#open-roles">See open roles</Link>
              </Button>
            )}
          </>
        }
      />
      {(reasons.length > 0 || benefits.length > 0) && (
        <Section id="why" eyebrow="Why work here" title="What it’s like to work with us">
          {reasons.length > 0 && (
            <ul className="grid gap-6 md:grid-cols-3">
              {reasons.map((reason) => (
                <li key={reason.id ?? reason.title} className="rounded-card bg-surface p-6">
                  <h3>{reason.title}</h3>
                  <p className="mt-2 text-muted">{fill(reason.body)}</p>
                </li>
              ))}
            </ul>
          )}
          {benefits.length > 0 && (
            <div className="mt-10">
              <h3>Benefits</h3>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <li key={benefit.id ?? benefit.text} className="flex items-start gap-2">
                    <Check aria-hidden className="mt-1 size-5 shrink-0 text-success-strong" />
                    {benefit.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Section>
      )}
      <OpenRoles jobs={jobs} region={region} />
      <ApplySection jobs={jobs} company={site.shortName} />
      <FinalCta
        cta={generalCta(quote)}
        region={region}
        title="Looking for a quote instead?"
        text={`Get a price range in minutes for most homes in ${region}.`}
      />
    </>
  )
}
