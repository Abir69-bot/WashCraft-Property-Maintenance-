import { cn } from '@/lib/utils'

const TONES = {
  default: 'bg-white',
  surface: 'bg-surface',
  dark: 'on-dark',
} as const

/** Standard page section: rhythm, container, optional eyebrow / heading / intro. */
export function Section({
  id,
  tone = 'default',
  eyebrow,
  title,
  intro,
  align = 'left',
  className,
  children,
}: {
  id: string
  tone?: keyof typeof TONES
  eyebrow?: string
  title?: React.ReactNode
  intro?: React.ReactNode
  align?: 'left' | 'center'
  className?: string
  children?: React.ReactNode
}) {
  const headingId = `${id}-heading`
  return (
    <section
      id={id}
      aria-labelledby={title ? headingId : undefined}
      className={cn('section-y', TONES[tone], className)}
    >
      <div className="container">
        {(eyebrow || title || intro) && (
          <header className={cn('mb-10 max-w-3xl', align === 'center' && 'mx-auto text-center')}>
            {eyebrow && (
              <p
                className={cn(
                  'mb-2 text-small font-semibold tracking-wide uppercase',
                  tone === 'dark' ? 'text-secondary-on-dark' : 'text-secondary-strong',
                )}
              >
                {eyebrow}
              </p>
            )}
            {title && <h2 id={headingId}>{title}</h2>}
            {intro && (
              <div className={cn('mt-4', tone === 'dark' ? 'text-white/90' : 'text-muted')}>
                {intro}
              </div>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  )
}
