import { Star } from 'lucide-react'

import { cn } from '@/lib/utils'

/** A 1–5 star rating, read out as "4 out of 5 stars". */
export function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span
      role="img"
      aria-label={`${rating} out of 5 stars`}
      className={cn('flex gap-0.5', className)}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden
          className={`size-4 ${i < rating ? 'fill-cta text-cta' : 'text-border-strong'}`}
        />
      ))}
    </span>
  )
}
