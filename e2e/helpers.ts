import AxeBuilder from '@axe-core/playwright'
import { expect, type Page } from '@playwright/test'

/** Pretend the visitor already answered the cookie banner, so it doesn't cover the page. */
export async function skipCookieBanner(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem('wc-consent', JSON.stringify({ analytics: false, at: '2026-01-01' }))
  })
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
