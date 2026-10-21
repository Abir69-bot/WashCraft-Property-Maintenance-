'use client'

import { Button, useDocumentInfo } from '@payloadcms/ui'

/** Download link on a lead file (the files are private, so they're served through the API). */
export function FileDownload() {
  const { id } = useDocumentInfo()
  if (!id) return null
  return (
    <div style={{ marginBottom: 'var(--base)' }}>
      <Button
        el="anchor"
        url={`/api/lead-files/${id}/download`}
        buttonStyle="secondary"
        size="small"
      >
        Download file
      </Button>
    </div>
  )
}
