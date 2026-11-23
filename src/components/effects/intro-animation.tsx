import type { CSSProperties } from 'react'

import { Logo } from '@/components/brand/logo'

import { INTRO_SCRIPT } from './intro-script'
import { SNOW_OVERRIDE_SCRIPT } from './snow-settings'
import './intro-animation.css'

/*
 * The ice breaks along a fixed pattern, worked out once when the module loads (no randomness, so
 * every render is identical): 12 cracks run out from the point the hammer hits, joined by a ring
 * crack. That gives 12 inner shards (triangles) and 12 outer shards that reach past the screen
 * edges. All coordinates are percentages of the screen.
 */
const IMPACT = { x: 50, y: 46 }
const SECTORS = 12
const OUTER_RADIUS = 120

type Point = [number, number]

const angleOf = (index: number) =>
  (index / SECTORS) * Math.PI * 2 + (((index * 37) % 10) - 5) * 0.035
const ring: Point[] = Array.from({ length: SECTORS }, (_, index) => {
  const radius = 15 + ((index * 53) % 11)
  return [
    IMPACT.x + Math.cos(angleOf(index)) * radius,
    IMPACT.y + Math.sin(angleOf(index)) * radius,
  ]
})
const edge: Point[] = Array.from({ length: SECTORS }, (_, index) => [
  IMPACT.x + Math.cos(angleOf(index)) * OUTER_RADIUS,
  IMPACT.y + Math.sin(angleOf(index)) * OUTER_RADIUS,
])

const clampPercent = (value: number) => Math.max(0, Math.min(100, value))
const percent = (value: number) => `${value.toFixed(2)}%`

/**
 * One shard: a box around its polygon (so the browser only paints that much), the polygon as a
 * clip path inside it, the ice texture lined up with the whole screen, and where it flies.
 */
function shard(points: Point[], index: number, outer: boolean): CSSProperties {
  const xs = points.map(([x]) => clampPercent(x))
  const ys = points.map(([, y]) => clampPercent(y))
  const left = Math.min(...xs)
  const top = Math.min(...ys)
  const width = Math.max(Math.max(...xs) - left, 1)
  const height = Math.max(Math.max(...ys) - top, 1)
  const local = points.map(
    ([x, y]) => `${percent(((x - left) / width) * 100)} ${percent(((y - top) / height) * 100)}`,
  )
  const centre = points.reduce<Point>(
    ([sx, sy], [x, y]) => [
      sx + clampPercent(x) / points.length,
      sy + clampPercent(y) / points.length,
    ],
    [0, 0],
  )
  const middle = angleOf(index) + Math.PI / SECTORS
  const distance = (outer ? 55 : 30) + ((index * 41) % 20)
  const spin = (((index * 67) % 2 === 0 ? 1 : -1) * (18 + ((index * 23) % 40))).toFixed(0)
  return {
    left: percent(left),
    top: percent(top),
    width: percent(width),
    height: percent(height),
    clipPath: `polygon(${local.join(', ')})`,
    backgroundSize: `${percent(10000 / width)} ${percent(10000 / height)}`,
    backgroundPosition: `${width >= 100 ? '0%' : percent((left / (100 - width)) * 100)} ${height >= 100 ? '0%' : percent((top / (100 - height)) * 100)}`,
    transformOrigin: `${percent(((centre[0] - left) / width) * 100)} ${percent(((centre[1] - top) / height) * 100)}`,
    '--tx': `${(Math.cos(middle) * distance).toFixed(1)}vmin`,
    '--ty': `${(Math.sin(middle) * distance).toFixed(1)}vmin`,
    '--tz': `${outer ? 120 : 260}px`,
    '--spin': `${spin}deg`,
    '--delay': `${outer ? 0.04 : 0}s`,
  } as CSSProperties
}

const next = (index: number) => (index + 1) % SECTORS
const SHARDS: CSSProperties[] = [
  ...ring.map((point, index) =>
    shard([[IMPACT.x, IMPACT.y], point, ring[next(index)]], index, false),
  ),
  ...ring.map((point, index) =>
    shard([point, edge[index], edge[next(index)], ring[next(index)]], index, true),
  ),
]

