import { describe, expect, it } from 'vitest'

import { flakeCount, pushStrength } from './snow-engine'

describe('flakeCount', () => {
  it('uses about 60 flakes on phones, 100 on tablets and 150 on desktops', () => {
    expect(flakeCount(375)).toBe(60)
    expect(flakeCount(767)).toBe(60)
    expect(flakeCount(768)).toBe(100)
    expect(flakeCount(1023)).toBe(100)
    expect(flakeCount(1024)).toBe(150)
    expect(flakeCount(2560)).toBe(150)
  })
})

describe('pushStrength', () => {
  it('pushes hardest right at the pointer and fades to nothing at 110px', () => {
    expect(pushStrength(0)).toBe(900)
    expect(pushStrength(55)).toBeCloseTo(225)
    expect(pushStrength(110)).toBe(0)
    expect(pushStrength(500)).toBe(0)
  })

  it('weakens smoothly with distance', () => {
    const pushes = [0, 20, 40, 60, 80, 100].map(pushStrength)
    for (let index = 1; index < pushes.length; index++) {
      expect(pushes[index]).toBeLessThan(pushes[index - 1])
    }
  })
})
