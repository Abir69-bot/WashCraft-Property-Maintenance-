'use client'

import { CircleAlert } from 'lucide-react'
import { useId } from 'react'
import { get, type FieldValues, type Path, type UseFormReturn } from 'react-hook-form'

import { Checkbox } from '@/components/ui/checkbox'
import { FormField } from '@/components/ui/form-field'
import { Input, Textarea } from '@/components/ui/input'
import { NativeSelect } from '@/components/ui/native-select'
import { answersSchema, type QuoteQuestion } from '@/lib/quote/questions'
import { cn } from '@/lib/utils'

/**
 * Accessible form fields bound to React Hook Form: every control has a visible label, errors
 * are tied to it with aria-describedby, and required fields are announced (brief §15).
 */

type Form<T extends FieldValues> = UseFormReturn<T>
type Option = string | { value: string; label: string }
const optionValue = (option: Option) => (typeof option === 'string' ? option : option.value)
const optionLabel = (option: Option) => (typeof option === 'string' ? option : option.label)

export function errorFor<T extends FieldValues>(form: Form<T>, name: Path<T>): string | undefined {
  return get(form.formState.errors, name)?.message
}

/** Applies a server action's field errors to the form. */
export function applyServerErrors<T extends FieldValues>(
  form: Form<T>,
  fieldErrors: Record<string, string> | undefined,
) {
  const names = Object.keys(fieldErrors ?? {})
  for (const name of names) form.setError(name as Path<T>, { message: fieldErrors![name] })
  if (names[0]) form.setFocus(names[0] as Path<T>)
}

export function TextField<T extends FieldValues>({
  form,
  name,
  label,
  hint,
  optional,
  className,
  ...input
}: {
  form: Form<T>
  name: Path<T>
  label: React.ReactNode
  hint?: React.ReactNode
  optional?: boolean
  className?: string
} & Pick<
  React.ComponentProps<'input'>,
  'type' | 'autoComplete' | 'inputMode' | 'maxLength' | 'min' | 'max' | 'step' | 'placeholder'
>) {
  const id = useId()
  return (
    <FormField
      id={id}
      label={label}
      hint={hint}
      optional={optional}
      error={errorFor(form, name)}
      className={className}
    >
      {(control) => <Input {...control} {...input} {...form.register(name)} />}
    </FormField>
  )
}

export function TextAreaField<T extends FieldValues>({
  form,
  name,
  label,
  hint,
  optional,
  rows,
  className,
}: {
  form: Form<T>
  name: Path<T>
  label: React.ReactNode
  hint?: React.ReactNode
  optional?: boolean
  rows?: number
  className?: string
}) {
  const id = useId()
  return (
    <FormField
      id={id}
      label={label}
      hint={hint}
      optional={optional}
      error={errorFor(form, name)}
      className={className}
    >
      {(control) => <Textarea {...control} rows={rows} {...form.register(name)} />}
    </FormField>
  )
}

export function SelectField<T extends FieldValues>({
  form,
  name,
  label,
  hint,
  options,
  placeholder = 'Choose one',
  optional,
  className,
}: {
  form: Form<T>
  name: Path<T>
  label: React.ReactNode
  hint?: React.ReactNode
  options: readonly Option[]
  placeholder?: string
  optional?: boolean
  className?: string
}) {
  const id = useId()
  return (
    <FormField
      id={id}
      label={label}
      hint={hint}
      optional={optional}
      error={errorFor(form, name)}
      className={className}
    >
      {(control) => (
        <NativeSelect {...control} {...form.register(name)}>
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={optionValue(option)} value={optionValue(option)}>
              {optionLabel(option)}
            </option>
          ))}
        </NativeSelect>
      )}
    </FormField>
  )
}

export function CheckboxField<T extends FieldValues>({
  form,
  name,
  label,
}: {
  form: Form<T>
  name: Path<T>
  label: React.ReactNode
}) {
  const id = useId()
  return <Checkbox id={id} label={label} {...form.register(name)} />
}

