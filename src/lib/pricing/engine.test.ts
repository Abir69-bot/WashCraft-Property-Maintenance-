import { describe, expect, it } from 'vitest'

import {
  answerMatches,
  priceLine,
  priceQuote,
  type Discount,
  type PricingRule,
  type QuoteItem,
} from './engine'

const settings = { rangeLow: 0.9, rangeHigh: 1.15 }

const houseWash: PricingRule = {
  baseFee: 0,
  unitRate: 300,
  minCharge: 300,
  multipliers: [
    { question: 'stories', answer: '2', factor: 1.25 },
    { question: 'siding', answer: 'Stucco', factor: 1.2 },
  ],
}

const pressureWash: PricingRule = {
  quantityQuestion: 'area',
  baseFee: 0,
  unitRate: 0.25,
  minCharge: 150,
  addOns: [{ question: 'stains', answer: 'yes', price: 40 }],
}

const lights: PricingRule = {
  quantityQuestion: 'roofline',
  baseFee: 150,
  unitRate: 5,
  minCharge: 350,
  addOns: [{ question: 'trees', answer: '*', price: 60 }],
}

const item = (key: string, rule: PricingRule | null, answers: QuoteItem['answers'] = {}) => ({
  key,
  name: key,
  rule,
  answers,
})

const discounts: Discount[] = [
  { name: '2 services', type: 'bundle', minServices: 2, percent: 5 },
  { name: '3+ services', type: 'bundle', minServices: 3, percent: 10 },
  { name: 'Quarterly', type: 'frequency', frequency: 'quarterly', percent: 10 },
]

describe('answerMatches', () => {
  it('compares text without case or spacing differences, and checkboxes as yes/no', () => {
    expect(answerMatches(' stucco ', 'Stucco')).toBe(true)
    expect(answerMatches(2, '2')).toBe(true)
    expect(answerMatches(true, 'yes')).toBe(true)
    expect(answerMatches(false, 'no')).toBe(true)
    expect(answerMatches(undefined, 'yes')).toBe(false)
    expect(answerMatches('', '')).toBe(false)
  })
})

describe('priceLine', () => {
  it('multiplies matching answers', () => {
    expect(priceLine(houseWash, { stories: '2', siding: 'Stucco' })).toEqual({
      price: 450,
      minimumApplied: false,
    })
    expect(priceLine(houseWash, { stories: '1', siding: 'Vinyl' })?.price).toBe(300)
  })

  it('uses the quantity question and adds checkbox add-ons', () => {
    expect(priceLine(pressureWash, { area: 1000, stains: true })?.price).toBe(290)
  })

  it('applies the minimum charge', () => {
    expect(priceLine(pressureWash, { area: 100 })).toEqual({ price: 150, minimumApplied: true })
  })

  it('prices "*" add-ons per unit of a number answer', () => {
    // 150 + 5 × 100 + 60 × 3 trees
    expect(priceLine(lights, { roofline: 100, trees: 3 })?.price).toBe(830)
    expect(priceLine(lights, { roofline: 100, trees: '' })?.price).toBe(650)
  })

  it('returns null when the quantity is missing or not a positive number', () => {
    expect(priceLine(pressureWash, {})).toBeNull()
    expect(priceLine(pressureWash, { area: 'lots' })).toBeNull()
    expect(priceLine(pressureWash, { area: 0 })).toBeNull()
  })
})

describe('priceQuote', () => {
  it('totals the lines and gives ranges rounded out to $5', () => {
    const quote = priceQuote({
      items: [item('house', houseWash, { stories: '2' })],
      settings,
      allowPlaceholders: true,
    })
    expect(quote.lines).toEqual([
      expect.objectContaining({ status: 'priced', price: 375, low: 335, high: 435 }),
    ])
    expect(quote).toMatchObject({ subtotal: 375, total: 375, low: 335, high: 435, complete: true })
    expect(quote.bundle).toBeNull()
  })

  it('applies the best bundle discount, then the frequency discount', () => {
    const quote = priceQuote({
      items: [
        item('house', houseWash, {}),
        item('concrete', pressureWash, { area: 1000 }),
        item('lights', lights, { roofline: 100 }),
      ],
      frequency: 'quarterly',
      discounts,
      settings,
      allowPlaceholders: true,
    })
    // 300 + 250 + 650 = 1200; −10% bundle = 1080; −10% quarterly = 972
    expect(quote.subtotal).toBe(1200)
    expect(quote.bundle).toEqual({ name: '3+ services', percent: 10, amount: 120 })
    expect(quote.frequency).toEqual({ name: 'Quarterly', percent: 10, amount: 108 })
    expect(quote.total).toBe(972)
    expect([quote.low, quote.high]).toEqual([870, 1120])
  })

  it('gives no frequency discount for one-time jobs or inactive discounts', () => {
    const items = [item('house', houseWash), item('concrete', pressureWash, { area: 1000 })]
    const oneTime = priceQuote({ items, discounts, settings, allowPlaceholders: true })
    expect(oneTime.frequency).toBeNull()
    expect(oneTime.bundle?.percent).toBe(5)
    const inactive = priceQuote({
      items,
      discounts: discounts.map((discount) => ({ ...discount, active: false })),
      settings,
      allowPlaceholders: true,
    })
    expect(inactive.bundle).toBeNull()
  })

  it('marks services without a rule or answer as custom quotes', () => {
    const quote = priceQuote({
      items: [item('house', houseWash), item('mystery', null), item('concrete', pressureWash)],
      discounts,
      settings,
      allowPlaceholders: true,
    })
    expect(quote.lines.map((line) => line.status)).toEqual(['priced', 'custom', 'custom'])
    expect(quote.complete).toBe(false)
    expect(quote.bundle).toBeNull()
    expect(quote.total).toBe(300)
  })

  describe('placeholder prices (needsReview)', () => {
    const placeholderRule = { ...houseWash, needsReview: true }
    const placeholderDiscounts = discounts.map((discount) => ({ ...discount, needsReview: true }))
    const items = [item('house', placeholderRule), item('concrete', pressureWash, { area: 1000 })]

    it('are used and flagged in development and preview', () => {
      const quote = priceQuote({
        items,
        discounts: placeholderDiscounts,
        settings,
        allowPlaceholders: true,
      })
      expect(quote.placeholder).toBe(true)
      expect(quote.lines[0]).toMatchObject({ status: 'priced', placeholder: true })
      expect(quote.bundle?.percent).toBe(5)
    })

    it('are never shown on the live site', () => {
      const quote = priceQuote({
        items,
        discounts: placeholderDiscounts,
        settings,
        allowPlaceholders: false,
      })
      expect(quote.placeholder).toBe(false)
      expect(quote.lines.map((line) => line.status)).toEqual(['custom', 'priced'])
      expect(quote.bundle).toBeNull()
      expect(quote.total).toBe(250)
    })

    it('leave nothing to show when every rule is a placeholder', () => {
      const quote = priceQuote({
        items: [item('house', placeholderRule)],
        settings,
        allowPlaceholders: false,
      })
      expect(quote).toMatchObject({ total: 0, low: 0, high: 0, complete: false })
    })
  })
})
