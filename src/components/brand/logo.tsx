import Image from 'next/image'

import logo from '@/assets/brand/washcraft-logo.png'
import { cn } from '@/lib/utils'

/**
 * The WashCraft badge logo. It has its own outline, so one version works on light and dark
 * backgrounds. Sized by height; next/image serves AVIF/WebP at 1x and 2x of that size.
 */
export function Logo({
  height = 64,
  priority = false,
  className,
}: {
  height?: number
  /** Set for the header logo, which is above the fold on every page. */
  priority?: boolean
  className?: string
}) {
  const width = Math.round((height * logo.width) / logo.height)
  return (
    <Image
      src={logo}
      alt="WashCraft Property Maintenance"
      width={width}
      height={height}
      priority={priority}
      className={cn('h-auto max-w-full', className)}
    />
  )
}
