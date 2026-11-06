import { describe, expect, it } from 'vitest'

import { routes } from './routes'
import {
  SERVICES_MENU,
  SERVICES_MENU_GROUPS,
  servicesMenu,
  servicesMenuGroups,
} from './services-menu'

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

describe('servicesMenuGroups', () => {
  const group = {
    heading: { label: 'Residential', targets: [{ category: 'interior-cleaning' }] },
    items: [
      { label: 'House', targets: [{ service: 'house-cleaning' }] },
      { label: 'Deep', targets: [{ service: 'deep-cleaning' }] },
    ],
  }

  it('links the heading to the category page and lists its live services', () => {
    const groups = servicesMenuGroups(
      [category('interior-cleaning', ['house-cleaning', 'deep-cleaning'])],
      [service('house-cleaning'), service('deep-cleaning')],
      [group],
    )
    expect(groups).toEqual([
      {
        heading: { label: 'Residential', href: routes.category('interior-cleaning') },
        links: [
          { label: 'House', href: routes.service('house-cleaning') },
          { label: 'Deep', href: routes.service('deep-cleaning') },
        ],
      },
    ])
  })

  it('leaves out unpublished services, and a group with nothing live', () => {
    const [only] = servicesMenuGroups(
      [category('interior-cleaning', ['house-cleaning'])],
      [service('house-cleaning')],
      [group],
    )
    expect(only.links).toEqual([{ label: 'House', href: routes.service('house-cleaning') }])
    expect(servicesMenuGroups([], [], [group])).toEqual([])
  })

  it('has the Residential Cleaning group the owner asked for', () => {
    const [residential] = SERVICES_MENU_GROUPS
    expect(residential.heading.label).toBe('Residential Cleaning')
    expect(residential.items.map((item) => item.label)).toEqual([
      'Interior House Cleaning',
      'Deep Cleaning',
      'Move-In & Move-Out Cleaning',
      'Regular Home Cleaning',
    ])
  })
})
