/**
 * The falling-snow canvas (Effect 1): flakes in three depth layers (far ones small, slow and
 * faint; near ones bigger, faster and brighter) drifting side to side in a light wind, and pushed
 * gently away from the mouse or a finger. falling-snow.tsx loads this once the page is idle.
 */

type Range = readonly [number, number]
type Layer = {
  share: number
  radius: Range
  speed: Range
  alpha: Range
  sway: Range
  /** How strongly the pointer pushes this layer (near flakes move most). */
  push: number
}

const LAYERS: readonly Layer[] = [
  { share: 0.55, radius: [0.7, 1.3], speed: [14, 26], alpha: [0.3, 0.5], sway: [4, 9], push: 0.5 },
  {
    share: 0.3,
    radius: [1.3, 2.2],
    speed: [30, 46],
    alpha: [0.5, 0.72],
    sway: [8, 15],
    push: 0.8,
  },
  {
    share: 0.15,
    radius: [2.2, 3.4],
    speed: [54, 80],
    alpha: [0.72, 0.92],
    sway: [14, 24],
    push: 1,
  },
]

/** Slow snow looks the same at 30 frames a second, for half the drawing work of 60. */
const FRAME_MS = 1000 / 30

/** Pixels around the pointer that it clears, and its strongest push (px/s²). */
const PUSH_RADIUS = 110
const PUSH_STRENGTH = 900

/** About 150 flakes on a desktop, 60 on a phone, in between on a tablet. */
export function flakeCount(viewportWidth: number): number {
  return viewportWidth < 768 ? 60 : viewportWidth < 1024 ? 100 : 150
}

/** The pointer's push on a flake `distance` px away: strongest up close, gone at the radius. */
export function pushStrength(distance: number): number {
  if (distance >= PUSH_RADIUS) return 0
  const closeness = 1 - distance / PUSH_RADIUS
  return closeness * closeness * PUSH_STRENGTH
}

type Flake = {
  x: number
  y: number
  radius: number
  speed: number
  sway: number
  swayRate: number
  phase: number
  alpha: number
  push: number
  vx: number
  vy: number
}

const between = ([min, max]: Range) => min + Math.random() * (max - min)

/** A soft round flake drawn once and stamped at every size (cheaper than drawing circles). */
function flakeSprite(): HTMLCanvasElement {
  const size = 32
  const sprite = document.createElement('canvas')
  sprite.width = size
  sprite.height = size
  const context = sprite.getContext('2d')
  if (context) {
    const glow = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    glow.addColorStop(0, 'rgb(255 255 255 / 1)')
    glow.addColorStop(0.45, 'rgb(255 255 255 / 0.85)')
    glow.addColorStop(1, 'rgb(255 255 255 / 0)')
    context.fillStyle = glow
    context.fillRect(0, 0, size, size)
  }
  return sprite
}

