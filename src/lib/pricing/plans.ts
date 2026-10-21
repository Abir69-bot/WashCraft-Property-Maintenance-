import { isProductionSite } from '@/lib/env'
import type { Plan } from '@/payload-types'

/** "$899 per year", or null ("Custom quote") while the price is a placeholder on the live site. */
export function planPrice(plan: Pick<Plan, 'price' | 'priceUnit' | 'needsReview'>) {
  if (plan.price == null || (plan.needsReview && isProductionSite)) return null
  return `$${plan.price.toLocaleString('en-US')}${plan.priceUnit ? ` ${plan.priceUnit}` : ''}`
}
