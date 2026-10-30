'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { TIMELINES } from '@/config/quote'
import { track } from '@/lib/analytics'
import { submitQuoteRequest } from '@/lib/leads/actions'
import { routes } from '@/lib/routes'
import { OTHER_SERVICE, quoteRequestSchema, type QuoteRequestInput } from '@/lib/schemas/quote'

import {
  ContactSection,
  FormAlert,
  FormSection,
  Honeypot,
  RadioGroupField,
  TextAreaField,
} from './fields'
import { FileUploadField } from './file-upload'
import { ServiceChecklist, type ServiceOptionGroup } from './flows/service-checklist'
import { Turnstile } from './turnstile'
import { useQuoteForm } from './use-quote-form'

/**
 * The quote request form (/quote). Service buttons link here with ?service=<slug>, which ticks
 * that service. The thank-you page only shows once the server has saved or backed up the request.
 */
export function QuoteRequestForm({
  groups,
  consentLabel,
  submitLabel,
}: {
  groups: ServiceOptionGroup[]
  consentLabel: string
  submitLabel: string
}) {
  const router = useRouter()
  const { form, onSubmit, pending, serverError, challenge, setUploading } = useQuoteForm<
    QuoteRequestInput,
    object
  >({
    schema: quoteRequestSchema,
    defaultValues: {
      services: [],
      description: '',
      photos: [],
      timeline: '' as QuoteRequestInput['timeline'],
      name: '',
      phone: '',
      email: '',
      address: '',
      zip: '',
      consent: false,
      fax: '',
      turnstile: '',
    },
    submit: submitQuoteRequest,
    onSuccess: (_result, values) => {
      track('quote_contact_submitted', { flow: 'request', services: values.services.length })
      router.push(`${routes.quoteThankYou}?type=custom`)
    },
  })

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('service')
    const known = groups.some((group) => group.services.some((service) => service.slug === slug))
    if (slug && known) form.setValue('services', [slug])
  }, [form, groups])

  const options: ServiceOptionGroup[] = [
    ...groups,
    { title: 'Other', services: [{ slug: OTHER_SERVICE, title: 'Something else, or not sure' }] },
  ]

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={pending} className="grid gap-10">
      <FormSection title="About the job">
        <ServiceChecklist
          form={form}
          name="services"
          legend="Service needed"
          hint="Tick everything that applies."
          groups={options}
          open={options.map((group) => group.title)}
        />
        <TextAreaField
          form={form}
          name="description"
          label="Describe the job"
          hint="What needs doing, roughly how big it is, and anything we should know about access (stairs, gates, building rules, parking)."
          rows={5}
        />
        <RadioGroupField
          form={form}
          name="timeline"
          legend="Preferred timing"
          options={TIMELINES}
          columns={2}
        />
        <FileUploadField form={form} name="photos" label="Photos" onBusyChange={setUploading} />
      </FormSection>

      <ContactSection form={form} consentLabel={consentLabel} either />
      <Turnstile key={challenge} onToken={(token) => form.setValue('turnstile', token)} />
      <Honeypot form={form} />
      <FormAlert message={serverError} />
      <Button type="submit" size="lg" disabled={pending} className="w-fit">
        {pending ? 'Sending your request…' : submitLabel}
      </Button>
    </form>
  )
}
