import { describe, expect, it } from 'vitest'

import { stockByService } from '@/assets/photos'
import { confirmedServices } from '@/config/site'
import { serviceHeroImages } from '@/seed/data/media'
import type { Media } from '@/payload-types'

import { servicePhoto } from './photos'

const media = (width: number, height: number) =>
  ({ id: 1, alt: 'Owner photo', url: '/api/media/file/job.jpg', width, height }) as Media

describe('servicePhoto', () => {
  it("uses the owner's photo when there is one", () => {
    const photo = servicePhoto('window-cleaning', media(1200, 900))
    expect(photo).toMatchObject({ src: '/api/media/file/job.jpg', alt: 'Owner photo', stock: null })
  })

  it('swaps a wide before/after pair for the licensed photo, which needs a credit', () => {
    const photo = servicePhoto('snow-removal', media(1536, 1024))
    expect(photo?.stock).toBe(stockByService['snow-removal'])
    expect(photo?.alt).toBe(stockByService['snow-removal'].alt)
  })

  it('keeps a wide photo when there is no licensed one to swap in', () => {
    expect(servicePhoto('roof-cleaning', media(1600, 900))?.stock).toBeNull()
  })

  it('falls back to the licensed photo, and to nothing', () => {
    expect(servicePhoto('house-cleaning', null)?.stock).toBe(stockByService['house-cleaning'])
    expect(servicePhoto('no-such-service', null)).toBeNull()
  })

  it('has a photo for every confirmed service', () => {
    const missing = confirmedServices.filter(
      (slug) => !stockByService[slug] && !serviceHeroImages[slug],
    )
    expect(missing).toEqual([])
  })

  it('never repeats a stock photo across services', () => {
    const photos = Object.values(stockByService)
    expect(new Set(photos).size).toBe(photos.length)
  })
})
