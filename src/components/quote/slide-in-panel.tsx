'use client'

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'

import { QuickQuoteForm, type ServiceGroup } from './quick-quote-form'

/** The slide-in's dialog and form, loaded only when the slide-in is about to open. */
export function SlideInPanel({
  open,
  onOpenChange,
  groups,
  consentLabel,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  groups: ServiceGroup[]
  consentLabel: string
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent side="right" closeLabel="Close the quote form">
        <DialogTitle>Get a quick quote</DialogTitle>
        <DialogDescription>
          Four quick details and we’ll get back to you with a price.
        </DialogDescription>
        <div className="mt-6">
          <QuickQuoteForm groups={groups} consentLabel={consentLabel} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
