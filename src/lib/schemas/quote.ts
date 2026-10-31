import { z } from 'zod'

import { FREQUENCIES } from '@/config/catalog'
import {
  BID_FREQUENCIES,
  COMMERCIAL_PROPERTY_TYPES,
  HOLIDAY_STYLES,
  INSTALL_WINDOWS,
  JUNK_ACCESS,
  JUNK_LOADS,
  REMOVAL_WINDOWS,
  RESIDENTIAL_PROPERTY_TYPES,
  SNOW_ADD_ONS,
  TIMELINES,
} from '@/config/quote'

import {
  addressField,
  contactFields,
  emailField,
  eitherContact,
  fileRefsField,
  shortText,
  zipField,
} from './fields'

/**
 * Schemas for the quote flows (brief §10.2, §10.5), shared by each form and its server action.
 * Answers to a service's own questions are checked separately with `answersSchema`, because
 * they come from the CMS.
 */

const values = <T extends readonly { value: string }[]>(items: T) =>
  items.map((item) => item.value) as unknown as [T[number]['value'], ...T[number]['value'][]]

export const answerValue = z.union([z.string().max(200), z.number(), z.boolean(), z.null()])
export const answersMap = z.record(z.string().max(60), answerValue)
export type AnswersInput = z.infer<typeof answersMap>

const residential = z.enum(values(RESIDENTIAL_PROPERTY_TYPES), { error: 'Choose a property type' })
const optionalDate = z.union([
  z.literal(''),
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a date'),
])
const choose = <T extends readonly [string, ...string[]]>(options: T, message: string) =>
  z.enum(options, { error: message })

const contact = {
  ...contactFields,
  address: addressField,
  zip: zipField,
}

export const instantQuoteSchema = z.object({
  propertyType: residential,
  services: z.array(z.string().max(100)).min(1, 'Choose at least one service').max(12),
  /** Answers per service slug. */
  answers: z.record(z.string().max(100), answersMap),
  frequency: z.enum(FREQUENCIES),
  /** A maintenance plan picked on /maintenance-plans. */
  plan: z.number().int().positive().nullable(),
  preferredDates: shortText(200),
  notes: shortText(2000),
  ...contact,
})
export type InstantQuoteInput = z.infer<typeof instantQuoteSchema>

export const quoteUpdateSchema = z.object({
  leadId: z.number().int().positive(),
  token: z.string().min(10).max(200),
  action: z.enum(['book', 'callback']),
})

export const snowContractSchema = z.object({
  propertyType: residential,
  answers: answersMap,
  addOns: z.array(z.enum(SNOW_ADD_ONS)).max(SNOW_ADD_ONS.length),
  trigger: z.string().trim().min(1, 'Choose when we should come out').max(60),
  billing: choose(['seasonal', 'per-visit'], 'Choose how you’d like to pay'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a start date'),
  notes: shortText(2000),
  ...contact,
})
export type SnowContractInput = z.infer<typeof snowContractSchema>

export const holidayLightsSchema = z
  .object({
    answers: answersMap,
    rooflineUnknown: z.boolean(),
    homeSize: z.string().max(60),
    /** Typed text; a whole number from 0 to 50. */
    railings: z
      .string()
      .trim()
      .refine(
        (value) => /^\d{1,2}$/.test(value) && Number(value) <= 50,
        'Enter a number from 0 to 50',
      ),
    style: choose(HOLIDAY_STYLES, 'Choose a style'),
    installWindow: choose(INSTALL_WINDOWS, 'Choose when to install'),
    removal: z.boolean(),
    removalWindow: z.union([z.literal(''), z.enum(REMOVAL_WINDOWS)]),
    storage: z.boolean(),
    notes: shortText(2000),
    ...contact,
  })
  .superRefine((form, ctx) => {
    if (form.rooflineUnknown && !form.homeSize) {
      ctx.addIssue({ code: 'custom', path: ['homeSize'], message: 'Choose the home size' })
    }
    if (form.removal && !form.removalWindow) {
      ctx.addIssue({
        code: 'custom',
        path: ['removalWindow'],
        message: 'Choose when to take them down',
      })
    }
  })
export type HolidayLightsInput = z.infer<typeof holidayLightsSchema>

export const junkRemovalSchema = z.object({
  description: z.string().trim().min(10, 'Tell us what needs to go').max(2000),
  photos: fileRefsField,
  load: choose(JUNK_LOADS, 'Choose about how much there is'),
  access: choose(JUNK_ACCESS, 'Choose where the items are'),
  stairs: z.boolean(),
  preferredDate: optionalDate,
  ...contact,
})
export type JunkRemovalInput = z.infer<typeof junkRemovalSchema>

/** Shown in the service list for jobs that don't match a listed service. */
export const OTHER_SERVICE = 'other'

/**
 * The quote request form (brief §7 of the 2026-10 update): the service, the job, optional
 * photos, and a way to reach the visitor (phone or email) and find the property (street address
 * or postal code).
 */
export const quoteRequestSchema = eitherContact(
  z.object({
    services: z
      .array(z.string().max(100))
      .min(1, 'Choose the service you need, or “Something else”')
      .max(30),
    description: z
      .string()
      .trim()
      .min(10, 'Tell us a little about the job (at least 10 characters)')
      .max(3000, 'Use 3,000 characters or fewer'),
    photos: fileRefsField,
    timeline: choose(TIMELINES, 'Choose when you’d like the work done'),
    ...contactFields,
    phone: z.union([z.literal(''), contactFields.phone]),
    address: z.union([z.literal(''), addressField]),
    zip: z.union([z.literal(''), zipField]),
  }),
)
export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>

export const commercialBidSchema = z.object({
  company: z.string().trim().min(2, 'Enter the company or HOA name').max(120),
  role: shortText(80),
  propertyType: z.enum(values(COMMERCIAL_PROPERTY_TYPES), { error: 'Choose a property type' }),
  /** Typed text; units or square feet, converted on the server. */
  size: z
    .string()
    .trim()
    .refine((value) => value === '' || /^\d{1,9}$/.test(value.replace(/,/g, '')), 'Enter a number'),
  sizeUnit: z.enum(['units', 'sq ft']),
  services: z.array(z.string().max(100)).min(1, 'Choose at least one service').max(30),
  frequency: choose(BID_FREQUENCIES, 'Choose how often'),
  insuranceCertificate: z.boolean(),
  files: fileRefsField,
  walkthroughDate: optionalDate,
  notes: shortText(4000),
  ...contact,
  email: emailField,
})
export type CommercialBidInput = z.infer<typeof commercialBidSchema>

/** One file the browser wants to upload. */
export const uploadRequestSchema = z.object({
  name: z.string().trim().min(1).max(200),
  type: z.string().max(100),
  size: z.number().int(),
  kind: z.enum(['photo', 'document']),
})

/** An uploaded file to check right after upload. */
export const uploadCheckSchema = z.object({
  key: z.string().max(200),
  kind: z.enum(['photo', 'document']),
})
