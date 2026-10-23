import path from 'path'
import type { CollectionConfig } from 'payload'

import { isSignedIn } from '@/access/roles'
import { env } from '@/lib/env'

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
    // Photos, plus PDFs for public downloads such as certificates on the About page.
    mimeTypes: ['image/*', 'application/pdf'],
    staticDir: path.resolve(process.cwd(), env.UPLOADS_DIR),
  },
}
