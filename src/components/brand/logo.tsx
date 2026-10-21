import Image from 'next/image'

import badge from '@/assets/brand/washcraft-logo.png'
import horizontal from '@/assets/brand/washcraft-logo-horizontal.png'
import { cn } from '@/lib/utils'

const LOGOS = { badge, horizontal } as const

/**
 * The owner's logo. "horizontal" suits the header; "badge" suits large placements. Both have
 * their own outline, so they work on light and dark backgrounds. Sized by height; next/image
 * serves AVIF/WebP at 1x and 2x of that size.
 */
export function Logo({
  variant = 'badge',
  height = 64,
  priority = false,
  className,
}: {
  variant?: keyof typeof LOGOS
  height?: number
  /** Set where the logo is above the fold on every page (the header). */
  priority?: boolean
  className?: string
}) {
  const image = LOGOS[variant]
  return (
    <Image
      src={image}
      alt="WashCraft Property Maintenance"
      width={Math.round((height * image.width) / image.height)}
      height={height}
      priority={priority}
      className={cn('h-auto max-w-full', className)}
    />
  )
}
