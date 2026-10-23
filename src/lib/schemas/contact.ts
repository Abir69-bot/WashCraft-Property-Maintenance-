import { z } from 'zod'

import {
  consentField,
  contactFields,
  emailField,
  fileRefsField,
  honeypotField,
  nameField,
  phoneField,
  shortText,
  turnstileField,
  zipField,
} from './fields'

/** Contact page form (brief §9.7): a lead of type "contact". */
export const contactSchema = z.object({
  ...contactFields,
  zip: z.union([z.literal(''), zipField]),
  message: z
    .string()
    .trim()
    .min(5, 'Tell us how we can help')
    .max(2000, 'Use 2,000 characters or fewer'),
})

export type ContactInput = z.infer<typeof contactSchema>

/** Careers application (brief §9.7). `role` is a job opening's slug, or empty for "any role". */
export const applicationSchema = z.object({
  name: nameField,
  email: emailField,
  phone: phoneField,
  role: shortText(100),
  resume: fileRefsField.max(1, 'Add one file'),
  message: shortText(2000),
  consent: consentField,
  fax: honeypotField,
  turnstile: turnstileField,
})

export type ApplicationInput = z.infer<typeof applicationSchema>
