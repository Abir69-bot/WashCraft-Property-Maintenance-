import { CircleAlert } from 'lucide-react'

import { cn } from '@/lib/utils'

export type FieldControlProps = {
  id: string
  'aria-describedby'?: string
  'aria-invalid'?: true
  'aria-required'?: true
}

type FormFieldProps = {
  id: string
  label: React.ReactNode
  hint?: React.ReactNode
  error?: string
  /**
   * Optional fields are marked "(optional)", or with the given note when one of several fields
   * is needed (e.g. "or email"). Everything else is announced as required.
   */
  optional?: boolean | string
  className?: string
  children: (control: FieldControlProps) => React.ReactNode
}

/**
 * Label, hint and error wired to the control with aria-describedby / aria-invalid.
 * Usage: <FormField id="phone" label="Phone">{(control) => <Input {...control} />}</FormField>
 */
export function FormField({
  id,
  label,
  hint,
  error,
  optional,
  className,
  children,
}: FormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={cn('grid gap-1.5', className)}>
      <label htmlFor={id} className="font-semibold text-ink">
        {label}
        {optional && (
          <span className="font-normal text-muted">
            {' '}
            ({optional === true ? 'optional' : optional})
          </span>
        )}
      </label>
      {hint && (
        <p id={hintId} className="text-small text-muted">
          {hint}
        </p>
      )}
      {children({
        id,
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : undefined,
        'aria-required': optional ? undefined : true,
      })}
      {error && (
        <p id={errorId} className="flex items-start gap-1.5 text-small font-medium text-error">
          <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}
