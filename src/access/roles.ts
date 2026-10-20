import type { Access, FieldAccess, PayloadRequest } from 'payload'

export type Role = 'owner' | 'staff'

export const ROLE_OPTIONS: { label: string; value: Role }[] = [
  { label: 'Owner', value: 'owner' },
  { label: 'Staff', value: 'staff' },
]

const roleOf = (req: PayloadRequest): Role | undefined => req.user?.role

export const isOwner: Access = ({ req }) => roleOf(req) === 'owner'

/** Plain boolean so it also fits `access.admin`. */
export const isSignedIn = ({ req }: { req: PayloadRequest }) => Boolean(req.user)

/** Owners manage everyone; staff can only see and edit their own account. */
export const isOwnerOrSelf: Access = ({ req }) => {
  if (roleOf(req) === 'owner') return true
  return req.user ? { id: { equals: req.user.id } } : false
}

export const fieldIsOwner: FieldAccess = ({ req }) => roleOf(req) === 'owner'
