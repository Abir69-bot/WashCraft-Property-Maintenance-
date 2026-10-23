import { describe, expect, it } from 'vitest'

import {
  applicantEmail,
  applicationBackupEmail,
  applicationOwnerEmail,
  applicationOwnerSms,
  backupEmail,
  customerEmail,
  customerSms,
  ownerEmail,
  ownerSms,
  priceRange,
  reviewRequest,
  type ApplicationSummary,
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

describe('job application messages', () => {
  const application: ApplicationSummary = {
    name: 'Chris Diaz',
    email: 'chris@example.com',
    phone: '(303) 555-0123',
    role: 'Exterior Cleaning Technician',
    message: 'Two seasons of pressure washing.',
    files: [{ name: 'resume.pdf', url: 'https://example.com/api/lead-files/9/download' }],
  }

  it('alerts the owner with the role and admin link', () => {
    expect(applicationOwnerSms(application, 'https://example.com/admin/x')).toBe(
      'New job application: Chris Diaz, Exterior Cleaning Technician — https://example.com/admin/x',
    )
    const email = applicationOwnerEmail(application, null)
    expect(email.subject).toBe('New job application: Chris Diaz (Exterior Cleaning Technician)')
    expect(email.text).toContain('Phone: (303) 555-0123')
    expect(email.text).toContain('Message: Two seasons of pressure washing.')
    expect(email.text).toContain('- resume.pdf: https://example.com/api/lead-files/9/download')
  })

  it('handles general applications without a role or résumé', () => {
    const general = { ...application, role: null, files: [], message: '' }
    expect(applicationOwnerSms(general, null)).toBe('New job application: Chris Diaz, any role')
    const email = applicationOwnerEmail(general, null)
    expect(email.text).toContain('Role: any role')
    expect(email.text).not.toContain('Message:')
    expect(email.text).not.toContain('Résumé')
  })

  it('confirms to the applicant without promising a reply time', () => {
    const email = applicantEmail(application, site)
    expect(email.subject).toBe('We got your application – WashCraft')
    expect(email.text).toContain('Hi Chris,')
    expect(email.text).toContain('for the Exterior Cleaning Technician role')
    expect(email.text).toContain('Call or text (720) 555-0142')
    expect(applicantEmail({ ...application, role: null }, site).text).not.toContain(' role')
  })

  it('puts the full record in the backup email', () => {
    const email = applicationBackupEmail(application, { id: 'abc' })
    expect(email.subject).toBe('New job application (saved to backup): Chris Diaz')
    expect(email.text).toContain('"id": "abc"')
  })
})
