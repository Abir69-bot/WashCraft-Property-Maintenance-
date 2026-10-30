import { Clock, MapPin } from 'lucide-react'
import Link from 'next/link'

import { isPlaceholder, type SiteConfig } from '@/config/site'
import { routes } from '@/lib/routes'

import { CallLink, TextLink } from './contact-links'

const linkClass = 'py-1 font-medium text-ink no-underline hover:text-primary hover:underline'

export function UtilityBar({ site }: { site: SiteConfig }) {
  return (
    <div className="hidden border-b border-border bg-surface text-small md:block">
      <div className="container flex min-h-10 items-center justify-between gap-6">
        <p className="flex items-center gap-2 text-muted">
          <MapPin aria-hidden className="size-4 text-secondary-strong" />
          <span>Serving {site.region}</span>
          <span aria-hidden>·</span>
          <Link href={routes.areas} className={linkClass}>
            Areas we serve
          </Link>
        </p>
        <div className="flex items-center gap-5">
          {!isPlaceholder(site.hours) && (
            <span className="hidden items-center gap-2 text-muted lg:flex">
              <Clock aria-hidden className="size-4 text-secondary-strong" />
              {site.hours}
            </span>
          )}
          <CallLink phone={site.phone} className={linkClass} />
          <TextLink phone={site.phone} className={linkClass} />
        </div>
      </div>
    </div>
  )
}
