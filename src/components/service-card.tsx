import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { PhotoCredits } from '@/components/photo-credits'
import { ServiceIcon } from '@/components/service-icon'
import { getServicePhotos } from '@/lib/data/service-photos'
import { servicePhoto } from '@/lib/photos'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils'

/**
 * Outcome-led service card (brief §9.1.5): photo, name, one line, and an outcome button. The
 * photo comes from servicePhoto() (the owner's, else a licensed one), so every page's cards
 * match; a service with neither shows its icon. Pages list the stock credits under the grid.
 */
export async function ServiceCard({
  slug,
  title,
  summary,
  icon,
  outcomeLabel,
  className,
}: {
  slug: string
  title: string
  summary: string
  icon?: string | null
  outcomeLabel: string
  className?: string
}) {
  const photo = servicePhoto(slug, (await getServicePhotos())[slug])
  return (
    <article className={cn('group flex card-lift flex-col overflow-hidden card-raised', className)}>
      {photo && (
        <div className="relative aspect-video overflow-hidden bg-surface">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        {!photo && (
          <span className="mb-4 icon-chip">
            <ServiceIcon name={icon} className="size-6" />
          </span>
        )}
        <h3 className="text-h3">
          <Link href={routes.service(slug)} className="text-primary no-underline hover:underline">
            {title}
          </Link>
        </h3>
        <p className="mt-2 text-muted">{summary}</p>
        <Link
          href={routes.service(slug)}
          aria-label={`${outcomeLabel}: ${title}`}
          className="mt-auto inline-flex min-h-11 items-center gap-2 pt-4 font-semibold"
        >
          {outcomeLabel}
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </div>
    </article>
  )
}

/** Credits for the stock photos on a set of service cards (none when they're all the owner's). */
export async function ServiceCardCredits({
  slugs,
  className,
}: {
  slugs: string[]
  className?: string
}) {
  const photos = await getServicePhotos()
  return (
    <PhotoCredits
      photos={slugs.map((slug) => servicePhoto(slug, photos[slug])?.stock)}
      className={cn('mt-6 text-muted', className)}
    />
  )
}
