import { describe, expect, it } from 'vitest'

import { categoryCta, generalCta, QUOTE_DEFAULTS, quoteCta, quoteLabel } from './flow'

const service = (overrides: Partial<Parameters<typeof quoteCta>[0]> = {}) => ({
  slug: 'gutter-cleaning',
  quoteMode: 'instant' as const,
  dedicatedFlow: null,
  ...overrides,
})

const allOn = { instantPricing: true, dedicatedForms: true, freeQuotes: false }

describe('quoteLabel', () => {
  it('says "free" only when the owner confirmed free quotes', () => {
    expect(quoteLabel(QUOTE_DEFAULTS)).toBe('Request a Quote')
    expect(quoteLabel({ ...QUOTE_DEFAULTS, freeQuotes: true })).toBe('Request a Free Quote')
  })
})

describe('quoteCta with the default switches (all off)', () => {
  it('sends every service to the quote form with the service picked', () => {
    for (const overrides of [
      {},
      { quoteMode: 'custom' as const },
      { quoteMode: 'contract' as const },
      { quoteMode: 'bid' as const },
      { quoteMode: 'subscription' as const },
      { quoteMode: 'custom' as const, dedicatedFlow: 'holiday-lights' as const },
    ]) {
      expect(quoteCta(service(overrides), QUOTE_DEFAULTS)).toEqual({
        href: '/quote?service=gutter-cleaning',
        label: 'Request a Quote',
      })
    }
  })

  it('uses the free-quote label when quotes are free', () => {
    expect(quoteCta(service(), { ...QUOTE_DEFAULTS, freeQuotes: true }).label).toBe(
      'Request a Free Quote',
    )
  })

  it('points the site-wide button at the quote form', () => {
    expect(generalCta(QUOTE_DEFAULTS)).toEqual({ href: '/quote', label: 'Request a Quote' })
    expect(categoryCta('winter', QUOTE_DEFAULTS).href).toBe('/quote')
  })
})

describe('quoteCta with the switches on', () => {
  it('sends instant-price services to the wizard with the service picked', () => {
    expect(quoteCta(service(), allOn)).toEqual({
      href: '/quote/instant?service=gutter-cleaning',
      label: 'Get instant price',
    })
    expect(quoteCta(service({ quoteMode: 'subscription' }), allOn).href).toBe(
      '/quote/instant?service=gutter-cleaning',
    )
  })

  it('sends custom-quote services to the quote form', () => {
    expect(quoteCta(service({ quoteMode: 'custom' }), allOn).href).toBe(
      '/quote?service=gutter-cleaning',
    )
  })

  it('switches seasonal and commercial services to their own forms', () => {
    expect(quoteCta(service({ quoteMode: 'contract' }), allOn).href).toBe('/quote/snow-contract')
    expect(quoteCta(service({ quoteMode: 'bid' }), allOn).href).toBe('/quote/commercial')
    expect(
      quoteCta(service({ quoteMode: 'custom', dedicatedFlow: 'holiday-lights' }), allOn).href,
    ).toBe('/quote/holiday-lights')
    expect(
      quoteCta(service({ quoteMode: 'custom', dedicatedFlow: 'junk-removal' }), allOn).href,
    ).toBe('/quote/junk-removal')
  })

  it("uses the parent service's flow for add-ons", () => {
    const parent = service({ slug: 'snow-removal', quoteMode: 'contract' })
    expect(quoteCta(service({ quoteMode: 'addon', parentService: parent }), allOn).href).toBe(
      '/quote/snow-contract',
    )
    expect(quoteCta(service({ quoteMode: 'addon', parentService: 7 }), allOn).href).toBe(
      '/quote?service=gutter-cleaning',
    )
  })

  it('matches the flow most of the category is quoted with', () => {
    expect(categoryCta('winter', allOn).href).toBe('/quote/snow-contract')
    expect(categoryCta('holiday', allOn).href).toBe('/quote/holiday-lights')
    expect(categoryCta('commercial', allOn).href).toBe('/quote/commercial')
    expect(categoryCta('exterior', allOn).href).toBe('/quote/instant')
  })
})
