import { slugField, type ArrayField, type CollectionConfig } from 'payload'

import { publicRead } from '@/access/public-read'
import { isOwner, isSignedIn } from '@/access/roles'
import { DEDICATED_FLOWS, QUOTE_MODE_LABELS, QUOTE_MODES } from '@/config/catalog'
import {
  faqsField,
  iconField,
  orderField,
  photoLabelField,
  seasonsField,
  seoTab,
  TOKENS_HINT,
  VERSIONS,
} from '@/fields/common'
import { redirectOnSlugChange } from '@/hooks/redirect-on-slug-change'
import { previewUrl } from '@/lib/preview'
import { validateQuoteQuestions } from '@/lib/quote/questions'

const titledItems = (
  name: string,
  label: string,
  minRows: number,
  maxRows: number,
): ArrayField => ({
  name,
  label,
  type: 'array',
  required: true,
  minRows,
  maxRows,
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'body', type: 'textarea', required: true },
  ],
})

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    preview: previewUrl('services'),
    group: 'Services',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'quoteMode', 'enabled', '_status'],
    listSearchableFields: ['title', 'slug'],
    description: `Each service has its own page at /services/<slug>. ${TOKENS_HINT}`,
  },
  access: {
    read: publicRead({ drafts: true }),
    create: isSignedIn,
    update: isSignedIn,
    delete: isOwner,
  },
  versions: VERSIONS,
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Page content',
          fields: [
            {
              name: 'headline',
              type: 'text',
              required: true,
              admin: { description: 'Hero headline. The H1 is always "[Service] in [region]".' },
            },
            {
              name: 'promise',
              type: 'text',
              required: true,
              admin: { description: 'One-line promise.' },
            },
            {
              name: 'summary',
              type: 'textarea',
              required: true,
              admin: { description: 'One or two sentences for service cards and search results.' },
            },
            { name: 'heroImage', type: 'upload', relationTo: 'media' },
            photoLabelField('heroImageLabel', 'Hero photo needed'),
            { name: 'problem', type: 'textarea', required: true, label: 'The problem we solve' },
            titledItems('benefits', 'Benefits (also shown as tabs)', 3, 5),
            {
              name: 'included',
              label: "What's included",
              type: 'array',
              required: true,
              minRows: 3,
              fields: [{ name: 'item', type: 'text', required: true }],
            },
            { name: 'method', type: 'textarea', required: true, label: 'How we do it' },
            { name: 'safety', type: 'textarea', label: 'Safety notes' },
            titledItems('process', 'Process steps', 4, 6),
            faqsField(),
          ],
        },
        {
          label: 'Card & menu',
          fields: [
            iconField,
            {
              name: 'outcomeLabel',
              type: 'text',
              required: true,
              admin: { description: 'Outcome-led button text, e.g. "Get streak-free windows".' },
            },
            {
              name: 'cardBullets',
              type: 'array',
              maxRows: 3,
              admin: { description: 'Three short points for the home page service explorer.' },
              fields: [{ name: 'text', type: 'text', required: true }],
            },
          ],
        },
        {
          label: 'Quote & pricing',
          fields: [
            {
              name: 'quoteMode',
              type: 'select',
              required: true,
              defaultValue: 'custom',
              options: QUOTE_MODES.map((value) => ({ label: QUOTE_MODE_LABELS[value], value })),
            },
            {
              name: 'parentService',
              type: 'relationship',
              relationTo: 'services',
              admin: {
                condition: (_, sibling) => sibling.quoteMode === 'addon',
                description: 'The service this add-on is sold with.',
              },
            },
            {
              name: 'dedicatedFlow',
              type: 'select',
              options: DEDICATED_FLOWS.map((value) => ({ label: value, value })),
              admin: { description: 'Send quote requests to a dedicated page instead.' },
            },
            {
              name: 'requiresSiteVisit',
              type: 'checkbox',
              admin: { description: 'Quotes need a site visit (e.g. painting, LED lighting).' },
            },
            {
              name: 'quoteQuestions',
              type: 'json',
              defaultValue: [],
              validate: (value: unknown) => validateQuoteQuestions(value),
              admin: {
                description:
                  'Questions asked in the instant-price wizard. Pricing rules refer to them by id.',
              },
            },
            {
              name: 'fromPrice',
              type: 'number',
              min: 0,
              admin: { description: 'Optional "from $X" shown in the pricing guide.' },
            },
            {
              name: 'priceFactors',
              type: 'array',
              admin: { description: 'What affects the price. The pricing guide hides when empty.' },
              fields: [{ name: 'factor', type: 'text', required: true }],
            },
            {
              name: 'addOns',
              type: 'array',
              fields: [
                { name: 'name', type: 'text', required: true },
                { name: 'description', type: 'text' },
              ],
            },
            seasonsField,
            {
              name: 'bookingWindowNote',
              type: 'text',
              admin: { description: 'Shown with the "Booking window" badge on seasonal services.' },
            },
          ],
        },
        {
          label: 'Related',
          fields: [
            {
              name: 'relatedServices',
              type: 'relationship',
              relationTo: 'services',
              hasMany: true,
              maxRows: 3,
              filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
            },
            {
              name: 'relatedSolutions',
              type: 'relationship',
              relationTo: 'solutions',
              hasMany: true,
            },
            { name: 'relatedPosts', type: 'relationship', relationTo: 'posts', hasMany: true },
          ],
        },
        seoTab(),
      ],
    },
    slugField({ position: 'sidebar' }),
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'service-categories',
      required: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
      index: true,
      admin: { position: 'sidebar', description: 'Untick to hide this service everywhere.' },
    },
    orderField,
  ],
  hooks: { afterChange: [redirectOnSlugChange('services')] },
}
