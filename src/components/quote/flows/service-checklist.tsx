'use client'

import { ChevronDown } from 'lucide-react'
import { useWatch, type FieldValues, type Path, type UseFormReturn } from 'react-hook-form'

import { errorFor } from '../fields'

export type ServiceOptionGroup = { title: string; services: { slug: string; title: string }[] }

/**
 * Services as checkboxes, one collapsible group per category (native <details>, so it works
 * with the keyboard and without JavaScript). Groups with a ticked service start open.
 */
export function ServiceChecklist<T extends FieldValues>({
  form,
  name,
  legend,
  hint,
  groups,
  open = [],
}: {
  form: UseFormReturn<T>
  name: Path<T>
  legend: string
  hint?: string
  groups: ServiceOptionGroup[]
  /** Category titles to show expanded. */
  open?: string[]
}) {
  const chosen = (useWatch({ control: form.control, name }) as string[] | undefined) ?? []
  const error = errorFor(form, name)
  return (
    <fieldset aria-invalid={error ? true : undefined} className="grid gap-2">
      <legend className="mb-1 font-semibold text-ink">{legend}</legend>
      {hint && <p className="text-small text-muted">{hint}</p>}
      {chosen.length > 0 && (
        <p className="text-small font-semibold text-primary">{chosen.length} selected</p>
      )}
      <div className="grid gap-2">
        {groups.map((group) => {
          const count = group.services.filter((service) => chosen.includes(service.slug)).length
          return (
            <details
              key={group.title}
              open={open.includes(group.title) || count > 0}
              className="group rounded-card border border-border bg-white"
            >
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 font-semibold text-primary">
                <span>
                  {group.title}
                  {count > 0 && <span className="ml-2 text-small text-muted">({count})</span>}
                </span>
                <ChevronDown
                  aria-hidden
                  className="size-5 shrink-0 transition-transform group-open:rotate-180"
                />
              </summary>
              <div className="grid gap-x-6 px-4 pb-3 sm:grid-cols-2">
                {group.services.map((service) => (
                  <label
                    key={service.slug}
                    className="flex min-h-11 cursor-pointer items-center gap-3 py-1"
                  >
                    <input
                      type="checkbox"
                      value={service.slug}
                      className="size-5 shrink-0 cursor-pointer accent-primary"
                      {...form.register(name)}
                    />
                    {service.title}
                  </label>
                ))}
              </div>
            </details>
          )
        })}
      </div>
      {error && <p className="text-small font-medium text-error">{error}</p>}
    </fieldset>
  )
}
