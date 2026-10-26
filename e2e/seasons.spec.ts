import { expect, test } from '@playwright/test'

import { site } from '../src/config/site'
import { fillTokens } from '../src/lib/text'
import { homepage } from '../src/seed/data/globals'
import { signIn, skipCookieBanner } from './helpers'

/**
 * Seasonal hero switching (brief §18). The date logic is unit tested (lib/seasons.test.ts); this
 * checks the whole chain: Seasonal settings → page refresh → the right hero and quote flow.
 * Forcing a season changes the whole site, so the `seasons` project runs this file after every
 * other test (playwright.config.ts). A staff test: CI only, like admin.spec.ts.
 */
test('the home page hero switches with the season', async ({ page, baseURL }) => {
  await skipCookieBanner(page)
  test.skip(!(await signIn(page)), 'Only runs with the test account (empty database, CI)')

  const setOverride = async (heroOverride: string) => {
    const response = await page.request.post('/api/globals/seasonal-settings', {
      data: { heroOverride },
      headers: { Origin: baseURL! },
    })
    expect(response.ok(), await response.text()).toBe(true)
  }
  const hero = async () => {
    await page.goto('/')
    const section = page.locator('section[aria-labelledby="hero-heading"]')
    const link = await section.getByRole('link').first().getAttribute('href')
    return `${await section.locator('h1').textContent()} → ${link}`
  }
  const expected = (season: string) => {
    const variant = homepage.heroVariants.find((item) => item.season === season)!
    return `${fillTokens(variant.headline, { region: site.region })} → ${variant.cta.href}`
  }

  try {
    for (const season of ['winter', 'holiday']) {
      await setOverride(season)
      // Saving refreshes the page in the background, so the new hero may take a moment.
      await expect.poll(hero, { timeout: 30_000 }).toBe(expected(season))
    }
  } finally {
    await setOverride('auto')
  }
})
