'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useId, useState, useTransition } from 'react'
import { useForm, type Resolver } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FormField } from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import { NativeSelect } from '@/components/ui/native-select'
import { track } from '@/lib/analytics'
import { submitQuickQuote } from '@/lib/leads/actions'
import { routes } from '@/lib/routes'
import type { QuickQuoteInput } from '@/lib/schemas/quick-quote'
import { collectTracking, rememberLandingPage } from '@/lib/tracking'
import { cn } from '@/lib/utils'

import { applyServerErrors, FormAlert, Honeypot } from './fields'
import { Turnstile } from './turnstile'

export type ServiceGroup = { label: string; options: { value: string; label: string }[] }

/**
 * The shared Zod schema, loaded with the first check instead of with the page: this form sits
 * on most pages, and Zod is the biggest part of its code.
 */
const resolver: Resolver<QuickQuoteInput> = async (values, context, options) => {
  const [{ zodResolver }, { quickQuoteSchema }] = await Promise.all([
    import('@hookform/resolvers/zod'),
    import('@/lib/schemas/quick-quote'),
  ])
  return zodResolver(quickQuoteSchema)(values, context, options)
}

/**
 * The short quote form (brief §10.1), reused in the home strip, service and city pages and the
 * slide-in. On success it goes to the thank-you page.
 */
export function QuickQuoteForm({
  groups,
  consentLabel,
  defaultService = '',
  layout = 'stacked',
}: {
  groups: ServiceGroup[]
  consentLabel: string
  defaultService?: string
  layout?: 'stacked' | 'wide'
}) {
  const id = useId()
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)
  const [challenge, setChallenge] = useState(0)
  const form = useForm<QuickQuoteInput>({
    resolver,
    defaultValues: {
      name: '',
      phone: '',
      zip: '',
      service: defaultService,
      email: '',
      consent: false,
      fax: '',
      turnstile: '',
    },
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  useEffect(rememberLandingPage, [])

  const onSubmit = handleSubmit((values) => {
    setServerError(null)
    startTransition(async () => {
      const result = await submitQuickQuote(values, collectTracking())
      if (result.ok) {
        track('quick_form_submit', { service: values.service })
        router.push(`${routes.quoteThankYou}?type=quick`)
        return
      }
      setServerError(result.message)
      applyServerErrors(form, result.fieldErrors)
      setChallenge((count) => count + 1)
    })
  })

  const field = (name: keyof QuickQuoteInput) => `${id}-${name}`
  const wide = layout === 'wide'

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={pending} className="grid gap-4">
      <div className={cn('grid gap-4', wide && 'md:grid-cols-2 xl:grid-cols-4')}>
        <FormField id={field('name')} label="Name" error={errors.name?.message}>
          {(control) => <Input {...control} {...register('name')} autoComplete="name" />}
        </FormField>
        <FormField id={field('phone')} label="Phone" error={errors.phone?.message}>
          {(control) => (
            <Input
              {...control}
              {...register('phone')}
              type="tel"
              autoComplete="tel"
              inputMode="tel"
            />
          )}
        </FormField>
        <FormField id={field('zip')} label="ZIP code" error={errors.zip?.message}>
          {(control) => (
            <Input
              {...control}
              {...register('zip')}
              autoComplete="postal-code"
              inputMode="numeric"
              maxLength={10}
            />
          )}
        </FormField>
        <FormField id={field('service')} label="Service" error={errors.service?.message}>
          {(control) => (
            <NativeSelect {...control} {...register('service')}>
              <option value="">Choose a service</option>
              {groups.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </NativeSelect>
          )}
        </FormField>
      </div>
      <div className={cn('grid gap-4', wide && 'md:grid-cols-[1fr_auto] md:items-end')}>
        <FormField id={field('email')} label="Email" optional error={errors.email?.message}>
          {(control) => (
            <Input {...control} {...register('email')} type="email" autoComplete="email" />
          )}
        </FormField>
        <Button type="submit" size="lg" disabled={pending} className="w-full md:w-auto">
          {pending ? 'Sending…' : 'Get my quote'}
        </Button>
      </div>
      <Checkbox id={field('consent')} {...register('consent')} label={consentLabel} />
      <Turnstile key={challenge} onToken={(token) => form.setValue('turnstile', token)} />
      <Honeypot form={form} />
      <FormAlert message={serverError} />
    </form>
  )
}
