import { Badge } from '@/components/ui/badge'
import { isProductionSite } from '@/lib/env'

/** Marks sample content in development and preview. Samples never reach the live site. */
export function SampleBadge({ show, className }: { show?: boolean | null; className?: string }) {
  if (!show || isProductionSite) return null
  return (
    <Badge tone="sample" className={className}>
      Sample
    </Badge>
  )
}
