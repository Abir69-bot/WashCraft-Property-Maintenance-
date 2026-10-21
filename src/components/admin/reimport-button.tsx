'use client'

import { Button, toast } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

/** Re-imports leads saved to backup storage while the database was down (brief §4A). */
export function ReimportButton() {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  const run = async () => {
    setBusy(true)
    try {
      const response = await fetch('/api/leads/reimport', {
        method: 'POST',
        credentials: 'include',
      })
      const result = (await response.json()) as {
        imported?: string[]
        failed?: string[]
        error?: string
      }
      if (!response.ok) throw new Error(result.error ?? 'Re-import failed')
      const imported = result.imported?.length ?? 0
      const failed = result.failed?.length ?? 0
      if (failed)
        toast.error(`${imported} imported, ${failed} could not be read. See the server log.`)
      else toast.success(`${imported} lead${imported === 1 ? '' : 's'} re-imported.`)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Re-import failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Button buttonStyle="secondary" size="small" disabled={busy} onClick={run}>
      {busy ? 'Re-importing…' : 'Re-import backed-up leads'}
    </Button>
  )
}
