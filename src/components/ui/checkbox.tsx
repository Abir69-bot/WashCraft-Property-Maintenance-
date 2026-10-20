import { cn } from '@/lib/utils'

type CheckboxProps = Omit<React.ComponentProps<'input'>, 'type'> & {
  label: React.ReactNode
}

/** Native checkbox with its label as one tap target (44px minimum height). */
export function Checkbox({ id, label, className, ...props }: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={cn('flex min-h-11 cursor-pointer items-start gap-3 py-2', className)}
    >
      <input
        id={id}
        type="checkbox"
        className="mt-0.5 size-5 shrink-0 cursor-pointer accent-primary aria-invalid:outline-2 aria-invalid:outline-error"
        {...props}
      />
      <span className="text-small text-ink">{label}</span>
    </label>
  )
}
