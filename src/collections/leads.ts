import type { CollectionConfig } from 'payload'

import { isOwner, isSignedIn } from '@/access/roles'
import { FREQUENCIES, FREQUENCY_LABELS, PROPERTY_TYPES } from '@/config/catalog'
import { LEAD_STATUSES, LEAD_TYPES } from '@/config/leads'
import { reimportHandler, requestReview } from '@/lib/leads/admin'
import { downloadLeadFile, removeStoredFile } from '@/lib/leads/lead-files'

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
    components: { beforeListTable: ['@/components/admin/lead-list-banners#FailedLeadsBanner'] },
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
                // Visitors give a phone number, an email address, or both.
                { name: 'phone', type: 'text' },
                { name: 'email', type: 'email' },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'address', type: 'text' },
                { name: 'postalCode', label: 'Postal code', type: 'text', index: true },
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
              name: 'plan',
              type: 'relationship',
              relationTo: 'plans',
              admin: { condition: (data) => Boolean(data.plan) },
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
      admin: {
        position: 'sidebar',
        components: { Cell: '@/components/admin/status-cell#StatusCell' },
      },
    },
    {
      name: 'callbackRequested',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'The customer asked for a call after seeing the estimate.',
      },
    },
    {
      name: 'outOfArea',
      type: 'checkbox',
      index: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Postal code outside your cities.',
      },
    },
    {
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar' },
    },
    { name: 'internalNotes', type: 'textarea', admin: { position: 'sidebar' } },
  ],
  endpoints: [{ path: '/reimport', method: 'post', handler: reimportHandler }],
  hooks: { afterChange: [requestReview] },
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

/**
 * Customer photos, RFPs and résumés. The files live in private storage (R2, or a local folder
 * in development) and are never public: signed-in staff download them through this collection's
 * endpoint. Created only by the quote forms (brief §10.5).
 */
export const LeadFiles: CollectionConfig = {
  slug: 'lead-files',
  labels: { singular: 'Lead file', plural: 'Lead files' },
  admin: {
    group: 'Leads',
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'mimeType', 'size', 'createdAt'],
    description: 'Photos and documents customers sent with their requests. Staff only.',
  },
  access: { read: isSignedIn, create: () => false, update: () => false, delete: isOwner },
  fields: [
    { name: 'filename', type: 'text', required: true, admin: { readOnly: true } },
    {
      type: 'row',
      fields: [
        {
          name: 'mimeType',
          label: 'Type',
          type: 'text',
          required: true,
          admin: { readOnly: true },
        },
        {
          name: 'size',
          label: 'Size (bytes)',
          type: 'number',
          required: true,
          admin: { readOnly: true },
        },
      ],
    },
    {
      name: 'key',
      type: 'text',
      required: true,
      unique: true,
      admin: { readOnly: true, description: 'Where the file is kept in private storage.' },
    },
    {
      name: 'download',
      type: 'ui',
      admin: { components: { Field: '@/components/admin/file-download#FileDownload' } },
    },
  ],
  endpoints: [{ path: '/:id/download', method: 'get', handler: downloadLeadFile }],
  hooks: { afterDelete: [removeStoredFile] },
}
