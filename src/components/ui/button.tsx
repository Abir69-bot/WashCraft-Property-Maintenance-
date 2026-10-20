import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'

import { cn } from '@/lib/utils'

export const buttonVariants = cva(
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap no-underline transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-5 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        cta: 'bg-cta text-ink hover:bg-cta-hover',
        primary: 'bg-primary text-white hover:bg-primary-hover',
        outline: 'border-2 border-primary bg-white text-primary hover:bg-surface',
        inverse: 'bg-white text-primary hover:bg-surface',
        ghost: 'text-primary hover:bg-surface',
        link: 'min-h-0 rounded-none px-0 text-secondary-strong underline underline-offset-4 hover:text-primary',
      },
      size: {
        sm: 'px-4 text-sm',
        md: 'h-12 px-6 text-base',
        lg: 'h-14 px-8 text-lg',
        icon: 'size-11 p-0',
      },
    },
    compoundVariants: [{ variant: 'link', className: 'h-auto px-0' }],
    defaultVariants: { variant: 'cta', size: 'md' },
  },
)

export type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    /** Render the child element (e.g. a Link or <a>) with button styling. */
    asChild?: boolean
  }

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Component = asChild ? Slot.Root : 'button'
  return <Component className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
