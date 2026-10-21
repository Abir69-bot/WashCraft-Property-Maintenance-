'use client'

import { Eye } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useTransition } from 'react'

import { exitPreview } from '@/lib/preview-actions'

/** Shown while staff preview drafts from the admin. */
export function PreviewBanner() {
  const pathname = usePathname()
  const [pending, startTransition] = useTransition()
  return (
    <div role="status" className="bg-todo text-ink">
      <div className="container flex flex-wrap items-center justify-between gap-3 py-2 text-small">
        <p className="flex items-center gap-2 font-semibold">
          <Eye aria-hidden className="size-4" />
          Preview: you’re seeing drafts and sample content. Visitors see the published page.
        </p>
        <button
          type="button"
          disabled={pending}
          onClick={() => startTransition(() => exitPreview(pathname))}
          className="min-h-11 rounded-full border border-ink px-4 font-semibold hover:bg-white"
        >
          Exit preview
        </button>
      </div>
    </div>
  )
}
