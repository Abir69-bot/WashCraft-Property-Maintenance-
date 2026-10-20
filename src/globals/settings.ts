import type { Field, GlobalConfig } from 'payload'

import { isOwner, isSignedIn } from '@/access/roles'
import { FREQUENCIES, FREQUENCY_LABELS, SEASON_LABELS, SEASONS } from '@/config/catalog'
import { photoLabelField, TOKENS_HINT } from '@/fields/common'

const publicGlobal = { read: () => true, update: isSignedIn }
const ownerGlobal = { read: () => true, update: isOwner }

const seasonOptions = SEASONS.map((value) => ({ label: SEASON_LABELS[value], value }))

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
].map((label, index) => ({ label, value: String(index + 1) }))

const link = (name: string): Field => ({
  name,
  type: 'group',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
  ],
})

const links = (name: string, label?: string): Field => ({
  name,
  label,
  type: 'array',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
  ],
})

/** Date range for one season; may wrap the new year (winter: Nov–Mar). */
const seasonRange = (name: string): Field => ({
  name,
  type: 'group',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'startMonth', type: 'select', required: true, options: MONTHS },
        { name: 'startDay', type: 'number', required: true, min: 1, max: 31, defaultValue: 1 },
        { name: 'endMonth', type: 'select', required: true, options: MONTHS },
        { name: 'endDay', type: 'number', required: true, min: 1, max: 31 },
      ],
    },
  ],
})

export const SeasonalSettings: GlobalConfig = {
  slug: 'seasonal-settings',
  label: 'Seasonal settings',
  admin: {
    group: 'Settings',
    description: 'Seasons drive the announcement bar, home page hero and "in season now" lists.',
  },
  access: publicGlobal,
  fields: [
    {
      name: 'seasons',
      type: 'group',
      fields: ['spring', 'summer', 'fall', 'winter', 'holiday'].map(seasonRange),
    },
    {
      name: 'heroOverride',
      type: 'select',
      defaultValue: 'auto',
      options: [{ label: 'Automatic (by date)', value: 'auto' }, ...seasonOptions],
      admin: { description: 'Force a seasonal home page hero instead of switching by date.' },
    },
    {
      name: 'announcements',
      type: 'array',
      admin: {
        description:
          'The bar at the top of every page shows the first active one for the current season.',
      },
      fields: [
        { name: 'season', type: 'select', required: true, options: seasonOptions },
        { name: 'message', type: 'text', required: true },
        {
          type: 'row',
          fields: [
            { name: 'linkLabel', type: 'text' },
            { name: 'linkHref', type: 'text' },
          ],
        },
        { name: 'active', type: 'checkbox', defaultValue: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'snowSignupDeadline', type: 'date', admin: { description: 'Hidden when blank.' } },
        {
          name: 'routesRemaining',
          type: 'number',
          min: 0,
          admin: { description: 'Snow routes left this season. Hidden when blank.' },
        },
      ],
    },
  ],
}

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  admin: {
    group: 'Settings',
    description: 'The Services menu is built from your categories and services.',
  },
  access: publicGlobal,
  fields: [
    link('headerCta'),
    links('companyLinks', 'Company menu'),
    links('commercialLinks', 'Commercial menu (extra links)'),
    {
      name: 'featuredCard',
      type: 'group',
      admin: { description: 'The card in the Services menu. Automatic shows what’s in season.' },
      fields: [
        { name: 'automatic', type: 'checkbox', defaultValue: true },
        { name: 'title', type: 'text' },
        { name: 'text', type: 'textarea' },
        { name: 'href', type: 'text' },
      ],
    },
  ],
}

export const Footer: GlobalConfig = {
  slug: 'footer',
  admin: { group: 'Settings' },
  access: publicGlobal,
  fields: [
    { name: 'blurb', type: 'textarea', required: true, admin: { description: TOKENS_HINT } },
    {
      name: 'servicesPerCategory',
      type: 'number',
      defaultValue: 5,
      min: 1,
      max: 10,
      admin: { description: 'How many services each footer column lists before "All services".' },
    },
    {
      name: 'callBand',
      label: '"Let’s talk" band',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'text', type: 'text' },
        {
          name: 'marquee',
          type: 'array',
          admin: { description: 'Short phrases that scroll across the band.' },
          fields: [{ name: 'text', type: 'text', required: true }],
        },
      ],
    },
    links('legalLinks', 'Legal links'),
  ],
}

