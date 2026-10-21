import { expect, test } from '@playwright/test'

import { expectAccessible, RADIX_FOCUS_PROXY, skipCookieBanner } from './helpers'

test.describe('home page', () => {
  test.beforeEach(async ({ page }) => {
    await skipCookieBanner(page)
  })

  test('shows the seasonal hero and the main sections', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.getByRole('link', { name: /instant price/i }).first()).toBeVisible()
    for (const heading of [
      'Get a quick quote',
      'Every season, one team',
      'Three steps to a cleaner property',
      'Questions people ask',
    ]) {
      await expect(page.getByRole('heading', { name: heading })).toBeVisible()
    }
    await expect(page.getByRole('contentinfo')).toBeVisible()
  })

  test('has no serious accessibility problems', async ({ page }) => {
    await page.goto('/')
    await expectAccessible(page)
  })

  test('never shows sample content on the production build', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Sample', { exact: true })).toHaveCount(0)
  })

  test('remembers a dismissed announcement', async ({ page }) => {
    await page.goto('/')
    const bar = page.locator('[data-announcement]')
    test.skip((await bar.count()) === 0, 'No announcement is active for today')
    await page.getByRole('button', { name: 'Dismiss announcement' }).click()
    await expect(bar).toBeHidden()
    await page.reload()
    await expect(bar).toBeHidden()
  })
})

test.describe('navigation', () => {
  test.beforeEach(async ({ page }) => {
    await skipCookieBanner(page)
  })

  test('opens the services mega-menu from the keyboard', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop navigation')
    await page.goto('/')
    const trigger = page.getByRole('button', { name: 'Services', exact: true })
    await trigger.focus()
    await page.keyboard.press('Enter')
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(
      page.getByRole('link', { name: 'Pressure Washing', exact: true }).first(),
    ).toBeVisible()
    await expectAccessible(page, { exclude: [RADIX_FOCUS_PROXY] })
    await page.keyboard.press('Tab')
    await expect(
      page
        .getByRole('navigation', { name: 'Main' })
        .getByRole('link', { name: 'Exterior cleaning', exact: true }),
    ).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(trigger).toBeFocused()
  })

  test('shows the Call · Text · Quote bar on phones only', async ({ page, isMobile }) => {
    await page.goto('/')
    const bar = page.getByRole('navigation', { name: 'Quick actions' })
    if (isMobile) {
      await expect(bar).toBeVisible()
      await expect(bar.getByRole('link', { name: 'Get quote' })).toBeVisible()
    } else {
      await expect(bar).toBeHidden()
    }
  })

  test('opens and closes the mobile menu', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile navigation')
    await page.goto('/')
    await page.getByRole('button', { name: 'Open menu' }).click()
    const menu = page.getByRole('dialog', { name: 'Menu' })
    await expect(menu).toBeVisible()
    await expectAccessible(page)
    await page.getByRole('button', { name: 'Close menu' }).click()
    await expect(menu).toBeHidden()
  })
})

test.describe('quick quote form', () => {
  test.beforeEach(async ({ page }) => {
    await skipCookieBanner(page)
  })

  test('explains what is missing', async ({ page }) => {
    await page.goto('/')
    const form = page.locator('#quick-quote-heading').locator('..')
    await form.getByRole('button', { name: 'Get my quote' }).click()
    await expect(form.getByText('Enter your name')).toBeVisible()
    await expect(form.getByText('Enter a 10-digit phone number')).toBeVisible()
    await expect(form.getByLabel('Name')).toBeFocused()
    await expect(form.getByLabel('Name')).toHaveAttribute('aria-invalid', 'true')
  })

  test('saves a request', async ({ page }) => {
    await page.goto('/?utm_source=e2e&utm_medium=test')
    const form = page.locator('#quick-quote-heading').locator('..')
    await form.getByLabel('Name').fill('E2E Test')
    await form.getByLabel('Phone').fill('(303) 555-0199')
    await form.getByLabel('ZIP code').fill('80202')
    await form.getByLabel('Service').selectOption({ label: 'Gutter Cleaning' })
    await form.getByRole('button', { name: 'Get my quote' }).click()
    await expect(page.getByRole('status').filter({ hasText: 'we’ve got it' })).toBeVisible()
  })
})
