import Link from 'next/link'

import { Logo } from '@/components/brand/logo'
import { isPlaceholder } from '@/config/site'
import type { LayoutData } from '@/lib/data/layout'
import { quoteLabel } from '@/lib/quote/flow'
import { categoryHref, routes } from '@/lib/routes'
import { fillTokens } from '@/lib/text'

import { CallLink, TextLink } from './contact-links'
import { CookieSettingsButton } from './cookie-consent'

const headingClass = 'mb-3 font-heading text-base font-bold text-white'
const linkClass =
  'inline-flex items-center gap-2 py-1 text-small text-white/85 no-underline hover:text-white hover:underline'

const SOCIAL_LABELS: Record<string, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  nextdoor: 'Nextdoor',
}

export function Footer({ data, analytics }: { data: LayoutData; analytics: boolean }) {
  const { site, categories, cities, navigation, footer } = data
  const perCategory = footer.servicesPerCategory ?? 5
  const socials = Object.entries(site.social).filter(([, url]) => url)
  const badges = [
    site.insuranceCoverage && `Insured: ${site.insuranceCoverage}`,
    site.workersCompRegistration && `Workers' comp: ${site.workersCompRegistration}`,
    ...site.licenceNumbers.map((number) => `License ${number}`),
  ].filter(Boolean) as string[]

  return (
    <footer className="border-t border-white/10 on-dark">
      <div className="container grid gap-12 py-14 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="grid gap-4">
            <Logo variant="badge" height={120} className="w-auto" />
            <p className="max-w-md text-small text-white/85">
              {fillTokens(footer.blurb, { region: site.region })}
            </p>
            {socials.length > 0 && (
              <ul className="flex flex-wrap gap-4" aria-label="Social media">
                {socials.map(([network, url]) => (
                  <li key={network}>
                    <a href={url!} className={linkClass} rel="me noopener" target="_blank">
                      {SOCIAL_LABELS[network]}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h2 className={headingClass}>Contact</h2>
            {/* Only confirmed details show; unset ones are left out, never shown as stand-ins. */}
            <ul className="grid gap-1 text-small text-white/85">
              <li>
                <CallLink phone={site.phone} className={linkClass} />
              </li>
              <li>
                <TextLink phone={site.phone} className={linkClass} />
              </li>
              {!isPlaceholder(site.email) && (
                <li>
                  <a href={`mailto:${site.email}`} data-track="email_click" className={linkClass}>
                    {site.email}
                  </a>
                </li>
              )}
              {!isPlaceholder(site.hours) && <li className="py-1">{site.hours}</li>}
              <li className="py-1">
                {site.address && !isPlaceholder(site.address)
                  ? site.address
                  : `We come to you in ${site.serviceAreas.join(', ')}.`}
              </li>
              <li>
                <Link href={routes.quote} className={`${linkClass} font-semibold text-white`}>
                  {quoteLabel(data.quote)} →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <nav aria-label="Services" className="grid grid-cols-2 gap-8 md:grid-cols-3 xl:grid-cols-6">
          {categories.map((category) => (
            <div key={category.id}>
              <h2 className={headingClass}>
                <Link
                  href={categoryHref(category)}
                  className="text-white no-underline hover:underline"
                >
                  {category.menuLabel || category.title}
                </Link>
              </h2>
              <ul>
                {category.services.slice(0, perCategory).map((service) => (
                  <li key={service.id}>
                    <Link href={routes.service(service.slug)} className={linkClass}>
                      {service.title}
                    </Link>
                  </li>
                ))}
                {category.services.length > 1 && (
                  <li>
                    <Link
                      href={routes.category(category.slug)}
                      className={`${linkClass} font-semibold text-white`}
                    >
                      All services →
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </nav>

        <div className="grid gap-8 md:grid-cols-3">
          <nav aria-label="Service areas">
            <h2 className={headingClass}>Areas</h2>
            <ul className="grid grid-cols-2 gap-x-4">
              {cities.map((city) => (
                <li key={city.id}>
                  <Link href={routes.city(city.slug)} className={linkClass}>
                    {city.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={routes.areas} className={`${linkClass} font-semibold text-white`}>
                  All areas →
                </Link>
              </li>
            </ul>
          </nav>
          <nav aria-label="Company">
            <h2 className={headingClass}>Company</h2>
            <ul>
              {(navigation.companyLinks ?? [])
                .filter((link) => data.hasGallery || link.href !== routes.beforeAndAfter)
                .map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>
          {badges.length > 0 && (
            <div>
              <h2 className={headingClass}>Credentials</h2>
              <ul className="grid gap-1 text-small text-white/85">
                {badges.map((badge) => (
                  <li key={badge}>{badge}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 border-t border-white/15 pt-6 text-small text-white/75 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {(footer.legalLinks ?? []).map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
            {analytics && (
              <li>
                <CookieSettingsButton className={linkClass} />
              </li>
            )}
          </ul>
        </div>
      </div>
    </footer>
  )
}
