import { expect, test } from '@playwright/test'

import { confirmedServices, site } from '../src/config/site'
import { categories } from '../src/seed/data/categories'
import { cities } from '../src/seed/data/cities'
import { allServices } from '../src/seed/data/services'
import { toSlug } from '../src/lib/text'
import { expectAccessible, expectTemplate, skipCookieBanner } from './helpers'

/** Only services the owner confirmed are published (src/config/site.ts). */
const confirmed = allServices.filter((service) => confirmedServices.includes(service.slug))

test.describe('every seeded page renders with correct metadata', () => {
  test.beforeEach(({ isMobile }) => {
    test.skip(isMobile, 'Metadata is the same on every screen size')
  })

  for (const service of confirmed) {
    test(`service: ${service.slug}`, async ({ page }) => {
      await expectTemplate(page, `/services/${service.slug}`, `${service.title} in ${site.region}`)
    })
  }

  for (const category of categories) {
    const published = confirmed.filter((service) => service.category === category.slug)
    test(`category: ${category.slug}`, async ({ page }) => {
      if (published.length > 1) {
        await expectTemplate(
          page,
          `/${category.slug}`,
          `${category.title} Services in ${site.region}`,
        )
      } else if (published.length === 1) {
        // A one-service category has no hub of its own.
        await page.goto(`/${category.slug}`)
        await expect(page).toHaveURL(new RegExp(`/services/${published[0].slug}$`))
      } else {
        expect((await page.goto(`/${category.slug}`))?.status()).toBe(404)
      }
    })
  }

  for (const city of cities) {
    const slug = toSlug(city.name)
    test(`city: ${slug}`, async ({ page }) => {
      await expectTemplate(page, `/areas/${slug}`, `Property Maintenance in ${city.name}`)
    })
  }

  for (const [path, heading] of [
    ['/services', `Property Maintenance Services in ${site.region}`],
    ['/areas', `Service Areas in ${site.region}`],
  ]) {
    test(`page: ${path}`, async ({ page }) => {
      await expectTemplate(page, path, heading)
    })
  }
})

test.describe('templates', () => {
  test.beforeEach(async ({ page }) => {
    await skipCookieBanner(page)
  })

  for (const path of [
    '/services/gutter-cleaning',
    '/exterior-cleaning',
    '/areas/scarborough',
    '/services',
    '/areas',
    '/commercial',
  ]) {
    test(`${path} has no serious accessibility problems`, async ({ page }) => {
      await page.goto(path)
      await expectAccessible(page)
    })
  }

  test('every service page covers scope, fit, limits, preparation, areas and FAQs', async ({
    page,
  }) => {
    await page.goto('/services/window-cleaning')
    const main = page.getByRole('main')
    for (const heading of [
      'What’s included',
      'Who window cleaning is for',
      'What’s not included, and access limits',
      'How to prepare',
      'Where we offer Window Cleaning',
      'Window Cleaning questions',
    ]) {
      await expect(main.getByRole('heading', { name: heading, level: 2 })).toBeVisible()
    }
    await expect(
      main.getByRole('link', { name: /^Request a (Free )?Quote$/ }).first(),
    ).toHaveAttribute('href', '/quote?service=window-cleaning')
  })

  test('seasonal services use the quote form while the dedicated forms are off', async ({
    page,
  }) => {
    await page.goto('/services/snow-removal')
    const hero = page.locator('section[aria-labelledby="page-heading"]')
    await expect(
      hero.getByRole('link', { name: /^Request a (Free )?Quote$/ }).first(),
    ).toHaveAttribute('href', '/quote?service=snow-removal')
  })

  test('services the owner hasn’t confirmed are not published', async ({ page }) => {
    for (const service of allServices.filter((item) => !confirmedServices.includes(item.slug))) {
      expect((await page.goto(`/services/${service.slug}`))?.status(), service.slug).toBe(404)
    }
    await page.goto('/services')
    await expect(page.getByRole('link', { name: 'House Washing', exact: true })).toHaveCount(0)
    await expect(page.getByRole('link', { name: 'Junk Removal', exact: true })).toHaveCount(0)
  })

  test('benefit tabs keep every panel in the page', async ({ page }) => {
    await page.goto('/services/gutter-cleaning')
    const tabs = page.getByRole('tablist', { name: 'Gutter Cleaning benefits' })
    const panels = page.locator('#benefits [role="tabpanel"]')
    const count = await tabs.getByRole('tab').count()
    await expect(panels).toHaveCount(count)
    await tabs.getByRole('tab').nth(1).click()
    await expect(panels.nth(1)).toBeVisible()
    await expect(panels.nth(0)).toBeHidden()
  })

  test('services can be filtered by category and searched', async ({ page }) => {
    await page.goto('/services')
    const status = page.getByRole('status').filter({ hasText: /services/ })
    await expect(status).toHaveText(`${confirmed.length} services`)
    await page.getByRole('button', { name: 'Exterior Cleaning', exact: true }).click()
    const exterior = confirmed.filter((service) => service.category === 'exterior-cleaning')
    await expect(status).toHaveText(`Showing ${exterior.length} of ${confirmed.length} services`)
    const main = page.getByRole('main')
    await expect(main.getByRole('heading', { name: 'Residential Cleaning', level: 2 })).toBeHidden()
    await expect(main.getByRole('heading', { name: 'Exterior Cleaning', level: 2 })).toBeVisible()
    await page.getByRole('button', { name: 'All', exact: true }).click()
    await page.getByLabel('Search services').fill('gutter')
    await expect(main.getByRole('link', { name: 'Gutter Cleaning', exact: true })).toBeVisible()
    await expect(main.getByRole('link', { name: 'Snow Removal', exact: true })).toBeHidden()
  })

  test('service-in-city pages stay off until the feature flag is on', async ({ page }) => {
    const response = await page.goto('/areas/scarborough/gutter-cleaning')
    expect(response?.status()).toBe(404)
  })

  test('unknown pages show a helpful 404 that search engines skip', async ({ page }) => {
    const response = await page.goto('/no-such-page')
    expect(response?.status()).toBe(404)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('We couldn’t find that page')
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute('content', /noindex/)
  })
})
