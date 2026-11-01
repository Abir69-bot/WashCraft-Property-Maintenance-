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
  natural = false,
  className,
}: {
  media: number | Media | null | undefined
  label?: string | null
  ratio?: PhotoRatio
  /** Rendered width hint for next/image, e.g. "(min-width: 1024px) 50vw, 100vw". */
  sizes: string
  priority?: boolean
  /** Show a landscape photo at its own proportions, uncropped (e.g. a before/after pair). */
  natural?: boolean
  className?: string
}) {
  if (media && typeof media === 'object' && media.url) {
    const uncropped = natural && media.width && media.height && media.width > media.height
    return (
      <div
        className={cn(
          'relative overflow-hidden rounded-card bg-surface',
          !uncropped && RATIOS[ratio],
          className,
        )}
        style={uncropped ? { aspectRatio: `${media.width} / ${media.height}` } : undefined}
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
