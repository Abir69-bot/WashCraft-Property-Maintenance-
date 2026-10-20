import { z } from 'zod'

/**
 * Data-driven quote questions (brief §10.3). Each instant service stores a JSON array of these;
 * the wizard renders them and the pricing engine reads the answers by `id`. Adding a service
 * needs no code changes.
 */

const base = {
  id: z.string().regex(/^[a-z][a-z0-9_]*$/, 'ids use lowercase letters, numbers and underscores'),
  label: z.string().trim().min(1),
  helpText: z.string().trim().min(1).optional(),
  required: z.boolean().optional(),
}

const selectQuestion = z.object({
  ...base,
  type: z.literal('select'),
  options: z.array(z.string().trim().min(1)).min(2, 'a select needs at least two options'),
})

const numberQuestion = z
  .object({
    ...base,
    type: z.literal('number'),
    min: z.number().optional(),
    max: z.number().optional(),
    /** Shown after the input, e.g. "sq ft". */
    unit: z.string().trim().min(1).optional(),
  })
  .refine((q) => q.min === undefined || q.max === undefined || q.min <= q.max, {
    message: 'min must not be greater than max',
  })

const booleanQuestion = z.object({ ...base, type: z.literal('boolean') })

export const quoteQuestionSchema = z.discriminatedUnion('type', [
  selectQuestion,
  numberQuestion,
  booleanQuestion,
])

export const quoteQuestionsSchema = z.array(quoteQuestionSchema).superRefine((questions, ctx) => {
  const seen = new Set<string>()
  questions.forEach((question, index) => {
    if (seen.has(question.id)) {
      ctx.addIssue({
        code: 'custom',
        path: [index, 'id'],
        message: `duplicate id "${question.id}"`,
      })
    }
    seen.add(question.id)
  })
})

export type QuoteQuestion = z.infer<typeof quoteQuestionSchema>

/** Payload `validate` for the JSON field: true, or a readable error message. */
export function validateQuoteQuestions(value: unknown): true | string {
  const result = quoteQuestionsSchema.safeParse(value ?? [])
  if (result.success) return true
  return result.error.issues
    .map((issue) => `Question ${issue.path.join('.')}: ${issue.message}`)
    .join('; ')
}
