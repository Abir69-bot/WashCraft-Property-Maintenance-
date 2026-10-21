'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, Building2, CircleCheck, MapPin } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { useForm, useWatch, type Path } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { FREQUENCY_LABELS, type Frequency } from '@/config/catalog'
import { RESIDENTIAL_PROPERTY_TYPES } from '@/config/quote'
import { track } from '@/lib/analytics'
import { submitInstantQuote } from '@/lib/leads/actions'
import type { QuoteReceipt } from '@/lib/leads/types'
import { answersSchema, type QuoteQuestion } from '@/lib/quote/questions'
import { sharedFrequencies } from '@/lib/quote/services'
import { routes } from '@/lib/routes'
import { instantQuoteSchema, type InstantQuoteInput } from '@/lib/schemas/quote'
import { matchCity, normalizeZip } from '@/lib/service-area'
import { collectTracking, rememberLandingPage } from '@/lib/tracking'

import { EstimateResult } from './estimate-result'
import {
  applyServerErrors,
  ContactSection,
  FormAlert,
  Honeypot,
  QuestionField,
  RadioGroupField,
  TextAreaField,
  TextField,
} from './fields'
import { Turnstile } from './turnstile'

export type WizardService = {
  slug: string
  title: string
  questions: QuoteQuestion[]
  frequencies: Frequency[]
  /** Booked as a subscription (e.g. garbage bin cleaning). */
  subscription: boolean
}
export type WizardGroup = { title: string; services: WizardService[] }
export type WizardPlan = { id: number; name: string; price: string | null; services: string[] }
export type WizardCity = { name: string; slug: string; zipPrefixes?: string[] | null }

type Step = 'zip' | 'property' | 'services' | 'details' | 'frequency' | 'contact' | 'result'

const TITLES: Record<Step, string> = {
  zip: 'Where is the property?',
  property: 'What kind of property is it?',
  services: 'What can we help with?',
  details: 'A few details',
  frequency: 'How often?',
  contact: 'Where should we send your price?',
  result: 'Your estimate',
}

const STORAGE_KEY = 'wc-instant-quote'
const MAX_AGE = 7 * 24 * 60 * 60 * 1000

type Saved = { at: number; step: Step; values: Partial<InstantQuoteInput> }

function loadSaved(): Saved | null {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as Saved | null
    return saved && Date.now() - saved.at < MAX_AGE && saved.step !== 'result' ? saved : null
  } catch {
    return null
  }
}

function save(saved: Saved | null) {
  try {
    if (saved) localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Storage blocked: progress just isn't kept.
  }
}

const EMPTY: InstantQuoteInput = {
  propertyType: '' as InstantQuoteInput['propertyType'],
  services: [],
  answers: {},
  frequency: 'one-time',
  plan: null,
  preferredDates: '',
  notes: '',
  name: '',
  phone: '',
  email: '',
  consent: false,
  fax: '',
  turnstile: '',
  address: '',
  zip: '',
}

type SharedQuestion = { question: QuoteQuestion; owner: string; key: string }

/**
 * Questions several chosen services ask in exactly the same way (e.g. home size) are asked once,
 * bound to the first service's answer, and copied to the others when leaving the step.
 */
function sharedQuestions(services: WizardService[]): SharedQuestion[] {
  const seen = new Map<string, SharedQuestion & { count: number }>()
  for (const service of services) {
    for (const question of service.questions) {
      const key = JSON.stringify(question)
      const entry = seen.get(key)
      if (entry) entry.count++
      else seen.set(key, { question, owner: service.slug, key, count: 1 })
    }
  }
  return [...seen.values()].filter((entry) => entry.count > 1)
}

/** Which step a field error belongs to, so the wizard can go back to it. */
function stepOf(field: string): Step {
  if (field === 'zip') return 'zip'
  if (field === 'propertyType') return 'property'
  if (field === 'services') return 'services'
  if (field.startsWith('answers.')) return 'details'
  if (field === 'frequency') return 'frequency'
  return 'contact'
}

