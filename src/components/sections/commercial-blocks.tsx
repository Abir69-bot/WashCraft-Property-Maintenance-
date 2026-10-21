import { ArrowRight, Building2, FileCheck2 } from 'lucide-react'
import Link from 'next/link'

import { CmsImage } from '@/components/cms-image'
import { SampleBadge } from '@/components/sample-badge'
import type { SiteConfig } from '@/config/site'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils'
import { fillTokens } from '@/lib/text'
import type { CaseStudy, CommercialPage, Service } from '@/payload-types'

import { Section } from './section'

/** Credentials from Site settings only (brief §3.3, §9.5). Empty until the owner sets them. */
export function credentials(site: SiteConfig): string[] {
  return [
    site.insuranceCoverage && `Liability insurance: ${site.insuranceCoverage}`,
    site.insuranceCoverage && 'Certificates of insurance on request',
    site.workersCompRegistration && `Workers’ comp: ${site.workersCompRegistration}`,
    ...site.licenceNumbers.map((number) => `License ${number}`),
  ].filter(Boolean) as string[]
}

/** Why managers work with us, plus the insurance and compliance block (brief §9.5). */
export function ManagerPoints({
  points,
  site,
}: {
  points: CommercialPage['points']
  site: SiteConfig
}) {
  const proof = credentials(site)
  if (!points?.length && proof.length === 0) return null
  return (
    <Section
      id="why-managers"
      tone="dark"
      eyebrow="For property managers"
      title="Why managers and boards work with us"
    >
      <div className={cn('grid gap-10', proof.length > 0 && 'lg:grid-cols-[1.5fr_1fr]')}>
        <ul className={cn('grid gap-6 sm:grid-cols-2', proof.length === 0 && 'lg:grid-cols-4')}>
          {(points ?? []).map((point) => (
            <li key={point.id ?? point.title}>
              <h3 className="flex items-center gap-2 text-white">
                <Building2 aria-hidden className="size-5 shrink-0 text-secondary-on-dark" />
                {point.title}
              </h3>
              <p className="mt-2 text-white/90">
                {fillTokens(point.body, { region: site.region })}
              </p>
            </li>
          ))}
        </ul>
        {proof.length > 0 && (
          <div className="rounded-card border border-white/20 p-6">
            <h3 className="flex items-center gap-2 text-white">
              <FileCheck2 aria-hidden className="size-5 text-secondary-on-dark" />
              Insurance and compliance
            </h3>
            <ul className="mt-4 grid gap-2 text-white/90">
              {proof.map((item) => (
                <li key={item}>✓ {item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Section>
  )
}

/** Link card from the commercial hub to the HOA & condo page. */
export function HoaCard({ hoa, region }: { hoa: CommercialPage['hoa']; region: string }) {
  return (
    <Section id="hoa">
      <Link
        href={routes.hoa}
        className="group grid items-center gap-6 rounded-card border border-border bg-surface p-6 no-underline md:grid-cols-[1fr_auto] md:p-10"
      >
        <span>
          <span className="block text-small font-semibold tracking-wide text-secondary-strong uppercase">
            HOA & condo boards
          </span>
          <span className="mt-2 block text-h3 font-heading font-bold text-primary group-hover:underline">
            {fillTokens(hoa.headline, { region })}
          </span>
          <span className="mt-2 block text-muted">{fillTokens(hoa.intro, { region })}</span>
        </span>
        <span className="inline-flex items-center gap-2 font-semibold text-secondary-strong">
          HOA & condo services <ArrowRight aria-hidden className="size-4" />
        </span>
      </Link>
    </Section>
  )
}

const PROPERTY_TYPES: Record<string, string> = {
  hoa: 'HOA',
  retail: 'Retail',
  office: 'Office',
  industrial: 'Industrial',
  'parking-garage': 'Parking garage',
  'multi-site': 'Multi-site',
}

/** Commercial case studies; samples never show on the live site (brief §9.5). */
export function CaseStudies({ items }: { items: CaseStudy[] }) {
  if (items.length === 0) return null
  return (
    <Section id="case-studies" tone="surface" eyebrow="Case studies" title="Recent projects">
      <ul className="grid gap-6 md:grid-cols-2">
        {items.map((study) => {
          const services = (study.services ?? []).filter(
            (service): service is Service => typeof service === 'object',
          )
          return (
            <li key={study.id} className="overflow-hidden rounded-card bg-white">
              <CmsImage
                media={study.image}
                label={study.imageLabel}
                ratio="16/9"
                sizes="(min-width: 768px) 50vw, 100vw"
                className="rounded-none"
              />
              <div className="p-6">
                <p className="flex items-center gap-2 text-small font-semibold text-secondary-strong">
                  {[study.client, study.propertyType && PROPERTY_TYPES[study.propertyType]]
                    .filter(Boolean)
                    .join(' · ')}
                  <SampleBadge show={study.isSample} />
                </p>
                <h3 className="mt-2">{study.title}</h3>
                <p className="mt-3 text-muted">
                  <strong className="text-ink">Challenge:</strong> {study.challenge}
                </p>
                <p className="mt-2 text-muted">
                  <strong className="text-ink">What we did:</strong> {study.solution}
                </p>
                {(study.results ?? []).length > 0 && (
                  <ul className="mt-3 grid gap-1">
                    {study.results!.map((result) => (
                      <li key={result.id ?? result.result}>✓ {result.result}</li>
                    ))}
                  </ul>
                )}
                {services.length > 0 && (
                  <p className="mt-4 text-small">
                    {services.map((service, index) => (
                      <span key={service.id}>
                        {index > 0 && ' · '}
                        <Link href={routes.service(service.slug)}>{service.title}</Link>
                      </span>
                    ))}
                  </p>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
