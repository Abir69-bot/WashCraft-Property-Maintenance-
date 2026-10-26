import type { GlobalConfig } from 'payload'

import { isOwner } from '@/access/roles'

const text = (name: string, description?: string) => ({
  name,
  type: 'text' as const,
  admin: description ? { description } : undefined,
})

/** Business facts. Mirrors src/config/site.ts, which seeds it (brief §2). */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: {
    group: 'Settings',
    description:
      'Your business details, used everywhere on the site. Sections that need a blank value hide themselves.',
  },
  access: { read: () => true, update: isOwner },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Business',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'name', type: 'text', required: true },
                { name: 'shortName', type: 'text', required: true },
              ],
            },
            text('tagline'),
            {
              type: 'row',
              fields: [
                text('phone', 'Used for call and text links.'),
                { name: 'email', type: 'text' },
              ],
            },
            text('address', 'Leave blank if you travel to customers and have no public address.'),
            text('hours', 'e.g. Mon–Sat 8am–6pm'),
            text(
              'region',
              'How locals name your area, as it reads after "in", e.g. "the GTA". Fills {region} in text.',
            ),
            {
              type: 'row',
              fields: [
                {
                  name: 'country',
                  type: 'select',
                  required: true,
                  options: ['US', 'CA'],
                  defaultValue: 'US',
                },
                {
                  name: 'currency',
                  type: 'select',
                  required: true,
                  options: ['USD', 'CAD'],
                  defaultValue: 'USD',
                },
                {
                  name: 'locale',
                  type: 'select',
                  required: true,
                  options: ['en-US', 'en-CA'],
                  defaultValue: 'en-US',
                },
              ],
            },
          ],
        },
        {
          label: 'Trust & proof',
          description: 'Each item only appears on the site once you fill it in.',
          fields: [
            { name: 'foundedYear', type: 'number', min: 1900 },
            text('insuranceCoverage', 'e.g. "$2M general liability"'),
            text('workersCompRegistration', 'Your workers’ compensation policy or registration.'),
            { name: 'licenceNumbers', label: 'License numbers', type: 'text', hasMany: true },
            text('responseTimePromise', 'e.g. "within 1 business hour"'),
            {
              name: 'guarantee',
              type: 'textarea',
              admin: { description: 'Your satisfaction guarantee, in your own words.' },
            },
            {
              name: 'stats',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'jobsCompleted', type: 'number', min: 0 },
                    { name: 'happyClients', type: 'number', min: 0 },
                    { name: 'rating', type: 'number', min: 1, max: 5 },
                    { name: 'reviewCount', type: 'number', min: 0 },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Lead alerts',
          description:
            'Who hears about new quote requests. Texts need Twilio and emails need Resend (see README).',
          fields: [
            {
              name: 'alertPhones',
              label: 'Text new leads to',
              type: 'text',
              hasMany: true,
              admin: { description: 'Mobile numbers, e.g. (720) 555-0100.' },
            },
            {
              name: 'alertEmails',
              label: 'Email new leads to',
              type: 'text',
              hasMany: true,
              admin: { description: 'Leave empty to use the business email above.' },
            },
          ],
        },
        {
          label: 'Google & social',
          fields: [
            text('googlePlaceId', 'Lets the site fetch your Google reviews.'),
            text(
              'googleReviewUrl',
              'The "Leave us a review" link from your Google Business Profile.',
            ),
            {
              type: 'row',
              fields: [
                {
                  name: 'googleRating',
                  type: 'number',
                  admin: { readOnly: true, description: 'From Google, refreshed daily.' },
                },
                { name: 'googleReviewCount', type: 'number', admin: { readOnly: true } },
                { name: 'googleSyncedAt', type: 'date', admin: { readOnly: true } },
              ],
            },
            {
              name: 'social',
              type: 'group',
              fields: ['facebook', 'instagram', 'linkedin', 'youtube', 'tiktok', 'nextdoor'].map(
                (network) => text(network),
              ),
            },
          ],
        },
      ],
    },
    {
      name: 'demo',
      label: 'Still demo values',
      type: 'select',
      hasMany: true,
      options: [
        'tagline',
        'phone',
        'email',
        'address',
        'hours',
        'region',
        { label: 'Cities (in the Cities list)', value: 'serviceAreas' },
      ],
      admin: {
        position: 'sidebar',
        description:
          'Fields filled with stand-in values. Remove each one once you have confirmed or replaced it. The live site can’t be published while any remain.',
      },
    },
  ],
}
