import { z } from 'zod'

import { e164 } from '@/lib/text'
import { normalizePostalCode } from '@/lib/service-area'

/** Field rules shared by every quote form, in the browser and on the server. */

export const nameField = z
  .string()
  .trim()
  .min(2, 'Enter your name')
  .max(80, 'Use 80 characters or fewer')

export const phoneField = z
  .string()
  .trim()
  .refine((value) => e164(value) !== null, 'Enter a 10-digit phone number')

export const zipField = z
  .string()
  .trim()
  .refine((value) => normalizePostalCode(value) !== null, 'Enter a postal code, e.g. M1B 2K3')

export const optionalEmailField = z.union([z.literal(''), z.email('Enter a valid email address')])
export const emailField = z.email('Enter a valid email address')

export const addressField = z
  .string()
  .trim()
  .min(5, 'Enter the street address')
  .max(200, 'Use 200 characters or fewer')

export const shortText = (max = 200) => z.string().trim().max(max, `Use ${max} characters or fewer`)

export const consentField = z.boolean()

/** Honeypot. Hidden from people; bots that fill it are silently ignored. */
export const honeypotField = z.string()

/** Cloudflare Turnstile token (empty when Turnstile isn't configured). */
export const turnstileField = z.string().max(4096).optional()

export const MAX_FILES = 10

/** Files already uploaded to private storage, referenced by their storage key. */
export const fileRefsField = z
  .array(z.object({ key: z.string().max(200), name: z.string().trim().min(1).max(200) }))
  .max(MAX_FILES, `Add up to ${MAX_FILES} files`)

export type FileRef = z.infer<typeof fileRefsField>[number]

/** Fields every form ends with: who to contact, consent, spam checks. */
export const contactFields = {
  name: nameField,
  phone: phoneField,
  email: optionalEmailField,
  consent: consentField,
  fax: honeypotField,
  turnstile: turnstileField,
}
