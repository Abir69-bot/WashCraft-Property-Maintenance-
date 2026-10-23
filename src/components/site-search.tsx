'use client'

import { Search } from 'lucide-react'
import Link from 'next/link'
import { useId, useState } from 'react'

import { Input } from '@/components/ui/input'
import { searchEntries, type SearchEntry } from '@/lib/search'

/** Search box for the 404 page: services, articles, solutions and main pages, in the browser. */
export function SiteSearch({ entries }: { entries: SearchEntry[] }) {
  const id = useId()
  const [query, setQuery] = useState('')
  const results = searchEntries(entries, query)
  const searching = query.trim().length > 1

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
          onChange={(event) => setQuery(event.target.value)}
          className="pl-10"
          autoComplete="off"
          placeholder="e.g. gutters, snow, windows"
        />
      </div>
      <p role="status" className="mt-2 text-small text-muted">
        {searching ? `${results.length} ${results.length === 1 ? 'result' : 'results'}` : ''}
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
