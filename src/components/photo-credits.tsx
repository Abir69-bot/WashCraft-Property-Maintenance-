import type { StockPhoto } from '@/assets/photos'
import { cn } from '@/lib/utils'

/** One photo's credit: title (linked to its source), author, license (linked) and changes made. */
export function CreditLine({ credit }: { credit: StockPhoto['credit'] }) {
  return (
    <>
      <a href={credit.source}>{credit.title}</a> by {credit.author},{' '}
      {credit.licenseUrl ? <a href={credit.licenseUrl}>{credit.license}</a> : credit.license}.{' '}
      {credit.changes}.
    </>
  )
}

/**
 * Credits for the licensed stock photos shown on a page, as their licenses require. Collapsed by
 * default; lists each photo once.
 */
export function PhotoCredits({
  photos,
  className,
}: {
  photos: (StockPhoto | null | undefined)[]
  className?: string
}) {
  const shown = [...new Set(photos.filter((photo): photo is StockPhoto => Boolean(photo)))]
  if (shown.length === 0) return null
  return (
    <details className={cn('text-small', className)}>
      <summary className="inline-flex min-h-11 cursor-pointer items-center">
        Stock photo credits
      </summary>
      <ul className="mt-2 grid gap-1">
        {shown.map(({ credit }) => (
          <li key={credit.source}>
            <CreditLine credit={credit} />
          </li>
        ))}
      </ul>
    </details>
  )
}
