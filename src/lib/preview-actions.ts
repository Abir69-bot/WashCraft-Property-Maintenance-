'use server'

import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

import { isSafePath } from '@/lib/preview'

/** Leaves draft mode and reloads the same page as visitors see it. */
export async function exitPreview(path: string) {
  ;(await draftMode()).disable()
  redirect(isSafePath(path) ? path : '/')
}
