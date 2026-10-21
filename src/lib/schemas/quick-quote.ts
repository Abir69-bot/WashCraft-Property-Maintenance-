import { z } from 'zod'

import { contactFields, zipField } from './fields'

/** Shared by the quick quote form (browser) and its server action (brief §10.1). */
export const quickQuoteSchema = z.object({
  ...contactFields,
  zip: zipField,
  service: z.string().min(1, 'Choose a service'),
})

export type QuickQuoteInput = z.infer<typeof quickQuoteSchema>

/** Where the visitor came from, attached to every lead (brief §11). */
export const trackingSchema = z.object({
  utm: z
    .object({
      source: z.string().max(100).optional(),
      medium: z.string().max(100).optional(),
      campaign: z.string().max(100).optional(),
      term: z.string().max(100).optional(),
      content: z.string().max(100).optional(),
    })
    .default({}),
  referrer: z.string().max(500).optional(),
  landingPage: z.string().max(500).optional(),
  device: z.enum(['mobile', 'tablet', 'desktop']).optional(),
})

export type Tracking = z.infer<typeof trackingSchema>
