import AxeBuilder from '@axe-core/playwright'
import { expect, type Page } from '@playwright/test'

import { site } from '../src/config/site'

/** Every lead made by the tests is named "E2E Test" and tagged utm_source=e2e. */
export const E2E = 'utm_source=e2e&utm_medium=test'

const ACCOUNT = { email: 'e2e@example.com', password: 'e2e-preview-password' }

/**
 * Signs in as the staff test account. On an empty database (CI) the account is created through
 * Payload's first-register endpoint; anywhere else sign-in fails and staff tests skip, so they
 * never touch a real account.
 */
export async function signIn(page: Page): Promise<boolean> {
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

/** Pretend the visitor already answered the cookie banner, so it doesn't cover the page. */
export async function skipCookieBanner(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem('wc-consent', JSON.stringify({ analytics: false, at: '2026-01-01' }))
  })
}

/** No cookie banner, and the slide-in counts as already shown, so neither gets in the way. */
export async function quiet(page: Page) {
  await skipCookieBanner(page)
  await page.addInitScript(() => localStorage.setItem('wc-slide-in', String(Date.now())))
}

/**
 * Radix NavigationMenu puts an aria-hidden, focusable span after an open trigger. It moves focus
 * straight into the menu, so nobody can rest on it, but axe reports it (aria-hidden-focus).
 * The nav test checks that Tab really does land inside the menu.
 */
export const RADIX_FOCUS_PROXY =
  'nav[aria-label="Main"] li > span[aria-hidden="true"][tabindex="0"]'

/** WCAG 2.2 AA check: no serious or critical axe violations (brief §15, §18). */
export async function expectAccessible(page: Page, { exclude = [] }: { exclude?: string[] } = {}) {
  const builder = new AxeBuilder({ page }).withTags([
    'wcag2a',
    'wcag2aa',
    'wcag21a',
    'wcag21aa',
    'wcag22aa',
  ])
  for (const selector of exclude) builder.exclude(selector)
  const results = await builder.analyze()
  const blocking = results.violations.filter(
    (violation) => violation.impact === 'serious' || violation.impact === 'critical',
  )
  const summary = blocking.map(
    (violation) =>
      `${violation.id} (${violation.impact}): ${violation.help}\n  ${violation.nodes
        .slice(0, 3)
        .map((node) => node.target.join(' '))
        .join('\n  ')}`,
  )
  expect(summary, summary.join('\n\n')).toEqual([])
}

const suffix = ` | ${site.shortName}`
const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Status, one H1, title pattern, description, canonical URL, Open Graph and breadcrumbs. */
export async function expectTemplate(page: Page, path: string, heading: string) {
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
