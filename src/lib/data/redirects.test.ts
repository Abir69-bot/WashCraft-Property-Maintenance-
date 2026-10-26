import { describe, expect, it, vi } from 'vitest'

vi.mock('./cache', () => ({ cachedQuery: () => vi.fn(), getPayloadClient: vi.fn() }))

const { normalizePath, redirectTarget, toSiteRedirects } = await import('./redirects')

const redirect = (
  from: string,
  to: Parameters<typeof redirectTarget>[0],
  type: '301' | '302' = '301',
) => ({ id: 1, from, to, type, createdAt: '', updatedAt: '' })

describe('normalizePath', () => {
  it('ignores case, trailing slashes, the domain and the query', () => {
    expect(normalizePath('/Services/Old-Page/')).toBe('/services/old-page')
    expect(normalizePath('services/old')).toBe('/services/old')
    expect(normalizePath('https://example.com/blog/old?utm=x')).toBe('/blog/old')
    expect(normalizePath('/')).toBe('/')
    expect(normalizePath('  ')).toBeNull()
  })
})

describe('redirectTarget', () => {
  it('points at a CMS page by its current slug', () => {
    expect(
      redirectTarget({
        type: 'reference',
        reference: { relationTo: 'services', value: { slug: 'gutter-cleaning' } as never },
      }),
    ).toBe('/services/gutter-cleaning')
  })

  it('keeps full URLs and tidies site paths', () => {
    expect(redirectTarget({ type: 'custom', url: 'https://other.example/page' })).toBe(
      'https://other.example/page',
    )
    expect(redirectTarget({ type: 'custom', url: 'blog/new/' })).toBe('/blog/new')
    expect(redirectTarget({ type: 'custom', url: '' })).toBeNull()
  })
})

describe('toSiteRedirects', () => {
  it('drops broken and self-pointing redirects and maps the type', () => {
    expect(
      toSiteRedirects([
        redirect('/old', { type: 'custom', url: '/new' }),
        redirect('/temp', { type: 'custom', url: '/elsewhere' }, '302'),
        redirect('/same', { type: 'custom', url: '/same/' }),
        redirect('/nowhere', { type: 'custom' }),
      ]),
    ).toEqual([
      { from: '/old', to: '/new', permanent: true },
      { from: '/temp', to: '/elsewhere', permanent: false },
    ])
  })
})
