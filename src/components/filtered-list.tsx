'use client'

import { useState } from 'react'

import { cn } from '@/lib/utils'

export type FilterOption = { value: string; label: string }
export type FilterItem = { key: string; tags: string[] }

export const chipClass =
  'min-h-11 rounded-full border border-border-strong px-4 font-semibold text-ink hover:border-primary aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-white'

/**
 * Cards with filter chips (blog categories, solution topics). The cards are rendered on the
 * server; this only shows and hides them, so without JavaScript every card is listed.
 */
export function FilteredList({
  label,
  noun,
  options,
  items,
  cards,
  listClassName,
}: {
  label: string
  /** Singular and plural, e.g. ['article', 'articles']. */
  noun: [string, string]
  options: FilterOption[]
  items: FilterItem[]
  cards: Record<string, React.ReactNode>
  listClassName: string
}) {
  const [active, setActive] = useState<string | null>(null)
  const used = options.filter((option) => items.some((item) => item.tags.includes(option.value)))
  const visible = active ? items.filter((item) => item.tags.includes(active)) : items
  const count = (n: number) => `${n} ${n === 1 ? noun[0] : noun[1]}`

  return (
    <div>
      {used.length > 1 && (
        <div role="group" aria-label={label} className="flex flex-wrap gap-2">
          {[{ value: null, label: 'All' }, ...used].map((option) => (
            <button
              key={option.value ?? 'all'}
              type="button"
              aria-pressed={active === option.value}
              onClick={() => setActive(option.value)}
              className={chipClass}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
      <p role="status" className={cn('text-small text-muted', used.length > 1 && 'mt-6')}>
        {active ? `Showing ${count(visible.length)}` : count(items.length)}
      </p>
      <ul className={cn('mt-6', listClassName)}>
        {visible.map((item) => (
          <li key={item.key}>{cards[item.key]}</li>
        ))}
      </ul>
    </div>
  )
}
