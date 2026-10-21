import type { AppliedDiscount } from '@/lib/pricing/engine'

/** What every quote form's server action returns. */
export type FormResult<T extends object = object> =
  ({ ok: true } & T) | { ok: false; message: string; fieldErrors?: Record<string, string> }

export type EstimateLine = {
  name: string
  status: 'priced' | 'custom'
  low?: number
  high?: number
  placeholder?: boolean
  minimumApplied?: boolean
}

/** A price estimate as the visitor sees it (no rule details). */
export type EstimateView = {
  lines: EstimateLine[]
  bundle: AppliedDiscount | null
  frequency: AppliedDiscount | null
  low: number
  high: number
  complete: boolean
  placeholder: boolean
  taxNote: string
  estimateNote: string
}

/** After a quote is saved: the estimate and what the visitor needs to book it. */
export type QuoteReceipt = {
  /** Null when the lead went to the backup store (the database was down). */
  leadId: number | null
  token: string | null
  estimate: EstimateView | null
  plan?: { name: string; price: string | null }
}
