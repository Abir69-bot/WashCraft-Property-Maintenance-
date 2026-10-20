import type { AccessArgs } from 'payload'
import { describe, expect, it } from 'vitest'

import { publicRead } from './public-read'

const visitor = { req: { user: null } } as unknown as AccessArgs
const signedIn = { req: { user: { id: 1, role: 'staff' } } } as unknown as AccessArgs

describe('publicRead', () => {
  it('lets signed-in users read everything', () => {
    expect(publicRead({ drafts: true, samples: true, production: true })(signedIn)).toBe(true)
  })

  it('shows visitors published documents only', () => {
    expect(publicRead({ drafts: true, production: false })(visitor)).toEqual({
      and: [{ _status: { equals: 'published' } }],
    })
  })

  it('hides sample content from visitors on the live site', () => {
    expect(publicRead({ samples: true, production: true })(visitor)).toEqual({
      and: [{ or: [{ isSample: { equals: false } }, { isSample: { exists: false } }] }],
    })
  })

  it('keeps sample content visible in development and preview', () => {
    expect(publicRead({ samples: true, production: false })(visitor)).toBe(true)
  })

  it('combines both rules', () => {
    const where = publicRead({ drafts: true, samples: true, production: true })(visitor)
    expect(where).toMatchObject({
      and: [{ _status: { equals: 'published' } }, { or: expect.any(Array) }],
    })
  })
})
