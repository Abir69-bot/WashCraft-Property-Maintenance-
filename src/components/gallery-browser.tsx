'use client'

import { ChevronLeft, ChevronRight, Expand } from 'lucide-react'
import { useId, useState } from 'react'

import { BeforeAfterSlider, type SliderImage } from '@/components/sections/before-after-slider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { NativeSelect } from '@/components/ui/native-select'

type Option = { value: string; label: string }

export type GalleryEntry = {
  id: number
  caption: string
  before: SliderImage
  after: SliderImage
  category: string | null
  service: string
  serviceName: string
  city: string | null
  cityName: string | null
  /** Show the "Sample" badge (never true on the live site). */
  sample: boolean
}

type Filters = { category: string; service: string; city: string }
const ALL: Filters = { category: '', service: '', city: '' }

const details = (entry: GalleryEntry) => [entry.serviceName, entry.cityName].filter(Boolean)

function Filter({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string
  label: string
  value: string
  options: Option[]
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block font-semibold">
        {label}
      </label>
      <NativeSelect id={id} value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">All</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </NativeSelect>
    </div>
  )
}

/**
 * Before-and-after gallery (brief §9.7): filter by category, service and city; drag sliders;
 * a larger view in a lightbox with previous/next. Every pair is in the server-rendered HTML.
 */
export function GalleryBrowser({
  entries,
  categories,
  services,
  cities,
}: {
  entries: GalleryEntry[]
  categories: Option[]
  services: (Option & { category: string | null })[]
  cities: Option[]
}) {
  const id = useId()
  const [filters, setFilters] = useState<Filters>(ALL)
  const [open, setOpen] = useState<number | null>(null)
  const visible = entries.filter(
    (entry) =>
      (!filters.category || entry.category === filters.category) &&
      (!filters.service || entry.service === filters.service) &&
      (!filters.city || entry.city === filters.city),
  )
  const serviceOptions = services.filter(
    (service) => !filters.category || service.category === filters.category,
  )
  const current = open === null ? null : visible[open]
  const step = (by: number) =>
    setOpen((index) => (index === null ? null : (index + by + visible.length) % visible.length))

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.length > 1 && (
          <Filter
            id={`${id}-category`}
            label="Category"
            value={filters.category}
            options={categories}
            onChange={(category) => setFilters({ ...filters, category, service: '' })}
          />
        )}
        {services.length > 1 && (
          <Filter
            id={`${id}-service`}
            label="Service"
            value={filters.service}
            options={serviceOptions}
            onChange={(service) => setFilters({ ...filters, service })}
          />
        )}
        {cities.length > 1 && (
          <Filter
            id={`${id}-city`}
            label="City"
            value={filters.city}
            options={cities}
            onChange={(city) => setFilters({ ...filters, city })}
          />
        )}
      </div>

      <p role="status" className="mt-6 text-small text-muted">
        {visible.length === entries.length
          ? `${entries.length} projects`
          : `Showing ${visible.length} of ${entries.length} projects`}
      </p>

      {visible.length === 0 ? (
        <div className="mt-6 rounded-card bg-surface p-6">
          <p>No projects match those filters yet.</p>
          <Button variant="outline" className="mt-4" onClick={() => setFilters(ALL)}>
            Show all projects
          </Button>
        </div>
      ) : (
        <ul className="mt-6 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((entry, index) => (
            <li key={entry.id}>
              <figure>
                <BeforeAfterSlider
                  before={entry.before}
                  after={entry.after}
                  caption={entry.caption}
                  sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
                />
                <figcaption className="mt-3">
                  <span className="flex items-center gap-2 font-semibold text-ink">
                    {entry.caption}
                    {entry.sample && <Badge tone="sample">Sample</Badge>}
                  </span>
                  {details(entry).length > 0 && (
                    <span className="block text-small text-muted">
                      {details(entry).join(' · ')}
                    </span>
                  )}
                </figcaption>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-1 -ml-3"
                  aria-label={`View larger: ${entry.caption}`}
                  onClick={() => setOpen(index)}
                >
                  <Expand aria-hidden />
                  View larger
                </Button>
              </figure>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={current !== null} onOpenChange={(isOpen) => !isOpen && setOpen(null)}>
        {current && (
          <DialogContent side="full">
            <div className="mx-auto flex min-h-full max-w-5xl flex-col justify-center gap-4 py-10">
              <DialogTitle>{current.caption}</DialogTitle>
              <DialogDescription>
                {[...details(current), `${(open ?? 0) + 1} of ${visible.length}`].join(' · ')}
              </DialogDescription>
              <BeforeAfterSlider
                key={current.id}
                before={current.before}
                after={current.after}
                caption={current.caption}
                sizes="(min-width: 1024px) 1024px, 100vw"
              />
              {visible.length > 1 && (
                <div className="flex justify-between gap-3">
                  <Button variant="outline" onClick={() => step(-1)}>
                    <ChevronLeft aria-hidden /> Previous
                  </Button>
                  <Button variant="outline" onClick={() => step(1)}>
                    Next <ChevronRight aria-hidden />
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
