'use client'

import { useFormFields } from '@payloadcms/ui'

const MINIMUM = 150

/** Live word count for a city's intro. Warns below 150 words to avoid thin "doorway" pages. */
export function WordCountHint() {
  const intro = useFormFields(([fields]) => fields.intro?.value)
  const words = typeof intro === 'string' ? intro.trim().split(/\s+/).filter(Boolean).length : 0
  const short = words < MINIMUM

  return (
    <p
      role="status"
      style={{
        margin: '-0.5rem 0 1.5rem',
        color: short ? 'var(--theme-warning-650)' : 'var(--theme-success-650)',
      }}
    >
      {words} words.{' '}
      {short
        ? `Aim for at least ${MINIMUM} unique words so Google sees a real local page.`
        : 'Good length.'}
    </p>
  )
}
