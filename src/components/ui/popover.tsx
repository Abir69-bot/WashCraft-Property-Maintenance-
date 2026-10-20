'use client'

import { Popover as PopoverPrimitive } from 'radix-ui'

import { cn } from '@/lib/utils'

export const Popover = PopoverPrimitive.Root
export const PopoverTrigger = PopoverPrimitive.Trigger

export function PopoverContent({
  className,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          'z-50 w-72 max-w-[calc(100vw-2rem)] animate-fade-in rounded-card border border-border bg-white p-4 text-small text-ink shadow-lg',
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}
