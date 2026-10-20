'use client'

import { ChevronDown } from 'lucide-react'
import { Accordion as AccordionPrimitive } from 'radix-ui'

import { cn } from '@/lib/utils'

export const Accordion = AccordionPrimitive.Root

export function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item className={cn('border-b border-border', className)} {...props} />
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="text-body">
      <AccordionPrimitive.Trigger
        className={cn(
          'group flex min-h-11 w-full items-center justify-between gap-4 py-4 text-left font-heading text-lg font-bold text-primary hover:text-secondary-strong',
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown
          aria-hidden
          className="size-5 shrink-0 transition-transform group-data-[state=open]:rotate-180"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

/** Always rendered (hidden when closed) so answers are in the HTML for search engines. */
export function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content forceMount className="data-[state=closed]:hidden" {...props}>
      <div className={cn('pb-5 text-ink', className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}
