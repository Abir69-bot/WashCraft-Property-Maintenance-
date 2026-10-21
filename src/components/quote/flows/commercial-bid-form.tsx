'use client'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { BID_FREQUENCIES, COMMERCIAL_PROPERTY_TYPES } from '@/config/quote'
import { track } from '@/lib/analytics'
import { submitCommercialBid } from '@/lib/leads/actions'
import { routes } from '@/lib/routes'
import { commercialBidSchema, type CommercialBidInput } from '@/lib/schemas/quote'

import {
  CheckboxField,
  ContactSection,
  FormAlert,
  FormSection,
  Honeypot,
  RadioGroupField,
  SelectField,
  TextAreaField,
  TextField,
} from '../fields'
import { FileUploadField } from '../file-upload'
import { Turnstile } from '../turnstile'
import { useQuoteForm } from '../use-quote-form'
import { ServiceChecklist, type ServiceOptionGroup } from './service-checklist'

/** Commercial / HOA bid request (brief §10.5). */
export function CommercialBidForm({
  groups,
  consentLabel,
}: {
  groups: ServiceOptionGroup[]
  consentLabel: string
}) {
  const router = useRouter()
  const { form, onSubmit, pending, serverError, challenge, setUploading } = useQuoteForm<
    CommercialBidInput,
    object
  >({
    schema: commercialBidSchema,
    defaultValues: {
      company: '',
      role: '',
      propertyType: '' as CommercialBidInput['propertyType'],
      size: '',
      sizeUnit: 'units',
      services: [],
      frequency: '' as CommercialBidInput['frequency'],
      insuranceCertificate: false,
      files: [],
      walkthroughDate: '',
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
    submit: submitCommercialBid,
    onSuccess: (_result, values) => {
      track('commercial_bid_submit', { services: values.services.length })
      router.push(`${routes.quoteThankYou}?type=commercial_bid`)
    },
  })
  const today = new Date().toISOString().slice(0, 10)

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={pending} className="grid gap-10">
      <FormSection title="Your organization">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            form={form}
            name="company"
            label="Company or HOA name"
            autoComplete="organization"
          />
          <TextField
            form={form}
            name="role"
            label="Your role"
            hint="e.g. property manager, board member"
            autoComplete="organization-title"
            optional
          />
          <SelectField
            form={form}
            name="propertyType"
            label="Property type"
            options={COMMERCIAL_PROPERTY_TYPES}
          />
          <div className="grid grid-cols-[1fr_auto] items-end gap-3">
            <TextField
              form={form}
              name="size"
              label="Size"
              inputMode="numeric"
              hint="Number of units, or square feet"
              optional
            />
            <SelectField
              form={form}
              name="sizeUnit"
              label={<span className="sr-only">Size unit</span>}
              options={['units', 'sq ft']}
              placeholder="Unit"
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="What you need">
        <ServiceChecklist
          form={form}
          name="services"
          legend="Services"
          groups={groups}
          open={groups[0] ? [groups[0].title] : []}
        />
        <RadioGroupField
          form={form}
          name="frequency"
          legend="How often?"
          options={BID_FREQUENCIES}
          columns={3}
        />
        <TextField
          form={form}
          name="walkthroughDate"
          label="Preferred site walk date"
          type="date"
          min={today}
          optional
        />
        <FileUploadField
          form={form}
          name="files"
          label="RFP, site plan or photos"
          kind="document"
          onBusyChange={setUploading}
        />
        <CheckboxField
          form={form}
          name="insuranceCertificate"
          label="Please include a certificate of insurance with the proposal"
        />
      </FormSection>

      <ContactSection
        form={form}
        consentLabel={consentLabel}
        emailRequired
        title="Your contact details"
      />
      <TextAreaField
        form={form}
        name="notes"
        label="Anything else we should know?"
        rows={4}
        optional
      />
      <Turnstile key={challenge} onToken={(token) => form.setValue('turnstile', token)} />
      <Honeypot form={form} />
      <FormAlert message={serverError} />
      <Button type="submit" size="lg" disabled={pending} className="w-fit">
        {pending ? 'Sending…' : 'Request a bid'}
      </Button>
    </form>
  )
}
