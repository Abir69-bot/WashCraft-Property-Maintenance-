import { expect, test } from '@playwright/test'

import { skipCookieBanner } from './helpers'

/**
 * Admin preview needs a signed-in user. On an empty database (CI) the test creates the first
 * admin user through Payload's first-register endpoint; anywhere else it skips, so it never
 * touches a real account.
 */
test('staff can preview a page from the admin and exit preview', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Admin preview is the same on every screen size')
  const init = await page.request.get('/api/users/init')
  const { initialized } = (await init.json()) as { initialized: boolean }
  test.skip(initialized, 'Only runs on an empty database (CI)')

  const register = await page.request.post('/api/users/first-register', {
    data: { email: 'e2e@example.com', password: 'e2e-preview-password', role: 'owner' },
  })
  expect(register.ok()).toBe(true)

  await skipCookieBanner(page)
  await page.goto('/next/preview?path=%2Fservices%2Fgutter-cleaning')
  await expect(page).toHaveURL(/\/services\/gutter-cleaning$/)
  const banner = page.getByRole('status').filter({ hasText: 'Preview' })
  await expect(banner).toBeVisible()

  await banner.getByRole('button', { name: 'Exit preview' }).click()
  await expect(page).toHaveURL(/\/services\/gutter-cleaning$/)
  await expect(page.getByText('you’re seeing drafts')).toHaveCount(0)
})