/** The cracks, drawn along exactly the lines the shards break on. */
const CRACKS = [
  ...ring.map(([x, y]) => `M${IMPACT.x} ${IMPACT.y}L${x.toFixed(2)} ${y.toFixed(2)}`),
  ...ring.map(([x, y], index) => {
    const [nx, ny] = ring[next(index)]
    return `M${x.toFixed(2)} ${y.toFixed(2)}L${nx.toFixed(2)} ${ny.toFixed(2)}`
  }),
  ...ring.map(([x, y], index) => {
    const [ex, ey] = edge[index]
    const reach = 0.35 + ((index * 19) % 30) / 100
    return `M${x.toFixed(2)} ${y.toFixed(2)}L${(x + (ex - x) * reach).toFixed(2)} ${(y + (ey - y) * reach).toFixed(2)}`
  }),
].join('')

/** Ice dust thrown out by the hit. */
const DUST = Array.from({ length: 16 }, (_, index): CSSProperties => {
  const angle = (index / 16) * Math.PI * 2 + ((index * 7) % 5) * 0.1
  const distance = 9 + ((index * 31) % 12)
  return {
    '--dx': `${(Math.cos(angle) * distance).toFixed(1)}vmin`,
    '--dy': `${(Math.sin(angle) * distance).toFixed(1)}vmin`,
    '--size': `${3 + ((index * 5) % 5)}px`,
  } as CSSProperties
})

/** Snowflakes in winter, spread evenly across the screen. */
const FLAKES = Array.from({ length: 24 }, (_, index): CSSProperties => {
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
 * Effect 2 (owner, 2026-11-23): the opening intro on the home page. The screen is a sheet of ice
 * with the logo frozen in it; an ice hammer swings in and strikes it, cracks race out, and the
 * ice blasts apart toward the viewer while the logo breaks free and bursts forward, opening the
 * page, which has been loading underneath the whole time. The overlay is server-rendered and
 * hidden; the inline script (intro-script.ts) shows it only when it should play and ends it on
 * any click, tap, scroll or key, before React has even loaded. No React code runs for it.
 */
export function IntroAnimation({ winter }: { winter: boolean }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: `${SNOW_OVERRIDE_SCRIPT};${INTRO_SCRIPT}` }} />
      <div className="wc-intro" data-winter={winter ? '' : undefined}>
        <div className="wc-intro__stage" aria-hidden="true">
          <div className="wc-intro__ice" />
          {SHARDS.map((style, index) => (
            <span key={index} className="wc-intro__shard" style={style} />
          ))}
          <div className="wc-intro__logo">
            <Logo variant="badge" height={262} />
          </div>
          <svg className="wc-intro__cracks" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path className="wc-intro__crack-glow" d={CRACKS} />
            <path className="wc-intro__crack" d={CRACKS} />
          </svg>
          <div className="wc-intro__flash" />
          {DUST.map((style, index) => (
            <span key={index} className="wc-intro__dust" style={style} />
          ))}
          <svg className="wc-intro__hammer" viewBox="0 0 100 100">
            <line className="wc-intro__handle-edge" x1="28" y1="28" x2="94" y2="94" />
            <line className="wc-intro__handle" x1="28" y1="28" x2="94" y2="94" />
            <line className="wc-intro__grip" x1="76" y1="76" x2="94" y2="94" />
            <polygon className="wc-intro__head" points="31.9,0.7 43.3,12.1 12.1,43.3 0.7,31.9" />
            <polygon className="wc-intro__shine" points="30.5,5.1 33.7,8.3 8.3,33.7 5.1,30.5" />
          </svg>
          {FLAKES.map((style, index) => (
            <span key={index} className="wc-intro__flake" style={style} />
          ))}
        </div>
        <button type="button" className="wc-intro__skip">
          Skip intro
        </button>
      </div>
    </>
  )
}
