import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

export const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-3 py-1 text-small font-semibold [&_svg]:size-4',
  {
    variants: {
      tone: {
        neutral: 'border border-border bg-surface text-ink',
        exterior: 'bg-secondary-strong text-white',
        interior: 'bg-primary text-white',
        winter: 'bg-winter-strong text-white',
        holiday: 'bg-holiday text-white',
        yard: 'bg-yard-strong text-white',
        commercial: 'bg-ink text-white',
        success: 'bg-success-strong text-white',
        sample: 'border border-dashed border-ink bg-todo text-ink',
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
