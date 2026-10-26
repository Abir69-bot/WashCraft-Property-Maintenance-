'use client'

import { CircleCheck, Info } from 'lucide-react'
import Link from 'next/link'
import { useId, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { routes } from '@/lib/routes'
import { matchCity, normalizePostalCode, type AreaCity } from '@/lib/service-area'

type Result =
  { kind: 'served'; city: AreaCity } | { kind: 'unknown'; zip: string } | { kind: 'invalid' }

/** "Do you serve my area?" (brief §9.1.17). Runs in the browser; no database needed. */
export function ZipChecker({ cities }: { cities: AreaCity[] }) {
  const id = useId()
  const [zip, setZip] = useState('')
  const [result, setResult] = useState<Result | null>(null)

  return (
    <div className="rounded-card border border-border bg-white p-6">
      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={(event) => {
          event.preventDefault()
          const normalized = normalizePostalCode(zip)
          if (!normalized) return setResult({ kind: 'invalid' })
          const city = matchCity(normalized, cities)
          setResult(city ? { kind: 'served', city } : { kind: 'unknown', zip: normalized })
        }}
      >
        <div className="grid min-w-40 flex-1 gap-1.5">
          <label htmlFor={`${id}-zip`} className="font-semibold">
            Do we serve your area?
          </label>
          <Input
            id={`${id}-zip`}
            value={zip}
            onChange={(event) => setZip(event.target.value)}
            autoComplete="postal-code"
            placeholder="Postal code"
            maxLength={10}
            aria-describedby={`${id}-result`}
          />
        </div>
        <Button type="submit" variant="primary">
          Check
        </Button>
      </form>
      <div id={`${id}-result`} role="status" className="mt-4 empty:hidden">
        {result?.kind === 'served' && (
          <p className="flex items-start gap-2">
            <CircleCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-success-strong" />
            <span>
              Yes, we serve <Link href={routes.city(result.city.slug)}>{result.city.name}</Link>.{' '}
              <Link href={routes.quoteInstant} className="font-semibold">
                Get an instant price
              </Link>
            </span>
          </p>
        )}
        {result?.kind === 'unknown' && (
          <p className="flex items-start gap-2">
            <Info aria-hidden className="mt-0.5 size-5 shrink-0 text-secondary-strong" />
            <span>
              {result.zip} isn&apos;t on our list yet. Send a{' '}
              <Link href={routes.quote}>quote request</Link> anyway and we&apos;ll let you know.
            </span>
          </p>
        )}
        {result?.kind === 'invalid' && (
          <p className="text-error">Enter a postal code, e.g. M1B 2K3.</p>
        )}
      </div>
    </div>
  )
}