export const HOME_SECTIONS = [
  'hero',
  'quick-quote',
  'client-logos',
  'trust-strip',
  'services',
  'seasonal-spotlight',
  'how-it-works',
  'before-after',
  'guarantee',
  'need-us-now',
  'testimonials',
  'why-choose-us',
  'comparison',
  'commercial',
  'plans',
  'founder',
  'service-areas',
  'faq',
  'articles',
  'final-cta',
] as const

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Home page',
  admin: {
    group: 'Settings',
    description: `Home page sections and shared content blocks. ${TOKENS_HINT}`,
  },
  access: publicGlobal,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Sections',
          fields: [
            {
              name: 'sections',
              type: 'array',
              admin: { description: 'Drag to reorder. Sections without content hide themselves.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'section',
                      type: 'select',
                      required: true,
                      options: HOME_SECTIONS.map((value) => ({ label: value, value })),
                    },
                    { name: 'enabled', type: 'checkbox', defaultValue: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Hero',
          fields: [
            {
              name: 'heroVariants',
              type: 'array',
              admin: { description: 'One per season. The site picks the one for today’s date.' },
              fields: [
                { name: 'season', type: 'select', required: true, options: seasonOptions },
                { name: 'eyebrow', type: 'text' },
                { name: 'headline', type: 'text', required: true },
                { name: 'subline', type: 'textarea', required: true },
                link('cta'),
                photoLabelField('imageLabel', 'Hero photo needed'),
              ],
            },
          ],
        },
        {
          label: 'Shared blocks',
          fields: [
            {
              name: 'howItWorks',
              type: 'array',
              minRows: 3,
              maxRows: 3,
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea', required: true },
              ],
            },
            {
              name: 'recurringUpsell',
              type: 'text',
              admin: { description: 'Shown under step 3.' },
            },
            {
              name: 'whyChooseUs',
              type: 'array',
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea', required: true },
                { name: 'image', type: 'upload', relationTo: 'media' },
                photoLabelField('imageLabel'),
              ],
            },
            {
              name: 'comparison',
              type: 'group',
              admin: { description: 'Generic categories only. Never name a competitor.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'usLabel', type: 'text', required: true },
                    { name: 'independentLabel', type: 'text', required: true },
                    { name: 'largeLabel', type: 'text', required: true },
                  ],
                },
                {
                  name: 'rows',
                  type: 'array',
                  fields: [
                    { name: 'criterion', type: 'text', required: true },
                    {
                      type: 'row',
                      fields: [
                        { name: 'us', type: 'text', required: true },
                        { name: 'independent', type: 'text', required: true },
                        { name: 'large', type: 'text', required: true },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export const FeatureFlags: GlobalConfig = {
  slug: 'feature-flags',
  label: 'Feature switches',
  admin: { group: 'Settings' },
  access: ownerGlobal,
  fields: [
    {
      name: 'cityServicePages',
      label: 'City service pages',
      type: 'checkbox',
      admin: {
        description: 'Build /areas/<city>/<service> pages for the services picked on each city.',
      },
    },
    {
      name: 'reviewRequests',
      type: 'checkbox',
      admin: {
        description:
          'Ask customers for a Google review when a lead is marked "won" (with consent).',
      },
    },
    {
      name: 'calBooking',
      type: 'checkbox',
      admin: { description: 'Offer "Book a call" with Cal.com on the thank-you page.' },
    },
    {
      name: 'calLink',
      type: 'text',
      admin: {
        condition: (data) => Boolean(data.calBooking),
        description: 'Your Cal.com link, e.g. "your-name/site-visit".',
      },
    },
    { name: 'chatWidget', type: 'checkbox', admin: { description: 'Show the chat widget slot.' } },
    {
      name: 'propertyLookup',
      type: 'checkbox',
      admin: { description: 'Pre-fill home size in the wizard (needs a property data source).' },
    },
  ],
}

export const PricingSettings: GlobalConfig = {
  slug: 'pricing-settings',
  label: 'Pricing settings',
  admin: { group: 'Pricing', description: 'How instant prices are shown as a range.' },
  access: ownerGlobal,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'rangeLow', type: 'number', required: true, defaultValue: 0.9, min: 0.5, max: 1 },
        { name: 'rangeHigh', type: 'number', required: true, defaultValue: 1.15, min: 1, max: 2 },
      ],
    },
    { name: 'taxNote', type: 'text', required: true },
    { name: 'estimateNote', type: 'text', required: true },
    {
      name: 'frequencies',
      type: 'select',
      hasMany: true,
      defaultValue: [...FREQUENCIES],
      options: FREQUENCIES.map((value) => ({ label: FREQUENCY_LABELS[value], value })),
      admin: {
        description: 'Frequencies offered in the wizard (discounts are set under Discounts).',
      },
    },
  ],
}
