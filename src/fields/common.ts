import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import type { ArrayField, CheckboxField, NumberField, SelectField, Tab, TextField } from 'payload'

import { SEASON_LABELS, SEASONS } from '@/config/catalog'
import { ICON_KEYS } from '@/config/icons'

/** Drafts with at most 20 versions per document, to protect Neon's free storage. */
export const VERSIONS = { drafts: true, maxPerDoc: 20 } as const

export const TOKENS_HINT = 'Write {region} to insert your service region.'

export const isSampleField: CheckboxField = {
  name: 'isSample',
  type: 'checkbox',
  label: 'Sample content',
  defaultValue: false,
  index: true,
  admin: {
    position: 'sidebar',
    description:
      'Samples show a "Sample" badge in development and preview, and never appear on the live site.',
  },
}

export const orderField: NumberField = {
  name: 'order',
  type: 'number',
  defaultValue: 100,
  admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
}

export const iconField: SelectField = {
  name: 'icon',
  type: 'select',
  required: true,
  options: ICON_KEYS.map((key) => ({ label: key, value: key })),
}

export const seasonsField: SelectField = {
  name: 'seasons',
  type: 'select',
  hasMany: true,
  required: true,
  defaultValue: ['all-year'],
  options: SEASONS.map((value) => ({ label: SEASON_LABELS[value], value })),
  admin: { description: 'When this service is offered. Dates are set in Seasonal settings.' },
}

/** Describes the photo to shoot. Shown as a placeholder until a real photo is uploaded. */
export function photoLabelField(name: string, label = 'Photo needed'): TextField {
  return {
    name,
    type: 'text',
    label,
    admin: { description: 'What the photo should show. Displayed until a real photo is uploaded.' },
  }
}

export function faqsField(name = 'faqs'): ArrayField {
  return {
    name,
    type: 'array',
    label: 'FAQs',
    labels: { singular: 'FAQ', plural: 'FAQs' },
    fields: [
      { name: 'question', type: 'text', required: true },
      { name: 'answer', type: 'textarea', required: true },
    ],
  }
}

/** SEO tab (stored as `meta`). Blank fields fall back to the page-type title pattern. */
export function seoTab(): Tab {
  return {
    name: 'meta',
    label: 'SEO',
    description: 'Leave blank to use the automatic title and description.',
    fields: [
      OverviewField({
        titlePath: 'meta.title',
        descriptionPath: 'meta.description',
        imagePath: 'meta.image',
      }),
      MetaTitleField({ hasGenerateFn: true }),
      MetaImageField({ relationTo: 'media' }),
      MetaDescriptionField({}),
      PreviewField({
        hasGenerateFn: true,
        titlePath: 'meta.title',
        descriptionPath: 'meta.description',
      }),
    ],
  }
}
