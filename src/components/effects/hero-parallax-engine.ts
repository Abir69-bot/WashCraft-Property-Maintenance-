/**
 * Effect 4's motion: the home hero photo slides a few pixels against the mouse, so it reads as a
 * layer behind the headline. It slides rather than tilts, so it needs only a 1-2% zoom (applied
 * while the mouse is over the photo) to keep the photo's edges out of sight.
 */

/** Furthest the photo moves: 8px sideways and 4px up or down. */
const SHIFT_X = 8
const SHIFT_Y = 4
/** Seconds to cover most of the way to the target: smooth and the same at any frame rate. */
const EASE_SECONDS = 0.13
const HERO = 'section[aria-labelledby="hero-heading"]'

/** Just enough zoom to hide the photo's edges at the furthest shift, plus a 1px margin. */
export function heroZoom(width: number, height: number): number {
  if (width <= 0 || height <= 0) return 1
  return 1 + 2 * Math.max((SHIFT_X + 1) / width, (SHIFT_Y + 1) / height)
}

const clamp = (value: number) => Math.max(-1, Math.min(1, value))

/** Starts following the mouse over the hero; returns a function that puts the photo back. */
export function startHeroParallax(): () => void {
  let photo: HTMLImageElement | null = null
  // `engaged` eases from 0 (today's look) to 1 (zoomed to cover the shift) and back.
  const target = { x: 0, y: 0, engaged: 0 }
  const current = { x: 0, y: 0, engaged: 0 }
  let frame = 0
  let last = 0

  // Looked up again whenever the hero re-renders (navigation, a new season's photo).
  const findPhoto = () => {
    if (!photo?.isConnected) {
      photo = document.querySelector<HTMLImageElement>(`${HERO} img[data-nimg="fill"]`)
    }
    return photo
  }

  const reset = (element: HTMLImageElement | null) => {
    element?.style.removeProperty('transform')
    element?.style.removeProperty('will-change')
  }

  const tick = (now: number) => {
    frame = 0
    const element = findPhoto()
    if (!element) return
    const seconds = last ? Math.min((now - last) / 1000, 0.1) : 1 / 60
    last = now
    const blend = 1 - Math.exp(-seconds / EASE_SECONDS)
    current.x += (target.x - current.x) * blend
    current.y += (target.y - current.y) * blend
    current.engaged += (target.engaged - current.engaged) * blend
    const settled =
      Math.abs(target.x - current.x) < 0.05 &&
      Math.abs(target.y - current.y) < 0.05 &&
      Math.abs(target.engaged - current.engaged) < 0.002
    if (settled && target.engaged === 0) {
      current.x = 0
      current.y = 0
      current.engaged = 0
      last = 0
      reset(element)
      return
    }
    // offsetWidth/Height are the layout size, unaffected by the transform itself.
    const zoom = 1 + (heroZoom(element.offsetWidth, element.offsetHeight) - 1) * current.engaged
    element.style.willChange = 'transform'
    element.style.transform = `translate3d(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px, 0) scale(${zoom.toFixed(4)})`
    if (settled) last = 0
    else frame = requestAnimationFrame(tick)
  }

  const wake = () => {
    if (!frame) frame = requestAnimationFrame(tick)
  }

  const rest = () => {
    target.x = 0
    target.y = 0
    target.engaged = 0
    wake()
  }

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return
    const hero = event.target instanceof Element ? event.target.closest(HERO) : null
    if (!hero) {
      if (target.engaged) rest()
      return
    }
    const box = hero.getBoundingClientRect()
    // The photo moves opposite to the mouse, as a layer further away would.
    target.x = -clamp(((event.clientX - box.left) / box.width) * 2 - 1) * SHIFT_X
    target.y = -clamp(((event.clientY - box.top) / box.height) * 2 - 1) * SHIFT_Y
    target.engaged = 1
    wake()
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('blur', rest)
  document.documentElement.addEventListener('mouseleave', rest)
  document.addEventListener('visibilitychange', rest)

  return () => {
    cancelAnimationFrame(frame)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('blur', rest)
    document.documentElement.removeEventListener('mouseleave', rest)
    document.removeEventListener('visibilitychange', rest)
    reset(photo)
  }
}
