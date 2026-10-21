'use client'

import { Building2, CalendarClock } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useWatch, type Path } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { RESIDENTIAL_PROPERTY_TYPES } from '@/config/quote'
import { track } from '@/lib/analytics'
import { submitSnowContract } from '@/lib/leads/actions'
import type { QuoteReceipt } from '@/lib/leads/types'
import type { QuoteQuestion } from '@/lib/quote/questions'
import { routes } from '@/lib/routes'
import { snowContractSchema, type SnowContractInput } from '@/lib/schemas/quote'

import { EstimateResult } from '../estimate-result'
import {
  checkAnswers,
  CheckboxGroupField,
  ContactSection,
  FormAlert,
  FormSection,
  Honeypot,
  QuestionField,
  RadioGroupField,
  TextAreaField,
  TextField,
} from '../fields'
import { Turnstile } from '../turnstile'
import { useQuoteForm } from '../use-quote-form'

/** Snow contract sign-up (brief §10.5). Commercial properties go to the bid form. */
export function SnowContractForm({
  questions,
  addOns,
  triggers,
  deadline,
  routesRemaining,
  paymentNote,
  consentLabel,
}: {
  questions: QuoteQuestion[]
  addOns: { slug: string; title: string }[]
  triggers: string[]
  deadline: string | null
  routesRemaining: number | null
  paymentNote: string | null
  consentLabel: string
}) {
  const router = useRouter()
  const [receipt, setReceipt] = useState<QuoteReceipt | null>(null)
  const { form, onSubmit, pending, serverError, challenge } = useQuoteForm<
    SnowContractInput,
    QuoteReceipt
  >({
    schema: snowContractSchema,
    defaultValues: {
      propertyType: '' as SnowContractInput['propertyType'],
      answers: {},
      addOns: [],
      trigger: '',
      billing: 'seasonal',
      startDate: '',
      notes: '',
      name: '',
      phone: '',
      email: '',
      address: '',
      zip: '',
      consent: false,
      fax: '',
      turnstile: '',
    },
    check: (values, current) => checkAnswers(current, questions, values.answers, 'answers'),
    submit: submitSnowContract,
    onSuccess: (result) => {
      track('snow_contract_submit', { billing: form.getValues('billing') })
      if (result.estimate) setReceipt(result)
      else router.push(`${routes.quoteThankYou}?type=snow_contract`)
    },
  })
  const propertyType = useWatch({ control: form.control, name: 'propertyType' }) as string

  if (receipt) {
    return <EstimateResult receipt={receipt} type="snow_contract" title="Your seasonal estimate" />
  }

  const today = new Date().toISOString().slice(0, 10)
  return (
    <form onSubmit={onSubmit} noValidate aria-busy={pending} className="grid gap-10">
      {(deadline || routesRemaining !== null) && (
        <p className="flex items-start gap-3 rounded-card bg-surface p-4 font-semibold text-ink">
          <CalendarClock aria-hidden className="mt-0.5 size-5 shrink-0 text-secondary-strong" />
          <span>
            {deadline && `Sign up by ${deadline}.`}{' '}
            {routesRemaining !== null &&
              `${routesRemaining} route${routesRemaining === 1 ? '' : 's'} left this season.`}
          </span>
        </p>
      )}

      <FormSection title="Your property">
        <RadioGroupField
          form={form}
          name="propertyType"
          legend="Property type"
          options={[
            ...RESIDENTIAL_PROPERTY_TYPES,
            { value: 'commercial', label: 'Commercial or HOA' },
          ]}
        />
        {propertyType === 'commercial' && (
          <p role="status" className="flex items-start gap-3 rounded-card bg-surface p-4">
            <Building2 aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
            <span>
              Commercial and HOA snow contracts are quoted after a site visit.{' '}
              <Link href={routes.quoteCommercial}>Request a commercial bid</Link>.
            </span>
          </p>
        )}
        <div className="grid gap-4 md:grid-cols-2">
          {questions.map((question) => (
            <QuestionField
              key={question.id}
              form={form}
              name={`answers.${question.id}` as Path<SnowContractInput>}
              question={question}
            />
          ))}
        </div>
      </FormSection>

      <FormSection title="Your contract">
        {addOns.length > 0 && (
          <CheckboxGroupField
            form={form}
            name="addOns"
            legend="Add-ons"
            options={addOns.map((addOn) => ({ value: addOn.slug, label: addOn.title }))}
            columns={3}
          />
        )}
        <RadioGroupField
          form={form}
          name="trigger"
          legend="Come out when snowfall reaches"
          options={triggers}
          columns={3}
        />
        <RadioGroupField
          form={form}
          name="billing"
          legend="How you’d like to pay"
          options={[
            { value: 'seasonal', label: 'Seasonal flat rate (see an estimate next)' },
            { value: 'per-visit', label: 'Per visit' },
          ]}
        />
        <TextField form={form} name="startDate" label="Start date" type="date" min={today} />
        <p className="text-small text-muted">
          {paymentNote ?? 'We confirm the payment schedule with your contract.'} No payment is taken
          online.
        </p>
      </FormSection>

      <ContactSection form={form} consentLabel={consentLabel} />
      <TextAreaField form={form} name="notes" label="Anything we should know?" rows={3} optional />
      <Turnstile key={challenge} onToken={(token) => form.setValue('turnstile', token)} />
      <Honeypot form={form} />
      <FormAlert message={serverError} />
      <Button
        type="submit"
        size="lg"
        disabled={pending || propertyType === 'commercial'}
        className="w-fit"
      >
        {pending ? 'Sending…' : 'Request my snow contract'}
      </Button>
    </form>
  )
}
