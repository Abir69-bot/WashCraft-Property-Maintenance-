'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { BUDGETS, TIMELINES } from '@/config/quote'
import { track } from '@/lib/analytics'
import { submitCustomQuote } from '@/lib/leads/actions'
import { routes } from '@/lib/routes'
import { customQuoteSchema, type CustomQuoteInput } from '@/lib/schemas/quote'

import {
  ContactSection,
  FormAlert,
  FormSection,
  Honeypot,
  RadioGroupField,
  SelectField,
  TextAreaField,
} from '../fields'
import { FileUploadField } from '../file-upload'
import { Turnstile } from '../turnstile'
import { useQuoteForm } from '../use-quote-form'
import { ServiceChecklist, type ServiceOptionGroup } from './service-checklist'

/** Custom quote with photos, for large or unusual jobs (brief §10.5). */
export function CustomQuoteForm({
  groups,
  consentLabel,
}: {
  groups: ServiceOptionGroup[]
  consentLabel: string
}) {
  const router = useRouter()
  const { form, onSubmit, pending, serverError, challenge, setUploading } = useQuoteForm<
    CustomQuoteInput,
    object
  >({
    schema: customQuoteSchema,
    defaultValues: {
      services: [],
      description: '',
      photos: [],
      timeline: '' as CustomQuoteInput['timeline'],
      budget: '',
      name: '',
      phone: '',
      email: '',
      address: '',
      zip: '',
      consent: false,
      fax: '',
      turnstile: '',
    },
    submit: submitCustomQuote,
    onSuccess: (_result, values) => {
      track('quote_contact_submitted', { flow: 'custom', services: values.services.length })
      router.push(`${routes.quoteThankYou}?type=custom`)
    },
  })

  // Service pages link here with ?service=<slug>.
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('service')
    const known = groups.some((group) => group.services.some((service) => service.slug === slug))
    if (slug && known) form.setValue('services', [slug])
  }, [form, groups])

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={pending} className="grid gap-10">
      <FormSection title="About the job">
        <ServiceChecklist
          form={form}
          name="services"
          legend="Which services?"
          hint="Pick any that apply, or leave it to us."
          groups={groups}
        />
        <TextAreaField
          form={form}
          name="description"
          label="Tell us about the job"
          hint="What needs doing, how big it is, and anything unusual about access."
          rows={5}
        />
        <FileUploadField form={form} name="photos" label="Photos" onBusyChange={setUploading} />
        <RadioGroupField
          form={form}
          name="timeline"
          legend="When do you need it done?"
          options={TIMELINES}
          columns={2}
        />
        <SelectField
          form={form}
          name="budget"
          label="Budget"
          options={BUDGETS}
          placeholder="Prefer not to say"
          optional
        />
      </FormSection>

      <ContactSection form={form} consentLabel={consentLabel} />
      <Turnstile key={challenge} onToken={(token) => form.setValue('turnstile', token)} />
      <Honeypot form={form} />
      <FormAlert message={serverError} />
      <Button type="submit" size="lg" disabled={pending} className="w-fit">
        {pending ? 'Sending…' : 'Request my quote'}
      </Button>
    </form>
  )
}
