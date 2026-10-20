import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import { publicRead } from '@/access/public-read'
import { isOwner, isSignedIn } from '@/access/roles'
import { isSampleField, orderField, photoLabelField } from '@/fields/common'

const sampleAwareAccess = {
  read: publicRead({ samples: true }),
  create: isSignedIn,
  update: isSignedIn,
  delete: isOwner,
}

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    group: 'Social proof',
    useAsTitle: 'name',
    defaultColumns: ['name', 'service', 'city', 'rating', 'isSample'],
    description: 'Reviews you collected yourself. Google reviews are fetched automatically.',
  },
  access: sampleAwareAccess,
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true, admin: { description: 'e.g. "Maria G."' } },
    { name: 'quote', type: 'textarea', required: true },
    { name: 'rating', type: 'number', required: true, min: 1, max: 5, defaultValue: 5 },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    photoLabelField('photoLabel'),
    {
      name: 'source',
      type: 'select',
      required: true,
      defaultValue: 'direct',
      options: [
        { label: 'Told us directly', value: 'direct' },
        { label: 'Google', value: 'google' },
        { label: 'Facebook', value: 'facebook' },
        { label: 'Nextdoor', value: 'nextdoor' },
        { label: 'Other site', value: 'other' },
      ],
    },
    {
      name: 'sourceUrl',
      type: 'text',
      admin: {
        description: 'Link to the original review. Google reviews show "Verified Google review".',
      },
    },
    { name: 'date', type: 'date' },
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'city',
      type: 'relationship',
      relationTo: 'cities',
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
        description: 'The large featured testimonial on the home page.',
      },
    },
    isSampleField,
    orderField,
  ],
}

export const GoogleReviews: CollectionConfig = {
  slug: 'google-reviews',
  admin: {
    group: 'Social proof',
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'rating', 'publishedAt', 'hidden'],
    description: 'Copied from Google once a day. Edit only the "Hide on site" box.',
  },
  access: { read: publicRead(), create: isOwner, update: isSignedIn, delete: isOwner },
  defaultSort: '-publishedAt',
  fields: [
    { name: 'reviewId', type: 'text', required: true, unique: true, admin: { readOnly: true } },
    { name: 'authorName', type: 'text', required: true, admin: { readOnly: true } },
    { name: 'authorPhotoUrl', type: 'text', admin: { readOnly: true } },
    { name: 'rating', type: 'number', required: true, admin: { readOnly: true } },
    { name: 'text', type: 'textarea', admin: { readOnly: true } },
    { name: 'reviewUrl', type: 'text', admin: { readOnly: true } },
    { name: 'publishedAt', type: 'date', index: true, admin: { readOnly: true } },
    { name: 'fetchedAt', type: 'date', admin: { readOnly: true } },
    { name: 'hidden', type: 'checkbox', label: 'Hide on site', admin: { position: 'sidebar' } },
  ],
}

/** Keep the gallery's category in step with its service, so it can be filtered by either. */
const syncCategoryFromService: CollectionBeforeChangeHook = async ({ data, req }) => {
  const serviceId = typeof data.service === 'object' ? data.service?.id : data.service
  if (!serviceId) return data
  const service = await req.payload.findByID({
    collection: 'services',
    id: serviceId,
    depth: 0,
    req,
  })
  return { ...data, category: service.category }
}

export const GalleryItems: CollectionConfig = {
  slug: 'gallery-items',
  labels: { singular: 'Before & after', plural: 'Before & after' },
  admin: {
    group: 'Social proof',
    useAsTitle: 'caption',
    defaultColumns: ['caption', 'service', 'city', 'isSample'],
  },
  access: sampleAwareAccess,
  defaultSort: 'order',
  fields: [
    { name: 'caption', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'before', type: 'upload', relationTo: 'media' },
        { name: 'after', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      type: 'row',
      fields: [
        photoLabelField('beforeLabel', 'Before photo needed'),
        photoLabelField('afterLabel', 'After photo needed'),
      ],
    },
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      required: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'service-categories',
      index: true,
      admin: { position: 'sidebar', readOnly: true, description: 'Set from the service.' },
    },
    {
      name: 'city',
      type: 'relationship',
      relationTo: 'cities',
      index: true,
      admin: { position: 'sidebar' },
    },
    { name: 'featured', type: 'checkbox', admin: { position: 'sidebar' } },
    isSampleField,
    orderField,
  ],
  hooks: { beforeChange: [syncCategoryFromService] },
}

export const ClientLogos: CollectionConfig = {
  slug: 'client-logos',
  admin: {
    group: 'Social proof',
    useAsTitle: 'name',
    defaultColumns: ['name', 'isSample'],
    description: 'Only add clients who agreed to be shown. The logo strip hides until one exists.',
  },
  access: sampleAwareAccess,
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'website', type: 'text' },
    isSampleField,
    orderField,
  ],
}

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: {
    group: 'Social proof',
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'propertyType'],
    description: 'Commercial and HOA projects, shown on the commercial pages.',
  },
  access: sampleAwareAccess,
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'client', type: 'text', required: true },
    {
      name: 'propertyType',
      type: 'select',
      options: ['hoa', 'retail', 'office', 'industrial', 'parking-garage', 'multi-site'].map(
        (value) => ({ label: value, value }),
      ),
    },
    { name: 'services', type: 'relationship', relationTo: 'services', hasMany: true },
    { name: 'challenge', type: 'textarea', required: true },
    { name: 'solution', type: 'textarea', required: true },
    {
      name: 'results',
      type: 'array',
      fields: [{ name: 'result', type: 'text', required: true }],
    },
    { name: 'image', type: 'upload', relationTo: 'media' },
    photoLabelField('imageLabel'),
    isSampleField,
    orderField,
  ],
}
