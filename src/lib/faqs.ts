export type FaqEntry = { id: string | number; question: string; answer: string }

/** Joins FAQ lists, keeping the first copy of any question asked twice. */
export function mergeFaqs(...lists: FaqEntry[][]): FaqEntry[] {
  const seen = new Set<string>()
  return lists.flat().filter((faq) => {
    const key = faq.question.trim().toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
