/**
 * The instant-price engine (brief §10.4). Pure functions, no database:
 *
 *   line   = max(minCharge, baseFee + unitRate × quantity × Π multipliers + add-ons)
 *   total  = Σ lines × (1 − bundle discount) × (1 − frequency discount)
 *   range  = [total × rangeLow, total × rangeHigh], rounded out to the nearest $5
 *
 * The minimum charge applies per service. Rules and discounts still marked `needsReview` are
 * placeholders: allowed in development and preview (flagged), never used on the live site,
 * where the line falls back to "custom quote".
 */

export type AnswerValue = string | number | boolean | null | undefined
export type Answers = Record<string, AnswerValue>

export type PricingRule = {
  quantityQuestion?: string | null
  baseFee: number
  unitRate: number
  minCharge: number
  multipliers?: { question: string; answer: string; factor: number }[] | null
  addOns?: { question: string; answer: string; price: number }[] | null
  needsReview?: boolean | null
}

export type Discount = {
  name?: string
  type: 'bundle' | 'frequency'
  minServices?: number | null
  frequency?: string | null
  percent: number
  active?: boolean | null
  needsReview?: boolean | null
}

export type PricingSettings = { rangeLow: number; rangeHigh: number }

export type QuoteItem = { key: string; name: string; answers: Answers; rule: PricingRule | null }

export type LineResult =
  | {
      key: string
      name: string
      status: 'priced'
      price: number
      low: number
      high: number
      minimumApplied: boolean
      placeholder: boolean
    }
  | { key: string; name: string; status: 'custom' }

export type AppliedDiscount = { name: string; percent: number; amount: number }

export type QuoteResult = {
  lines: LineResult[]
  subtotal: number
  bundle: AppliedDiscount | null
  frequency: AppliedDiscount | null
  total: number
  low: number
  high: number
  /** Every line has a price. */
  complete: boolean
  /** Placeholder (unreviewed) numbers were used. Never true on the live site. */
  placeholder: boolean
}

/** Checkbox answers match "yes"/"no"; everything else compares as text. */
export function answerMatches(value: AnswerValue, expected: string): boolean {
  if (value === null || value === undefined || value === '') return false
  const text = typeof value === 'boolean' ? (value ? 'yes' : 'no') : String(value)
  return text.trim().toLowerCase() === expected.trim().toLowerCase()
}

const asNumber = (value: AnswerValue) => {
  if (typeof value === 'boolean' || value === null || value === undefined || value === '') {
    return null
  }
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

const roundMoney = (value: number) => Math.round(value * 100) / 100
const roundDown5 = (value: number) => Math.floor(value / 5) * 5
const roundUp5 = (value: number) => Math.ceil(value / 5) * 5

/** One service's price from its rule, or null when an answer it needs is missing. */
export function priceLine(
  rule: PricingRule,
  answers: Answers,
): { price: number; minimumApplied: boolean } | null {
  let quantity = 1
  if (rule.quantityQuestion) {
    const answered = asNumber(answers[rule.quantityQuestion])
    if (answered === null || answered <= 0) return null
    quantity = answered
  }
  const factor = (rule.multipliers ?? [])
    .filter((multiplier) => answerMatches(answers[multiplier.question], multiplier.answer))
    .reduce((product, multiplier) => product * multiplier.factor, 1)
  const addOns = (rule.addOns ?? []).reduce((sum, addOn) => {
    if (addOn.answer === '*') {
      const count = asNumber(answers[addOn.question])
      return count && count > 0 ? sum + addOn.price * count : sum
    }
    return answerMatches(answers[addOn.question], addOn.answer) ? sum + addOn.price : sum
  }, 0)
  const raw = rule.baseFee + rule.unitRate * quantity * factor + addOns
  const price = roundMoney(Math.max(rule.minCharge, raw))
  return { price, minimumApplied: rule.minCharge > raw }
}

const best = (discounts: Discount[]) =>
  discounts.reduce<Discount | null>(
    (top, discount) => (!top || discount.percent > top.percent ? discount : top),
    null,
  )

export function priceQuote({
  items,
  frequency = 'one-time',
  discounts = [],
  settings,
  allowPlaceholders,
}: {
  items: QuoteItem[]
  frequency?: string | null
  discounts?: Discount[]
  settings: PricingSettings
  /** False on the live site: unreviewed rules and discounts are ignored. */
  allowPlaceholders: boolean
}): QuoteResult {
  const range = (value: number) => ({
    low: roundDown5(value * settings.rangeLow),
    high: roundUp5(value * settings.rangeHigh),
  })
  let placeholder = false

  const lines: LineResult[] = items.map((item) => {
    const usable = item.rule && (allowPlaceholders || !item.rule.needsReview)
    const priced = usable ? priceLine(item.rule!, item.answers) : null
    if (!priced) return { key: item.key, name: item.name, status: 'custom' }
    const linePlaceholder = Boolean(item.rule!.needsReview)
    placeholder ||= linePlaceholder
    return {
      key: item.key,
      name: item.name,
      status: 'priced',
      price: priced.price,
      ...range(priced.price),
      minimumApplied: priced.minimumApplied,
      placeholder: linePlaceholder,
    }
  })

  const priced = lines.filter((line) => line.status === 'priced')
  const subtotal = roundMoney(priced.reduce((sum, line) => sum + line.price, 0))
  const usable = discounts.filter(
    (discount) => discount.active !== false && (allowPlaceholders || !discount.needsReview),
  )
  const bundleRule = best(
    usable.filter(
      (discount) => discount.type === 'bundle' && priced.length >= (discount.minServices ?? 2),
    ),
  )
  const frequencyRule =
    frequency && frequency !== 'one-time'
      ? best(
          usable.filter(
            (discount) => discount.type === 'frequency' && discount.frequency === frequency,
          ),
        )
      : null

  const afterBundle = subtotal * (1 - (bundleRule?.percent ?? 0) / 100)
  const total = roundMoney(afterBundle * (1 - (frequencyRule?.percent ?? 0) / 100))
  const applied = (discount: Discount | null, base: number): AppliedDiscount | null => {
    if (!discount) return null
    placeholder ||= Boolean(discount.needsReview)
    return {
      name: discount.name ?? `${discount.percent}% off`,
      percent: discount.percent,
      amount: roundMoney((base * discount.percent) / 100),
    }
  }

  return {
    lines,
    subtotal,
    bundle: applied(bundleRule, subtotal),
    frequency: applied(frequencyRule, afterBundle),
    total,
    ...(priced.length ? range(total) : { low: 0, high: 0 }),
    complete: priced.length === lines.length && lines.length > 0,
    placeholder,
  }
}
