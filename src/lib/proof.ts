import { sampleProof, type SiteConfig } from '@/config/site'
import { isProductionSite } from '@/lib/env'

/**
 * The rating and guarantee as pages show them: the real values (Google or Site settings), or in
 * development and preview the sample ones, flagged so a "Sample" badge goes next to them. On the
 * live site both stay hidden until the owner provides the real thing (brief §3.2, §3.3).
 */
export function shownRating(site: Pick<SiteConfig, 'stats'>, production = isProductionSite) {
  const { rating, reviewCount } = site.stats
  if (rating && reviewCount) return { rating, reviewCount, sample: false }
  if (production) return null
  return { rating: sampleProof.rating, reviewCount: sampleProof.reviewCount, sample: true }
}

export function shownGuarantee(site: Pick<SiteConfig, 'guarantee'>, production = isProductionSite) {
  if (site.guarantee) return { text: site.guarantee, sample: false }
  return production ? null : { text: sampleProof.guarantee, sample: true }
}

export type ShownGuarantee = ReturnType<typeof shownGuarantee>
