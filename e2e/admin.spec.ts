import { expect, test, type Page } from '@playwright/test'

import { skipCookieBanner } from './helpers'

/**
 * Staff tools. They need a signed-in user: on an empty database (CI) the first test account is
 * created through Payload's first-register endpoint; anywhere else these tests skip, so they
 * never touch a real account.
 */
const ACCOUNT = { email: 'e2e@example.com', password: 'e2e-preview-password' }

async function signIn(page: Page): Promise<boolean> {
  const init = await page.request.get('/api/users/init')
  const { initialized } = (await init.json()) as { initialized: boolean }
  if (!initialized) {
    const register = await page.request.post('/api/users/first-register', {
      data: { ...ACCOUNT, role: 'owner' },
    })
    return register.ok()
  }
  const login = await page.request.post('/api/users/login', { data: ACCOUNT })
  return login.ok()
}

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
