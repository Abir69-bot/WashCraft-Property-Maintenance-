import { z } from 'zod'

import { normalizeZip } from '@/lib/service-area'

/** Shared by the quick quote form (browser) and its server action (brief §10.1). */
export const quickQuoteSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name').max(80, 'Use 80 characters or fewer'),
  phone: z
    .string()
    .trim()
    .refine((value) => {
      const digits = value.replace(/\D/g, '')
      return digits.length === 10 || (digits.length === 11 && digits.startsWith('1'))
    }, 'Enter a 10-digit phone number'),
  zip: z
    .string()
    .trim()
    .refine((value) => normalizeZip(value) !== null, 'Enter a 5-digit ZIP code'),
  service: z.string().min(1, 'Choose a service'),
  email: z.union([z.literal(''), z.email('Enter a valid email address')]),
  consent: z.boolean(),
  /** Honeypot. Hidden from people; bots that fill it are silently ignored. */
  fax: z.string(),
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
