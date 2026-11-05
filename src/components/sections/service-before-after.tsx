import Image, { type StaticImageData } from 'next/image'
import Link from 'next/link'

import type { BeforeAfterExample } from '@/assets/before-after'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils'

/** One half of the pair: the photo with its label along the bottom edge. */
function Half({
  src,
  alt,
  label,
}: {
  src: StaticImageData
  alt: string
  label: 'Before' | 'After'
}) {
  return (
    <figure className="group relative aspect-[4/5] overflow-hidden bg-night-raised">
      <Image
        src={src}
        alt={alt}
        placeholder="blur"
        fill
        sizes="(min-width: 1280px) 290px, (min-width: 1024px) 24vw, 50vw"
        className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
      />
      <figcaption className="absolute inset-x-0 bottom-0 flex justify-center bg-linear-to-t from-brand-ink/80 to-transparent pt-10 pb-3">
        <span
          className={cn(
            'rounded-full px-4 py-1 text-small font-bold tracking-widest uppercase',
            label === 'After' ? 'bg-cta text-brand-ink' : 'bg-brand-ink/85 text-white',
          )}
        >
          {label}
        </span>
      </figcaption>
    </figure>
  )
}

/**
 * A before-and-after pair beside "Why it matters" on service pages: the two photos side by side
 * in one rounded frame, split by a thin line, labelled along the bottom, with its caption and,
 * for licensed photos, a note that they are examples (credited on the Photo Credits page), not
 * WashCraft's work.
 */
export function BeforeAfterPair({ example }: { example: BeforeAfterExample }) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-0.5 overflow-hidden rounded-card border border-border bg-white/70 shadow-raised">
        <Half src={example.before} alt={example.beforeAlt} label="Before" />
        <Half src={example.after} alt={example.afterAlt} label="After" />
      </div>
      <p className="mt-3 text-small text-muted">
        {example.caption}.
        {example.credit && (
          <>
            {' '}
            Example photos by {example.credit.author}, not WashCraft’s work (
            <Link href={routes.photoCredits}>photo credits</Link>).
          </>
        )}
      </p>
    </div>
  )
}
