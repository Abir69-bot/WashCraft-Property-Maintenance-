import { isPlaceholder } from '@/config/site'

export type TokenValues = { region: string; city?: string; company?: string }

/** Fills {region}, {city} and {company} in CMS text. Unknown tokens are left as written. */
export function fillTokens(text: string, values: TokenValues): string {
  return text.replace(/\{(region|city|company)\}/g, (token, key: keyof TokenValues) => {
    const value = values[key]
    return value && !isPlaceholder(value) ? value : token
  })
}

/** Phone helpers for tel: and sms: links. US/Canada (NANP) numbers only. */
export function e164(phone: string | null | undefined): string | null {
  if (!phone || isPlaceholder(phone)) return null
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
  return null
}

export const telHref = (phone: string | null | undefined) => {
  const number = e164(phone)
  return number ? `tel:${number}` : null
}

export const smsHref = (phone: string | null | undefined) => {
  const number = e164(phone)
  return number ? `sms:${number}` : null
}

/** URL slug from a name, e.g. "Castle Rock" → "castle-rock" (matches Payload's slug field). */
export const toSlug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
