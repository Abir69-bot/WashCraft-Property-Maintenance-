import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { CmsImage } from '@/components/cms-image'
import { SampleBadge } from '@/components/sample-badge'
import { routes } from '@/lib/routes'
import { fillTokens } from '@/lib/text'
import type { TeamMember } from '@/payload-types'

import { Section, type SectionTone } from './section'

/** Team grid (brief §9.7, About). Each card links to the person's bio page. */
export function TeamGrid({
  members,
  region,
  title = 'The team',
  tone,
}: {
  members: TeamMember[]
  region: string
  title?: string
  tone?: SectionTone
}) {
  if (members.length === 0) return null
  return (
    <Section id="team" tone={tone} eyebrow="Who you’ll meet" title={title}>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <li key={member.id}>
            <article className="flex h-full flex-col overflow-hidden rounded-card border border-border bg-white">
              <CmsImage
                media={member.photo}
                label={member.photoLabel}
                ratio="4/5"
                sizes="(min-width: 1024px) 380px, (min-width: 480px) 50vw, 100vw"
                className="rounded-none"
              />
              <div className="flex flex-1 flex-col p-6">
                <SampleBadge show={member.isSample} className="mb-2 w-fit" />
                <h3 className="text-h3">
                  <Link
                    href={routes.teamMember(member.slug)}
                    className="text-primary no-underline hover:underline"
                  >
                    {member.name}
                  </Link>
                </h3>
                <p className="font-semibold text-secondary-strong">{member.role}</p>
                <p className="mt-2 text-muted">{fillTokens(member.shortBio, { region })}</p>
                <p className="mt-auto inline-flex items-center gap-2 pt-4 font-semibold text-secondary-strong">
                  Read bio <ArrowRight aria-hidden className="size-4" />
                </p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </Section>
  )
}
