import { isPlaceholder, type Country, type SiteConfig } from './site'

export type ConfigProblem = { field: string; message: string }

const REQUIRED_TEXT = ['tagline', 'phone', 'email', 'hours', 'region'] as const

const COUNTRY_DEFAULTS: Record<Country, Pick<SiteConfig, 'currency' | 'locale'>> = {
  CA: { currency: 'CAD', locale: 'en-CA' },
  US: { currency: 'USD', locale: 'en-US' },
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

/** Every reason the site is not ready for a production build. Empty means ready. */
export function checkSiteConfig(config: SiteConfig): ConfigProblem[] {
  const problems: ConfigProblem[] = []
  const add = (field: string, message: string) => problems.push({ field, message })

  for (const field of REQUIRED_TEXT) {
    const value = config[field]
    if (isPlaceholder(value) || value.trim() === '') add(field, 'is not set')
  }

  if (isPlaceholder(config.address)) {
    add('address', 'is not set (use null for a service-area business)')
  }

  if (!isPlaceholder(config.phone) && config.phone.replace(/\D/g, '').length < 10) {
    add('phone', 'needs at least 10 digits')
  }

  if (!isPlaceholder(config.email) && !EMAIL.test(config.email)) {
    add('email', 'is not a valid email address')
  }

  for (const field of ['country', 'currency', 'locale'] as const) {
    if (isPlaceholder(config[field])) add(field, 'is not set')
  }

  if (!isPlaceholder(config.country)) {
    const expected = COUNTRY_DEFAULTS[config.country]
    for (const field of ['currency', 'locale'] as const) {
      const value = config[field]
      if (!isPlaceholder(value) && value !== expected[field]) {
        add(field, `should be ${expected[field]} when country is ${config.country}`)
      }
    }
  }

  if (config.serviceAreas.length === 0) add('serviceAreas', 'needs at least one city')
  config.serviceAreas.forEach((city, index) => {
    if (isPlaceholder(city) || city.trim() === '') add(`serviceAreas[${index}]`, 'is not set')
  })

  const urls: [string, string | null][] = [
    ['googleReviewUrl', config.googleReviewUrl],
    ...Object.entries(config.social).map(([network, url]): [string, string | null] => [
      `social.${network}`,
      url,
    ]),
  ]
  for (const [field, url] of urls) {
    if (url !== null && !isHttpsUrl(url)) add(field, 'must be an https:// URL or null')
  }

  const { rating, reviewCount } = config.stats
  if (rating !== null && (rating < 1 || rating > 5)) add('stats.rating', 'must be between 1 and 5')
  if (reviewCount !== null && (!Number.isInteger(reviewCount) || reviewCount < 0)) {
    add('stats.reviewCount', 'must be a whole number')
  }

  const thisYear = new Date().getFullYear()
  if (config.foundedYear !== null && (config.foundedYear < 1900 || config.foundedYear > thisYear)) {
    add('foundedYear', `must be between 1900 and ${thisYear}`)
  }

  return problems
}
