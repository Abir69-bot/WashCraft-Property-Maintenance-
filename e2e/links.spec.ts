import { expect, test } from '@playwright/test'

/** Internal links nobody follows from a page: the admin, APIs and Next's own files. */
const SKIP = /^\/(admin|api|_next|next)(\/|$)/

/**
 * Link check (brief §18): every internal link on every page in the sitemap leads somewhere.
 * Links that redirect count as broken too, so menus and copy always point at the final address.
 */
test('no page links to a missing or moved address', async ({ request, baseURL, isMobile }) => {
  test.skip(isMobile, 'The same links on every screen size')
  test.setTimeout(300_000)

  const sitemap = await (await request.get('/sitemap.xml')).text()
  const pages = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => new URL(match[1]).pathname,
  )
  expect(pages.length).toBeGreaterThan(50)

  const linkedFrom = new Map<string, string>()
  for (const page of pages) {
    const html = await (await request.get(page)).text()
    for (const [, href] of html.matchAll(/<a\s[^>]*?href="([^"]+)"/g)) {
      const url = new URL(href.replaceAll('&amp;', '&'), baseURL)
      if (url.origin !== new URL(baseURL!).origin || SKIP.test(url.pathname)) continue
      if (!linkedFrom.has(url.pathname)) linkedFrom.set(url.pathname, page)
    }
  }

  const broken: string[] = []
  for (const [path, page] of linkedFrom) {
    const response = await request.get(path, { maxRedirects: 0 })
    if (response.status() !== 200)
      broken.push(`${path} (${response.status()}), linked from ${page}`)
  }
  expect(broken).toEqual([])
})
