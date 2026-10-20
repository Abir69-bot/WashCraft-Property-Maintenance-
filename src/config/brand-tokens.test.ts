import { readFileSync } from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'

import { contrastRatio } from '@/lib/contrast'

import { colorTokens, contrastPairs, tokenHex } from './brand-tokens'

const css = readFileSync(path.resolve(process.cwd(), 'src/app/(site)/globals.css'), 'utf8')
const rootBlock = /:root\s*\{([^}]*)\}/.exec(css)?.[1] ?? ''
const cssVariables = new Map(
  [...rootBlock.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})\s*;/gi)].map(([, name, hex]) => [
    name,
    hex.toUpperCase(),
  ]),
)

describe('contrastRatio', () => {
  it('matches known WCAG values', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5)
    expect(contrastRatio('#777777', '#FFFFFF')).toBeCloseTo(4.48, 2)
  })
})

describe('brand tokens', () => {
  it.each(colorTokens)('globals.css defines --$name as $hex', ({ name, hex }) => {
    expect(cssVariables.get(name)).toBe(hex.toUpperCase())
  })

  it('documents every colour variable in globals.css', () => {
    const documented = new Set(colorTokens.map((token) => token.name))
    expect([...cssVariables.keys()].filter((name) => !documented.has(name))).toEqual([])
  })

  it.each(contrastPairs)('$fg on $bg reaches $min:1 ($where)', ({ fg, bg, min }) => {
    expect(contrastRatio(tokenHex(fg), tokenHex(bg))).toBeGreaterThanOrEqual(min)
  })
})
