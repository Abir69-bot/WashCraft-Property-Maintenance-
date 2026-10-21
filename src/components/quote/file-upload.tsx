'use client'

import { CircleAlert, CircleCheck, LoaderCircle, Paperclip, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { useController, type FieldValues, type Path, type UseFormReturn } from 'react-hook-form'

import { confirmUpload, prepareUpload } from '@/lib/leads/actions'
import type { FileRef } from '@/lib/schemas/fields'
import { cn } from '@/lib/utils'

const MAX_BYTES = 10 * 1024 * 1024

const KINDS = {
  photo: {
    accept: 'image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif',
    hint: 'JPEG, PNG, HEIC or WebP, up to 10 MB each.',
  },
  document: {
    accept: 'application/pdf,image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif',
    hint: 'PDF, JPEG, PNG, HEIC or WebP, up to 10 MB each.',
  },
} as const

const BY_EXTENSION: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  heic: 'image/heic',
  heif: 'image/heic',
  pdf: 'application/pdf',
}

/** Some browsers report HEIC photos with no type; fall back to the extension. */
const typeOf = (file: File) =>
  file.type || BY_EXTENSION[file.name.split('.').pop()?.toLowerCase() ?? ''] || ''

const sizeLabel = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(bytes / 1024)} KB`

type Item = {
  id: string
  name: string
  size: number
  status: 'uploading' | 'done' | 'error'
  message?: string
  key?: string
}

async function upload(
  file: File,
  kind: keyof typeof KINDS,
): Promise<{ key: string } | { error: string }> {
  if (file.size > MAX_BYTES) return { error: 'Larger than 10 MB.' }
  const target = await prepareUpload({ name: file.name, type: typeOf(file), size: file.size, kind })
  if (!target.ok) return { error: target.message }
  try {
    const response = await fetch(target.url, { method: 'PUT', headers: target.headers, body: file })
    if (!response.ok) return { error: 'Upload failed. Please try again.' }
    const check = await confirmUpload({ key: target.key, kind })
    return check.ok ? { key: target.key } : { error: check.message }
  } catch {
    return { error: 'Upload failed. Check your connection and try again.' }
  }
}

/**
 * Photo or document uploads (brief §10.5). Files go straight to private storage as soon as they
 * are picked; the form only sends their storage keys. `onBusyChange` lets the form wait for
 * uploads in progress.
 */
export function FileUploadField<T extends FieldValues>({
  form,
  name,
  label,
  kind = 'photo',
  max = 10,
  onBusyChange,
}: {
  form: UseFormReturn<T>
  name: Path<T>
  label: string
  kind?: keyof typeof KINDS
  max?: number
  onBusyChange?: (busy: boolean) => void
}) {
  const id = useId()
  const input = useRef<HTMLInputElement>(null)
  const { field, fieldState } = useController({ control: form.control, name })
  const [items, setItems] = useState<Item[]>([])
  const [notice, setNotice] = useState('')
  const sync = useRef(field.onChange)
  const busyChange = useRef(onBusyChange)
  useEffect(() => {
    sync.current = field.onChange
    busyChange.current = onBusyChange
  })

  useEffect(() => {
    const refs: FileRef[] = items.flatMap((item) =>
      item.status === 'done' && item.key ? [{ key: item.key, name: item.name }] : [],
    )
    sync.current(refs)
    busyChange.current?.(items.some((item) => item.status === 'uploading'))
  }, [items])

  const update = (itemId: string, change: Partial<Item>) =>
    setItems((current) =>
      current.map((item) => (item.id === itemId ? { ...item, ...change } : item)),
    )

  const onPick = (files: FileList | null) => {
    if (!files?.length) return
    const room = max - items.filter((item) => item.status !== 'error').length
    const picked = [...files].slice(0, Math.max(room, 0))
    if (files.length > picked.length) setNotice(`You can add up to ${max} files.`)
    const added = picked.map((file) => ({
      file,
      item: {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: file.name,
        size: file.size,
        status: 'uploading' as const,
      },
    }))
    setItems((current) => [...current, ...added.map(({ item }) => item)])
    for (const { file, item } of added) {
      void upload(file, kind).then((result) => {
        if ('key' in result) {
          update(item.id, { status: 'done', key: result.key })
          setNotice(`${file.name} uploaded.`)
        } else {
          update(item.id, { status: 'error', message: result.error })
          setNotice(`${file.name} couldn’t be uploaded: ${result.error}`)
        }
      })
    }
    if (input.current) input.current.value = ''
  }

  const remove = (item: Item) => {
    setItems((current) => current.filter((entry) => entry.id !== item.id))
    setNotice(`${item.name} removed.`)
  }

  const error = fieldState.error?.message
  return (
    <div className="grid gap-2">
      <span id={`${id}-label`} className="font-semibold text-ink">
        {label} <span className="font-normal text-muted">(optional)</span>
      </span>
      <p id={`${id}-hint`} className="text-small text-muted">
        Up to {max} files. {KINDS[kind].hint}
      </p>
      <input
        ref={input}
        id={id}
        type="file"
        multiple
        accept={KINDS[kind].accept}
        aria-labelledby={`${id}-label`}
        aria-describedby={`${id}-hint${error ? ` ${id}-error` : ''}`}
        className="peer sr-only"
        onChange={(event) => onPick(event.target.files)}
      />
      <label
        htmlFor={id}
        className="flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-card border-2 border-dashed border-border-strong bg-surface px-4 py-4 font-semibold text-primary peer-focus-visible:[outline:3px_solid_var(--focus-ring)] peer-focus-visible:outline-offset-2 hover:border-primary"
      >
        <Paperclip aria-hidden className="size-5" />
        Choose {kind === 'photo' ? 'photos' : 'files'}
      </label>
      {items.length > 0 && (
        <ul className="grid gap-2">
          {items.map((item) => (
            <li
              key={item.id}
              className={cn(
                'flex items-center gap-3 rounded-lg border px-3 py-2 text-small',
                item.status === 'error' ? 'border-error' : 'border-border',
              )}
            >
              {item.status === 'uploading' && (
                <LoaderCircle aria-hidden className="size-5 shrink-0 animate-spin text-muted" />
              )}
              {item.status === 'done' && (
                <CircleCheck aria-hidden className="size-5 shrink-0 text-success-strong" />
              )}
              {item.status === 'error' && (
                <CircleAlert aria-hidden className="size-5 shrink-0 text-error" />
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-ink">{item.name}</span>
                <span className={item.status === 'error' ? 'text-error' : 'text-muted'}>
                  {item.status === 'uploading'
                    ? 'Uploading…'
                    : item.status === 'error'
                      ? item.message
                      : sizeLabel(item.size)}
                </span>
              </span>
              <button
                type="button"
                onClick={() => remove(item)}
                aria-label={`Remove ${item.name}`}
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-muted hover:bg-surface hover:text-ink"
              >
                <X aria-hidden className="size-5" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <p role="status" aria-live="polite" className="sr-only">
        {notice}
      </p>
      {error && (
        <p id={`${id}-error`} className="text-small font-medium text-error">
          {error}
        </p>
      )}
    </div>
  )
}
