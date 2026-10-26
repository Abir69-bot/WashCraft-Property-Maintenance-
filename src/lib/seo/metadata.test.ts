import { describe, expect, it } from 'vitest'

import type { Media } from '@/payload-types'

import { excerpt, pageMetadata } from './metadata'
import { readOgCard } from './og'

const photo = {
  id: 1,
  alt: 'Clean gutters',
  url: 'http://localhost:3000/api/media/file/gutters.jpg',
} as Media

describe('excerpt', () => {
  it('keeps short text and collapses whitespace', () => {
    expect(excerpt('  Clean   gutters.\n')).toBe('Clean gutters.')
  })

  it('cuts long text at a word boundary', () => {
    const text = 'word '.repeat(60)
    const result = excerpt(text, 30)
    expect(result.length).toBeLessThanOrEqual(30)
    expect(result).toBe('word word word word word word…')
  })
})

describe('pageMetadata', () => {
  const base = {
    path: '/services/gutter-cleaning',
    title: 'Gutter Cleaning in Denver Metro',
    description: 'Gutters cleared by hand and flushed.',
    siteName: 'WashCraft',
  }

  it('uses the title pattern, a canonical URL and Open Graph tags', () => {
    expect(pageMetadata(base)).toEqual({
      title: 'Gutter Cleaning in Denver Metro',
      description: 'Gutters cleared by hand and flushed.',
      alternates: { canonical: '/services/gutter-cleaning' },
      openGraph: {
        type: 'website',
        siteName: 'WashCraft',
        url: '/services/gutter-cleaning',
        title: 'Gutter Cleaning in Denver Metro | WashCraft',
        description: 'Gutters cleared by hand and flushed.',
        images: [expect.objectContaining({ width: 1200, height: 630 })],
      },
    })
  })

  it('shares a signed, generated card when the page has no photo', () => {
    const [card] = pageMetadata({ ...base, eyebrow: 'Exterior Cleaning' }).openGraph!.images as {
      url: string
      alt: string
    }[]
    const url = new URL(card.url, 'http://localhost')
    expect(url.pathname).toBe('/next/og')
    expect(card.alt).toBe('Gutter Cleaning in Denver Metro')
    expect(readOgCard(url.searchParams)).toEqual({
      title: 'Gutter Cleaning in Denver Metro',
      eyebrow: 'Exterior Cleaning',
    })
    url.searchParams.set('title', 'Something else')
    expect(readOgCard(url.searchParams)).toBeNull()
  })

  it('lets the SEO tab override the title, description and image', () => {
    const metadata = pageMetadata({
      ...base,
      seo: { title: 'Custom title | WashCraft', description: 'Custom description', image: photo },
    })
    expect(metadata.title).toEqual({ absolute: 'Custom title | WashCraft' })
    expect(metadata.description).toBe('Custom description')
    expect(metadata.openGraph).toMatchObject({
      title: 'Custom title | WashCraft',
      images: [{ url: '/api/media/file/gutters.jpg', alt: 'Clean gutters' }],
    })
  })

  it('falls back to the page photo for Open Graph', () => {
    expect(pageMetadata({ ...base, image: photo }).openGraph).toMatchObject({
      images: [{ url: '/api/media/file/gutters.jpg', alt: 'Clean gutters' }],
    })
  })
})
