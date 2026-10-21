import type { CollectionAfterChangeHook, PayloadHandler } from 'payload'

import { getNotifier } from '@/lib/notify'
import { getSite } from '@/lib/site-settings'
import { privateStore } from '@/lib/storage'
import { e164 } from '@/lib/text'
import type { Lead } from '@/payload-types'

import { createLeadFromBackup } from './create'
import { reviewRequest } from './messages'
import { reimportFailedLeads } from './save'

/** POST /api/leads/reimport — staff re-import leads that were saved to backup storage. */
export const reimportHandler: PayloadHandler = async (req) => {
  if (!req.user) return Response.json({ error: 'Sign in first.' }, { status: 401 })
  const result = await reimportFailedLeads(privateStore(), createLeadFromBackup(req.payload))
  return Response.json(result)
}

/**
 * Feature switch "Review requests" (brief §11): when a lead is first marked won, text and/or
 * email the customer the Google review link, once, and only if they agreed to messages.
 */
export const requestReview: CollectionAfterChangeHook<Lead> = async ({
  doc,
  previousDoc,
  operation,
  req,
  context,
}) => {
  if (
    operation !== 'update' ||
    doc.status !== 'won' ||
    previousDoc?.status === 'won' ||
    doc.reviewRequestedAt ||
    !doc.consent ||
    context.skipReviewRequest
  ) {
    return doc
  }
  const flags = await req.payload.findGlobal({ slug: 'feature-flags', depth: 0, req })
  if (!flags.reviewRequests) return doc
  const site = await getSite(req.payload)
  if (!site.googleReviewUrl) return doc

  const message = reviewRequest(doc, site, site.googleReviewUrl)
  const notifier = getNotifier()
  const phone = e164(doc.phone)
  const results = await Promise.allSettled([
    phone ? notifier.sendSms({ to: phone, body: message.sms }) : Promise.resolve(),
    doc.email ? notifier.sendEmail({ to: [doc.email], ...message.email }) : Promise.resolve(),
  ])
  results
    .filter((result) => result.status === 'rejected')
    .forEach((result) =>
      console.error(`[lead] review request for lead ${doc.id} failed`, result.reason),
    )

  await req.payload.update({
    collection: 'leads',
    id: doc.id,
    data: { reviewRequestedAt: new Date().toISOString() },
    req,
    depth: 0,
    context: { skipReviewRequest: true },
  })
  return doc
}
