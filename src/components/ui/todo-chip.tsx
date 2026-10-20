import { isPlaceholder } from '@/config/site'

/** Visible marker for a business fact that hasn't been set yet. */
export function TodoChip({ label }: { label: string }) {
  return (
    <span
      title="Placeholder: set this in src/config/site.ts or the admin's Site settings"
      className="inline-flex items-center rounded-md border border-dashed border-ink bg-todo px-2 py-0.5 font-mono text-small font-semibold text-ink"
    >
      TODO: {label}
    </span>
  )
}

/** Renders a site fact, or a TODO chip while it is still a [PLACEHOLDER]. */
export function SiteValue({ value, label }: { value: string; label: string }) {
  return isPlaceholder(value) ? <TodoChip label={label} /> : <>{value}</>
}
