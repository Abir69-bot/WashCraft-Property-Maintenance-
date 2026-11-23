import { describe, expect, it } from 'vitest'

import { heroZoom } from './hero-parallax-engine'

describe('heroZoom', () => {
  it('zooms just enough to hide the edges at the furthest shift (8px across, 4px up/down)', () => {
    expect(heroZoom(1024, 696)).toBeCloseTo(1.0176, 4)
    expect(heroZoom(1366, 696)).toBeCloseTo(1.0144, 4)
    expect(heroZoom(1440, 828)).toBeCloseTo(1.0125, 4)
    expect(heroZoom(1920, 1008)).toBeCloseTo(1.0099, 4)
  })

  it('always covers the shift: the photo grows at least 2 × 8px across and 2 × 4px down', () => {
    for (const [width, height] of [
      [1024, 500],
      [1280, 720],
      [2560, 1300],
    ]) {
      const zoom = heroZoom(width, height)
      expect((zoom - 1) * width).toBeGreaterThanOrEqual(16)
      expect((zoom - 1) * height).toBeGreaterThanOrEqual(8)
    }
  })

  it('leaves an unmeasured photo alone', () => {
    expect(heroZoom(0, 600)).toBe(1)
    expect(heroZoom(1200, 0)).toBe(1)
  })
})
