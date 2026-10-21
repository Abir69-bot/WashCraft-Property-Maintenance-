import { describe, expect, it } from 'vitest'

import {
  backupEmail,
  customerEmail,
  customerSms,
  ownerEmail,
  ownerSms,
  priceRange,
  reviewRequest,
  type LeadSummary,
} from './messages'

const site = {
  name: 'WashCraft Property Maintenance',
  shortName: 'WashCraft',
  phone: '(720) 555-0142',
  email: 'hello@example.com',
  responseTimePromise: null,
}

const lead: LeadSummary = {
  id: 7,
  type: 'instant',
  name: 'Maria Gomez',
  phone: '(303) 555-0199',
  email: 'maria@example.com',
  postalCode: '80202',
  cityName: 'Denver',
  services: ['Gutter Cleaning', 'Window Cleaning'],
  totalLow: 335,
  totalHigh: 1435.5,
  details: { snowTrigger: '2 inches', addOns: ['Salting', 'Ice control'], storage: true },
  files: [{ name: 'front.jpg', url: 'https://example.com/api/lead-files/3/download' }],
}

describe('lead messages', () => {
  it('formats price ranges', () => {
    expect(priceRange(335, 1435.5)).toBe('$335–$1,436')
    expect(priceRange(0, 0)).toBeNull()
  })

  it('alerts the owner by SMS with who, what, where, price and a link', () => {
    expect(ownerSms(lead, 'https://x/admin/collections/leads/7')).toBe(
      'New instant price lead: Maria Gomez, Gutter Cleaning, Window Cleaning, Denver, $335–$1,436 — https://x/admin/collections/leads/7',
    )
    expect(ownerSms({ ...lead, cityName: null, outOfArea: true, services: [] }, null)).toBe(
      'New instant price lead: Maria Gomez, ZIP 80202, $335–$1,436 (outside your area)',
    )
  })

  it('emails the owner every detail and file link', () => {
    const { subject, text } = ownerEmail(lead, 'https://x/admin/collections/leads/7')
    expect(subject).toBe('New instant price lead: Maria Gomez (Denver)')
    expect(text).toContain('Phone: (303) 555-0199')
    expect(text).toContain('Snow Trigger: 2 inches')
    expect(text).toContain('Add Ons: Salting, Ice control')
    expect(text).toContain('Storage: Yes')
    expect(text).toContain('- front.jpg: https://example.com/api/lead-files/3/download')
    expect(text).not.toContain('Address:')
  })

  it('confirms to the customer without promising a reply time unless one is set', () => {
    const email = customerEmail(lead, site, 'Confirmed after photos or a visit.')
    expect(email.text).toContain('Hi Maria,')
    expect(email.text).toContain('Your estimate: $335–$1,436. Confirmed after photos or a visit.')
    expect(email.text).toContain('We’ll be in touch to confirm the details.')
    expect(
      customerEmail(lead, { ...site, responseTimePromise: 'within 1 business day' }).text,
    ).toContain('We’ll get back to you within 1 business day.')
  })

  it('always includes an opt-out in customer texts', () => {
    expect(customerSms(lead, site)).toMatch(/Reply STOP to opt out\.$/)
    expect(reviewRequest(lead, site, 'https://g.page/r/x').sms).toMatch(/Reply STOP to opt out\.$/)
  })

  it('leaves out placeholder business facts', () => {
    expect(customerSms(lead, { ...site, phone: '[PHONE]' })).not.toContain('[PHONE]')
  })

  it('puts the whole record in the backup email', () => {
    const email = backupEmail(lead, { id: 'abc', lead: { name: 'Maria Gomez' } })
    expect(email.subject).toBe('New instant price lead (saved to backup): Maria Gomez')
    expect(email.text).toContain('"id": "abc"')
  })
})

describe('quoteUpdate', async () => {
  const { quoteUpdate } = await import('./messages')
  it('tells the owner who wants to book', () => {
    expect(quoteUpdate(lead, 'book', 'https://x/7').sms).toBe(
      'Maria Gomez wants to book their instant price estimate. Phone: (303) 555-0199 — https://x/7',
    )
    expect(quoteUpdate(lead, 'callback', 'https://x/7').email.subject).toBe(
      'Maria Gomez asked for a call-back about their estimate',
    )
  })
})
