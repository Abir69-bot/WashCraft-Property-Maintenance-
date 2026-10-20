import type { CollectionConfig } from 'payload'

import { fieldIsOwner, isOwner, isOwnerOrSelf, isSignedIn, ROLE_OPTIONS } from '@/access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role'],
  },
  auth: true,
  access: {
    admin: isSignedIn,
    create: isOwner,
    read: isOwnerOrSelf,
    update: isOwnerOrSelf,
    delete: isOwner,
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'staff',
      options: ROLE_OPTIONS,
      saveToJWT: true,
      access: { update: fieldIsOwner },
      admin: { description: 'Owners manage users, pricing and settings. Staff work leads.' },
    },
  ],
  hooks: {
    beforeChange: [
      // The account created on the "create first user" screen becomes the owner.
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data
        const { totalDocs } = await req.payload.count({ collection: 'users', req })
        return totalDocs === 0 ? { ...data, role: 'owner' } : data
      },
    ],
  },
}
