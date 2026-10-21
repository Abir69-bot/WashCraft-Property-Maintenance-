'use client'

import { Search } from 'lucide-react'
import Link from 'next/link'
import { useId, useState } from 'react'

import { Input } from '@/components/ui/input'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils'

export type DirectoryCategory = { slug: string; title: string }
export type DirectoryService = { slug: string; category: string; text: string }

/**
 * All services with category chips and a search box (brief §9.7). The cards arrive already
 * rendered on the server; this component only shows and hides them, so the full list works
 * without JavaScript too.
 */
export function ServicesDirectory({
  categories,
  services,
  cards,
}: {
  categories: DirectoryCategory[]
  services: DirectoryService[]
  cards: Record<string, React.ReactNode>
}) {
  const id = useId()
  const [category, setCategory] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  const visible = services.filter(
    (service) =>
      (!category || service.category === category) &&
      words.every((word) => service.text.includes(word)),
  )
  const chips = [{ slug: null, title: 'All' }, ...categories]

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              key={chip.slug ?? 'all'}
              type="button"
              aria-pressed={category === chip.slug}
              onClick={() => setCategory(chip.slug)}
              className="min-h-11 rounded-full border border-border-strong px-4 font-semibold text-ink hover:border-primary aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-white"
            >
              {chip.title}
            </button>
          ))}
        </div>
        <div className="w-full lg:max-w-xs">
          <label htmlFor={`${id}-search`} className="mb-1 block font-semibold">
            Search services
          </label>
          <div className="relative">
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted"
            />
            <Input
              id={`${id}-search`}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="pl-10"
              autoComplete="off"
            />
          </div>
        </div>
      </div>

      <p role="status" className="mt-6 text-small text-muted">
        {visible.length === services.length
          ? `${services.length} services`
          : `Showing ${visible.length} of ${services.length} services`}
      </p>

      {visible.length === 0 && (
        <p className="mt-6 rounded-card bg-surface p-6">
          Nothing matches “{query}”. Try another word, or{' '}
          <Link href={routes.quoteCustom}>tell us about the job</Link> and we’ll help.
        </p>
      )}

      {categories.map((group) => {
        const groupServices = visible.filter((service) => service.category === group.slug)
        return (
          <section
            key={group.slug}
            aria-labelledby={`${id}-${group.slug}`}
            className={cn('mt-10', groupServices.length === 0 && 'hidden')}
          >
            <h2 id={`${id}-${group.slug}`} className="text-h3">
              <Link
                href={routes.category(group.slug)}
                className="text-primary no-underline hover:underline"
              >
                {group.title}
              </Link>
            </h2>
            <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {groupServices.map((service) => (
                <li key={service.slug}>{cards[service.slug]}</li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
