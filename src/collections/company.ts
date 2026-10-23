import { slugField, type CollectionConfig } from 'payload'

import { publicRead } from '@/access/public-read'
import { isOwner, isSignedIn } from '@/access/roles'
import { isSampleField, orderField, photoLabelField, seoTab, VERSIONS } from '@/fields/common'
import { redirectOnSlugChange } from '@/hooks/redirect-on-slug-change'
import { previewUrl } from '@/lib/preview'

const access = {
  read: publicRead({ drafts: true, samples: true }),
  create: isSignedIn,
  update: isSignedIn,
  delete: isOwner,
}

const textList = (name: string, label: string) => ({
  name,
  label,
  type: 'array' as const,
  fields: [{ name: 'text', type: 'text' as const, required: true }],
})

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  labels: { singular: 'Team member', plural: 'Team' },
  admin: {
    group: 'Company',
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'isFounder', 'isSample', '_status'],
    description: 'Each person has a bio page at /team/<slug>.',
    preview: previewUrl('team-members'),
  },
  access,
  versions: VERSIONS,
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Profile',
          fields: [
            { name: 'role', type: 'text', required: true },
            {
              name: 'shortBio',
              type: 'textarea',
              required: true,
              admin: { description: 'For cards.' },
            },
            {
              name: 'bio',
              type: 'textarea',
              required: true,
              admin: { description: 'Full bio page.' },
            },
            { name: 'photo', type: 'upload', relationTo: 'media' },
            photoLabelField('photoLabel'),
            textList('specialities', 'Specialities'),
          ],
        },
        seoTab(),
      ],
    },
    slugField({ position: 'sidebar', useAsSlug: 'name' }),
    {
      name: 'isFounder',
      type: 'checkbox',
      admin: { position: 'sidebar', description: 'Shown in "Meet the founder".' },
    },
    isSampleField,
    orderField,
  ],
  hooks: { afterChange: [redirectOnSlugChange('team-members')] },
}

export const JobOpenings: CollectionConfig = {
  slug: 'job-openings',
  labels: { singular: 'Job opening', plural: 'Job openings' },
  admin: {
    group: 'Company',
    useAsTitle: 'title',
    defaultColumns: ['title', 'employmentType', 'active', 'isSample', '_status'],
    description: 'Open roles at /careers/<slug>. Untick "Accepting applications" to close one.',
    preview: previewUrl('job-openings'),
  },
  access,
  versions: VERSIONS,
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Job',
          fields: [
            { name: 'summary', type: 'textarea', required: true },
            { name: 'location', type: 'text', required: true },
            {
              name: 'payRange',
              type: 'text',
              admin: { description: 'e.g. "$20–$24/hour". Leave blank to hide.' },
            },
            textList('responsibilities', 'What you’ll do'),
            textList('requirements', 'What you need'),
            textList('niceToHave', 'Nice to have'),
          ],
        },
        seoTab(),
      ],
    },
    slugField({ position: 'sidebar' }),
    {
      name: 'employmentType',
      type: 'select',
      required: true,
      options: [
        { label: 'Full-time', value: 'full-time' },
        { label: 'Part-time', value: 'part-time' },
        { label: 'Seasonal', value: 'seasonal' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Accepting applications',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    isSampleField,
    orderField,
  ],
  hooks: { afterChange: [redirectOnSlugChange('job-openings')] },
}
