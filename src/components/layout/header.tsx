import { Phone } from 'lucide-react'
import Link from 'next/link'

import { Logo } from '@/components/brand/logo'
import { Button } from '@/components/ui/button'
import type { LayoutData } from '@/lib/data/layout'
import { routes } from '@/lib/routes'
import { smsHref, telHref } from '@/lib/text'

import { HeaderShell } from './header-shell'
import { MainNav, type FeaturedCard, type NavLink } from './main-nav'
import { MobileMenu } from './mobile-menu'

export function Header({ data, featured }: { data: LayoutData; featured: FeaturedCard | null }) {
  const { site, categories, cities, navigation } = data
  const cta = navigation.headerCta ?? { label: 'Get instant price', href: routes.quoteInstant }
  const areaLinks: NavLink[] = cities.map((city) => ({
    label: city.name,
    href: routes.city(city.slug),
  }))
  const companyLinks = navigation.companyLinks ?? []
  const commercialLinks = navigation.commercialLinks ?? []
  const callHref = telHref(site.phone)

  return (
    <HeaderShell>
      <div className="relative container flex items-center gap-4 py-2 transition-[padding] group-data-[scrolled]:py-1">
        <Link
          href={routes.home}
          aria-label="WashCraft Property Maintenance, home"
          className="shrink-0"
        >
          <Logo
            variant="horizontal"
            height={56}
            priority
            className="h-12 w-auto transition-[height] group-data-[scrolled]:h-11 sm:h-14"
          />
        </Link>
        <MainNav
          categories={categories}
          commercialLinks={commercialLinks}
          areaLinks={areaLinks}
          companyLinks={companyLinks}
          featured={featured}
        />
        <div className="ml-auto flex items-center gap-2">
          {callHref && (
            <a
              href={callHref}
              data-track="call_click"
              className="hidden min-h-11 items-center gap-2 px-3 font-semibold text-primary no-underline xl:inline-flex"
            >
              <Phone aria-hidden className="size-4" />
              {site.phone}
            </a>
          )}
          <Button asChild className="hidden sm:inline-flex">
            <Link href={cta.href}>{cta.label}</Link>
          </Button>
          <MobileMenu
            categories={categories}
            areaLinks={areaLinks}
            companyLinks={companyLinks}
            commercialLinks={commercialLinks}
            cta={cta}
            callHref={callHref}
            textHref={smsHref(site.phone)}
          />
        </div>
      </div>
    </HeaderShell>
  )
}
