import { describe, expect, it } from 'vitest'

import { isSafePath, previewUrl } from './preview'

describe('preview', () => {
  it('only redirects to paths on this site', () => {
    expect(isSafePath('/services/gutter-cleaning')).toBe(true)
    expect(isSafePath('/')).toBe(true)
    expect(isSafePath('//evil.example')).toBe(false)
    expect(isSafePath(String.raw`/\evil.example`)).toBe(false)
    expect(isSafePath('https://evil.example')).toBe(false)
    expect(isSafePath('')).toBe(false)
  })

  it("builds the admin preview link from the document's page path", () => {
    expect(previewUrl('services')({ slug: 'gutter-cleaning' })).toBe(
      '/next/preview?path=%2Fservices%2Fgutter-cleaning',
    )
    expect(previewUrl('cities')({ slug: 'aurora' })).toBe('/next/preview?path=%2Fareas%2Faurora')
    expect(previewUrl('services')({ slug: '' })).toBeNull()
  })
})
