import type { CollectionConfig } from 'payload'

import { isSignedIn } from '@/access/roles'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Admin' },
  access: {
    read: () => true,
    create: isSignedIn,
    update: isSignedIn,
    delete: isSignedIn,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description:
          'Describe the photo for screen-reader users, e.g. "Clean cedar deck after washing".',
      },
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
  },
}
