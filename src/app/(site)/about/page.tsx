import { BadgeCheck, FileText, HeartHandshake } from 'lucide-react'
import type { Metadata } from 'next'

import { CmsImage } from '@/components/cms-image'
import { credentials } from '@/components/sections/commercial-blocks'
import { FinalCta, Founder, TrustStrip } from '@/components/sections/home-blocks'
import { PageHero, QuoteActions } from '@/components/sections/page-hero'
import { Section } from '@/components/sections/section'
import { TeamGrid } from '@/components/sections/team'
import { getAboutPage, getTeam } from '@/lib/data/content'
import { getLayoutData } from '@/lib/data/layout'
import { generalCta } from '@/lib/quote/flow'
import { routes } from '@/lib/routes'
import { pageMetadata } from '@/lib/seo/metadata'
import { fillTokens } from '@/lib/text'
import { asMedia, mediaSrc } from '@/lib/view'

const title = (company: string) => `About ${company}`

export async function generateMetadata(): Promise<Metadata> {
  const [{ site }, about] = await Promise.all([getLayoutData(), getAboutPage()])
  return pageMetadata({
    path: routes.about,
    title: title(site.shortName),
    description: fillTokens(about.intro, { region: site.region }),
    image: asMedia(about.heroImage),
    siteName: site.shortName,
  })
}

const paragraphs = (text: string) => text.split(/\n\s*\n/).filter((part) => part.trim())

/**
 * About (brief §9.7): story, mission and values, founder, team, credentials with downloadable
 * certificates, and community involvement. Sections without real content are left out.
 */
export default async function AboutPage() {
  const [{ site, quote }, about, team] = await Promise.all([
    getLayoutData(),
    getAboutPage(),
    getTeam(),
  ])
  const region = site.region
  const fill = (text: string) => fillTokens(text, { region })
  const founder = team.find((member) => member.isFounder) ?? null
  const proof = credentials(site)
  const certificates = (about.certificates ?? []).flatMap((certificate) => {
    const file = asMedia(certificate.file)
    return file ? [{ id: certificate.id ?? file.id, title: certificate.title, file }] : []
  })

  return (
    <>
      <PageHero
        crumbs={[{ label: 'About', href: routes.about }]}
        eyebrow="About us"
        title={title(site.shortName)}
        lead={fill(about.headline)}
        intro={fill(about.intro)}
        actions={<QuoteActions cta={generalCta(quote)} phone={site.phone} />}
        aside={
          <CmsImage
            media={about.heroImage}
            label={about.heroImageLabel}
            ratio="4/3"
            sizes="(min-width: 1024px) 560px, 100vw"
            priority
          />
        }
      />

      {about.story && (
        <Section id="story" title="Our story">
          <div className="grid max-w-[70ch] gap-4 text-lg">
            {paragraphs(fill(about.story)).map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </Section>
      )}

      {(about.mission || (about.values ?? []).length > 0) && (
        <Section id="values" tone="surface" eyebrow="What we stand for" title="Mission and values">
          {about.mission && (
            <p className="max-w-3xl text-h3 font-heading text-primary">{fill(about.mission)}</p>
          )}
          {(about.values ?? []).length > 0 && (
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {(about.values ?? []).map((value) => (
                <li key={value.id ?? value.title} className="rounded-card bg-white p-6">
                  <h3 className="flex items-start gap-2">
                    <BadgeCheck aria-hidden className="mt-1 size-5 shrink-0 text-success-strong" />
                    {value.title}
                  </h3>
                  <p className="mt-2 text-muted">{fill(value.body)}</p>
                </li>
              ))}
            </ul>
          )}
        </Section>
      )}

      <Founder founder={founder} region={region} />
      <TeamGrid
        members={team.filter((member) => member.id !== founder?.id)}
        region={region}
        tone="surface"
      />

      {(proof.length > 0 || certificates.length > 0) && (
        <Section id="credentials" eyebrow="Paperwork" title="Our credentials">
          {proof.length > 0 && (
            <ul className="grid gap-3 sm:grid-cols-2">
              {proof.map((item) => (
                <li key={item} className="flex items-center gap-2 font-semibold text-ink">
                  <BadgeCheck aria-hidden className="size-5 shrink-0 text-success-strong" />
                  {item}
                </li>
              ))}
            </ul>
          )}
          {certificates.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-3">
              {certificates.map((certificate) => (
                <li key={certificate.id}>
                  <a
                    href={mediaSrc(certificate.file)}
                    download
                    className="inline-flex min-h-11 items-center gap-2 rounded-card border border-border px-4 font-semibold no-underline hover:border-primary"
                  >
                    <FileText aria-hidden className="size-5 text-secondary-strong" />
                    {certificate.title}
                    <span className="text-small font-normal text-muted">(download)</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Section>
      )}

      {about.community && (
        <Section id="community" tone="surface" eyebrow="In the community" title="Giving back">
          <div className="flex max-w-[70ch] gap-4">
            <HeartHandshake aria-hidden className="size-8 shrink-0 text-secondary-strong" />
            <div className="grid gap-4 text-lg">
              {paragraphs(fill(about.community)).map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          </div>
        </Section>
      )}

      <TrustStrip site={site} />
      <FinalCta region={region} cta={generalCta(quote)} />
    </>
  )
}
