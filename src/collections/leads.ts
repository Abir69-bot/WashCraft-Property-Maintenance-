import type { CollectionConfig } from 'payload'

import { isOwner, isSignedIn } from '@/access/roles'
import { FREQUENCIES, FREQUENCY_LABELS, PROPERTY_TYPES } from '@/config/catalog'

export const LEAD_TYPES = [
  'quick',
  'instant',
  'custom',
  'snow_contract',
  'holiday_lights',
  'junk',
  'commercial_bid',
  'subscription',
  'contact',
] as const

export const LEAD_STATUSES = [
  'new',
  'estimate_viewed',
  'booking_requested',
  'contacted',
  'quoted',
  'booked',
  'won',
  'lost',
] as const

const options = (values: readonly string[]) =>
  values.map((value) => ({ label: value.replaceAll('_', ' '), value }))

/**
 * Every quote request (brief §11). Created only by server code (forms save with
 * overrideAccess); the public API can't create or read leads.
 */
export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    group: 'Leads',
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'status', 'cityName', 'totalHigh', 'createdAt'],
    listSearchableFields: ['name', 'email', 'phone', 'postalCode'],
  },
  access: { read: isSignedIn, create: isSignedIn, update: isSignedIn, delete: isOwner },
  defaultSort: '-createdAt',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Request',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'name', type: 'text', required: true },
                { name: 'phone', type: 'text', required: true },
                { name: 'email', type: 'email' },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'address', type: 'text' },
                { name: 'postalCode', label: 'ZIP code', type: 'text', index: true },
                { name: 'cityName', label: 'City', type: 'text' },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'city', type: 'relationship', relationTo: 'cities', index: true },
                { name: 'propertyType', type: 'select', options: options(PROPERTY_TYPES) },
                {
                  name: 'frequency',
                  type: 'select',
                  options: FREQUENCIES.map((value) => ({ label: FREQUENCY_LABELS[value], value })),
                },
              ],
            },
            {
              name: 'services',
              type: 'relationship',
              relationTo: 'services',
              hasMany: true,
              index: true,
            },
            {
              name: 'lineItems',
              type: 'array',
              admin: { readOnly: true },
              fields: [
                { name: 'service', type: 'relationship', relationTo: 'services' },
                { name: 'serviceName', type: 'text' },
                { name: 'answers', type: 'json' },
                {
                  type: 'row',
                  fields: [
                    { name: 'priceLow', type: 'number' },
                    { name: 'priceHigh', type: 'number' },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'totalLow', type: 'number', admin: { readOnly: true } },
                { name: 'totalHigh', type: 'number', admin: { readOnly: true } },
              ],
            },
            { name: 'preferredDates', type: 'text' },
            { name: 'notes', type: 'textarea', label: 'Customer notes' },
            {
              name: 'details',
              type: 'json',
              admin: {
                readOnly: true,
                description:
                  'Answers specific to the form used (snow contract, holiday lights, ...).',
              },
            },
            {
              name: 'files',
              label: 'Photos and documents',
              type: 'relationship',
              relationTo: 'lead-files',
              hasMany: true,
            },
          ],
        },
        {
          label: 'Consent & tracking',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'consent', type: 'checkbox', admin: { readOnly: true } },
                { name: 'consentAt', type: 'date', admin: { readOnly: true } },
              ],
            },
            { name: 'consentText', type: 'textarea', admin: { readOnly: true } },
            {
              name: 'utm',
              type: 'group',
              admin: { readOnly: true },
              fields: [
                {
                  type: 'row',
                  fields: ['source', 'medium', 'campaign', 'term', 'content'].map((name) => ({
                    name,
                    type: 'text' as const,
                  })),
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'referrer', type: 'text', admin: { readOnly: true } },
                { name: 'landingPage', type: 'text', admin: { readOnly: true } },
                { name: 'device', type: 'text', admin: { readOnly: true } },
              ],
            },
          ],
        },
        {
          label: 'Notifications',
          fields: [
            {
              name: 'notificationStatus',
              type: 'select',
              defaultValue: 'pending',
              options: options(['pending', 'sent', 'partial', 'failed']),
              admin: { readOnly: true },
            },
            { name: 'notificationLog', type: 'json', admin: { readOnly: true } },
            { name: 'reviewRequestedAt', type: 'date', admin: { readOnly: true } },
          ],
        },
      ],
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      index: true,
      options: options(LEAD_TYPES),
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      index: true,
      options: options(LEAD_STATUSES),
      admin: { position: 'sidebar' },
    },
    {
      name: 'outOfArea',
      type: 'checkbox',
      index: true,
      admin: { position: 'sidebar', readOnly: true, description: 'ZIP code outside your cities.' },
    },
    {
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar' },
    },
    { name: 'internalNotes', type: 'textarea', admin: { position: 'sidebar' } },
  ],
}

export const Applications: CollectionConfig = {
  slug: 'applications',
  labels: { singular: 'Job application', plural: 'Job applications' },
  admin: {
    group: 'Leads',
    useAsTitle: 'name',
    defaultColumns: ['name', 'jobOpening', 'status', 'createdAt'],
  },
  access: { read: isSignedIn, create: isSignedIn, update: isSignedIn, delete: isOwner },
  defaultSort: '-createdAt',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
        { name: 'phone', type: 'text', required: true },
      ],
    },
    { name: 'jobOpening', type: 'relationship', relationTo: 'job-openings', index: true },
    { name: 'resume', type: 'relationship', relationTo: 'lead-files' },
    { name: 'message', type: 'textarea' },
    { name: 'consent', type: 'checkbox', admin: { readOnly: true } },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      index: true,
      options: options(['new', 'reviewing', 'interview', 'hired', 'declined']),
      admin: { position: 'sidebar' },
    },
  ],
}

/** Customer photos, RFPs and résumés. Private: only signed-in staff can open them. */
export const LeadFiles: CollectionConfig = {
  slug: 'lead-files',
  labels: { singular: 'Lead file', plural: 'Lead files' },
  admin: {
    group: 'Leads',
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'mimeType', 'createdAt'],
  },
  access: { read: isSignedIn, create: isSignedIn, update: isSignedIn, delete: isOwner },
  upload: {
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/heic',
      'image/heif',
      'application/pdf',
    ],
  },
  fields: [],
}