/** Adds the snow canvas to the page and starts it; returns a function that removes it again. */
export function startSnow(): () => void {
  const canvas = document.createElement('canvas')
  canvas.className = 'wc-snow-canvas'
  canvas.setAttribute('aria-hidden', 'true')
  const context = canvas.getContext('2d')
  if (!context) return () => {}
  const ctx = context
  document.body.append(canvas)
  const sprite = flakeSprite()
  const flakes: Flake[] = []
  const pointer = { x: 0, y: 0, active: false }
  let width = 0
  let height = 0
  let frame = 0
  let resizeFrame = 0
  let last = 0
  let time = 0

  // One canvas pixel per CSS pixel, even on sharp screens: the flakes are soft dots, so extra
  // resolution adds drawing work without visible detail. The phone address bar changes the
  // height as the page scrolls: only grow the canvas then, and start over only when the width
  // changes (rotation, window resize).
  function resize() {
    const nextWidth = window.innerWidth
    const nextHeight =
      nextWidth === width ? Math.max(height, window.innerHeight) : window.innerHeight
    if (nextWidth === width && nextHeight === height) return
    if (width) for (const flake of flakes) flake.x *= nextWidth / width
    width = nextWidth
    height = nextHeight
    canvas.width = width
    canvas.height = height
    canvas.style.height = `${height}px`
  }

  resize()
  const count = flakeCount(width)
  for (const layer of LAYERS) {
    for (let index = 0; index < Math.round(count * layer.share); index++) {
      flakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: between(layer.radius),
        speed: between(layer.speed),
        sway: between(layer.sway),
        swayRate: 0.5 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        alpha: between(layer.alpha),
        push: layer.push,
        vx: 0,
        vy: 0,
      })
    }
  }

  function draw(now: number) {
    if (last && now - last < FRAME_MS - 2) {
      frame = requestAnimationFrame(draw)
      return
    }
    const seconds = last ? Math.min((now - last) / 1000, 0.1) : 0
    last = now
    time += seconds
    const wind = Math.sin(time * 0.11) * 9 + Math.sin(time * 0.037 + 1) * 5
    const fadeIn = Math.min(1, time / 1.2)
    const damping = Math.exp(-2.4 * seconds)
    ctx.clearRect(0, 0, width, height)
    for (const flake of flakes) {
      if (pointer.active) {
        const dx = flake.x - pointer.x
        const dy = flake.y - pointer.y
        const distance = Math.hypot(dx, dy)
        const force = pushStrength(distance) * flake.push
        if (force > 0 && distance > 0.5) {
          flake.vx += (dx / distance) * force * seconds
          flake.vy += (dy / distance) * force * seconds
        }
      }
      flake.vx *= damping
      flake.vy *= damping
      flake.x +=
        (wind * (0.4 + flake.push * 0.6) +
          Math.sin(time * flake.swayRate + flake.phase) * flake.sway +
          flake.vx) *
        seconds
      flake.y += (flake.speed + flake.vy) * seconds
      const size = flake.radius * 4
      if (flake.y - size > height) {
        flake.y = -size
        flake.x = Math.random() * width
        flake.vx = 0
        flake.vy = 0
      } else if (flake.y < -60) {
        flake.y = -60
      }
      if (flake.x < -size) flake.x += width + size * 2
      else if (flake.x > width + size) flake.x -= width + size * 2
      ctx.globalAlpha = flake.alpha * fadeIn
      ctx.drawImage(sprite, flake.x - size / 2, flake.y - size / 2, size, size)
    }
    frame = requestAnimationFrame(draw)
  }

  // Mouse and pen follow pointer events; fingers use touch events, which keep coming while the
  // page scrolls. All listeners are passive: the snow never gets in the way of scrolling.
  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return
    pointer.x = event.clientX
    pointer.y = event.clientY
    pointer.active = true
  }
  const onTouch = (event: TouchEvent) => {
    const touch = event.touches[0]
    if (!touch) {
      pointer.active = false
      return
    }
    pointer.x = touch.clientX
    pointer.y = touch.clientY
    pointer.active = true
  }
  const onLeave = () => {
    pointer.active = false
  }
  const onResize = () => {
    cancelAnimationFrame(resizeFrame)
    resizeFrame = requestAnimationFrame(resize)
  }
  const onVisibility = () => {
    cancelAnimationFrame(frame)
    if (document.visibilityState === 'visible') {
      last = 0
      frame = requestAnimationFrame(draw)
    }
  }

  const passive = { passive: true }
  window.addEventListener('pointermove', onPointerMove, passive)
  window.addEventListener('touchstart', onTouch, passive)
  window.addEventListener('touchmove', onTouch, passive)
  window.addEventListener('touchend', onTouch, passive)
  window.addEventListener('touchcancel', onLeave, passive)
  window.addEventListener('blur', onLeave)
  window.addEventListener('resize', onResize)
  document.documentElement.addEventListener('mouseleave', onLeave)
  document.addEventListener('visibilitychange', onVisibility)
  frame = requestAnimationFrame(draw)

  return () => {
    cancelAnimationFrame(frame)
    cancelAnimationFrame(resizeFrame)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('touchstart', onTouch)
    window.removeEventListener('touchmove', onTouch)
    window.removeEventListener('touchend', onTouch)
    window.removeEventListener('touchcancel', onLeave)
    window.removeEventListener('blur', onLeave)
    window.removeEventListener('resize', onResize)
    document.documentElement.removeEventListener('mouseleave', onLeave)
    document.removeEventListener('visibilitychange', onVisibility)
    canvas.remove()
  }
}
