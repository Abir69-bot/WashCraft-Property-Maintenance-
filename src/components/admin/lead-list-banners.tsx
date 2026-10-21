import { Banner } from '@payloadcms/ui'
import type { ServerProps } from 'payload'

import { pendingFailedLeads } from '@/lib/leads/save'
import { privateStore } from '@/lib/storage'

import { pricingToReview } from './lead-dashboard'
import { ReimportButton } from './reimport-button'

/** Above the Leads list: backed-up leads waiting to be re-imported. */
export async function FailedLeadsBanner({ user }: ServerProps) {
  if (!user) return null
  const failed = await pendingFailedLeads(privateStore()).catch(() => [])
  if (!failed.length) return null
  return (
    <Banner type="error">
      {failed.length} lead{failed.length === 1 ? ' was' : 's were'} saved to backup while the
      database was unreachable. <ReimportButton />
    </Banner>
  )
}

/** Above the pricing lists: placeholders still waiting for the owner's numbers. */
export async function PricingReviewBanner({ payload, user }: ServerProps) {
  if (!user) return null
  const toReview = await pricingToReview(payload)
  if (!toReview) return null
  return (
    <Banner type="warning">
      {toReview} price{toReview === 1 ? '' : 's'} (rules, discounts and plans) still use placeholder
      numbers. Check each one and untick “Needs review”; until then the live site shows “Custom
      quote”.
    </Banner>
  )
}
