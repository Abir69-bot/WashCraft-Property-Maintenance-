import { expect, test } from '@playwright/test'

import { expectAccessible, RADIX_FOCUS_PROXY, skipCookieBanner } from './helpers'

test.describe('home page', () => {
  test.beforeEach(async ({ page }) => {
    await skipCookieBanner(page)
  })

  test('shows the hero, its two buttons and the main sections', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toHaveText('Year-Round Property Maintenance, Made Simple')
    const hero = page.locator('section[aria-labelledby="hero-heading"]')
    await expect(hero.getByRole('link', { name: /^Request a (Free )?Quote$/ })).toHaveAttribute(
      'href',
      '/quote',
    )
    await expect(hero.getByRole('link', { name: 'Explore Our Services' })).toHaveAttribute(
      'href',
      '/services',
    )
    for (const heading of [
      'Property care from one company, all year',
      'Services for every season',
      'Why choose WashCraft',
      'How getting a quote works',
      'Where we work',
      'Questions people ask',
      'Tell us about your property',
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

  test('shows no placeholder or stand-in contact details', async ({ page }) => {
    for (const path of ['/', '/quote', '/contact', '/about']) {
      await page.goto(path)
      const text = await page.locator('body').innerText()
      expect(text, path).not.toMatch(/TODO|\[PHONE\]|\[EMAIL\]|\[HOURS\]|555-01\d\d|example\.com/)
      // Call and email links only appear once real details are set (none are in the seed).
      await expect(page.locator('a[href^="tel:"], a[href^="mailto:"]'), path).toHaveCount(0)
    }
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
        .getByRole('link', { name: 'Residential cleaning', exact: true }),
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
