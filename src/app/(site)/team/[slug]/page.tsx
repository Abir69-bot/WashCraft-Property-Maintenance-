import { Check } from 'lucide-react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { CmsImage } from '@/components/cms-image'
import { SampleBadge } from '@/components/sample-badge'
import { FinalCta } from '@/components/sections/home-blocks'
import { PageHero, QuoteActions } from '@/components/sections/page-hero'
import { Section } from '@/components/sections/section'
import { getTeam } from '@/lib/data/content'
import { loadTeamMember } from '@/lib/data/load'
import { routes } from '@/lib/routes'
import { pageMetadata } from '@/lib/seo/metadata'
import { fillTokens } from '@/lib/text'
import { asMedia } from '@/lib/view'

export async function generateStaticParams() {
  const team = await getTeam()
  return team.map((member) => ({ slug: member.slug }))
}

const title = (name: string, role: string) => `${name}, ${role}`

export async function generateMetadata({ params }: PageProps<'/team/[slug]'>): Promise<Metadata> {
  const { layout, page } = await loadTeamMember((await params).slug)
  if (!page) return {}
  return pageMetadata({
    path: routes.teamMember(page.slug),
    title: title(page.name, page.role),
    description: fillTokens(page.shortBio, { region: layout.site.region }),
    seo: page.meta,
    image: asMedia(page.photo),
    siteName: layout.site.shortName,
  })
}

/** Team bio page (brief §9.7): photo, role, bio, specialities and a quote CTA. */
export default async function TeamMemberPage({ params }: PageProps<'/team/[slug]'>) {
  const { layout, page: member } = await loadTeamMember((await params).slug)
  if (!member) notFound()
  const { site } = layout
  const region = site.region
  const paragraphs = fillTokens(member.bio, { region })
    .split(/\n\s*\n/)
    .filter((part) => part.trim())

  return (
    <>
      <PageHero
        crumbs={[
          { label: 'About', href: routes.about },
          { label: member.name, href: routes.teamMember(member.slug) },
        ]}
        eyebrow={member.isFounder ? 'Founder' : 'Our team'}
        title={title(member.name, member.role)}
        intro={fillTokens(member.shortBio, { region })}
        badge={<SampleBadge show={member.isSample} />}
        actions={
          <QuoteActions
            cta={{ href: routes.quoteInstant, label: 'Get instant price' }}
            phone={site.phone}
          />
        }
        aside={
          <CmsImage
            media={member.photo}
            label={member.photoLabel}
            ratio="4/5"
            sizes="(min-width: 1024px) 480px, 100vw"
            priority
            className="lg:max-w-md"
          />
        }
      />
      <Section id="bio" title={`About ${member.name.split(' ')[0]}`}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="grid max-w-[70ch] gap-4 text-lg">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
          {(member.specialities ?? []).length > 0 && (
            <div className="self-start rounded-card bg-surface p-6">
              <h3>Specialities</h3>
              <ul className="mt-3 grid gap-2">
                {(member.specialities ?? []).map((item) => (
                  <li key={item.id ?? item.text} className="flex items-start gap-2">
                    <Check aria-hidden className="mt-1 size-5 shrink-0 text-success-strong" />
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Section>
      <FinalCta region={region} />
    </>
  )
}
