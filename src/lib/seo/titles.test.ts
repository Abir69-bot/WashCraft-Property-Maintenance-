import { describe, expect, it } from 'vitest'

import { documentTitle } from './titles'

const context = { region: 'Denver Metro' }

describe('documentTitle', () => {
  it('follows the brief’s patterns', () => {
    expect(documentTitle('services', { title: 'Gutter Cleaning' }, context)).toBe(
      'Gutter Cleaning in Denver Metro',
    )
    expect(documentTitle('service-categories', { title: 'Winter' }, context)).toBe(
      'Winter Services in Denver Metro',
    )
    expect(documentTitle('cities', { name: 'Aurora' }, context)).toBe(
      'Property Maintenance in Aurora',
    )
  })

  it('uses the plain title for other pages', () => {
    expect(documentTitle('posts', { title: 'Ice dams, explained' }, context)).toBe(
      'Ice dams, explained',
    )
  })
})
