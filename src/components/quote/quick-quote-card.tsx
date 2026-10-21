import { QuickQuoteForm, type ServiceGroup } from './quick-quote-form'

/** The quick quote form in a card, beside the hero on service and city pages (brief §8). */
export function QuickQuoteCard({
  groups,
  consentLabel,
  defaultService,
}: {
  groups: ServiceGroup[]
  consentLabel: string
  defaultService?: string
}) {
  return (
    <section
      aria-labelledby="quick-quote-heading"
      className="rounded-card border border-border bg-white p-6 shadow-lg md:p-8"
    >
      <h2 id="quick-quote-heading" className="text-h3">
        Get a quick quote
      </h2>
      <p className="mt-1 mb-6 text-muted">
        Four quick details and we’ll get back to you with a price.
      </p>
      <QuickQuoteForm groups={groups} consentLabel={consentLabel} defaultService={defaultService} />
    </section>
  )
}
