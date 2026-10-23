'use client'

import { CircleCheck } from 'lucide-react'
import { useEffect, useRef } from 'react'

/** Replaces a form once it's sent. Focus moves to the heading so screen readers announce it. */
export function FormSent({ title, children }: { title: string; children: React.ReactNode }) {
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => heading.current?.focus(), [])
  return (
    <div className="rounded-card bg-surface p-6 sm:p-8">
      <CircleCheck aria-hidden className="mb-3 size-10 text-success-strong" />
      <h2 ref={heading} tabIndex={-1} className="text-h3 focus:outline-none">
        {title}
      </h2>
      <div className="mt-2 text-lg text-muted">{children}</div>
    </div>
  )
}
