'use client'

import { toast } from '@payloadcms/ui'
import { useState } from 'react'
import type { DefaultCellComponentProps, SelectFieldClient } from 'payload'

import { LEAD_STATUSES } from '@/config/leads'

/** Change a lead's status straight from the Leads list (brief §11 "quick status change"). */
export function StatusCell({ cellData, rowData }: DefaultCellComponentProps<SelectFieldClient>) {
  const [status, setStatus] = useState(String(cellData ?? 'new'))
  const [saving, setSaving] = useState(false)

  const change = async (next: string) => {
    const previous = status
    setStatus(next)
    setSaving(true)
    try {
      const response = await fetch(`/api/leads/${rowData.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      })
      if (!response.ok) throw new Error(`Status not saved (${response.status})`)
      toast.success(`${rowData.name ?? 'Lead'}: ${next.replaceAll('_', ' ')}`)
    } catch (error) {
      setStatus(previous)
      toast.error(error instanceof Error ? error.message : 'Status not saved')
    } finally {
      setSaving(false)
    }
  }

  return (
    // The row links to the lead; keep clicks on the menu from opening it.
    <span
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <select
        aria-label={`Status for ${rowData.name ?? 'lead'}`}
        value={status}
        disabled={saving}
        onChange={(event) => change(event.target.value)}
        style={{ font: 'inherit', padding: '2px 4px' }}
      >
        {LEAD_STATUSES.map((value) => (
          <option key={value} value={value}>
            {value.replaceAll('_', ' ')}
          </option>
        ))}
      </select>
    </span>
  )
}
