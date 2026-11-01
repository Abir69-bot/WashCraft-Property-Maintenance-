import type { SiteConfig } from '@/config/site'

/** Proof points shown in heroes, each only when backed by site settings (brief §3.3). */
export function proofPoints(site: SiteConfig) {
  return [
    site.insuranceCoverage && 'Insured',
    site.workersCompRegistration && 'Workers’ comp covered',
    site.foundedYear && `Serving since ${site.foundedYear}`,
    site.responseTimePromise && `Replies ${site.responseTimePromise}`,
  ].filter(Boolean) as string[]
}
