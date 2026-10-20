import { cn } from '@/lib/utils'

/*
 * PLACEHOLDER LOGO (listed in CONTENT_TODO.md): a house roofline over a water droplet.
 * The same geometry is used in public/brand/*.svg, src/app/(site)/icon.svg and the OG image.
 */
export const MARK_PATHS = {
  roof: 'M6 23 24 7l18 16',
  drop: 'M24 12.5S14 25 14 33a10 10 0 0 0 20 0c0-8-10-20.5-10-20.5Z',
  shine: 'M19.25 33.5a5 5 0 0 0 3.75 5.25',
} as const

export type LogoVariant = 'colour' | 'white' | 'mono'

const MARK_COLOURS: Record<LogoVariant, { roof: string; drop: string; shine?: string }> = {
  colour: { roof: 'var(--primary)', drop: 'var(--secondary)', shine: '#fff' },
  white: { roof: '#fff', drop: '#fff', shine: 'var(--primary)' },
  mono: { roof: 'currentColor', drop: 'currentColor' },
}

export function LogoMark({
  variant = 'colour',
  className,
}: {
  variant?: LogoVariant
  className?: string
}) {
  const colours = MARK_COLOURS[variant]
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false" className={className}>
      <path
        d={MARK_PATHS.roof}
        fill="none"
        stroke={colours.roof}
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d={MARK_PATHS.drop} fill={colours.drop} />
      {colours.shine && (
        <path
          d={MARK_PATHS.shine}
          fill="none"
          stroke={colours.shine}
          strokeWidth={2.25}
          strokeLinecap="round"
        />
      )}
    </svg>
  )
}

/** Mark + wordmark. The visible text doubles as the accessible name. */
export function Logo({
  variant = 'colour',
  withTagline = true,
  className,
}: {
  variant?: LogoVariant
  withTagline?: boolean
  className?: string
}) {
  const colour = variant === 'colour'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2.5',
        variant === 'white' && 'text-white',
        className,
      )}
    >
      <LogoMark variant={variant} className="size-10 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="font-heading text-2xl font-extrabold tracking-tight">
          <span className={cn(colour && 'text-primary')}>Wash</span>
          <span className={cn(colour && 'text-secondary-strong')}>Craft</span>
        </span>
        {withTagline && (
          <span
            className={cn(
              'mt-1 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase',
              colour && 'text-muted',
            )}
          >
            Property Maintenance
          </span>
        )}
      </span>
    </span>
  )
}
