import { slugField, type CollectionConfig, type Field } from 'payload'

import { publicRead } from '@/access/public-read'
import { isOwner, isSignedIn } from '@/access/roles'
import { faqsField, photoLabelField, seoTab, TOKENS_HINT, VERSIONS } from '@/fields/common'
import { redirectOnSlugChange } from '@/hooks/redirect-on-slug-change'

const access = {
  read: publicRead({ drafts: true }),
  create: isSignedIn,
  update: isSignedIn,
  delete: isOwner,
}

const relatedServices: Field = {
  name: 'relatedServices',
  type: 'relationship',
  relationTo: 'services',
  hasMany: true,
  required: true,
  minRows: 1,
  index: true,
  admin: { description: 'Every article links to at least one service (brief §13).' },
}

const heroFields: Field[] = [
  { name: 'heroImage', type: 'upload', relationTo: 'media' },
  photoLabelField('heroImageLabel', 'Hero photo needed'),
]

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Blog post', plural: 'Blog posts' },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', '_status'],
    description: `Articles at /blog/<slug>. ${TOKENS_HINT}`,
  },
  access,
  versions: VERSIONS,
  defaultSort: '-publishedAt',
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Article',
          fields: [
            { name: 'excerpt', type: 'textarea', required: true },
            ...heroFields,
            { name: 'content', type: 'richText', required: true },
          ],
        },
        {
          label: 'Related',
          fields: [
            relatedServices,
            {
              name: 'relatedPosts',
              type: 'relationship',
              relationTo: 'posts',
              hasMany: true,
              maxRows: 3,
              filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
            },
          ],
        },
        seoTab(),
      ],
    },
    slugField({ position: 'sidebar' }),
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Seasonal tips', value: 'seasonal' },
        { label: 'How-to', value: 'how-to' },
        { label: 'Buying guides', value: 'guides' },
        { label: 'Company news', value: 'news' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'team-members',
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      index: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar' },
    },
  ],
  hooks: { afterChange: [redirectOnSlugChange('posts')] },
}

export const Solutions: CollectionConfig = {
  slug: 'solutions',
  labels: { singular: 'Solution', plural: 'Solutions' },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status'],
    description: `Problem-and-fix pages at /solutions/<slug>, e.g. "Ice dam prevention". ${TOKENS_HINT}`,
  },
  access,
  versions: VERSIONS,
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Page content',
          fields: [
            {
              name: 'problem',
              type: 'textarea',
              required: true,
              admin: {
                description: 'The problem in one or two sentences, in the customer’s words.',
              },
            },
            ...heroFields,
            { name: 'content', type: 'richText', required: true },
            faqsField(),
          ],
        },
        {
          label: 'Related',
          fields: [
            relatedServices,
            {
              name: 'relatedSolutions',
              type: 'relationship',
              relationTo: 'solutions',
              hasMany: true,
              maxRows: 3,
              filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
            },
          ],
        },
        seoTab(),
      ],
    },
    slugField({ position: 'sidebar' }),
  ],
  hooks: { afterChange: [redirectOnSlugChange('solutions')] },
}
