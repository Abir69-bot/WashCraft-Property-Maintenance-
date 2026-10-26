/** "Do you serve my area?" matching against each city's postal codes or prefixes (brief §10.2). */

export type AreaCity = { name: string; slug: string; zipPrefixes?: string[] | null }

// Canadian postal codes never use D, F, I, O, Q or U, nor W or Z as the first letter.
const CANADIAN = /^\s*([ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z])[\s-]*(\d[ABCEGHJ-NPRSTV-Z]\d)\s*$/i
const US = /^\s*(\d{5})(?:-?\d{4})?\s*$/

/**
 * A Canadian postal code as "M1B 2K3", or the first five digits of a US ZIP code (ZIP+4
 * accepted), or null.
 */
export function normalizePostalCode(input: string): string | null {
  const canadian = CANADIAN.exec(input)
  if (canadian) return `${canadian[1]} ${canadian[2]}`.toUpperCase()
  return US.exec(input)?.[1] ?? null
}

const compact = (value: string) => value.replace(/\s+/g, '').toUpperCase()

/**
 * The city whose postal code or prefix matches best (longest prefix wins), or null. Prefixes
 * are usually the first three characters of a Canadian postal code ("M1B") or of a ZIP code.
 */
export function matchCity<T extends AreaCity>(postalCode: string, cities: T[]): T | null {
  const normalized = normalizePostalCode(postalCode)
  if (!normalized) return null
  const code = compact(normalized)
  let best: { city: T; length: number } | null = null
  for (const city of cities) {
    for (const prefix of city.zipPrefixes ?? []) {
      const clean = compact(prefix)
      if (clean && code.startsWith(clean) && clean.length > (best?.length ?? 0)) {
        best = { city, length: clean.length }
      }
    }
  }
  return best?.city ?? null
}
