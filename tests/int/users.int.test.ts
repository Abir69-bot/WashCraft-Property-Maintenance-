import { getPayload, type Migration, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { migrations } from '@/migrations'
import config from '@/payload.config'

let payload: Payload

beforeAll(async () => {
  payload = await getPayload({ config })
  // Same path as production: the committed migrations, never schema push. (Payload's generic
  // Migration type takes `unknown` args; the generated ones take the Postgres adapter's.)
  await payload.db.migrate({ migrations: migrations as unknown as Migration[] })
  await payload.delete({ collection: 'users', where: { id: { exists: true } } })
})

afterAll(async () => {
  await payload.delete({ collection: 'users', where: { id: { exists: true } } })
  await payload.destroy()
})

describe('users', () => {
  it('makes the first account the owner and later accounts staff', async () => {
    // Both ask for "staff" (the form default); only the very first account is promoted.
    const first = await payload.create({
      collection: 'users',
      data: { email: 'owner@example.com', password: 'correct-horse-battery', role: 'staff' },
    })
    const second = await payload.create({
      collection: 'users',
      data: { email: 'staff@example.com', password: 'correct-horse-battery', role: 'staff' },
    })

    expect(first.role).toBe('owner')
    expect(second.role).toBe('staff')
  })

  it('lets staff read only their own account', async () => {
    const staff = await payload.find({
      collection: 'users',
      where: { email: { equals: 'staff@example.com' } },
    })
    const visible = await payload.find({
      collection: 'users',
      overrideAccess: false,
      user: staff.docs[0],
    })

    expect(visible.docs.map((user) => user.email)).toEqual(['staff@example.com'])
  })

  it('stops staff promoting themselves', async () => {
    const { docs } = await payload.find({
      collection: 'users',
      where: { email: { equals: 'staff@example.com' } },
    })
    const updated = await payload.update({
      collection: 'users',
      id: docs[0].id,
      data: { role: 'owner' },
      overrideAccess: false,
      user: docs[0],
    })

    expect(updated.role).toBe('staff')
  })
})
