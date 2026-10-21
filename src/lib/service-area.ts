/** "Do you serve my area?" matching against each city's ZIP codes or prefixes (brief §10.2). */

export type AreaCity = { name: string; slug: string; zipPrefixes?: string[] | null }

/** The first five digits of a US ZIP code (accepts ZIP+4), or null. */
export function normalizeZip(input: string): string | null {
  const match = /^\s*(\d{5})(?:-?\d{4})?\s*$/.exec(input)
  return match ? match[1] : null
}

/** The city whose ZIP code or prefix matches best (longest prefix wins), or null. */
export function matchCity<T extends AreaCity>(zip: string, cities: T[]): T | null {
  const normalized = normalizeZip(zip)
  if (!normalized) return null
  let best: { city: T; length: number } | null = null
  for (const city of cities) {
    for (const prefix of city.zipPrefixes ?? []) {
      const clean = prefix.trim()
      if (clean && normalized.startsWith(clean) && clean.length > (best?.length ?? 0)) {
        best = { city, length: clean.length }
      }
    }
  }
  return best?.city ?? null
}
