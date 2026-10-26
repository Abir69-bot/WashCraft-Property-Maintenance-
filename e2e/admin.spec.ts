import { expect, test } from '@playwright/test'

import { signIn, skipCookieBanner } from './helpers'

/**
 * Staff tools. They need a signed-in user, so they only run on an empty database (CI); see
 * signIn(). The seasonal hero test, which changes site-wide settings, is in seasons.spec.ts.
 */
test.describe('staff tools', () => {
  test.describe.configure({ mode: 'serial' })

  test.beforeEach(async ({ page, isMobile }) => {
    test.skip(isMobile, 'The admin is the same on every screen size')
    await skipCookieBanner(page)
    test.skip(!(await signIn(page)), 'Only runs with the test account (empty database, CI)')
  })

  test('staff can preview a page from the admin and exit preview', async ({ page }) => {
    await page.goto('/next/preview?path=%2Fservices%2Fgutter-cleaning')
    await expect(page).toHaveURL(/\/services\/gutter-cleaning$/)
    const banner = page.getByRole('status').filter({ hasText: 'Preview' })
    await expect(banner).toBeVisible()
    await banner.getByRole('button', { name: 'Exit preview' }).click()
    await expect(page).toHaveURL(/\/services\/gutter-cleaning$/)
    await expect(page.getByText('you’re seeing drafts')).toHaveCount(0)
  })

  test('redirects from the admin send old addresses to the new page', async ({ page, baseURL }) => {
    const headers = { Origin: baseURL! }
    const create = (from: string) =>
      page.request.post('/api/redirects', {
        data: { from, type: '301', to: { type: 'custom', url: '/services/gutter-cleaning' } },
        headers,
      })
    // One unknown path anywhere, one where a service used to be.
    const created = [await create('/old-gutter-page'), await create('/services/old-gutters')]
    const ids: number[] = []
    for (const response of created) {
      expect(response.ok(), await response.text()).toBe(true)
      ids.push(((await response.json()) as { doc: { id: number } }).doc.id)
    }
    try {
      for (const from of ['/old-gutter-page', '/services/old-gutters']) {
        // Saving refreshes the cache in the background, so the new redirect may take a moment.
        await expect
          .poll(async () => {
            const response = await page.request.get(from, { maxRedirects: 0 })
            return `${response.status()} ${response.headers().location ?? ''}`
          })
          .toBe('308 /services/gutter-cleaning')
      }
      await page.goto('/Old-Gutter-Page')
      await expect(page).toHaveURL(/\/services\/gutter-cleaning$/)
    } finally {
      for (const id of ids) await page.request.delete(`/api/redirects/${id}`, { headers })
    }
  })

  test('the dashboard summarises leads and the database size', async ({ page }) => {
    await page.goto('/admin')
    await expect(page.getByRole('heading', { name: /This week’s leads/ })).toBeVisible()
    await expect(page.getByText('By source')).toBeVisible()
    await expect(page.getByText(/MB of \d+ MB/)).toBeVisible()
    await expect(page.getByText(/still use placeholder numbers/)).toBeVisible()
  })

  test('a lead’s status can be changed from the list', async ({ page, baseURL }) => {
    const created = await page.request.post('/api/leads', {
      data: { type: 'quick', status: 'new', name: 'E2E Status Lead', phone: '3035550199' },
      // Like a browser would: Payload accepts signed-in writes only from the site's own origin.
      headers: { Origin: baseURL! },
    })
    expect(created.ok(), await created.text()).toBe(true)
    await page.goto('/admin/collections/leads')
    const status = page.getByLabel('Status for E2E Status Lead')
    await expect(status).toHaveValue('new')
    await status.selectOption('contacted')
    await expect(page.getByText('E2E Status Lead: contacted')).toBeVisible()
    await page.reload()
    await expect(page.getByLabel('Status for E2E Status Lead')).toHaveValue('contacted')
  })

  test('pricing lists show what still needs review', async ({ page }) => {
    await page.goto('/admin/collections/pricing-rules')
    await expect(page.getByText(/still use placeholder numbers/)).toBeVisible()
  })
})
