import type { CheckboxField, CollectionConfig } from 'payload'

import { publicRead } from '@/access/public-read'
import { isOwner, isSignedIn } from '@/access/roles'
import { FREQUENCIES, FREQUENCY_LABELS, SEASON_LABELS, SEASONS } from '@/config/catalog'
import { orderField } from '@/fields/common'

const ownerEdits = { read: isSignedIn, create: isOwner, update: isOwner, delete: isOwner }

const needsReviewField: CheckboxField = {
  name: 'needsReview',
  type: 'checkbox',
  defaultValue: true,
  index: true,
  admin: {
    position: 'sidebar',
    description:
      'Placeholder numbers. While ticked, the live site shows "Request a quote" instead of a price.',
  },
}

export const PRICING_UNITS = [
  { label: 'Per job (flat)', value: 'job' },
  { label: 'Per square foot', value: 'sq_ft' },
  { label: 'Per linear foot', value: 'linear_ft' },
  { label: 'Per window', value: 'window' },
  { label: 'Per panel', value: 'panel' },
  { label: 'Per bin', value: 'bin' },
  { label: 'Per item', value: 'item' },
] as const

/**
 * price = baseFee + unitRate × quantity × Π multipliers + add-ons, then at least minCharge
 * (brief §10.4). Questions are referenced by the ids in the service's quote questions.
 */
export const PricingRules: CollectionConfig = {
  slug: 'pricing-rules',
  admin: {
    group: 'Pricing',
    useAsTitle: 'name',
    defaultColumns: ['name', 'unit', 'baseFee', 'unitRate', 'minCharge', 'needsReview'],
    description: 'How the instant-price wizard prices each service. Only owners can change these.',
  },
  access: ownerEdits,
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      required: true,
      unique: true,
      index: true,
    },
    {
      type: 'row',
      fields: [
        { name: 'unit', type: 'select', required: true, options: [...PRICING_UNITS] },
        {
          name: 'quantityQuestion',
          type: 'text',
          admin: { description: 'Question id that gives the quantity. Blank = 1.' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'baseFee', type: 'number', required: true, min: 0, defaultValue: 0 },
        { name: 'unitRate', type: 'number', required: true, min: 0, defaultValue: 0 },
        { name: 'minCharge', type: 'number', required: true, min: 0, defaultValue: 0 },
      ],
    },
    {
      name: 'multipliers',
      type: 'array',
      admin: { description: 'e.g. question "stories", answer "2", factor 1.3' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'question', type: 'text', required: true },
            { name: 'answer', type: 'text', required: true },
            { name: 'factor', type: 'number', required: true, min: 0 },
          ],
        },
      ],
    },
    {
      name: 'addOns',
      type: 'array',
      admin: {
        description:
          'Added when a question has this answer ("yes" for checkboxes). Answer "*" multiplies the price by a number answer, e.g. $60 per tree.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'question', type: 'text', required: true },
            { name: 'answer', type: 'text', required: true, defaultValue: 'yes' },
            { name: 'price', type: 'number', required: true, min: 0 },
          ],
        },
      ],
    },
    { name: 'notes', type: 'textarea' },
    needsReviewField,
  ],
}

export const Discounts: CollectionConfig = {
  slug: 'discounts',
  admin: {
    group: 'Pricing',
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'percent', 'active', 'needsReview'],
  },
  access: ownerEdits,
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Bundle (several services)', value: 'bundle' },
        { label: 'Recurring frequency', value: 'frequency' },
      ],
    },
    {
      name: 'minServices',
      type: 'number',
      min: 2,
      admin: { condition: (_, sibling) => sibling.type === 'bundle' },
    },
    {
      name: 'frequency',
      type: 'select',
      options: FREQUENCIES.map((value) => ({ label: FREQUENCY_LABELS[value], value })),
      admin: { condition: (_, sibling) => sibling.type === 'frequency' },
    },
    { name: 'percent', type: 'number', required: true, min: 0, max: 50 },
    { name: 'active', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    needsReviewField,
  ],
}

export const Plans: CollectionConfig = {
  slug: 'plans',
  labels: { singular: 'Plan or package', plural: 'Plans & packages' },
  admin: {
    group: 'Pricing',
    useAsTitle: 'name',
    defaultColumns: ['name', 'kind', 'price', 'needsReview'],
    description: 'Maintenance plans and seasonal packages on /maintenance-plans.',
  },
  access: { read: publicRead(), create: isOwner, update: isOwner, delete: isOwner },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'kind',
      type: 'select',
      required: true,
      options: [
        { label: 'Maintenance plan (tier)', value: 'tier' },
        { label: 'Seasonal package', value: 'package' },
      ],
    },
    {
      name: 'season',
      type: 'select',
      options: SEASONS.map((value) => ({ label: SEASON_LABELS[value], value })),
      admin: { condition: (_, sibling) => sibling.kind === 'package' },
    },
    { name: 'tagline', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        {
          name: 'price',
          type: 'number',
          min: 0,
          admin: { description: 'Blank shows "Custom quote".' },
        },
        { name: 'priceUnit', type: 'text', admin: { description: 'e.g. "per year"' } },
      ],
    },
    {
      name: 'features',
      type: 'array',
      required: true,
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: { description: 'Pre-selected in the instant-price wizard.' },
    },
    { name: 'highlighted', type: 'checkbox', admin: { position: 'sidebar' } },
    needsReviewField,
    orderField,
  ],
}