/** A labelled group of radio buttons or checkboxes (fieldset + legend). */
function ChoiceGroup<T extends FieldValues>({
  form,
  name,
  legend,
  hint,
  options,
  type,
  columns = 1,
}: {
  form: Form<T>
  name: Path<T>
  legend: React.ReactNode
  hint?: React.ReactNode
  options: readonly (Option & {})[]
  type: 'radio' | 'checkbox'
  columns?: 1 | 2 | 3
}) {
  const id = useId()
  const error = errorFor(form, name)
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ')
  return (
    <fieldset
      aria-describedby={describedBy || undefined}
      aria-invalid={error ? true : undefined}
      className="grid gap-2"
    >
      <legend className="mb-1 font-semibold text-ink">{legend}</legend>
      {hint && (
        <p id={`${id}-hint`} className="text-small text-muted">
          {hint}
        </p>
      )}
      <div
        className={cn(
          'grid gap-x-6',
          columns === 2 && 'sm:grid-cols-2',
          columns === 3 && 'sm:grid-cols-2 lg:grid-cols-3',
        )}
      >
        {options.map((option) => (
          <label
            key={optionValue(option)}
            className="flex min-h-11 cursor-pointer items-center gap-3 py-1"
          >
            <input
              type={type}
              value={optionValue(option)}
              className="size-5 shrink-0 cursor-pointer accent-primary"
              {...form.register(name)}
            />
            <span>{optionLabel(option)}</span>
          </label>
        ))}
      </div>
      {error && (
        <p
          id={`${id}-error`}
          className="flex items-start gap-1.5 text-small font-medium text-error"
        >
          <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}
    </fieldset>
  )
}

export function RadioGroupField<T extends FieldValues>(
  props: Omit<Parameters<typeof ChoiceGroup<T>>[0], 'type'>,
) {
  return <ChoiceGroup {...props} type="radio" />
}

export function CheckboxGroupField<T extends FieldValues>(
  props: Omit<Parameters<typeof ChoiceGroup<T>>[0], 'type'>,
) {
  return <ChoiceGroup {...props} type="checkbox" />
}

/** A service's own quote question from the CMS (select, number or yes/no). */
export function QuestionField<T extends FieldValues>({
  form,
  name,
  question,
}: {
  form: Form<T>
  name: Path<T>
  question: QuoteQuestion
}) {
  const optional = !question.required
  if (question.type === 'boolean') {
    return <CheckboxField form={form} name={name} label={question.label} />
  }
  if (question.type === 'select') {
    return (
      <SelectField
        form={form}
        name={name}
        label={question.label}
        hint={question.helpText}
        options={question.options}
        optional={optional}
      />
    )
  }
  const range =
    question.min !== undefined && question.max !== undefined
      ? `${question.min.toLocaleString('en-US')}–${question.max.toLocaleString('en-US')}${question.unit ? ` ${question.unit}` : ''}`
      : null
  return (
    <TextField
      form={form}
      name={name}
      label={question.unit ? `${question.label} (${question.unit})` : question.label}
      hint={
        [question.helpText, range && `Between ${range}.`].filter(Boolean).join(' ') || undefined
      }
      optional={optional}
      inputMode="numeric"
      type="number"
      min={question.min}
      max={question.max}
    />
  )
}

/** Honeypot: hidden from people and screen readers; bots that fill it are ignored. */
export function Honeypot<T extends FieldValues>({ form }: { form: Form<T> }) {
  const id = useId()
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor={id}>Leave this empty</label>
      <input id={id} tabIndex={-1} autoComplete="off" {...form.register('fax' as Path<T>)} />
    </div>
  )
}

export function FormAlert({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <p role="alert" className="flex items-start gap-2 font-medium text-error">
      <CircleAlert aria-hidden className="mt-0.5 size-5 shrink-0" />
      {message}
    </p>
  )
}

/** Name, phone, email, address and ZIP, plus the consent checkbox. */
export function ContactSection<T extends FieldValues>({
  form,
  consentLabel,
  emailRequired = false,
  address = true,
  zip = true,
  title = 'Your details',
}: {
  form: Form<T>
  consentLabel: string
  emailRequired?: boolean
  address?: boolean
  /** Off when the form already asked for the ZIP code (the wizard's first step). */
  zip?: boolean | 'optional'
  title?: string
}) {
  const field = (name: string) => name as Path<T>
  return (
    <fieldset className="grid gap-4">
      <legend className="mb-2 text-h3 font-heading font-bold text-primary">{title}</legend>
      <div className="grid gap-4 md:grid-cols-2">
        <TextField form={form} name={field('name')} label="Name" autoComplete="name" />
        <TextField
          form={form}
          name={field('phone')}
          label="Phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
        />
        <TextField
          form={form}
          name={field('email')}
          label="Email"
          type="email"
          autoComplete="email"
          optional={!emailRequired}
        />
        {address && (
          <TextField
            form={form}
            name={field('address')}
            label="Street address"
            autoComplete="street-address"
          />
        )}
        {zip && (
          <TextField
            form={form}
            name={field('zip')}
            label="ZIP code"
            autoComplete="postal-code"
            inputMode="numeric"
            maxLength={10}
            optional={zip === 'optional'}
          />
        )}
      </div>
      <CheckboxField form={form} name={field('consent')} label={consentLabel} />
    </fieldset>
  )
}

/** A titled group of fields. */
export function FormSection({
  title,
  hint,
  children,
}: {
  title: string
  hint?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <fieldset className="grid gap-4">
      <legend className="mb-2 text-h3 font-heading font-bold text-primary">{title}</legend>
      {hint && <p className="-mt-2 text-muted">{hint}</p>}
      {children}
    </fieldset>
  )
}

/** Checks answers to a service's CMS questions, marking and focusing the first problem. */
export function checkAnswers<T extends FieldValues>(
  form: Form<T>,
  questions: QuoteQuestion[],
  values: unknown,
  prefix: string,
): boolean {
  const result = answersSchema(questions).safeParse(values ?? {})
  if (result.success) return true
  const names = result.error.issues.map((issue) => `${prefix}.${issue.path.join('.')}` as Path<T>)
  result.error.issues.forEach((issue, index) =>
    form.setError(names[index], { message: issue.message }),
  )
  form.setFocus(names[0])
  return false
}
