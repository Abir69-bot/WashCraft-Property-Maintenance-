import { slugField, type CollectionConfig } from 'payload'

import { publicRead } from '@/access/public-read'
import { isOwner, isSignedIn } from '@/access/roles'
import { CATEGORY_TONES } from '@/config/catalog'
import {
  iconField,
  orderField,
  photoLabelField,
  seoTab,
  TOKENS_HINT,
  VERSIONS,
} from '@/fields/common'
import { redirectOnSlugChange } from '@/hooks/redirect-on-slug-change'
import { previewUrl } from '@/lib/preview'

export const ServiceCategories: CollectionConfig = {
  slug: 'service-categories',
  labels: { singular: 'Service category', plural: 'Service categories' },
  admin: {
    preview: previewUrl('service-categories'),
    group: 'Services',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'order', '_status'],
    description: `Each category has a hub page at /<slug>. ${TOKENS_HINT}`,
  },
  access: {
    read: publicRead({ drafts: true }),
    create: isOwner,
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
          label: 'Hub page',
          fields: [
            { name: 'headline', type: 'text', required: true },
            { name: 'intro', type: 'textarea', required: true },
            { name: 'heroImage', type: 'upload', relationTo: 'media' },
            photoLabelField('heroImageLabel', 'Hero photo needed'),
            {
              name: 'bookingNote',
              type: 'text',
              admin: {
                description: 'Seasonal timing, e.g. "Book fall gutter cleaning by October".',
              },
            },
            {
              name: 'bundles',
              type: 'array',
              admin: { description: 'Packages of services in this category.' },
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'textarea', required: true },
                { name: 'services', type: 'relationship', relationTo: 'services', hasMany: true },
              ],
            },
          ],
        },
        {
          label: 'Card & menu',
          fields: [
            iconField,
            {
              name: 'tone',
              type: 'select',
              required: true,
              options: CATEGORY_TONES.map((value) => ({ label: value, value })),
              admin: { description: 'Accent color for badges and icons.' },
            },
            { name: 'menuLabel', type: 'text', admin: { description: 'Shorter name for menus.' } },
            { name: 'summary', type: 'textarea', required: true },
            {
              name: 'outcomeLabel',
              type: 'text',
              required: true,
              admin: { description: 'Outcome-led button text for the category tile.' },
            },
          ],
        },
        seoTab(),
      ],
    },
    slugField({ position: 'sidebar' }),
    orderField,
  ],
  hooks: { afterChange: [redirectOnSlugChange('service-categories')] },
}
