import { expect, test, type Page } from '@playwright/test'

import { site } from '../src/config/site'
import { categories } from '../src/seed/data/categories'
import { cities } from '../src/seed/data/cities'
import { allServices } from '../src/seed/data/services'
import { toSlug } from '../src/lib/text'
import { expectAccessible, skipCookieBanner } from './helpers'

const suffix = ` | ${site.shortName}`
const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Status, one H1, title pattern, description, canonical URL, Open Graph and breadcrumbs. */
async function expectTemplate(page: Page, path: string, heading: string) {
  const response = await page.goto(path)
  expect(response?.status(), path).toBe(200)
  await expect(page.locator('h1')).toHaveCount(1)
  await expect(page.locator('h1')).toHaveText(heading)
  await expect(page).toHaveTitle(heading + suffix)
  const description = await page.locator('meta[name="description"]').getAttribute('content')
  expect(description?.length, `${path} description`).toBeGreaterThan(50)
  expect(description!.length, `${path} description`).toBeLessThanOrEqual(160)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    new RegExp(`${escape(path)}$`),
  )
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    'content',
    heading + suffix,
  )
  await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toBeVisible()
}

test.describe('every seeded page renders with correct metadata', () => {
  test.beforeEach(({ isMobile }) => {
    test.skip(isMobile, 'Metadata is the same on every screen size')
  })

  for (const service of allServices) {
    test(`service: ${service.slug}`, async ({ page }) => {
      await expectTemplate(page, `/services/${service.slug}`, `${service.title} in ${site.region}`)
    })
  }

  for (const category of categories) {
    test(`category: ${category.slug}`, async ({ page }) => {
      await expectTemplate(
        page,
        `/${category.slug}`,
        `${category.title} Services in ${site.region}`,
      )
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
    ['/maintenance-plans', `Maintenance Plans in ${site.region}`],
    ['/commercial/hoa', `HOA & Condo Property Maintenance in ${site.region}`],
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
    '/areas/denver',
    '/services',
    '/areas',
    '/commercial',
    '/commercial/hoa',
    '/maintenance-plans',
  ]) {
    test(`${path} has no serious accessibility problems`, async ({ page }) => {
      await page.goto(path)
      await expectAccessible(page)
    })
  }

  test('seasonal services send quotes to their own flow', async ({ page }) => {
    await page.goto('/services/snow-removal')
    const hero = page.locator('section[aria-labelledby="page-heading"]')
    await expect(hero.getByRole('link', { name: 'Sign up for a snow contract' })).toHaveAttribute(
      'href',
      '/quote/snow-contract',
    )
    await expect(hero.getByText(/Booking window/)).toBeVisible()
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
    await expect(status).toHaveText(`${allServices.length} services`)
    await page.getByRole('button', { name: 'Winter Services', exact: true }).click()
    const winter = allServices.filter((service) => service.category === 'winter-services')
    await expect(status).toHaveText(`Showing ${winter.length} of ${allServices.length} services`)
    const main = page.getByRole('main')
    await expect(main.getByRole('heading', { name: 'Exterior Cleaning', level: 2 })).toBeHidden()
    await expect(main.getByRole('heading', { name: 'Winter Services', level: 2 })).toBeVisible()
    await page.getByRole('button', { name: 'All', exact: true }).click()
    await page.getByLabel('Search services').fill('gutter')
    await expect(main.getByRole('link', { name: 'Gutter Cleaning', exact: true })).toBeVisible()
    await expect(main.getByRole('link', { name: 'Snow Removal', exact: true })).toBeHidden()
  })

  test('service-in-city pages stay off until the feature flag is on', async ({ page }) => {
    const response = await page.goto('/areas/denver/gutter-cleaning')
    expect(response?.status()).toBe(404)
  })

  test('unknown pages show a helpful 404 that search engines skip', async ({ page }) => {
    const response = await page.goto('/no-such-page')
    expect(response?.status()).toBe(404)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('We couldn’t find that page')
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute('content', /noindex/)
  })
})
