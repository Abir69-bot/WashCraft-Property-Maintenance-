import Image, { type StaticImageData } from 'next/image'
import Link from 'next/link'

import type { BeforeAfterExample } from '@/assets/before-after'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils'

import { Section } from './section'

/** One labelled photo of the pair: equal frames, rounded, a slow zoom on hover. */
function Frame({
  src,
  alt,
  label,
  wide,
}: {
  src: StaticImageData
  alt: string
  label: 'Before' | 'After'
  wide: boolean
}) {
  return (
    <figure className="group relative aspect-[4/5] overflow-hidden rounded-card border border-border bg-card">
      <Image
        src={src}
        alt={alt}
        placeholder="blur"
        fill
        sizes={wide ? '(min-width: 1024px) 380px, 50vw' : '(min-width: 768px) 280px, 50vw'}
        className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
      />
      <figcaption
        className={cn(
          'absolute top-3 left-3 rounded-full px-3 py-1 text-small font-bold tracking-wide uppercase',
          label === 'After' ? 'bg-cta text-brand-ink' : 'bg-brand-ink/80 text-white',
        )}
      >
        {label}
      </figcaption>
    </figure>
  )
}

/**
 * Before-and-after examples near the top of a service page: the two photos side by side (also
 * on phones, so the comparison stays visible), labelled, with a note that the pair is another
 * company's job. Hidden when the service has no verified pair.
 */
export function ServiceBeforeAfter({
  examples,
  service,
}: {
  examples: BeforeAfterExample[] | undefined
  service: string
}) {
  if (!examples?.length) return null
  return (
    <Section
      id="before-after-examples"
      eyebrow="Before & after"
      title={`What ${service.toLowerCase()} can do`}
      intro="An example of the kind of result this service is for. It’s from another company’s job, not ours: ask us for photos of our own work."
    >
      <ul className="grid gap-10">
        {examples.map((example) => {
          // Small originals are shown at a smaller size, so they stay sharp.
          const wide = example.before.width >= 800
          return (
            <li key={example.credit.source} className={wide ? 'max-w-3xl' : 'max-w-xl'}>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <Frame src={example.before} alt={example.beforeAlt} label="Before" wide={wide} />
                <Frame src={example.after} alt={example.afterAlt} label="After" wide={wide} />
              </div>
              <p className="mt-3 text-small text-muted">
                {example.caption}. Example photo by {example.credit.author} (
                <Link href={routes.photoCredits}>photo credits</Link>).
              </p>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
