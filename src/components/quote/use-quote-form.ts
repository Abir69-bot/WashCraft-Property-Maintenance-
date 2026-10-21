'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState, useTransition } from 'react'
import { useForm, type DefaultValues, type FieldValues, type UseFormReturn } from 'react-hook-form'
import type { z } from 'zod'

import type { FormResult } from '@/lib/leads/types'
import type { Tracking } from '@/lib/schemas/quick-quote'
import { collectTracking, rememberLandingPage } from '@/lib/tracking'

import { applyServerErrors } from './fields'

/**
 * The submit cycle every quote form shares: validate in the browser, wait for uploads, call the
 * server action, show its field errors, and get a fresh Turnstile token after a failure.
 */
export function useQuoteForm<T extends FieldValues, R extends object>({
  schema,
  defaultValues,
  submit,
  onSuccess,
  check,
}: {
  schema: z.ZodType<T, T>
  defaultValues: DefaultValues<T>
  submit: (values: T, tracking: Tracking) => Promise<FormResult<R>>
  onSuccess: (result: { ok: true } & R, values: T) => void
  /** Extra checks before sending (e.g. a service's CMS questions). Return false to stop. */
  check?: (values: T, form: UseFormReturn<T>) => boolean
}) {
  const form = useForm<T>({ resolver: zodResolver(schema), defaultValues })
  const [pending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)
  const [challenge, setChallenge] = useState(0)
  const [uploading, setUploading] = useState(false)

  useEffect(rememberLandingPage, [])

  const onSubmit = form.handleSubmit((values) => {
    if (uploading) {
      setServerError('Please wait for your files to finish uploading.')
      return
    }
    if (check && !check(values, form)) return
    setServerError(null)
    startTransition(async () => {
      const result = await submit(values, collectTracking())
      if (result.ok) return onSuccess(result, values)
      setServerError(result.message)
      applyServerErrors(form, result.fieldErrors)
      setChallenge((count) => count + 1)
    })
  })

  return {
    form,
    onSubmit,
    pending,
    serverError,
    /** Change as the Turnstile `key` to get a fresh token after a failed send. */
    challenge,
    setUploading,
  }
}
