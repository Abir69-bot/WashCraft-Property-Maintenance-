import { Clock, FileText, Mail, MapPin, Navigation, Phone, type LucideIcon } from 'lucide-react'

import { isPlaceholder, type SiteConfig } from '@/config/site'
import { directionsHref, telHref } from '@/lib/text'
import { cn } from '@/lib/utils'

/** `wide` rows (hours, the street address) take the card's full width. */
type Detail = { icon: LucideIcon; label: string; value: React.ReactNode; wide?: boolean }

/**
 * The business's contact details on the night theme: phone, email, hours, address (with Google
 * Maps directions) and service area, each with its icon. Only confirmed details show, never
 * placeholders. `area` names the city a service area page is about. Plain links take the
 * surrounding night text colour (NIGHT_TEXT in page-hero.tsx).
 */
export function ContactDetails({ site, area }: { site: SiteConfig; area?: string }) {
  const tel = telHref(site.phone)
  const address = site.address && !isPlaceholder(site.address) ? site.address : null
  const rows: (Detail | false | null | '')[] = [
    tel && {
      icon: Phone,
      label: 'Phone',
      value: (
        <a href={tel} data-track="call_click">
          {site.phone}
        </a>
      ),
    },
    !isPlaceholder(site.email) && {
      icon: Mail,
      label: 'Email',
      value: (
        <a href={`mailto:${site.email}`} data-track="email_click">
          {site.email}
        </a>
      ),
    },
    !isPlaceholder(site.hours) && { icon: Clock, label: 'Hours', value: site.hours, wide: true },
    address && {
      icon: MapPin,
      label: 'Address',
      wide: true,
      value: (
        <a
          href={directionsHref(address)}
          target="_blank"
          rel="noopener"
          data-track="directions_click"
        >
          {address}
          <span className="sr-only"> (directions in Google Maps, opens in a new tab)</span>
        </a>
      ),
    },
    {
      icon: Navigation,
      label: 'Service area',
      value: area ? `We come to you anywhere in ${area}` : site.region,
    },
    site.freeQuotes && { icon: FileText, label: 'Quotes', value: 'Free written estimates' },
  ]
  const details = rows.filter((detail): detail is Detail => Boolean(detail))

  return (
    <dl className="grid gap-5 sm:grid-cols-2">
      {details.map(({ icon: Icon, label, value, wide }) => (
        // The icon sits inside <dt>: a <dl> group may hold only <dt> and <dd>.
        <div key={label} className={cn('relative min-h-10 pl-13', wide && 'sm:col-span-2')}>
          <dt className="text-small text-night-muted">
            <span className="absolute top-0 left-0 grid size-10 place-items-center rounded-full bg-white/10 text-cta">
              <Icon aria-hidden className="size-5" />
            </span>
            {label}
          </dt>
          <dd className="font-semibold [overflow-wrap:anywhere] text-white">{value}</dd>
        </div>
      ))}
    </dl>
  )
}
