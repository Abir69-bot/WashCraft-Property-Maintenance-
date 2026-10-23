'use client'

import { useState } from 'react'

import {
  CheckboxField,
  FormAlert,
  Honeypot,
  SelectField,
  TextAreaField,
  TextField,
} from '@/components/quote/fields'
import { FileUploadField } from '@/components/quote/file-upload'
import { Turnstile } from '@/components/quote/turnstile'
import { useQuoteForm } from '@/components/quote/use-quote-form'
import { Button } from '@/components/ui/button'
import { track } from '@/lib/analytics'
import { submitJobApplication } from '@/lib/leads/actions'
import { applicationSchema, type ApplicationInput } from '@/lib/schemas/contact'

import { FormSent } from './form-sent'

/**
 * Careers application (brief §9.7): name, email, phone, role, résumé and message. The résumé is
 * optional (a PDF or a photo of one) so nobody is turned away for not having a file.
 */
export function ApplicationForm({
  roles,
  defaultRole = '',
  consentLabel,
}: {
  roles: { value: string; label: string }[]
  defaultRole?: string
  consentLabel: string
}) {
  const [sent, setSent] = useState(false)
  const { form, onSubmit, pending, serverError, challenge, setUploading } = useQuoteForm<
    ApplicationInput,
    object
  >({
    schema: applicationSchema,
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: defaultRole,
      resume: [],
      message: '',
      consent: false,
      fax: '',
      turnstile: '',
    },
    submit: (values) => submitJobApplication(values),
    onSuccess: (_result, values) => {
      track('careers_apply', { role: values.role || 'any' })
      setSent(true)
    },
  })

  if (sent) {
    return (
      <FormSent title="Thanks, we got your application">
        We read every application and will contact you if there’s a good fit.
      </FormSent>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={pending} className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2">
        <TextField form={form} name="name" label="Name" autoComplete="name" />
        <TextField form={form} name="email" label="Email" type="email" autoComplete="email" />
        <TextField
          form={form}
          name="phone"
          label="Phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
        />
        <SelectField
          form={form}
          name="role"
          label="Role"
          options={roles}
          placeholder="Any role"
          optional
        />
      </div>
      <FileUploadField
        form={form}
        name="resume"
        label="Résumé (optional): PDF or a photo, up to 10 MB"
        kind="document"
        max={1}
        onBusyChange={setUploading}
      />
      <TextAreaField
        form={form}
        name="message"
        label="Tell us about yourself"
        hint="Experience, when you can start, and whether you have a driver’s license."
        optional
        rows={5}
      />
      <CheckboxField form={form} name="consent" label={consentLabel} />
      <Turnstile key={challenge} onToken={(token) => form.setValue('turnstile', token)} />
      <Honeypot form={form} />
      <FormAlert message={serverError} />
      <Button type="submit" size="lg" disabled={pending} className="w-fit">
        {pending ? 'Sending…' : 'Send application'}
      </Button>
    </form>
  )
}
