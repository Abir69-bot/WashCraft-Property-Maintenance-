import { Briefcase, Check, DollarSign, MapPin } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { SampleBadge } from '@/components/sample-badge'
import { ApplySection, EMPLOYMENT_LABELS } from '@/components/sections/careers'
import { FinalCta } from '@/components/sections/home-blocks'
import { PageHero } from '@/components/sections/page-hero'
import { Section } from '@/components/sections/section'
import { Button } from '@/components/ui/button'
import { getJobs } from '@/lib/data/content'
import { loadJob } from '@/lib/data/load'
import { routes } from '@/lib/routes'
import { pageMetadata } from '@/lib/seo/metadata'
import { fillTokens } from '@/lib/text'

export async function generateStaticParams() {
  const jobs = await getJobs()
  return jobs.map((job) => ({ slug: job.slug }))
}

const title = (job: string, region: string) => `${job} Jobs in ${region}`

export async function generateMetadata({
  params,
}: PageProps<'/careers/[slug]'>): Promise<Metadata> {
  const { layout, page } = await loadJob((await params).slug)
  if (!page) return {}
  const region = layout.site.region
  return pageMetadata({
    path: routes.job(page.slug),
    title: title(page.title, region),
    description: fillTokens(page.summary, { region }),
    seo: page.meta,
    siteName: layout.site.shortName,
  })
}

function List({ title, items }: { title: string; items: { id?: string | null; text: string }[] }) {
  if (items.length === 0) return null
  return (
    <div>
      <h3>{title}</h3>
      <ul className="mt-4 grid gap-2">
        {items.map((item) => (
          <li key={item.id ?? item.text} className="flex items-start gap-2">
            <Check aria-hidden className="mt-1 size-5 shrink-0 text-success-strong" />
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Job opening (brief §9.7) with the application form, the role already chosen. */
export default async function JobPage({ params }: PageProps<'/careers/[slug]'>) {
  const { layout, page: job } = await loadJob((await params).slug)
  if (!job) notFound()
  const { site } = layout
  const region = site.region
  const jobs = await getJobs()
  const facts = [
    { icon: Briefcase, label: 'Type', value: EMPLOYMENT_LABELS[job.employmentType] },
    { icon: MapPin, label: 'Location', value: fillTokens(job.location, { region }) },
    ...(job.payRange ? [{ icon: DollarSign, label: 'Pay', value: job.payRange }] : []),
  ]

  return (
    <>
      <PageHero
        crumbs={[
          { label: 'Careers', href: routes.careers },
          { label: job.title, href: routes.job(job.slug) },
        ]}
        eyebrow="Open role"
        title={title(job.title, region)}
        intro={fillTokens(job.summary, { region })}
        badge={<SampleBadge show={job.isSample} />}
        actions={
          job.active ? (
            <Button asChild size="lg">
              <Link href="#apply">Apply for this role</Link>
            </Button>
          ) : undefined
        }
      />
      <Section id="role" title="About the role">
        <dl className="grid gap-4 sm:grid-cols-3">
          {facts.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3 rounded-card bg-surface p-4">
              <Icon aria-hidden className="mt-0.5 size-5 shrink-0 text-secondary-strong" />
              <div>
                <dt className="text-small font-semibold text-muted">{label}</dt>
                <dd className="font-semibold text-ink">{value}</dd>
              </div>
            </div>
          ))}
        </dl>
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <List title="What you’ll do" items={job.responsibilities ?? []} />
          <List title="What you need" items={job.requirements ?? []} />
          <List title="Nice to have" items={job.niceToHave ?? []} />
        </div>
      </Section>
      {job.active ? (
        <ApplySection jobs={jobs} defaultRole={job.slug} company={site.shortName} />
      ) : (
        <Section id="apply" tone="surface" title="This role is closed">
          <p>
            We’re not taking applications for this role right now.{' '}
            <Link href={routes.careers}>See our other openings</Link> or send a general application.
          </p>
        </Section>
      )}
      <FinalCta
        region={region}
        title="Looking for a quote instead?"
        text={`Get a price range in minutes for most homes in ${region}.`}
      />
    </>
  )
}
