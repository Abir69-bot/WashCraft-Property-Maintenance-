import type { CSSProperties } from 'react'

import { Logo } from '@/components/brand/logo'

import { INTRO_SCRIPT } from './intro-script'
import { SNOW_OVERRIDE_SCRIPT } from './snow-settings'
import './intro-animation.css'

/** Snowflakes spread evenly across the intro (no randomness, so every render is identical). */
const FLAKES = Array.from({ length: 28 }, (_, index): CSSProperties => {
  const seconds = 1.4 + ((index * 37) % 11) / 10
  return {
    '--x': `${((index * 61.8) % 100).toFixed(1)}%`,
    '--size': `${2 + ((index * 7) % 4)}px`,
    '--opacity': 0.45 + ((index * 13) % 6) / 10,
    '--fall': `${seconds.toFixed(1)}s`,
    '--start': `${(-(((index * 53) % 100) / 100) * seconds).toFixed(2)}s`,
    '--drift': `${((index * 29) % 41) - 20}px`,
  } as CSSProperties
})

/**
 * Effect 2 (owner, 2026-11-23): a short opening intro on the home page. The logo comes forward in
 * 3D, a light sweeps across it, snow falls around it in winter, then the curtain lifts to show the
 * page, which has been loading underneath the whole time. The overlay is server-rendered and
 * hidden; the inline script (intro-script.ts) shows it only when it should play and ends it on any
 * click, tap, scroll or key, before React has even loaded. No React code runs for it.
 */
export function IntroAnimation({ winter }: { winter: boolean }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: `${SNOW_OVERRIDE_SCRIPT};${INTRO_SCRIPT}` }} />
      <div className="wc-intro" data-winter={winter ? '' : undefined}>
        <div className="wc-intro__stage" aria-hidden="true">
          <div className="wc-intro__glow" />
          {FLAKES.map((style, index) => (
            <span key={index} className="wc-intro__flake" style={style} />
          ))}
          <div className="wc-intro__logo">
            <Logo variant="badge" height={262} />
            <Logo variant="badge" height={262} className="wc-intro__shine" />
          </div>
        </div>
        <button type="button" className="wc-intro__skip">
          Skip intro
        </button>
      </div>
    </>
  )
}
