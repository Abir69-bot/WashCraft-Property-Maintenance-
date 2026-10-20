'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'
import { Dialog as DialogPrimitive } from 'radix-ui'

import { cn } from '@/lib/utils'

/** Focus is trapped while open, Esc closes, and focus returns to the trigger (Radix). */
export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close

const contentVariants = cva('fixed z-50 bg-white text-ink shadow-xl focus:outline-none', {
  variants: {
    side: {
      center:
        'top-1/2 left-1/2 max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 animate-slide-in-up overflow-y-auto rounded-card p-6 sm:p-8',
      right: 'inset-y-0 right-0 w-full max-w-md animate-slide-in-right overflow-y-auto p-6 sm:p-8',
      full: 'inset-0 animate-fade-in overflow-y-auto p-4',
    },
  },
  defaultVariants: { side: 'center' },
})

export function DialogContent({
  className,
  children,
  side,
  closeLabel = 'Close',
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> &
  VariantProps<typeof contentVariants> & { closeLabel?: string }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 animate-fade-in bg-ink/60" />
      <DialogPrimitive.Content className={cn(contentVariants({ side }), className)} {...props}>
        {children}
        <DialogPrimitive.Close
          aria-label={closeLabel}
          className="absolute top-2 right-2 inline-flex size-11 items-center justify-center rounded-full text-muted hover:bg-surface hover:text-ink"
        >
          <X aria-hidden className="size-5" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

export function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title className={cn('pr-10 text-h3 text-primary', className)} {...props} />
  )
}

export function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description className={cn('mt-2 text-muted', className)} {...props} />
}
