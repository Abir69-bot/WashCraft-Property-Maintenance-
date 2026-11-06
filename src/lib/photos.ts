import type { StaticImageData } from 'next/image'

import { stockByService, type StockPhoto } from '@/assets/photos'
import { serviceFeaturePhotos } from '@/assets/service-feature-photos'
import { mediaSrc } from '@/lib/view'
import type { Media } from '@/payload-types'

/** A photo ready for next/image: an admin upload or a static import. */
export type Photo = {
  src: string | StaticImageData
  alt: string
  width?: number | null
  height?: number | null
}

/** A service card's photo, with the licensed stock photo behind it (null for the owner's). */
export type ServicePhoto = Photo & { stock: StockPhoto | null }

export const fromMedia = (media: Media): Photo => ({
  src: mediaSrc(media),
  alt: media.alt,
  width: media.width,
  height: media.height,
})

export const fromStock = (photo: StockPhoto): Photo => ({
  src: photo.src,
  alt: photo.alt,
  width: photo.src.width,
  height: photo.src.height,
})

/**
 * The photo on a service's card, everywhere cards appear. The owner's photo (the service's
 * hero image in the admin) wins, except a wide side-by-side pair (3:2 or wider), which a card
 * would cut in half. Next comes a photo the owner supplied with the site (service-feature-photos),
 * then the licensed photo for that service.
 */
export function servicePhoto(slug: string, media: Media | null | undefined): ServicePhoto | null {
  const licensed = stockByService[slug]
  const pair = media?.width && media.height && media.width / media.height >= 1.5
  if (media && !(pair && licensed)) return { ...fromMedia(media), stock: null }
  const supplied = serviceFeaturePhotos[slug]
  if (supplied) return { ...supplied, stock: null }
  return licensed ? { ...fromStock(licensed), stock: licensed } : null
}
