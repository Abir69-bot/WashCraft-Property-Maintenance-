import Link from 'next/link'

import type { Season } from '@/config/catalog'
import type { SeasonalSetting } from '@/payload-types'

import { AnnouncementDismiss } from './announcement-dismiss'

export type Announcement = {
  id: string
  message: string
  linkLabel?: string | null
  linkHref?: string | null
}

const STORAGE_KEY = 'wc-announcement'

/** Short stable id, so a new message shows again after an older one was dismissed. */
function idFor(message: string) {
  let hash = 5381
  for (const char of message) hash = ((hash * 33) ^ char.charCodeAt(0)) >>> 0
  return hash.toString(36)
}

/** The active announcement for the current season, falling back to other active seasons. */
export function pickAnnouncement(
  seasonal: SeasonalSetting,
  current: Season,
  active: Season[],
): Announcement | null {
  const live = (seasonal.announcements ?? []).filter((item) => item.active)
  const pick =
    live.find((item) => item.season === current) ??
    live.find((item) => active.includes(item.season as Season)) ??
    live.find((item) => item.season === 'all-year')
  return pick ? { ...pick, id: idFor(pick.message) } : null
}

/**
 * Runs before paint: hides the bar if this message was dismissed in the last 7 days, so it
 * never flashes and the page doesn't shift.
 */
export function announcementScript(id: string) {
  return `try{var d=JSON.parse(localStorage.getItem('${STORAGE_KEY}')||'null');if(d&&d.id===${JSON.stringify(id)}&&d.until>Date.now())document.documentElement.setAttribute('data-announcement-hidden','')}catch(e){}`
}

export function AnnouncementBar({ announcement }: { announcement: Announcement | null }) {
  if (!announcement) return null
  return (
    <div data-announcement className="on-dark text-small">
      <div className="container flex min-h-11 items-center justify-center gap-3 py-1.5">
        <p className="text-center">
          {announcement.message}
          {announcement.linkHref && announcement.linkLabel && (
            <>
              {' '}
              <Link
                href={announcement.linkHref}
                className="inline-block py-1 font-semibold whitespace-nowrap text-white underline underline-offset-4"
              >
                {announcement.linkLabel}
              </Link>
            </>
          )}
        </p>
        <AnnouncementDismiss id={announcement.id} storageKey={STORAGE_KEY} />
      </div>
    </div>
  )
}
