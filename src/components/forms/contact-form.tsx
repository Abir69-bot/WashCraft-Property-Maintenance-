'use client'

import { useState } from 'react'

import { ContactSection, FormAlert, Honeypot, TextAreaField } from '@/components/quote/fields'
import { Turnstile } from '@/components/quote/turnstile'
import { useQuoteForm } from '@/components/quote/use-quote-form'
import { Button } from '@/components/ui/button'
import { track } from '@/lib/analytics'
import { submitContact } from '@/lib/leads/actions'
import { contactSchema, type ContactInput } from '@/lib/schemas/contact'

import { FormSent } from './form-sent'

/** Contact page form (brief §9.7). Saved as a "contact" lead. */
export function ContactForm({ consentLabel }: { consentLabel: string }) {
  const [sent, setSent] = useState(false)
  const { form, onSubmit, pending, serverError, challenge } = useQuoteForm<ContactInput, object>({
    schema: contactSchema,
    defaultValues: {
      message: '',
      name: '',
      phone: '',
      email: '',
      zip: '',
      consent: false,
      fax: '',
      turnstile: '',
    },
    submit: submitContact,
    onSuccess: () => {
      track('contact_submit')
      setSent(true)
    },
  })

  if (sent) {
    return (
      <FormSent title="Thanks, we got your message">
        We’ll get back to you as soon as we can.
      </FormSent>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={pending} className="grid gap-8">
      <TextAreaField form={form} name="message" label="How can we help?" rows={5} />
      <ContactSection
        form={form}
        consentLabel={consentLabel}
        address={false}
        zip="optional"
        title="How to reach you"
      />
      <Turnstile key={challenge} onToken={(token) => form.setValue('turnstile', token)} />
      <Honeypot form={form} />
      <FormAlert message={serverError} />
      <Button type="submit" size="lg" disabled={pending} className="w-fit">
        {pending ? 'Sending…' : 'Send message'}
      </Button>
    </form>
  )
}
