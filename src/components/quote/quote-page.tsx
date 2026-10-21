import { Breadcrumbs, type Crumb } from '@/components/layout/breadcrumbs'
import { CallLink, TextLink } from '@/components/layout/contact-links'
import { isPlaceholder, type SiteConfig } from '@/config/site'
import { routes } from '@/lib/routes'
import { telHref } from '@/lib/text'

/** Layout for every quote page: heading, the form, and a "prefer to talk?" box. */
export function QuotePage({
  crumb,
  title,
  intro,
  site,
  children,
}: {
  crumb?: Crumb
  title: string
  intro?: React.ReactNode
  site: SiteConfig
  children: React.ReactNode
}) {
  return (
    <>
      <section aria-labelledby="page-heading" className="bg-surface">
        <Breadcrumbs
          items={[{ label: 'Get a quote', href: routes.quote }, ...(crumb ? [crumb] : [])]}
        />
        <div className="container pt-6 pb-10">
          <h1 id="page-heading">{title}</h1>
          {intro && <div className="mt-4 max-w-2xl text-lg text-muted">{intro}</div>}
        </div>
      </section>
      <div className="container grid gap-10 section-y lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0">{children}</div>
        <aside
          aria-labelledby="talk-heading"
          className="self-start rounded-card bg-surface p-6 lg:sticky lg:top-28"
        >
          <h2 id="talk-heading" className="text-h3">
            Prefer to talk?
          </h2>
          {telHref(site.phone) ? (
            <ul className="mt-3 grid gap-2">
              <li>
                <CallLink
                  phone={site.phone}
                  label={`Call ${site.phone}`}
                  className="font-semibold"
                />
              </li>
              <li>
                <TextLink phone={site.phone} label="Send us a text" className="font-semibold" />
              </li>
            </ul>
          ) : (
            <p className="mt-3 text-muted">Our phone number is coming soon.</p>
          )}
          {!isPlaceholder(site.hours) && <p className="mt-3 text-small text-muted">{site.hours}</p>}
          <h3 className="mt-6 text-base">What happens next</h3>
          <ol className="mt-2 grid list-decimal gap-1 pl-5 text-small text-muted">
            <li>We review your request.</li>
            <li>We contact you to confirm the details and price.</li>
            <li>You pick a date that suits you. No payment is taken online.</li>
          </ol>
        </aside>
      </div>
    </>
  )
}
