import { describe, expect, it } from 'vitest'

import { categoryCta, quoteCta } from './flow'

const service = (overrides: Partial<Parameters<typeof quoteCta>[0]> = {}) => ({
  slug: 'gutter-cleaning',
  quoteMode: 'instant' as const,
  dedicatedFlow: null,
  ...overrides,
})

describe('quoteCta', () => {
  it('sends instant-price services to the wizard with the service picked', () => {
    expect(quoteCta(service())).toEqual({
      href: '/quote/instant?service=gutter-cleaning',
      label: 'Get instant price',
    })
    expect(quoteCta(service({ quoteMode: 'subscription' })).href).toBe(
      '/quote/instant?service=gutter-cleaning',
    )
  })

  it('sends custom-quote services to the custom form', () => {
    expect(quoteCta(service({ quoteMode: 'custom' })).href).toBe(
      '/quote/custom?service=gutter-cleaning',
    )
  })

  it('switches seasonal and commercial services to their own flow', () => {
    expect(quoteCta(service({ quoteMode: 'contract' })).href).toBe('/quote/snow-contract')
    expect(quoteCta(service({ quoteMode: 'bid' })).href).toBe('/quote/commercial')
    expect(quoteCta(service({ quoteMode: 'custom', dedicatedFlow: 'holiday-lights' })).href).toBe(
      '/quote/holiday-lights',
    )
    expect(quoteCta(service({ quoteMode: 'custom', dedicatedFlow: 'junk-removal' })).href).toBe(
      '/quote/junk-removal',
    )
  })

  it("uses the parent service's flow for add-ons", () => {
    const parent = service({ slug: 'snow-removal', quoteMode: 'contract' })
    expect(quoteCta(service({ quoteMode: 'addon', parentService: parent })).href).toBe(
      '/quote/snow-contract',
    )
    expect(quoteCta(service({ quoteMode: 'addon', parentService: 7 })).href).toBe(
      '/quote/custom?service=gutter-cleaning',
    )
  })
})

describe('categoryCta', () => {
  it('matches the flow most of the category is quoted with', () => {
    expect(categoryCta('winter').href).toBe('/quote/snow-contract')
    expect(categoryCta('holiday').href).toBe('/quote/holiday-lights')
    expect(categoryCta('commercial').href).toBe('/quote/commercial')
    expect(categoryCta('exterior').href).toBe('/quote/instant')
  })
})
