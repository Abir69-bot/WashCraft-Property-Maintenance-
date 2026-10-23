import { ArrowRight, Briefcase, MapPin } from 'lucide-react'
import Link from 'next/link'

import { ApplicationForm } from '@/components/forms/application-form'
import { SampleBadge } from '@/components/sample-badge'
import { routes } from '@/lib/routes'
import { fillTokens } from '@/lib/text'
import type { JobOpening } from '@/payload-types'

import { Section, type SectionTone } from './section'

export const EMPLOYMENT_LABELS: Record<JobOpening['employmentType'], string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  seasonal: 'Seasonal',
}

export const applicationConsent = (company: string) =>
  `${company} may call, text or email me about my application.`

/** Open roles (brief §9.7). With none open, it invites a general application instead. */
export function OpenRoles({ jobs, region }: { jobs: JobOpening[]; region: string }) {
  return (
    <Section id="open-roles" eyebrow="Careers" title="Open roles">
      {jobs.length > 0 ? (
        <ul className="grid gap-4">
          {jobs.map((job) => (
            <li key={job.id}>
              <article className="flex flex-col gap-3 rounded-card border border-border p-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="flex flex-wrap items-center gap-2 text-h3">
                    <Link
                      href={routes.job(job.slug)}
                      className="text-primary no-underline hover:underline"
                    >
                      {job.title}
                    </Link>
                    <SampleBadge show={job.isSample} />
                  </h3>
                  <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-small text-muted">
                    <span className="inline-flex items-center gap-1">
                      <Briefcase aria-hidden className="size-4" />
                      {EMPLOYMENT_LABELS[job.employmentType]}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin aria-hidden className="size-4" />
                      {fillTokens(job.location, { region })}
                    </span>
                    {job.payRange && <span>{job.payRange}</span>}
                  </p>
                  <p className="mt-2 max-w-2xl">{fillTokens(job.summary, { region })}</p>
                </div>
                <p className="inline-flex shrink-0 items-center gap-2 font-semibold text-secondary-strong">
                  View role <ArrowRight aria-hidden className="size-4" />
                </p>
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <p className="max-w-2xl rounded-card bg-surface p-6">
          There are no open roles right now, but we’re always glad to hear from good people. Send us
          your details below and we’ll keep them on file.
        </p>
      )}
    </Section>
  )
}

/** The application form section, shared by /careers and each job page. */
export function ApplySection({
  jobs,
  defaultRole,
  company,
  tone = 'surface',
}: {
  jobs: JobOpening[]
  defaultRole?: string
  company: string
  tone?: SectionTone
}) {
  return (
    <Section
      id="apply"
      tone={tone}
      title="Apply"
      intro="It takes a couple of minutes. A résumé helps but isn’t required."
    >
      <div className="max-w-3xl">
        <ApplicationForm
          roles={jobs.map((job) => ({ value: job.slug, label: job.title }))}
          defaultRole={defaultRole}
          consentLabel={applicationConsent(company)}
        />
      </div>
    </Section>
  )
}
