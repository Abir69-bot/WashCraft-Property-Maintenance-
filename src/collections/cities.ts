import { slugField, type CollectionConfig } from 'payload'

import { publicRead } from '@/access/public-read'
import { isOwner, isSignedIn } from '@/access/roles'
import { faqsField, orderField, photoLabelField, seoTab, VERSIONS } from '@/fields/common'
import { redirectOnSlugChange } from '@/hooks/redirect-on-slug-change'
import { previewUrl } from '@/lib/preview'

export const Cities: CollectionConfig = {
  slug: 'cities',
  labels: { singular: 'City', plural: 'Cities' },
  admin: {
    preview: previewUrl('cities'),
    group: 'Areas',
    useAsTitle: 'name',
    defaultColumns: ['name', 'state', 'slug', '_status'],
    description: 'Each city you serve gets a landing page at /areas/<slug>.',
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
    { name: 'name', type: 'text', required: true },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Page content',
          fields: [
            {
              name: 'intro',
              type: 'textarea',
              required: true,
              admin: {
                description:
                  'Write this for this city only: what homes and weather are like, and how you help.',
              },
            },
            {
              name: 'introWordCount',
              type: 'ui',
              admin: { components: { Field: '@/components/admin/word-count-hint#WordCountHint' } },
            },
            { name: 'heroImage', type: 'upload', relationTo: 'media' },
            photoLabelField('heroImageLabel', 'City photo needed'),
            {
              name: 'neighborhoods',
              type: 'array',
              fields: [
                { name: 'name', type: 'text', required: true },
                { name: 'blurb', type: 'textarea', required: true },
                { name: 'image', type: 'upload', relationTo: 'media' },
                photoLabelField('imageLabel'),
              ],
            },
            {
              name: 'localStats',
              label: 'Local conditions',
              type: 'array',
              admin: {
                description:
                  'Facts like average snowfall, each with its source. Never estimate: leave empty if unsure.',
              },
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'value', type: 'text', required: true },
                { name: 'sourceName', type: 'text', required: true },
                { name: 'sourceUrl', type: 'text', required: true },
              ],
            },
            {
              name: 'whyChooseUs',
              type: 'textarea',
              admin: { description: 'Optional local angle for the "Why choose us" section.' },
            },
            faqsField(),
          ],
        },
        {
          label: 'Location',
          fields: [
            {
              name: 'state',
              label: 'Province or state',
              type: 'text',
              required: true,
              admin: { description: 'Two-letter code, e.g. ON' },
            },
            {
              name: 'zipPrefixes',
              label: 'Postal codes',
              type: 'text',
              hasMany: true,
              admin: {
                description:
                  'The first three characters of each postal code the city covers (e.g. M1B), used by the "Do you serve my area?" checker and to match quotes to a city.',
              },
            },
            {
              type: 'row',
              fields: [
                { name: 'lat', type: 'number', label: 'Latitude', required: true },
                { name: 'lng', type: 'number', label: 'Longitude', required: true },
              ],
            },
            {
              name: 'servicePages',
              label: 'Service-in-city pages',
              type: 'relationship',
              relationTo: 'services',
              hasMany: true,
              admin: {
                description:
                  'Services that get a page at /areas/<city>/<service>. Needs the "City service pages" feature flag.',
              },
            },
          ],
        },
        seoTab(),
      ],
    },
    slugField({ position: 'sidebar', useAsSlug: 'name' }),
    orderField,
  ],
  hooks: { afterChange: [redirectOnSlugChange('cities')] },
}
