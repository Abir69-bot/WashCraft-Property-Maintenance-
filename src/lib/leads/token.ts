import { sign, verify } from '@/lib/signing'

/**
 * Lets the visitor who just got an estimate act on their own lead ("Book this", "Request a
 * call-back") without an account. The token is an HMAC of the lead id; nobody can derive it for
 * another lead.
 */
export const leadToken = (id: number | string) => sign(`lead:${id}`)

export const verifyLeadToken = (id: number | string, token: string) =>
  typeof token === 'string' && token.length > 0 && verify(`lead:${id}`, token)
