import { describe, expect, it } from 'vitest'

import { routes } from './routes'
import { SERVICES_MENU, servicesMenu } from './services-menu'

const service = (slug: string) => ({ slug })
const category = (slug: string, services: string[]) => ({ slug, services: services.map(service) })

describe('servicesMenu', () => {
  it('links services and categories that are live', () => {
    const [column] = servicesMenu(
      [category('exterior-cleaning', ['pressure-washing', 'soft-washing'])],
      [service('pressure-washing'), service('soft-washing')],
      [
        [
          { label: 'Exterior', targets: [{ category: 'exterior-cleaning' }] },
          { label: 'Pressure', targets: [{ service: 'pressure-washing' }] },
        ],
      ],
    )
    expect(column).toEqual([
      { label: 'Exterior', href: routes.category('exterior-cleaning') },
      { label: 'Pressure', href: routes.service('pressure-washing') },
    ])
  })

  it('falls back to the next target, and drops items with none', () => {
    const [column] = servicesMenu(
      [category('empty', [])],
      [],
      [
        [
          { label: 'Fallback', targets: [{ service: 'draft-service' }, { path: '/services' }] },
          { label: 'Unpublished', targets: [{ service: 'draft-service' }] },
          { label: 'Empty category', targets: [{ category: 'empty' }] },
        ],
      ],
    )
    expect(column).toEqual([{ label: 'Fallback', href: '/services' }])
  })

  it('sends a one-service category straight to its service', () => {
    const [column] = servicesMenu(
      [category('winter-services', ['snow-removal'])],
      [service('snow-removal')],
      [[{ label: 'Winter', targets: [{ category: 'winter-services' }] }]],
    )
    expect(column).toEqual([{ label: 'Winter', href: routes.service('snow-removal') }])
  })

  it('keeps the owner’s two columns of six', () => {
    expect(SERVICES_MENU.map((column) => column.length)).toEqual([6, 6])
    expect(SERVICES_MENU.at(-1)?.at(-1)?.label).toBe('All Services')
  })
})
