import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { ServiceIcon } from '@/components/service-icon'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils'

/** Outcome-led service card (brief §9.1.5): icon, name, one line, and an outcome button. */
export function ServiceCard({
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
  return (
    <article className={cn('flex card-lift flex-col card-raised p-6', className)}>
      <span className="icon-chip">
        <ServiceIcon name={icon} className="size-6" />
      </span>
      <h3 className="mt-4 text-h3">
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
    </article>
  )
}
