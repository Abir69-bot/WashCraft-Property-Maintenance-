import { FileText, MessageSquare, Phone } from 'lucide-react'
import Link from 'next/link'

import { routes } from '@/lib/routes'
import { smsHref, telHref } from '@/lib/text'

import { HideOn, QUOTE_PAGES } from './route-visibility'

const itemClass =
  'flex min-h-14 flex-col items-center justify-center gap-0.5 text-small font-semibold no-underline'

/** Sticky Call · Text · Get quote bar below 768px, hidden on quote pages (brief §8). */
export function MobileActionBar({ phone }: { phone: string }) {
  const call = telHref(phone)
  const text = smsHref(phone)
  return (
    <HideOn prefixes={QUOTE_PAGES}>
      <nav
        aria-label="Quick actions"
        className="fixed inset-x-0 bottom-0 z-40 grid auto-cols-fr grid-flow-col border-t border-border bg-white shadow-[0_-4px_12px_rgb(0_0_0/0.08)] md:hidden"
      >
        {call && (
          <a href={call} data-track="call_click" className={`${itemClass} text-primary`}>
            <Phone aria-hidden className="size-5" />
            Call
          </a>
        )}
        {text && (
          <a href={text} data-track="sms_click" className={`${itemClass} text-primary`}>
            <MessageSquare aria-hidden className="size-5" />
            Text
          </a>
        )}
        <Link href={routes.quote} className={`${itemClass} bg-cta text-ink`}>
          <FileText aria-hidden className="size-5" />
          Get quote
        </Link>
      </nav>
    </HideOn>
  )
}
