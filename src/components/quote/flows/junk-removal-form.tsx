'use client'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { JUNK_ACCESS, JUNK_LOADS } from '@/config/quote'
import { track } from '@/lib/analytics'
import { submitJunkRemoval } from '@/lib/leads/actions'
import { routes } from '@/lib/routes'
import { junkRemovalSchema, type JunkRemovalInput } from '@/lib/schemas/quote'

import {
  CheckboxField,
  ContactSection,
  FormAlert,
  FormSection,
  Honeypot,
  RadioGroupField,
  TextAreaField,
  TextField,
} from '../fields'
import { FileUploadField } from '../file-upload'
import { Turnstile } from '../turnstile'
import { useQuoteForm } from '../use-quote-form'

/** Photo-based junk removal quote (brief §10.5). */
export function JunkRemovalForm({ consentLabel }: { consentLabel: string }) {
  const router = useRouter()
  const { form, onSubmit, pending, serverError, challenge, setUploading } = useQuoteForm<
    JunkRemovalInput,
    object
  >({
    schema: junkRemovalSchema,
    defaultValues: {
      description: '',
      photos: [],
      load: '' as JunkRemovalInput['load'],
      access: '' as JunkRemovalInput['access'],
      stairs: false,
      preferredDate: '',
      name: '',
      phone: '',
      email: '',
      address: '',
      zip: '',
      consent: false,
      fax: '',
      turnstile: '',
    },
    submit: submitJunkRemoval,
    onSuccess: (_result, values) => {
      track('junk_quote_submit', { photos: values.photos.length })
      router.push(`${routes.quoteThankYou}?type=junk`)
    },
  })
  const today = new Date().toISOString().slice(0, 10)

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={pending} className="grid gap-10">
      <FormSection title="What needs to go?">
        <TextAreaField
          form={form}
          name="description"
          label="Describe the items"
          hint="e.g. old couch, mattress, 10 bags of yard waste"
          rows={4}
        />
        <FileUploadField
          form={form}
          name="photos"
          label="Photos of the items"
          onBusyChange={setUploading}
        />
        <RadioGroupField
          form={form}
          name="load"
          legend="About how much is there?"
          hint="A rough guess is fine. The photos help us confirm."
          options={JUNK_LOADS}
          columns={3}
        />
        <RadioGroupField
          form={form}
          name="access"
          legend="Where are the items?"
          options={JUNK_ACCESS}
          columns={2}
        />
        <CheckboxField
          form={form}
          name="stairs"
          label="We’ll need to carry items up or down stairs"
        />
        <TextField
          form={form}
          name="preferredDate"
          label="Preferred date"
          type="date"
          min={today}
          optional
        />
      </FormSection>

      <ContactSection form={form} consentLabel={consentLabel} />
      <Turnstile key={challenge} onToken={(token) => form.setValue('turnstile', token)} />
      <Honeypot form={form} />
      <FormAlert message={serverError} />
      <Button type="submit" size="lg" disabled={pending} className="w-fit">
        {pending ? 'Sending…' : 'Get my junk removal quote'}
      </Button>
    </form>
  )
}
