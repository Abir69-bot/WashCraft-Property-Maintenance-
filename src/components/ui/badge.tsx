import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

export const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-3 py-1 text-small font-semibold [&_svg]:size-4',
  {
    variants: {
      tone: {
        neutral: 'border border-border bg-surface text-ink',
        exterior: 'bg-brand-secondary-strong text-white',
        interior: 'bg-brand-primary text-white',
        winter: 'bg-winter-strong text-white',
        holiday: 'bg-holiday text-white',
        yard: 'bg-yard-strong text-white',
        commercial: 'bg-brand-ink text-white',
        success: 'bg-brand-success-strong text-white',
        sample: 'border border-dashed border-brand-ink bg-todo text-brand-ink',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
)

export type BadgeTone = NonNullable<VariantProps<typeof badgeVariants>['tone']>

export function Badge({
  className,
  tone,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />
}
