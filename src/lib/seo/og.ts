import { sign, verify } from '@/lib/signing'

/**
 * Generated share images (brief §13) for pages without a photo of their own. The title and
 * eyebrow travel in the URL, signed, so the route only ever draws text the site produced.
 */
export const OG_ROUTE = '/next/og'
export const OG_SIZE = { width: 1200, height: 630 }

const payload = (title: string, eyebrow: string) => `og|${title}|${eyebrow}`

export function ogCardPath({ title, eyebrow = '' }: { title: string; eyebrow?: string }) {
  const params = new URLSearchParams({ title, eyebrow, sig: sign(payload(title, eyebrow)) })
  return `${OG_ROUTE}?${params}`
}

/** The card's text if the signature matches, otherwise null. */
export function readOgCard(params: URLSearchParams) {
  const title = params.get('title') ?? ''
  const eyebrow = params.get('eyebrow') ?? ''
  const sig = params.get('sig') ?? ''
  if (!title || title.length > 200 || eyebrow.length > 80) return null
  return verify(payload(title, eyebrow), sig) ? { title, eyebrow } : null
}
