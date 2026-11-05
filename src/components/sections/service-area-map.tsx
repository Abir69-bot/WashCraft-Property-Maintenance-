'use client'

import 'leaflet/dist/leaflet.css'

import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

/** `href` makes the marker clickable, with a popup linking to the city's page. */
export type MapCity = { name: string; lat: number; lng: number; href?: string }

/** Popup for a clickable marker, built as DOM nodes so names are never parsed as HTML. */
function popupFor(city: MapCity, current: boolean) {
  const box = document.createElement('div')
  const name = document.createElement('strong')
  name.textContent = city.name
  box.append(name, document.createElement('br'))
  if (current || !city.href) {
    box.append('You’re viewing this area')
  } else {
    const link = document.createElement('a')
    link.href = city.href
    link.textContent = `See ${city.name}`
    box.append(link)
  }
  return box
}

/**
 * OpenStreetMap of the cities served. Leaflet loads only when the map scrolls into view
 * (brief §15). City names are permanent labels; the city list next to it has the same links.
 * `focus` centres the map on one city (city pages) and highlights its marker. When cities have
 * an `href`, markers open a popup linking to their page, and the scroll wheel zooms once the
 * map is clicked (never while scrolling past it).
 */
export function ServiceAreaMap({
  cities,
  focus,
  className,
}: {
  cities: MapCity[]
  focus?: string
  className?: string
}) {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = container.current
    if (!element || cities.length === 0) return
    let map: import('leaflet').Map | undefined
    let cancelled = false

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const L = (await import('leaflet')).default
        if (cancelled) return
        const leaflet = L.map(element, { scrollWheelZoom: false })
        map = leaflet
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(leaflet)
        for (const city of cities) {
          const focused = city.name === focus
          const marker = L.circleMarker([city.lat, city.lng], {
            radius: focused ? 12 : 9,
            color: '#0E4D64',
            weight: 3,
            fillColor: focused ? '#F5B700' : '#2CB1BC',
            fillOpacity: 0.9,
            interactive: Boolean(city.href),
          })
            .bindTooltip(city.name, { permanent: true, direction: 'right', offset: [10, 0] })
            .addTo(leaflet)
          if (city.href) marker.bindPopup(popupFor(city, focused))
        }
        if (cities.some((city) => city.href)) {
          leaflet.on('click', () => leaflet.scrollWheelZoom.enable())
          leaflet.on('mouseout', () => leaflet.scrollWheelZoom.disable())
        }
        const center = cities.find((city) => city.name === focus)
        if (center) leaflet.setView([center.lat, center.lng], 11)
        else
          leaflet.fitBounds(L.latLngBounds(cities.map((city) => [city.lat, city.lng])).pad(0.3), {
            maxZoom: 11,
          })
      },
      { rootMargin: '200px' },
    )
    observer.observe(element)
    return () => {
      cancelled = true
      observer.disconnect()
      map?.remove()
    }
  }, [cities, focus])

  return (
    <div
      ref={container}
      role="region"
      aria-label={
        focus ? `Map of ${focus} and nearby cities we serve` : 'Map of the cities we serve'
      }
      className={cn(
        'z-0 h-80 overflow-hidden rounded-card border border-border bg-surface lg:h-full lg:min-h-96',
        className,
      )}
    />
  )
}
