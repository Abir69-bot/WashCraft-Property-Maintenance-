import { MapPin } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { ContactForm } from '@/components/forms/contact-form'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { ContactDetails } from '@/components/sections/contact-details'
import { NIGHT_TEXT, QuoteActions } from '@/components/sections/page-hero'
import { Section } from '@/components/sections/section'
import { ServiceAreaMap } from '@/components/sections/service-area-map'
import { ZipChecker } from '@/components/sections/zip-checker'
import { consentText } from '@/config/consent'
import { getLayoutData } from '@/lib/data/layout'
import { generalCta } from '@/lib/quote/flow'
import { routes } from '@/lib/routes'
import { pageMetadata } from '@/lib/seo/metadata'
import { cn } from '@/lib/utils'

const title = 'Contact Us'
const intro = (region: string) =>
  `Questions about a job, a quote or our service area? Call, email or send us a message. We serve homes and businesses in ${region}.`

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getLayoutData()
  return pageMetadata({
    path: routes.contact,
    title,
    description: intro(site.region),
    siteName: site.shortName,
  })
}

/**
 * Contact (brief §9.7), opening in the night theme: the heading and the quote and call buttons
 * on the left, the business's details on the right. Then the message form, the postal code
 * check and the service areas. Unset details are left out, never shown as stand-ins.
 */
export default async function ContactPage() {
  const { site, cities, quote } = await getLayoutData()
  const cta = generalCta(quote)

  return (
    <>
      <section aria-labelledby="page-heading" className="hero-night">
        <Breadcrumbs items={[{ label: 'Contact', href: routes.contact }]} tone="night" />
        <div className="container grid items-center gap-10 pt-6 pb-12 lg:grid-cols-[1fr_1.1fr] lg:gap-14 lg:pb-16">
          <div className={NIGHT_TEXT}>
            <p className="mb-3 text-small font-semibold tracking-wide text-secondary-on-dark uppercase">
              Get in touch
            </p>
            <h1 id="page-heading" className="display-type display-hero text-white">
              {title}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-night-muted">{intro(site.region)}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <QuoteActions
                cta={cta}
                phone={site.phone}
                label={site.freeQuotes ? 'Get Your Free Quote' : cta.label}
              />
            </div>
          </div>
          <div className={cn(NIGHT_TEXT, 'night-card p-6 motion-safe:animate-slide-in-up sm:p-8')}>
            <h2 className="text-h3 text-white">{site.name}</h2>
            <div className="mt-6">
              <ContactDetails site={site} />
            </div>
          </div>
        </div>
      </section>

      <Section id="message" title="Send us a message">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div>
            <p className="mb-8 max-w-2xl text-muted">
              Need a price for a job? The <Link href={routes.quote}>quote request form</Link> lets
              you pick the service and add photos.
            </p>
            <ContactForm consentLabel={consentText(site.country, site.shortName)} />
          </div>
          <aside aria-label="Check your area" className="grid content-start gap-6">
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
    </>
  )
}
