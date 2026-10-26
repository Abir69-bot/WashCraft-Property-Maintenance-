'use client'

import { useState } from 'react'
import { useWatch, type Path } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { HOLIDAY_STYLES, INSTALL_WINDOWS, REMOVAL_WINDOWS } from '@/config/quote'
import { track } from '@/lib/analytics'
import { submitHolidayLights } from '@/lib/leads/actions'
import type { QuoteReceipt } from '@/lib/leads/types'
import type { QuoteQuestion } from '@/lib/quote/questions'
import { holidayLightsSchema, type HolidayLightsInput } from '@/lib/schemas/quote'

import { EstimateResult } from '../estimate-result'
import {
  CheckboxField,
  ContactSection,
  FormAlert,
  FormSection,
  Honeypot,
  QuestionField,
  RadioGroupField,
  SelectField,
  TextAreaField,
  TextField,
} from '../fields'
import { checkAnswers } from '../check-answers'
import { Turnstile } from '../turnstile'
import { useQuoteForm } from '../use-quote-form'

/** Christmas light installation, removal and storage booking (brief §10.5). */
export function HolidayLightsForm({
  questions,
  homeSizes,
  consentLabel,
}: {
  questions: QuoteQuestion[]
  homeSizes: string[]
  consentLabel: string
}) {
  const [receipt, setReceipt] = useState<QuoteReceipt | null>(null)
  const { form, onSubmit, pending, serverError, challenge } = useQuoteForm<
    HolidayLightsInput,
    QuoteReceipt
  >({
    schema: holidayLightsSchema,
    defaultValues: {
      answers: {},
      rooflineUnknown: false,
      homeSize: '',
      railings: '0',
      style: '' as HolidayLightsInput['style'],
      installWindow: '' as HolidayLightsInput['installWindow'],
      removal: true,
      removalWindow: '',
      storage: false,
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
    check: (values, current) =>
      checkAnswers(
        current,
        values.rooflineUnknown
          ? questions.filter((question) => question.id !== 'roofline')
          : questions,
        values.answers,
        'answers',
      ),
    submit: submitHolidayLights,
    onSuccess: (result) => {
      track('holiday_lights_submit')
      setReceipt(result)
    },
  })
  const [rooflineUnknown, removal] = useWatch({
    control: form.control,
    name: ['rooflineUnknown', 'removal'],
  })

  if (receipt) return <EstimateResult receipt={receipt} type="holiday_lights" />

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={pending} className="grid gap-10">
      <FormSection title="Your home">
        <div className="grid gap-4 md:grid-cols-2">
          {questions.map((question) =>
            question.id === 'roofline' && rooflineUnknown ? null : (
              <QuestionField
                key={question.id}
                form={form}
                name={`answers.${question.id}` as Path<HolidayLightsInput>}
                question={question}
              />
            ),
          )}
          <TextField
            form={form}
            name="railings"
            label="Railings to light"
            inputMode="numeric"
            type="number"
            min={0}
            max={50}
          />
        </div>
        {questions.some((question) => question.id === 'roofline') && (
          <CheckboxField
            form={form}
            name="rooflineUnknown"
            label="I’m not sure how long the roofline is"
          />
        )}
        {rooflineUnknown && (
          <SelectField
            form={form}
            name="homeSize"
            label="About how big is the home?"
            hint="We’ll estimate the roofline from it and measure on site."
            options={homeSizes}
          />
        )}
      </FormSection>

      <FormSection title="Your lights">
        <RadioGroupField
          form={form}
          name="style"
          legend="Style"
          options={HOLIDAY_STYLES}
          columns={3}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <SelectField
            form={form}
            name="installWindow"
            label="When should we install them?"
            options={INSTALL_WINDOWS}
          />
          {removal && (
            <SelectField
              form={form}
              name="removalWindow"
              label="When should we take them down?"
              options={REMOVAL_WINDOWS}
            />
          )}
        </div>
        <CheckboxField form={form} name="removal" label="Take the lights down in January" />
        <CheckboxField form={form} name="storage" label="Store the lights until next season" />
      </FormSection>

      <ContactSection form={form} consentLabel={consentLabel} />
      <TextAreaField form={form} name="notes" label="Anything we should know?" rows={3} optional />
      <Turnstile key={challenge} onToken={(token) => form.setValue('turnstile', token)} />
      <Honeypot form={form} />
      <FormAlert message={serverError} />
      <Button type="submit" size="lg" disabled={pending} className="w-fit">
        {pending ? 'Working out your price…' : 'See my price'}
      </Button>
    </form>
  )
}