/** The instant-price wizard (brief §10.2). Rendered in the browser only (see the page). */
export function InstantWizard({
  groups,
  plans,
  cities,
  offeredFrequencies,
  consentLabel,
}: {
  groups: WizardGroup[]
  plans: WizardPlan[]
  cities: WizardCity[]
  offeredFrequencies: Frequency[]
  consentLabel: string
}) {
  const params = useSearchParams()
  const services = useMemo(() => groups.flatMap((group) => group.services), [groups])
  const known = (slug: string) => services.some((service) => service.slug === slug)

  // Start from ?plan= / ?service= when given, otherwise from saved progress.
  const [start] = useState(() => {
    const plan = plans.find((item) => String(item.id) === params.get('plan')) ?? null
    const service = params.get('service')
    if (plan) {
      return {
        step: 'zip' as Step,
        values: { ...EMPTY, plan: plan.id, services: plan.services.filter(known) },
      }
    }
    if (service && known(service))
      return { step: 'zip' as Step, values: { ...EMPTY, services: [service] } }
    const saved = loadSaved()
    return saved
      ? { step: saved.step, values: { ...EMPTY, ...saved.values, turnstile: '', fax: '' } }
      : { step: 'zip' as Step, values: EMPTY }
  })

  const form = useForm<InstantQuoteInput>({
    resolver: zodResolver(instantQuoteSchema),
    defaultValues: start.values,
  })
  const [step, setStep] = useState<Step>(start.step)
  const [receipt, setReceipt] = useState<QuoteReceipt | null>(null)
  const [pending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)
  const [challenge, setChallenge] = useState(0)
  const heading = useRef<HTMLHeadingElement>(null)
  const started = useRef(false)

  const values = useWatch({ control: form.control })
  const selected = services.filter((service) => values.services?.includes(service.slug))
  const plan = plans.find((item) => item.id === values.plan) ?? null
  const frequencies = sharedFrequencies(selected, offeredFrequencies)
  const shared = sharedQuestions(selected)
  const sharedKeys = new Set(shared.map((entry) => entry.key))
  const steps: Step[] = [
    'zip',
    'property',
    'services',
    ...(selected.some((service) => service.questions.length) ? (['details'] as Step[]) : []),
    ...(frequencies.length > 1 && !plan ? (['frequency'] as Step[]) : []),
    'contact',
  ]
  const index = steps.indexOf(step)
  const commercial = step === 'property' && (values.propertyType as string) === 'commercial'
  const zip = normalizeZip(values.zip ?? '')
  const city = zip ? matchCity(zip, cities) : null

  useEffect(rememberLandingPage, [])

  // Keep progress for a week, so a visitor can come back to it.
  useEffect(() => {
    if (step === 'result') return
    const { turnstile: _turnstile, fax: _fax, ...rest } = form.getValues()
    save({ at: Date.now(), step, values: rest })
  }, [form, step, values])

  const go = (next: Step) => {
    setStep(next)
    requestAnimationFrame(() => heading.current?.focus())
  }

  async function validateStep(): Promise<boolean> {
    if (step === 'zip') return form.trigger('zip')
    if (step === 'property') return !commercial && form.trigger('propertyType')
    if (step === 'services') return form.trigger('services')
    if (step === 'details') {
      for (const entry of shared) {
        const value = form.getValues(
          `answers.${entry.owner}.${entry.question.id}` as Path<InstantQuoteInput>,
        )
        for (const service of selected) {
          if (service.slug === entry.owner) continue
          if (!service.questions.some((question) => JSON.stringify(question) === entry.key))
            continue
          form.setValue(
            `answers.${service.slug}.${entry.question.id}` as Path<InstantQuoteInput>,
            value,
          )
        }
      }
      const invalid: Path<InstantQuoteInput>[] = []
      for (const service of selected) {
        const result = answersSchema(service.questions).safeParse(
          form.getValues(`answers.${service.slug}`) ?? {},
        )
        if (result.success) continue
        for (const issue of result.error.issues) {
          const name = `answers.${service.slug}.${issue.path.join('.')}` as Path<InstantQuoteInput>
          form.setError(name, { message: issue.message })
          invalid.push(name)
        }
      }
      if (invalid[0]) form.setFocus(invalid[0])
      return invalid.length === 0
    }
    if (step === 'frequency') return form.trigger('frequency')
    return true
  }

  const next = async () => {
    if (!(await validateStep())) return
    if (!started.current) {
      started.current = true
      track('quote_start', { flow: 'instant' })
    }
    track('quote_step', { step: index + 2 })
    if (step === 'services' && !frequencies.includes(form.getValues('frequency'))) {
      form.setValue('frequency', 'one-time')
    }
    go(steps[index + 1])
  }

  // Built per submit event, so the handlers (which move focus) never run during render.
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) =>
    form.handleSubmit(
      (data) => {
        setServerError(null)
        startTransition(async () => {
          const result = await submitInstantQuote(
            { ...data, services: selected.map((service) => service.slug) },
            collectTracking(),
          )
          if (!result.ok) {
            setServerError(result.message)
            setChallenge((count) => count + 1)
            const fields = Object.keys(result.fieldErrors ?? {})
            if (fields[0] && stepOf(fields[0]) !== 'contact') go(stepOf(fields[0]))
            applyServerErrors(form, result.fieldErrors)
            return
          }
          track('quote_contact_submitted', { flow: 'instant', services: selected.length })
          save(null)
          setReceipt(result)
          setStep('result')
        })
      },
      (errors) => {
        const fields = Object.keys(errors)
        if (fields[0] && stepOf(fields[0]) !== 'contact') go(stepOf(fields[0]))
      },
    )(event)

  if (step === 'result' && receipt) {
    return (
      <EstimateResult
        receipt={receipt}
        type={plan || selected.some((service) => service.subscription) ? 'subscription' : 'instant'}
      />
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={pending} className="grid gap-8">
      <div>
        <p className="text-small font-semibold text-muted">
          Step {index + 1} of {steps.length}
        </p>
        <div
          role="progressbar"
          aria-label="Quote progress"
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-valuenow={index + 1}
          aria-valuetext={`Step ${index + 1} of ${steps.length}: ${TITLES[step]}`}
          className="mt-2 h-2 overflow-hidden rounded-full bg-surface"
        >
          <div
            className="h-full rounded-full bg-primary transition-[width]"
            style={{ width: `${((index + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {plan && (
        <p className="rounded-card bg-surface p-4">
          <strong className="text-ink">You picked the {plan.name} plan.</strong> Its services are
          selected below; change them if you like.
        </p>
      )}

      <section aria-labelledby="wizard-step" className="grid gap-6">
        <h2 id="wizard-step" ref={heading} tabIndex={-1} className="text-h3 focus:outline-none">
          {TITLES[step]}
        </h2>

        {step === 'zip' && (
          <div className="grid max-w-sm gap-3">
            <TextField
              form={form}
              name="zip"
              label="ZIP code"
              autoComplete="postal-code"
              inputMode="numeric"
              maxLength={10}
            />
            {zip && (
              <p role="status" className="flex items-start gap-2 text-small">
                {city ? (
                  <>
                    <CircleCheck aria-hidden className="size-5 shrink-0 text-success-strong" />
                    Good news: we serve {city.name}.
                  </>
                ) : (
                  <>
                    <MapPin aria-hidden className="size-5 shrink-0 text-muted" />
                    That looks outside our usual area. You can still continue and we’ll let you
                    know.
                  </>
                )}
              </p>
            )}
          </div>
        )}

        {step === 'property' && (
          <>
            <RadioGroupField
              form={form}
              name="propertyType"
              legend="Property type"
              options={[
                ...RESIDENTIAL_PROPERTY_TYPES,
                { value: 'commercial', label: 'Commercial, HOA or several buildings' },
              ]}
            />
            {commercial && (
              <div role="status" className="flex items-start gap-3 rounded-card bg-surface p-4">
                <Building2 aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
                <p>
                  Commercial and HOA properties get a written bid instead of an online price.{' '}
                  <Link href={routes.quoteCommercial}>Request a commercial bid</Link>.
                </p>
              </div>
            )}
          </>
        )}

        {step === 'services' && (
          <div className="grid gap-6">
            {groups.map((group) => (
              <fieldset key={group.title} className="grid gap-1">
                <legend className="mb-2 font-heading font-bold text-primary">{group.title}</legend>
                <div className="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
                  {group.services.map((service) => (
                    <label
                      key={service.slug}
                      className="flex min-h-11 cursor-pointer items-center gap-3 py-1"
                    >
                      <input
                        type="checkbox"
                        value={service.slug}
                        className="size-5 shrink-0 cursor-pointer accent-primary"
                        {...form.register('services')}
                      />
                      {service.title}
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
            <FormAlert message={form.formState.errors.services?.message ?? null} />
          </div>
        )}

        {step === 'details' && (
          <div className="grid gap-8">
            {shared.length > 0 && (
              <fieldset className="grid gap-4">
                <legend className="mb-1 font-heading font-bold text-primary">
                  About your property
                </legend>
                <div className="grid gap-4 md:grid-cols-2">
                  {shared.map((entry) => (
                    <QuestionField
                      key={entry.key}
                      form={form}
                      name={
                        `answers.${entry.owner}.${entry.question.id}` as Path<InstantQuoteInput>
                      }
                      question={entry.question}
                    />
                  ))}
                </div>
              </fieldset>
            )}
            {selected.map((service) => {
              const own = service.questions.filter(
                (question) => !sharedKeys.has(JSON.stringify(question)),
              )
              if (own.length === 0) return null
              return (
                <fieldset key={service.slug} className="grid gap-4">
                  <legend className="mb-1 font-heading font-bold text-primary">
                    {service.title}
                  </legend>
                  <div className="grid gap-4 md:grid-cols-2">
                    {own.map((question) => (
                      <QuestionField
                        key={question.id}
                        form={form}
                        name={`answers.${service.slug}.${question.id}` as Path<InstantQuoteInput>}
                        question={question}
                      />
                    ))}
                  </div>
                </fieldset>
              )
            })}
          </div>
        )}

        {step === 'frequency' && (
          <RadioGroupField
            form={form}
            name="frequency"
            legend="Repeat visits"
            hint="Regular visits can cost less. You can change this any time."
            options={frequencies.map((value) => ({ value, label: FREQUENCY_LABELS[value] }))}
          />
        )}

        {step === 'contact' && (
          <div className="grid gap-6">
            <ContactSection form={form} consentLabel={consentLabel} zip={false} />
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                form={form}
                name="preferredDates"
                label="Preferred dates"
                hint="e.g. weekday mornings, or after May 15"
                optional
              />
              <TextAreaField form={form} name="notes" label="Anything else?" rows={3} optional />
            </div>
            <Turnstile key={challenge} onToken={(token) => form.setValue('turnstile', token)} />
            <Honeypot form={form} />
          </div>
        )}
      </section>

      <FormAlert message={serverError} />

      <div className="flex flex-wrap items-center gap-3">
        {index > 0 && (
          <Button type="button" variant="outline" size="lg" onClick={() => go(steps[index - 1])}>
            <ArrowLeft aria-hidden />
            Back
          </Button>
        )}
        {step === 'contact' ? (
          <Button type="submit" size="lg" disabled={pending}>
            {pending ? 'Working out your price…' : 'See my price'}
          </Button>
        ) : (
          <Button type="button" size="lg" onClick={next} disabled={commercial}>
            Next
            <ArrowRight aria-hidden />
          </Button>
        )}
        {step === 'contact' && (
          <p className="w-full text-small text-muted">
            We save your request before showing the price, so we can follow up if you have
            questions.
          </p>
        )}
      </div>
    </form>
  )
}
