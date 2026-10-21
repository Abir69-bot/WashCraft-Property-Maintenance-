'use client'

import 'leaflet/dist/leaflet.css'

import { useEffect, useRef } from 'react'

export type MapCity = { name: string; lat: number; lng: number }

/**
 * OpenStreetMap of the cities served. Leaflet loads only when the map scrolls into view
 * (brief §15). City names are permanent labels; the city list next to it has the same links.
 * `focus` centres the map on one city (city pages) and highlights its marker.
 */
export function ServiceAreaMap({ cities, focus }: { cities: MapCity[]; focus?: string }) {
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
        map = L.map(element, { scrollWheelZoom: false })
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map)
        for (const city of cities) {
          const focused = city.name === focus
          L.circleMarker([city.lat, city.lng], {
            radius: focused ? 12 : 9,
            color: '#0E4D64',
            weight: 3,
            fillColor: focused ? '#F5B700' : '#2CB1BC',
            fillOpacity: 0.9,
            interactive: false,
          })
            .bindTooltip(city.name, { permanent: true, direction: 'right', offset: [10, 0] })
            .addTo(map)
        }
        const center = cities.find((city) => city.name === focus)
        if (center) map.setView([center.lat, center.lng], 11)
        else
          map.fitBounds(L.latLngBounds(cities.map((city) => [city.lat, city.lng])).pad(0.3), {
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
      className="z-0 h-80 overflow-hidden rounded-card border border-border bg-surface lg:h-full lg:min-h-96"
    />
  )
}
