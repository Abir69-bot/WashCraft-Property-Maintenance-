'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CircleCheck } from 'lucide-react'
import { useEffect, useId, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FormField } from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import { NativeSelect } from '@/components/ui/native-select'
import { submitQuickQuote } from '@/lib/leads/quick-quote'
import { quickQuoteSchema, type QuickQuoteInput } from '@/lib/schemas/quick-quote'
import { collectTracking, rememberLandingPage } from '@/lib/tracking'
import { cn } from '@/lib/utils'

export type ServiceGroup = { label: string; options: { value: string; label: string }[] }

/** The short quote form (brief §10.1), reused in the hero strip, service and city pages. */
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
  const [pending, startTransition] = useTransition()
  const [sent, setSent] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<QuickQuoteInput>({
    resolver: zodResolver(quickQuoteSchema),
    defaultValues: {
      name: '',
      phone: '',
      zip: '',
      service: defaultService,
      email: '',
      consent: false,
      fax: '',
    },
  })

  useEffect(rememberLandingPage, [])

  const onSubmit = handleSubmit((values) => {
    setServerError(null)
    startTransition(async () => {
      const result = await submitQuickQuote(values, collectTracking())
      if (result.ok) {
        setSent(true)
        return
      }
      setServerError(result.message)
      for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
        setError(field as keyof QuickQuoteInput, { message })
      }
    })
  })

  if (sent) {
    return (
      <div role="status" className="flex items-start gap-3 rounded-card bg-white p-6 text-ink">
        <CircleCheck aria-hidden className="mt-0.5 size-6 shrink-0 text-success-strong" />
        <div>
          <p className="font-heading text-lg font-bold text-primary">Thanks, we’ve got it.</p>
          <p className="mt-1 text-muted">
            We’ll be in touch about your quote. Need us sooner? Call or text.
          </p>
        </div>
      </div>
    )
  }

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
      {/* Honeypot: hidden from people and screen readers. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={field('fax')}>Leave this empty</label>
        <input id={field('fax')} tabIndex={-1} autoComplete="off" {...register('fax')} />
      </div>
      {serverError && (
        <p role="alert" className="font-medium text-error">
          {serverError}
        </p>
      )}
    </form>
  )
}
