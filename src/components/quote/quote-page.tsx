import { Lock, Mail } from 'lucide-react'
import Link from 'next/link'

import { Breadcrumbs, type Crumb } from '@/components/layout/breadcrumbs'
import { CallLink, TextLink } from '@/components/layout/contact-links'
import { HowItWorks } from '@/components/sections/home-blocks'
import { isPlaceholder, type SiteConfig } from '@/config/site'
import { routes } from '@/lib/routes'
import { telHref } from '@/lib/text'
import type { Homepage } from '@/payload-types'

/**
 * Layout for every quote page: heading, the form, a "prefer to talk?" box (only with confirmed
 * contact details), what happens to the visitor's details, and how quoting works.
 */
export function QuotePage({
  crumb,
  title,
  intro,
  site,
  steps,
  children,
}: {
  crumb?: Crumb
  title: string
  intro?: React.ReactNode
  site: SiteConfig
  /** The quote process (Home page → How it works), shown under the form. */
  steps?: Homepage['howItWorks']
  children: React.ReactNode
}) {
  const phone = telHref(site.phone) ? site.phone : null
  const email = isPlaceholder(site.email) ? null : site.email
  const hours = isPlaceholder(site.hours) ? null : site.hours

  return (
    <>
      <section aria-labelledby="page-heading" className="hero-surface">
        <Breadcrumbs
          items={[{ label: 'Request a quote', href: routes.quote }, ...(crumb ? [crumb] : [])]}
        />
        <div className="container pt-6 pb-10">
          <h1 id="page-heading">{title}</h1>
          {intro && <div className="mt-4 max-w-2xl text-lg text-muted">{intro}</div>}
        </div>
      </section>
      <div className="container grid gap-10 section-y lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 card-raised p-5 sm:p-8">{children}</div>
        <aside className="grid content-start gap-5 self-start lg:sticky lg:top-28">
          {(phone || email) && (
            <section aria-labelledby="talk-heading" className="card-raised p-6">
              <h2 id="talk-heading" className="text-h3">
                Prefer to talk?
              </h2>
              <ul className="mt-3 grid gap-2">
                {phone && (
                  <li>
                    <CallLink phone={phone} label={`Call ${phone}`} className="font-semibold" />
                  </li>
                )}
                {phone && (
                  <li>
                    <TextLink phone={phone} label="Send us a text" className="font-semibold" />
                  </li>
                )}
                {email && (
                  <li>
                    <a
                      href={`mailto:${email}`}
                      data-track="email_click"
                      className="inline-flex items-center gap-2 font-semibold break-all"
                    >
                      <Mail aria-hidden className="size-4 shrink-0" />
                      {email}
                    </a>
                  </li>
                )}
              </ul>
              {hours && <p className="mt-3 text-small text-muted">{hours}</p>}
            </section>
          )}
          <section aria-labelledby="privacy-heading" className="rounded-card bg-surface p-6">
            <h2 id="privacy-heading" className="flex items-center gap-2 text-base">
              <Lock aria-hidden className="size-4 text-secondary-strong" />
              Your details and photos
            </h2>
            <p className="mt-2 text-small text-muted">
              We use what you send only to review your request, prepare your estimate and contact
              you about it. Photos go to private storage that only WashCraft staff can open; they
              are never posted on the website or shared. We don’t sell your information. Read our{' '}
              <Link href={routes.privacy}>privacy policy</Link>.
            </p>
          </section>
        </aside>
      </div>
      {steps && steps.length > 0 && <HowItWorks steps={steps} tone="surface" />}
    </>
  )
}
