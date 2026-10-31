'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef, useState, useTransition } from 'react'
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
  // Blocks a second send while one is in flight (double clicks, Enter pressed twice) and after
  // success, while the browser moves to the thank-you page.
  const sending = useRef(false)

  useEffect(rememberLandingPage, [])

  function send(values: T) {
    if (sending.current) return
    if (uploading) {
      setServerError('Please wait for your files to finish uploading.')
      return
    }
    if (check && !check(values, form)) return
    setServerError(null)
    sending.current = true
    startTransition(async () => {
      let result: FormResult<R>
      try {
        result = await submit(values, collectTracking())
      } catch {
        // Network error or the server didn't answer: nothing was confirmed, so say so.
        result = {
          ok: false,
          message:
            'We couldn’t reach our server, so your request was not sent. Check your connection and try again.',
        }
      }
      if (result.ok) return onSuccess(result, values)
      sending.current = false
      setServerError(result.message)
      applyServerErrors(form, result.fieldErrors)
      setChallenge((count) => count + 1)
    })
  }

  // handleSubmit is only called from the submit event, so `send` never runs during render.
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (sending.current) {
      event.preventDefault()
      return
    }
    void form.handleSubmit(send)(event)
  }

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
