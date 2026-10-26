'use client'

import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'

import { answersSchema, type QuoteQuestion } from '@/lib/quote/questions'

/**
 * Kept apart from fields.tsx: it needs Zod, and the quick quote form (on most pages) uses those
 * fields without wanting Zod in its first download.
 */
/** Checks answers to a service's CMS questions, marking and focusing the first problem. */
export function checkAnswers<T extends FieldValues>(
  form: UseFormReturn<T>,
  questions: QuoteQuestion[],
  values: unknown,
  prefix: string,
): boolean {
  const result = answersSchema(questions).safeParse(values ?? {})
  if (result.success) return true
  const names = result.error.issues.map((issue) => `${prefix}.${issue.path.join('.')}` as Path<T>)
  result.error.issues.forEach((issue, index) =>
    form.setError(names[index], { message: issue.message }),
  )
  form.setFocus(names[0])
  return false
}
