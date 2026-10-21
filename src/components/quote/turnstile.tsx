'use client'

import { useEffect, useRef } from 'react'

import { TURNSTILE_SITE_KEY } from '@/lib/public-env'

type TurnstileApi = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string
  remove: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

let script: Promise<TurnstileApi> | null = null

function loadTurnstile() {
  script ??= new Promise((resolve, reject) => {
    const tag = document.createElement('script')
    tag.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    tag.async = true
    tag.onload = () =>
      window.turnstile ? resolve(window.turnstile) : reject(new Error('Turnstile missing'))
    tag.onerror = () => {
      script = null
      reject(new Error('Turnstile failed to load'))
    }
    document.head.appendChild(tag)
  })
  return script
}

/**
 * Cloudflare Turnstile spam check (brief §10.1). Usually invisible; it only asks the visitor to
 * click when Cloudflare isn't sure. Renders nothing when no site key is set (development).
 * Tokens are single-use: change `key` to get a fresh one after a failed submission.
 */
export function Turnstile({ onToken }: { onToken: (token: string) => void }) {
  const container = useRef<HTMLDivElement>(null)
  const callback = useRef(onToken)
  useEffect(() => {
    callback.current = onToken
  })

  useEffect(() => {
    const element = container.current
    if (!TURNSTILE_SITE_KEY || !element) return
    let widget: string | undefined
    let cancelled = false
    loadTurnstile()
      .then((api) => {
        if (cancelled) return
        widget = api.render(element, {
          sitekey: TURNSTILE_SITE_KEY,
          appearance: 'interaction-only',
          size: 'flexible',
          callback: (token: string) => callback.current(token),
          'expired-callback': () => callback.current(''),
          'error-callback': () => callback.current(''),
        })
      })
      .catch((error) => console.warn(error))
    return () => {
      cancelled = true
      if (widget) window.turnstile?.remove(widget)
    }
  }, [])

  return TURNSTILE_SITE_KEY ? <div ref={container} /> : null
}
