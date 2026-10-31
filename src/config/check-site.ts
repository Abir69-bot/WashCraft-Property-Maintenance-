import { isPlaceholder, type Country, type SiteConfig } from './site'

export type ConfigProblem = { field: string; message: string }

/**
 * Facts the live site can't launch without. Phone and hours are optional: call links and
 * opening hours simply stay hidden until they're confirmed. The email is required because new
 * leads are sent there when no separate alert email is set.
 */
const REQUIRED_TEXT = ['tagline', 'email', 'region'] as const

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

  for (const field of config.demo) {
    add(
      field,
      'is a demo value (confirm or replace it, then remove it from the "Still demo values" list)',
    )
  }

  return problems
}

type Source = Record<string, string | undefined>

const set = (source: Source, ...names: string[]) => names.every((name) => source[name]?.trim())

/**
 * Integrations a production deploy needs (Vercel's disk is read-only, so uploads and lead
 * backups must go to R2, and the owner hears about leads by email), plus recommended ones.
 */
export function checkIntegrations(source: Source): {
  required: ConfigProblem[]
  recommended: ConfigProblem[]
} {
  const required: ConfigProblem[] = []
  const recommended: ConfigProblem[] = []
  const r2Keys = ['R2_ENDPOINT', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY']
  if (!set(source, ...r2Keys, 'R2_PRIVATE_BUCKET')) {
    required.push({
      field: 'R2 private bucket',
      message: 'is needed for customer photos and lead backups',
    })
  }
  if (!set(source, ...r2Keys, 'R2_PUBLIC_BUCKET', 'R2_PUBLIC_URL')) {
    required.push({
      field: 'R2 public bucket',
      message: 'is needed for photos uploaded in the admin',
    })
  }
  if (!set(source, 'RESEND_API_KEY', 'EMAIL_FROM')) {
    required.push({ field: 'Resend email', message: 'is needed to email you new leads' })
  }
  if (!set(source, 'TURNSTILE_SECRET_KEY', 'NEXT_PUBLIC_TURNSTILE_SITE_KEY')) {
    recommended.push({ field: 'Turnstile', message: 'is not set: forms have no spam check' })
  }
  if (!set(source, 'TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_FROM')) {
    recommended.push({ field: 'Twilio', message: 'is not set: no text alerts for new leads' })
  }
  return { required, recommended }
}
