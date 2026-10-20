import { ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'

import { fieldClassName } from './input'

/**
 * Native <select>: OS pickers on phones, <optgroup> support, works before JavaScript loads.
 * Used for form fields instead of a Radix Select (see DECISIONS.md).
 */
export function NativeSelect({ className, children, ...props }: React.ComponentProps<'select'>) {
  return (
    <div className="relative">
      <select
        className={cn(fieldClassName, 'min-h-12 cursor-pointer appearance-none pr-11', className)}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-muted"
      />
    </div>
  )
}
