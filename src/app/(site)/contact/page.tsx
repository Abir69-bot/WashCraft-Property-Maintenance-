import { ArrowRight, Clock, FileText, Mail, MapPin } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { ContactForm } from '@/components/forms/contact-form'
import { CallLink, TextLink } from '@/components/layout/contact-links'
import { TrustStrip } from '@/components/sections/home-blocks'
import { PageHero, QuoteActions } from '@/components/sections/page-hero'
import { Section } from '@/components/sections/section'
import { ServiceAreaMap } from '@/components/sections/service-area-map'
import { ZipChecker } from '@/components/sections/zip-checker'
import { Button } from '@/components/ui/button'
import { consentText } from '@/config/consent'
import { isPlaceholder } from '@/config/site'
import { getLayoutData } from '@/lib/data/layout'
import { generalCta, quoteLabel } from '@/lib/quote/flow'
import { routes } from '@/lib/routes'
import { pageMetadata } from '@/lib/seo/metadata'
import { telHref } from '@/lib/text'

const title = (company: string) => `Contact ${company}`
const intro = (region: string) =>
  `Questions about a job, a quote or our service area? Send us a message or a quote request. We serve homes and businesses in ${region}.`

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

/**
 * Contact (brief §9.7): the quote request route, a message form, the confirmed ways to reach
 * the business, and the service areas. Unset contact details are left out, never shown as
 * stand-ins.
 */
export default async function ContactPage() {
  const { site, cities, quote } = await getLayoutData()
  const phone = telHref(site.phone) ? site.phone : null
  const email = isPlaceholder(site.email) ? null : site.email
  const hours = isPlaceholder(site.hours) ? null : site.hours

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Contact', href: routes.contact }]}
        eyebrow="Contact"
        title={title(site.shortName)}
        intro={intro(site.region)}
        actions={<QuoteActions cta={generalCta(quote)} phone={site.phone} />}
      />

      <Section id="message" title="Send us a message">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div>
            <p className="mb-8 max-w-2xl text-muted">
              Need a price for a job? The <Link href={routes.quote}>quote request form</Link> lets
              you pick the service and add photos.
            </p>
            <ContactForm consentLabel={consentText(site.country, site.shortName)} />
          </div>
          <aside aria-labelledby="details-heading" className="grid content-start gap-6">
            <div className="card-raised p-6">
              <h3 id="details-heading">
                {phone || email ? 'Reach us directly' : 'Get a written estimate'}
              </h3>
              <ul className="mt-4 grid gap-4 text-ink">
                {phone && (
                  <li className={rowClass}>
                    <CallLink phone={phone} label={`Call ${phone}`} className="font-semibold" />
                  </li>
                )}
                {phone && (
                  <li className={rowClass}>
                    <TextLink phone={phone} label={`Text ${phone}`} className="font-semibold" />
                  </li>
                )}
                {email && (
                  <li className={rowClass}>
                    <Mail aria-hidden className={iconClass} />
                    <a
                      href={`mailto:${email}`}
                      data-track="email_click"
                      className="font-semibold break-all"
                    >
                      {email}
                    </a>
                  </li>
                )}
                {hours && (
                  <li className={rowClass}>
                    <Clock aria-hidden className={iconClass} />
                    <span>
                      <span className="block font-semibold">Hours</span>
                      {hours}
                    </span>
                  </li>
                )}
                <li className={rowClass}>
                  <MapPin aria-hidden className={iconClass} />
                  <span>
                    {site.address && !isPlaceholder(site.address) ? (
                      <>
                        <span className="block font-semibold">Address</span>
                        {site.address}
                      </>
                    ) : (
                      `We come to you in ${site.serviceAreas.join(', ')}.`
                    )}
                  </span>
                </li>
                <li className={rowClass}>
                  <FileText aria-hidden className={iconClass} />
                  <span>
                    Every quote is a written estimate with the scope, exclusions, price and
                    conditions.
                  </span>
                </li>
              </ul>
              <Button asChild className="mt-6 w-full">
                <Link href={routes.quote}>
                  {quoteLabel(quote)} <ArrowRight aria-hidden />
                </Link>
              </Button>
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
