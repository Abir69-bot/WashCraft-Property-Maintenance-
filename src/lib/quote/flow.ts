import { routes } from '@/lib/routes'
import type { Service } from '@/payload-types'

export type QuoteCta = { href: string; label: string }

type Quotable = Pick<Service, 'slug' | 'quoteMode' | 'dedicatedFlow'> & {
  parentService?: number | Quotable | null
}

/**
 * Where a service's quote button goes (brief §9.3.15, §10). Seasonal services switch to their
 * own flow (snow contract, holiday lights); add-ons use their parent service's flow.
 */
export function quoteCta(service: Quotable): QuoteCta {
  if (service.dedicatedFlow === 'holiday-lights') {
    return { href: routes.quoteHolidayLights, label: 'Book holiday lights' }
  }
  if (service.dedicatedFlow === 'junk-removal') {
    return { href: routes.quoteJunkRemoval, label: 'Get a junk removal quote' }
  }
  const withService = (path: string) => `${path}?service=${encodeURIComponent(service.slug)}`
  switch (service.quoteMode) {
    case 'contract':
      return { href: routes.quoteSnowContract, label: 'Sign up for a snow contract' }
    case 'bid':
      return { href: routes.quoteCommercial, label: 'Request a bid' }
    case 'instant':
    case 'subscription':
      return { href: withService(routes.quoteInstant), label: 'Get instant price' }
    case 'addon':
      if (service.parentService && typeof service.parentService === 'object') {
        return quoteCta(service.parentService)
      }
      return { href: withService(routes.quoteCustom), label: 'Request a quote' }
    default:
      return { href: withService(routes.quoteCustom), label: 'Request a quote' }
  }
}

/** Main quote button on a category hub, by the category's accent (brief §9.2). */
export function categoryCta(tone: string): QuoteCta {
  switch (tone) {
    case 'winter':
      return { href: routes.quoteSnowContract, label: 'Sign up for a snow contract' }
    case 'holiday':
      return { href: routes.quoteHolidayLights, label: 'Book holiday lights' }
    case 'commercial':
      return { href: routes.quoteCommercial, label: 'Request a bid' }
    default:
      return { href: routes.quoteInstant, label: 'Get instant price' }
  }
}
