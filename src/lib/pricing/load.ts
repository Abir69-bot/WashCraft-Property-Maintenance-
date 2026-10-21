import type { Frequency, QuoteMode } from '@/config/catalog'
import { FREQUENCIES } from '@/config/catalog'
import { cachedQuery, getPayloadClient } from '@/lib/data/cache'
import { isProductionSite } from '@/lib/env'
import { quoteQuestionsSchema, type QuoteQuestion } from '@/lib/quote/questions'

import { priceQuote, type Answers, type Discount, type PricingRule } from './engine'

const idOf = (value: number | { id: number }) => (typeof value === 'object' ? value.id : value)

export type PricingData = {
  /** Keyed by service id (as a string, so the cache can serialize it). */
  rules: Record<string, PricingRule>
  discounts: Discount[]
  settings: {
    rangeLow: number
    rangeHigh: number
    taxNote: string
    estimateNote: string
    frequencies: Frequency[]
  }
}

/** Pricing rules, discounts and settings. Server-only: the numbers never reach the browser. */
export const getPricingData = cachedQuery('pricing', async (): Promise<PricingData> => {
  const payload = await getPayloadClient()
  const [rules, discounts, settings] = await Promise.all([
    payload.find({ collection: 'pricing-rules', pagination: false, depth: 0 }),
    payload.find({ collection: 'discounts', pagination: false, depth: 0 }),
    payload.findGlobal({ slug: 'pricing-settings', depth: 0 }),
  ])
  return {
    rules: Object.fromEntries(
      rules.docs.map((rule) => [
        String(idOf(rule.service)),
        {
          quantityQuestion: rule.quantityQuestion,
          baseFee: rule.baseFee,
          unitRate: rule.unitRate,
          minCharge: rule.minCharge,
          multipliers: rule.multipliers,
          addOns: rule.addOns,
          needsReview: rule.needsReview,
        },
      ]),
    ),
    discounts: discounts.docs.map((discount) => ({
      name: discount.name,
      type: discount.type,
      minServices: discount.minServices,
      frequency: discount.frequency,
      percent: discount.percent,
      active: discount.active,
      needsReview: discount.needsReview,
    })),
    settings: {
      rangeLow: settings.rangeLow,
      rangeHigh: settings.rangeHigh,
      taxNote: settings.taxNote,
      estimateNote: settings.estimateNote,
      frequencies: settings.frequencies?.length ? settings.frequencies : [...FREQUENCIES],
    },
  }
})

export type QuoteService = {
  id: number
  slug: string
  title: string
  category: number
  icon: string
  quoteMode: QuoteMode
  dedicatedFlow: string | null
  questions: QuoteQuestion[]
  frequencies: Frequency[]
}

/** Every enabled service with its quote questions, for the wizard and the quote forms. */
export const getQuoteServices = cachedQuery('quote-services', async (): Promise<QuoteService[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'services',
    overrideAccess: false,
    where: { enabled: { equals: true } },
    sort: 'order',
    pagination: false,
    depth: 0,
    select: {
      title: true,
      slug: true,
      category: true,
      icon: true,
      quoteMode: true,
      dedicatedFlow: true,
      quoteQuestions: true,
      frequencies: true,
    },
  })
  return docs.map((service) => ({
    id: service.id,
    slug: service.slug,
    title: service.title,
    category: idOf(service.category),
    icon: service.icon,
    quoteMode: service.quoteMode,
    dedicatedFlow: service.dedicatedFlow ?? null,
    questions: quoteQuestionsSchema.safeParse(service.quoteQuestions).data ?? [],
    frequencies: service.frequencies?.length ? service.frequencies : ['one-time'],
  }))
})

/** Prices a set of services with the current rules (placeholders allowed outside production). */
export function estimate(
  pricing: PricingData,
  items: { service: Pick<QuoteService, 'id' | 'title'>; answers: Answers }[],
  frequency: Frequency = 'one-time',
) {
  return priceQuote({
    items: items.map(({ service, answers }) => ({
      key: String(service.id),
      name: service.title,
      answers,
      rule: pricing.rules[String(service.id)] ?? null,
    })),
    frequency,
    discounts: pricing.discounts,
    settings: pricing.settings,
    allowPlaceholders: !isProductionSite,
  })
}
