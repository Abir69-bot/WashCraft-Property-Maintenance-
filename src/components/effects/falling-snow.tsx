'use client'

import { Snowflake } from 'lucide-react'
import { useEffect, useSyncExternalStore } from 'react'

import { HideOn, QUOTE_AND_LEGAL } from '@/components/layout/route-visibility'
import { Button } from '@/components/ui/button'
import { useReducedMotion } from '@/components/use-reduced-motion'

import { snowOverride } from './snow-settings'
import './falling-snow.css'

/** The visitor's choice from the snowflake button, kept on this device. */
const CHOICE_KEY = 'wc-snow'
const choiceListeners = new Set<() => void>()
/** Used when storage is blocked, so the button still works until the page reloads. */
let choiceInMemory: boolean | null = null

function snowChosen(): boolean {
  if (choiceInMemory !== null) return choiceInMemory
  try {
    return localStorage.getItem(CHOICE_KEY) !== 'off'
  } catch {
    return true
  }
}

function chooseSnow(on: boolean) {
  choiceInMemory = on
  try {
    localStorage.setItem(CHOICE_KEY, on ? 'on' : 'off')
  } catch {
    // Storage blocked: the in-memory choice applies until the page reloads.
  }
  choiceListeners.forEach((listener) => listener())
}

function subscribeChoice(onChange: () => void) {
  choiceListeners.add(onChange)
  const onStorage = (event: StorageEvent) => {
    if (event.key !== CHOICE_KEY) return
    choiceInMemory = null
    onChange()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    choiceListeners.delete(onChange)
    window.removeEventListener('storage', onStorage)
  }
}

const noSubscription = () => () => {}

/** Signs that the visitor is using the page: the snow starts with the first of these. */
const ENGAGEMENT = ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll']
/** A visitor who just reads without touching anything gets the snow after this long. */
const FALLBACK_MS = 8000
let engagedBefore = false

/**
 * Runs `task` once the page has fully loaded and the visitor first moves, taps, scrolls or types
 * (or after a few seconds), when the browser is idle. Decoration never competes with the page
 * while it loads. Returns a cancel function.
 */
function whenEngaged(task: () => void): () => void {
  let loaded = document.readyState === 'complete'
  let started = false
  let timer = 0
  let idle = 0
  const removeListeners = () => {
    ENGAGEMENT.forEach((type) => window.removeEventListener(type, onEngage))
    window.removeEventListener('load', onLoad)
    window.clearTimeout(timer)
  }
  const maybeStart = () => {
    if (started || !loaded || !engagedBefore) return
    started = true
    removeListeners()
    // Safari has no requestIdleCallback.
    if (typeof window.requestIdleCallback === 'function') {
      idle = window.requestIdleCallback(task, { timeout: 1000 })
    } else {
      task()
    }
  }
  function onEngage() {
    engagedBefore = true
    maybeStart()
  }
  function onLoad() {
    loaded = true
    timer = window.setTimeout(onEngage, FALLBACK_MS)
    maybeStart()
  }
  ENGAGEMENT.forEach((type) => window.addEventListener(type, onEngage, { passive: true }))
  if (loaded) onLoad()
  else window.addEventListener('load', onLoad, { once: true })
  return () => {
    started = true
    removeListeners()
    if (idle) window.cancelIdleCallback(idle)
  }
}

/**
 * Effect 1 (owner, 2026-11-23): snow falling over the site in winter (or with ?snow=on), with a
 * snowflake button to turn it off. It stays away from the quote and legal pages, where people
 * fill in forms or read, like the call band and the phone action bar do. Nothing shows for
 * visitors who prefer reduced motion. The canvas engine loads only after the page has loaded and
 * the visitor starts using it.
 */
export function FallingSnow({ winter }: { winter: boolean }) {
  return (
    <HideOn prefixes={QUOTE_AND_LEGAL}>
      <Snow winter={winter} />
    </HideOn>
  )
}

function Snow({ winter }: { winter: boolean }) {
  const reducedMotion = useReducedMotion()
  const wanted = useSyncExternalStore(
    noSubscription,
    () => snowOverride(window.location.search) ?? winter,
    () => false,
  )
  const chosen = useSyncExternalStore(subscribeChoice, snowChosen, () => true)
  const shown = wanted && !reducedMotion
  const falling = shown && chosen

  // data-snow-motion tells the snow cap's lights to keep twinkling while the snow falls, and to
  // stop when the visitor turns the snow off (snow-cap.css).
  useEffect(() => {
    if (!shown || chosen) return
    const root = document.documentElement
    root.setAttribute('data-snow-motion', 'off')
    return () => root.removeAttribute('data-snow-motion')
  }, [shown, chosen])

  useEffect(() => {
    if (!falling) return
    const root = document.documentElement
    let stop: (() => void) | undefined
    let cancelled = false
    const cancelStart = whenEngaged(() => {
      import('./snow-engine')
        .then(({ startSnow }) => {
          if (cancelled) return
          stop = startSnow()
          root.setAttribute('data-snow-motion', 'on')
        })
        .catch(() => {
          // No snow if the engine can't load; the page itself is unaffected.
        })
    })
    return () => {
      cancelled = true
      cancelStart()
      stop?.()
      root.removeAttribute('data-snow-motion')
    }
  }, [falling])

  if (!shown) return null
  return (
    <>
      <Button
        type="button"
        size="icon"
        variant="night"
        aria-label="Snow effects"
        aria-pressed={chosen}
        title={chosen ? 'Turn the snow off' : 'Turn the snow on'}
        onClick={() => chooseSnow(!chosen)}
        className="wc-snow-toggle"
      >
        <Snowflake aria-hidden="true" />
      </Button>
    </>
  )
}
