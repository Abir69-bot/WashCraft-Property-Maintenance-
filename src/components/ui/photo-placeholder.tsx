import { Camera } from 'lucide-react'

import { cn } from '@/lib/utils'

export const RATIOS = {
  '16/9': 'aspect-video',
  '21/9': 'aspect-[21/9]',
  '3/2': 'aspect-[3/2]',
  '4/3': 'aspect-[4/3]',
  '1/1': 'aspect-square',
  '4/5': 'aspect-[4/5]',
} as const

export type PhotoRatio = keyof typeof RATIOS

/**
 * Stand-in for a photo the client still needs to shoot. The label says exactly what to
 * photograph; every label is collected into CONTENT_TODO.md.
 */
export function PhotoPlaceholder({
  label,
  ratio = '4/3',
  className,
}: {
  label: string
  ratio?: PhotoRatio
  className?: string
}) {
  return (
    <div
      role="img"
      aria-label={`Photo coming soon: ${label}`}
      data-photo-placeholder={label}
      className={cn(
        'flex flex-col items-center justify-center gap-3 overflow-hidden rounded-card border border-dashed border-border-strong bg-surface p-6 text-center',
        RATIOS[ratio],
        className,
      )}
    >
      <Camera aria-hidden className="size-8 text-muted" />
      <p className="max-w-xs text-small font-medium text-muted">{label}</p>
    </div>
  )
}
