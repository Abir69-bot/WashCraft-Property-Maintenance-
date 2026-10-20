import { cn } from '@/lib/utils'

/** Shared look for text inputs, textareas and selects. 16px text stops iOS zooming on focus. */
export const fieldClassName =
  'block w-full rounded-lg border border-border-strong bg-white px-4 text-base text-ink placeholder:text-muted aria-invalid:border-2 aria-invalid:border-error disabled:cursor-not-allowed disabled:bg-surface disabled:text-muted'

export function Input({ className, ...props }: React.ComponentProps<'input'>) {
  return <input className={cn(fieldClassName, 'min-h-12', className)} {...props} />
}

export function Textarea({ className, rows = 4, ...props }: React.ComponentProps<'textarea'>) {
  return <textarea rows={rows} className={cn(fieldClassName, 'py-3', className)} {...props} />
}
