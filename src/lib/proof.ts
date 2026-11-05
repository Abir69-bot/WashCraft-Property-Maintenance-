import { sampleProof, type SiteConfig } from '@/config/site'
import { isProductionSite } from '@/lib/env'

/**
 * The rating as pages show it: only the real numbers (Google's, synced daily, or Site
 * settings), never a sample, so no page shows an unverified rating (owner, 2026-11-05).
 */
export function shownRating(site: Pick<SiteConfig, 'stats'>) {
  const { rating, reviewCount } = site.stats
  return rating && reviewCount ? { rating, reviewCount } : null
}

/**
 * The guarantee as pages show it: the real one, or in development and preview the sample, flagged
 * so a "Sample" badge goes next to it. On the live site it stays hidden until the owner provides
 * one (brief §3.2, §3.3).
 */

export function shownGuarantee(site: Pick<SiteConfig, 'guarantee'>, production = isProductionSite) {
  if (site.guarantee) return { text: site.guarantee, sample: false }
  return production ? null : { text: sampleProof.guarantee, sample: true }
}

export type ShownGuarantee = ReturnType<typeof shownGuarantee>
