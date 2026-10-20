'use client'

import { Tabs as TabsPrimitive } from 'radix-ui'

import { cn } from '@/lib/utils'

/** Arrow keys move between tabs; Home/End jump to the first/last (Radix). */
export const Tabs = TabsPrimitive.Root

export function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn('inline-flex flex-wrap gap-1 rounded-3xl bg-surface p-1', className)}
      {...props}
    />
  )
}

export function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'inline-flex min-h-11 items-center gap-2 rounded-full px-5 font-semibold text-muted transition-colors hover:text-primary data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm [&_svg]:size-5',
        className,
      )}
      {...props}
    />
  )
}

export function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={cn('mt-6', className)} {...props} />
}
