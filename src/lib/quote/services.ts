import { FREQUENCIES, type Frequency, type QuoteMode } from '@/config/catalog'

/** Services the instant-price wizard offers: instant or subscription, without their own form. */
export const isWizardService = (service: { quoteMode: QuoteMode; dedicatedFlow: string | null }) =>
  (service.quoteMode === 'instant' || service.quoteMode === 'subscription') &&
  !service.dedicatedFlow

/** Frequencies every chosen service allows, from those offered (one-time is always allowed). */
export function sharedFrequencies(
  services: { frequencies: Frequency[] }[],
  offered: readonly Frequency[],
): Frequency[] {
  return FREQUENCIES.filter(
    (frequency) =>
      frequency === 'one-time' ||
      (offered.includes(frequency) &&
        services.length > 0 &&
        services.every((service) => service.frequencies.includes(frequency))),
  )
}
