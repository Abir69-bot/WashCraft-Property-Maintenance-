/** Site search for the 404 page: runs in the browser over a small index built at render. */

export type SearchEntry = { title: string; href: string; kind: string; text: string }

const MAX_RESULTS = 8

/** Ranks entries by how many query words they contain, title matches first. */
export function searchEntries(entries: SearchEntry[], query: string) {
  const words = query
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 1)
  if (words.length === 0) return []
  return entries
    .map((entry) => {
      const title = entry.title.toLowerCase()
      const text = entry.text.toLowerCase()
      const found = words.filter((word) => title.includes(word) || text.includes(word))
      const inTitle = words.filter((word) => title.includes(word)).length
      return { entry, score: found.length * 10 + inTitle }
    })
    .filter(({ score }) => score >= words.length * 10)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_RESULTS)
    .map(({ entry }) => entry)
}
