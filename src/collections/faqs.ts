import type { CollectionConfig } from 'payload'

import { publicRead } from '@/access/public-read'
import { isOwner, isSignedIn } from '@/access/roles'
import { FAQ_CATEGORIES } from '@/config/content'
import { orderField, TOKENS_HINT } from '@/fields/common'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  admin: {
    group: 'Content',
    useAsTitle: 'question',
    defaultColumns: ['question', 'category', 'showOnHome'],
    description: `Questions for the FAQ page, category hubs and the home page. Service pages have their own FAQs. ${TOKENS_HINT}`,
  },
  access: { read: publicRead(), create: isSignedIn, update: isSignedIn, delete: isOwner },
  defaultSort: 'order',
  fields: [
    { name: 'question', type: 'text', required: true, unique: true },
    { name: 'answer', type: 'textarea', required: true },
    {
      name: 'category',
      type: 'select',
      required: true,
      index: true,
      options: [...FAQ_CATEGORIES],
      admin: { position: 'sidebar' },
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      index: true,
      admin: { position: 'sidebar', description: 'Also show on these service pages.' },
    },
    {
      name: 'showOnHome',
      type: 'checkbox',
      admin: { position: 'sidebar', description: 'Include in the home page FAQ (6–8 is ideal).' },
    },
    orderField,
  ],
}
