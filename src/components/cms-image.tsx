import Image from 'next/image'

import { PhotoPlaceholder, RATIOS, type PhotoRatio } from '@/components/ui/photo-placeholder'
import { cn } from '@/lib/utils'
import { mediaSrc } from '@/lib/view'
import type { Media } from '@/payload-types'

/** An uploaded photo, or a placeholder describing the photo still needed. */
export function CmsImage({
  media,
  label,
  ratio = '4/3',
  sizes,
  priority = false,
  className,
}: {
  media: number | Media | null | undefined
  label?: string | null
  ratio?: PhotoRatio
  /** Rendered width hint for next/image, e.g. "(min-width: 1024px) 50vw, 100vw". */
  sizes: string
  priority?: boolean
  className?: string
}) {
  if (media && typeof media === 'object' && media.url) {
    return (
      <div
        className={cn('relative overflow-hidden rounded-card bg-surface', RATIOS[ratio], className)}
      >
        <Image
          src={mediaSrc(media)}
          alt={media.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    )
  }
  return (
    <PhotoPlaceholder label={label || 'Photo coming soon'} ratio={ratio} className={className} />
  )
}
