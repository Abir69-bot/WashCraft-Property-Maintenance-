import type { CategoryTone, DedicatedFlow, Frequency, QuoteMode, Season } from '@/config/catalog'
import type { IconKey } from '@/config/icons'
import type { QuoteQuestion } from '@/lib/quote/questions'

export type CategorySlug =
  | 'exterior-cleaning'
  | 'interior-cleaning'
  | 'winter-services'
  | 'holiday-lighting'
  | 'yard-care'
  | 'commercial'

export type TitledText = { title: string; body: string }
export type Faq = { question: string; answer: string }

export type CategorySeed = {
  slug: CategorySlug
  title: string
  menuLabel: string
  tone: CategoryTone
  icon: IconKey
  headline: string
  intro: string
  summary: string
  outcomeLabel: string
  heroImageLabel: string
  bookingNote?: string
  bundles: { title: string; description: string; services: string[] }[]
}

/** Copy is written for a grade 6–8 reader. `{region}` is filled in when the page renders. */
export type ServiceSeed = {
  slug: string
  title: string
  category: CategorySlug
  icon: IconKey
  quoteMode: QuoteMode
  dedicatedFlow?: DedicatedFlow
  /** For add-ons: the service they're sold with. */
  parent?: string
  siteVisit?: boolean
  seasons: Season[]
  bookingWindowNote?: string
  headline: string
  promise: string
  summary: string
  outcomeLabel: string
  bullets: [string, string, string]
  heroImageLabel: string
  problem: string
  benefits: TitledText[]
  included: string[]
  method: string
  safety?: string
  process: TitledText[]
  priceFactors: string[]
  addOns?: { name: string; description?: string }[]
  faqs: Faq[]
  related: [string, string, string]
  questions?: QuoteQuestion[]
}

export type CitySeed = {
  name: string
  state: string
  lat: number
  lng: number
  zipPrefixes: string[]
  intro: string
  heroImageLabel: string
  neighborhoods: { name: string; blurb: string; imageLabel: string }[]
  whyChooseUs: string
  faqs: Faq[]
}

export type ArticleSeed = {
  slug: string
  title: string
  excerpt: string
  heroImageLabel: string
  /** Markdown, converted to rich text by the seed. */
  markdown: string
  relatedServices: string[]
}

export type PricingRuleSeed = {
  service: string
  unit: 'job' | 'sq_ft' | 'linear_ft' | 'window' | 'panel' | 'bin' | 'item'
  quantityQuestion?: string
  baseFee: number
  unitRate: number
  minCharge: number
  multipliers?: { question: string; answer: string; factor: number }[]
  addOns?: { question: string; answer?: string; price: number }[]
}

export type DiscountSeed =
  | { name: string; type: 'bundle'; minServices: number; percent: number }
  | { name: string; type: 'frequency'; frequency: Frequency; percent: number }
