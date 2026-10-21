import { MessageSquare, Phone } from 'lucide-react'

import { TodoChip } from '@/components/ui/todo-chip'
import { smsHref, telHref } from '@/lib/text'
import { cn } from '@/lib/utils'

/** "Call (720) 555-0142" link, or a TODO chip while the phone number is a placeholder. */
export function CallLink({
  phone,
  className,
  label,
}: {
  phone: string
  className?: string
  label?: string
}) {
  const href = telHref(phone)
  if (!href) return <TodoChip label="phone" />
  return (
    <a
      href={href}
      data-track="call_click"
      className={cn('inline-flex items-center gap-2', className)}
    >
      <Phone aria-hidden className="size-4 shrink-0" />
      {label ?? phone}
    </a>
  )
}

export function TextLink({
  phone,
  className,
  label = 'Text us',
}: {
  phone: string
  className?: string
  label?: string
}) {
  const href = smsHref(phone)
  if (!href) return null
  return (
    <a
      href={href}
      data-track="sms_click"
      className={cn('inline-flex items-center gap-2', className)}
    >
      <MessageSquare aria-hidden className="size-4 shrink-0" />
      {label}
    </a>
  )
}
