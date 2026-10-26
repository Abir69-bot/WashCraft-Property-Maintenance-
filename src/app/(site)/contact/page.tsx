import { Clock, Mail, MapPin } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { ContactForm } from '@/components/forms/contact-form'
import { CallLink, TextLink } from '@/components/layout/contact-links'
import { TrustStrip } from '@/components/sections/home-blocks'
import { PageHero, QuoteActions } from '@/components/sections/page-hero'
import { Section } from '@/components/sections/section'
import { ServiceAreaMap } from '@/components/sections/service-area-map'
import { ZipChecker } from '@/components/sections/zip-checker'
import { SiteValue } from '@/components/ui/todo-chip'
import { consentText } from '@/config/consent'
import { getLayoutData } from '@/lib/data/layout'
import { routes } from '@/lib/routes'
import { pageMetadata } from '@/lib/seo/metadata'

const title = (company: string) => `Contact ${company}`
const intro = (region: string) =>
  `Questions about a job, a quote or our service area? Call, text, email or send us a message. We serve homes and businesses across ${region}.`

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getLayoutData()
  return pageMetadata({
    path: routes.contact,
    title: title(site.shortName),
    description: intro(site.region),
    siteName: site.shortName,
  })
}

const rowClass = 'flex items-start gap-3'
const iconClass = 'mt-1 size-5 shrink-0 text-secondary-strong'

/** Contact (brief §9.7): form, phone, text, email, hours, address, map and postal code checker. */
export default async function ContactPage() {
  const { site, cities } = await getLayoutData()

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Contact', href: routes.contact }]}
        eyebrow="Contact"
        title={title(site.shortName)}
        intro={intro(site.region)}
        actions={
          <QuoteActions
            cta={{ href: routes.quoteInstant, label: 'Get instant price' }}
            phone={site.phone}
          />
        }
      />

      <Section id="message" title="Send us a message">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div>
            <p className="mb-8 max-w-2xl text-muted">
              Looking for a price? The <Link href={routes.quoteInstant}>instant price form</Link> is
              the quickest way.
            </p>
            <ContactForm consentLabel={consentText(site.country, site.shortName)} />
          </div>
          <aside aria-labelledby="details-heading" className="grid content-start gap-6">
            <div className="rounded-card bg-surface p-6">
              <h3 id="details-heading">Reach us directly</h3>
              <ul className="mt-4 grid gap-4 text-ink">
                <li className={rowClass}>
                  <CallLink
                    phone={site.phone}
                    label={`Call ${site.phone}`}
                    className="font-semibold"
                  />
                </li>
                <li className={rowClass}>
                  <TextLink
                    phone={site.phone}
                    label={`Text ${site.phone}`}
                    className="font-semibold"
                  />
                </li>
                <li className={rowClass}>
                  <Mail aria-hidden className={iconClass} />
                  <a
                    href={`mailto:${site.email}`}
                    data-track="email_click"
                    className="font-semibold"
                  >
                    <SiteValue value={site.email} label="email" />
                  </a>
                </li>
                <li className={rowClass}>
                  <Clock aria-hidden className={iconClass} />
                  <span>
                    <span className="block font-semibold">Hours</span>
                    <SiteValue value={site.hours} label="hours" />
                  </span>
                </li>
                <li className={rowClass}>
                  <MapPin aria-hidden className={iconClass} />
                  <span>
                    {site.address ? (
                      <>
                        <span className="block font-semibold">Address</span>
                        <SiteValue value={site.address} label="address" />
                      </>
                    ) : (
                      <>
                        We come to you across <SiteValue value={site.region} label="region" />
                      </>
                    )}
                  </span>
                </li>
              </ul>
            </div>
            <ZipChecker cities={cities} />
          </aside>
        </div>
      </Section>

      {cities.length > 0 && (
        <Section id="service-area" tone="surface" title="Where we work">
          <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
            <ul className="grid content-start gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {cities.map((city) => (
                <li key={city.id}>
                  <Link
                    href={routes.city(city.slug)}
                    className="flex min-h-11 items-center gap-2 font-semibold no-underline hover:underline"
                  >
                    <MapPin aria-hidden className="size-4 shrink-0 text-secondary-strong" />
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
            <ServiceAreaMap cities={cities.map(({ name, lat, lng }) => ({ name, lat, lng }))} />
          </div>
        </Section>
      )}

      <TrustStrip site={site} />
    </>
  )
}
