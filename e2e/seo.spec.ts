import { expect, test, type Page } from '@playwright/test'

import { posts } from '../src/seed/data/articles'
import { skipCookieBanner } from './helpers'

type Item = Record<string, unknown> & { '@type': string }

/** Every JSON-LD item on the page, flattened (some scripts hold an array). */
async function structuredData(page: Page): Promise<Item[]> {
  const scripts = await page.locator('script[type="application/ld+json"]').allTextContents()
  return scripts.flatMap((text) => {
    const data = JSON.parse(text) as Item | Item[]
    return Array.isArray(data) ? data : [data]
  })
}

const types = (items: Item[]) => items.map((item) => item['@type'])

test.describe('search engines', () => {
  test.beforeEach(({ isMobile }) => {
    test.skip(isMobile, 'The same on every screen size')
  })

  test('robots.txt keeps private routes out and points to the sitemap', async ({ request }) => {
    const robots = await (await request.get('/robots.txt')).text()
    expect(robots).toMatch(/Allow: \/\n/)
    expect(robots).toContain('Disallow: /admin')
    expect(robots).toContain('Disallow: /quote/thank-you')
    expect(robots).toMatch(/Sitemap: .*\/sitemap\.xml/)
  })

  test('the sitemap lists live pages only, and every one of them loads', async ({ request }) => {
    const xml = await (await request.get('/sitemap.xml')).text()
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]))
    const paths = urls.map((url) => url.pathname)
    expect(paths).toEqual(
      expect.arrayContaining(['/', '/services/gutter-cleaning', '/areas/scarborough', '/blog']),
    )
    expect(paths.join(' ')).not.toMatch(/thank-you|styleguide|\/team\//)
    for (const path of paths) {
      expect((await request.get(path)).status(), path).toBe(200)
    }
  })

  test('every page describes the business, and no page marks up reviews', async ({ page }) => {
    for (const path of ['/', '/contact', '/reviews']) {
      await page.goto(path)
      const items = await structuredData(page)
      expect(types(items)).toEqual(
        expect.arrayContaining(['HomeAndConstructionBusiness', 'WebSite']),
      )
      expect(JSON.stringify(items)).not.toMatch(/AggregateRating|"Review"/)
    }
  })

  test('pages carry the structured data for their type', async ({ page }) => {
    const expected: [string, string[]][] = [
      ['/services/gutter-cleaning', ['Service', 'BreadcrumbList', 'FAQPage']],
      ['/exterior-cleaning', ['Service', 'BreadcrumbList']],
      ['/faq', ['FAQPage', 'BreadcrumbList']],
      [`/blog/${posts[0].slug}`, ['Article', 'BreadcrumbList']],
      ['/solutions/ice-dam-prevention', ['Article', 'BreadcrumbList', 'FAQPage']],
    ]
    for (const [path, wanted] of expected) {
      await page.goto(path)
      const items = await structuredData(page)
      expect(types(items), path).toEqual(expect.arrayContaining(wanted))
      expect(types(items).filter((type) => type === 'FAQPage').length, path).toBeLessThanOrEqual(1)
    }
    await page.goto('/exterior-cleaning')
    const catalog = (await structuredData(page)).find((item) => item['@type'] === 'Service')
    expect(catalog?.hasOfferCatalog).toMatchObject({ '@type': 'OfferCatalog' })
  })

  test('every page has a share image, and generated ones can’t be forged', async ({
    page,
    request,
  }) => {
    for (const path of ['/', '/about', '/services/gutter-cleaning', `/blog/${posts[0].slug}`]) {
      await page.goto(path)
      const image = await page.locator('meta[property="og:image"]').first().getAttribute('content')
      expect(image, path).toBeTruthy()
      const { pathname, search } = new URL(image!)
      const response = await request.get(pathname + search)
      expect(response.status(), path).toBe(200)
      expect(response.headers()['content-type'], path).toMatch(/^image\//)
    }
    await page.goto('/about')
    const card = new URL(
      (await page.locator('meta[property="og:image"]').first().getAttribute('content'))!,
    )
    expect(card.pathname).toBe('/next/og')
    card.searchParams.set('title', 'Something we never wrote')
    expect((await request.get(card.pathname + card.search)).status()).toBe(404)
  })

  test('pages name their service, category and city for analytics', async ({ page }) => {
    await page.goto('/services/gutter-cleaning')
    await expect(page.locator('meta[name="wc:service"]')).toHaveAttribute(
      'content',
      'gutter-cleaning',
    )
    await expect(page.locator('meta[name="wc:category"]')).toHaveAttribute(
      'content',
      'exterior-cleaning',
    )
    await page.goto('/areas/scarborough')
    await expect(page.locator('meta[name="wc:city"]')).toHaveAttribute('content', 'scarborough')
  })
})

test.describe('analytics', () => {
  test('nothing loads or is recorded until the visitor accepts cookies', async ({ page }) => {
    const thirdParty: string[] = []
    await page.route(/googletagmanager\.com|clarity\.ms/, (route) => {
      thirdParty.push(route.request().url())
      return route.fulfill({ status: 200, contentType: 'text/javascript', body: '' })
    })
    await page.goto('/services/gutter-cleaning')
    await page.getByRole('region', { name: 'Cookie choices' }).waitFor()
    expect(thirdParty).toEqual([])
    expect(await page.evaluate(() => 'dataLayer' in window)).toBe(false)

    await page.getByRole('button', { name: 'Decline' }).click()
    expect(thirdParty).toEqual([])

    // Accepting loads the configured tools (the CI build sets test IDs; locally there may be none).
    test.skip(!process.env.NEXT_PUBLIC_GTM_ID, 'No Tag Manager ID in this build')
    // Dispatched: on phones the action bar can sit over the footer button.
    await page.getByRole('button', { name: 'Cookie settings' }).dispatchEvent('click')
    await page.getByRole('button', { name: 'Accept' }).click()
    await expect.poll(() => thirdParty.some((url) => url.includes('gtm.js'))).toBe(true)
    // A click on the call link, without actually opening the phone app.
    await page.evaluate(() => {
      document.addEventListener('click', (event) => event.preventDefault(), { once: true })
      document
        .querySelector('a[data-track="call_click"]')!
        .dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })
    const events = await page.evaluate(() =>
      (
        (window as unknown as { dataLayer: { event?: string; service?: string }[] }).dataLayer ?? []
      ).filter((entry) => entry.event === 'call_click'),
    )
    expect(events[0]).toMatchObject({ event: 'call_click', service: 'gutter-cleaning' })
  })

  test('a visitor who already declined never loads analytics', async ({ page }) => {
    await skipCookieBanner(page)
    const thirdParty: string[] = []
    await page.route(/googletagmanager\.com|clarity\.ms/, (route) => {
      thirdParty.push(route.request().url())
      return route.abort()
    })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    expect(thirdParty).toEqual([])
  })
})
