'use client'

import { Search } from 'lucide-react'
import Link from 'next/link'
import { useId, useRef, useState } from 'react'

import { Input } from '@/components/ui/input'
import { SEARCH_INDEX_PATH, searchEntries, type SearchEntry } from '@/lib/search'

/**
 * Search box for the 404 page: services, articles, solutions and main pages. The index is
 * fetched the first time the box is used, so pages that never show a 404 never load it.
 */
export function SiteSearch() {
  const id = useId()
  const [query, setQuery] = useState('')
  const [entries, setEntries] = useState<SearchEntry[] | null>(null)
  const [failed, setFailed] = useState(false)
  const requested = useRef(false)

  const loadIndex = () => {
    if (requested.current) return
    requested.current = true
    fetch(SEARCH_INDEX_PATH)
      .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
      .then((index: SearchEntry[]) => setEntries(index))
      .catch(() => setFailed(true))
  }

  const results = searchEntries(entries ?? [], query)
  const searching = query.trim().length > 1
  const status = !searching
    ? ''
    : failed
      ? 'Search isn’t available right now. Try the links below.'
      : entries === null
        ? 'Searching…'
        : `${results.length} ${results.length === 1 ? 'result' : 'results'}`

  return (
    <search className="max-w-2xl">
      <label htmlFor={`${id}-q`} className="mb-1 block font-semibold">
        Search the site
      </label>
      <div className="relative">
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted"
        />
        <Input
          id={`${id}-q`}
          type="search"
          value={query}
          onFocus={loadIndex}
          onChange={(event) => {
            loadIndex()
            setQuery(event.target.value)
          }}
          className="pl-10"
          autoComplete="off"
          placeholder="e.g. gutters, snow, windows"
        />
      </div>
      <p role="status" className="mt-2 text-small text-muted">
        {status}
      </p>
      {results.length > 0 && (
        <ul className="mt-2 grid gap-2">
          {results.map((entry) => (
            <li key={entry.href}>
              <Link
                href={entry.href}
                className="block rounded-card border border-border bg-white p-4 no-underline hover:border-primary"
              >
                <span className="block text-small font-semibold text-secondary-strong">
                  {entry.kind}
                </span>
                <span className="block font-semibold text-primary">{entry.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </search>
  )
}
