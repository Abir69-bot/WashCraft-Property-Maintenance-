import path from 'path'

import { expect, test, type Page } from '@playwright/test'

import { E2E, expectAccessible, quiet, signIn, skipCookieBanner } from './helpers'

/**
 * The quote flows that stay off until the owner confirms prices and options: instant prices,
 * maintenance plans, the quick quote form and slide-in, and the dedicated snow, holiday lights,
 * junk removal and commercial bid forms. This file switches them on (Settings → Feature
 * switches), so the `features` project runs it after the desktop and mobile tests
 * (playwright.config.ts). A staff test: CI only, like admin.spec.ts.
 */

const fixture = (name: string) => path.resolve('e2e', 'fixtures', name)

async function setSwitches(page: Page, origin: string, on: boolean) {
  const response = await page.request.post('/api/globals/feature-flags', {
    data: { instantPricing: on, dedicatedQuoteForms: on },
    headers: { Origin: origin },
  })
  expect(response.ok(), await response.text()).toBe(true)
}

test.describe.configure({ mode: 'serial' })

test.beforeAll(async ({ browser, baseURL }) => {
  const page = await browser.newPage()
  test.skip(!(await signIn(page)), 'Only runs with the test account (empty database, CI)')
  await setSwitches(page, baseURL!, true)
  // Saving refreshes the pages in the background, so wait until the wizard is served.
  await expect
    .poll(async () => (await page.request.get('/quote/instant', { maxRedirects: 0 })).status(), {
      timeout: 30_000,
    })
    .toBe(200)
  await page.close()
})

test.afterAll(async ({ browser, baseURL }) => {
  const page = await browser.newPage()
  if (await signIn(page)) await setSwitches(page, baseURL!, false)
  await page.close()
})

async function fillContact(page: Page, { address = true, zip = true } = {}) {
  await page.getByLabel('Name', { exact: true }).fill('E2E Test')
  await page.getByLabel('Phone', { exact: true }).fill('(416) 555-0199')
  await page.getByLabel(/^Email/).fill('e2e@example.com')
  if (address) await page.getByLabel('Street address').fill('123 Test Street')
  if (zip) await page.getByLabel('Postal code').fill('M1B 2K3')
  await page.getByLabel(/may contact me/).check()
}

/** Answers every question on the wizard's details step: first choice, lowest number. */
async function answerVisibleQuestions(page: Page) {
  const form = page.locator('form')
  for (const select of await form.locator('select').all()) {
    await select.selectOption({ index: 1 })
  }
  for (const input of await form.locator('input[type="number"]').all()) {
    await input.fill((await input.getAttribute('min')) ?? '1')
  }
}

/**
 * The estimate, or (while every seeded price is still a placeholder) the "we'll price it"
 * message, with no placeholder price or dollar figure anywhere (brief §10.4).
 */
async function expectEstimate(page: Page) {
  const total = page.getByText('Estimated total')
  const pending = page.getByText('We have your details. We’ll review them')
  await expect(total.or(pending)).toBeVisible()
  if (await pending.isVisible()) {
    await expect(page.getByRole('main').getByText(/Placeholder price|\$\d/)).toHaveCount(0)
    return
  }
  await expect(page.getByText(/^\$[\d,]+–\$[\d,]+$/).last()).toBeVisible()
}

test.describe('switched-on quote flows', () => {
  test.beforeEach(async ({ page }) => {
    await quiet(page)
  })

  test('service pages show the quick quote form and their own flow', async ({ page }) => {
    await page.goto('/services/snow-removal')
    const hero = page.locator('section[aria-labelledby="page-heading"]')
    await expect(hero.getByRole('link', { name: 'Sign up for a snow contract' })).toHaveAttribute(
      'href',
      '/quote/snow-contract',
    )
    await expect(hero.getByRole('heading', { name: 'Get a quick quote' })).toBeVisible()
  })

  test('the quick quote form explains what is missing, then sends', async ({ page }) => {
    await page.goto(`/services/gutter-cleaning?${E2E}`)
    const form = page.getByRole('heading', { name: 'Get a quick quote' }).locator('..')
    await form.getByRole('button', { name: 'Get my quote' }).click()
    await expect(form.getByText('Enter your name')).toBeVisible()
    await expect(form.getByLabel('Name')).toHaveAttribute('aria-invalid', 'true')
    await form.getByLabel('Name').fill('E2E Test')
    await form.getByLabel('Phone', { exact: true }).fill('(416) 555-0199')
    await form.getByLabel('Postal code').fill('M1B 2K3')
    await form.getByRole('button', { name: 'Get my quote' }).click()
    await expect(page).toHaveURL(/\/quote\/thank-you\?type=quick$/)
  })

  test('the instant wizard prices services and books them', async ({ page }) => {
    await page.goto(`/quote/instant?${E2E}`)
    await page.getByLabel('Postal code').fill('M1B 2K3')
    await expect(page.getByText('Good news: we serve Scarborough.')).toBeVisible()
    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await page.getByLabel('House', { exact: true }).check()
    await page.getByRole('button', { name: 'Next', exact: true }).click()
    for (const service of ['Gutter Cleaning', 'Window Cleaning']) {
      await page.getByLabel(service, { exact: true }).check()
    }
    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'A few details' })).toBeVisible()
    await answerVisibleQuestions(page)
    await page.getByRole('button', { name: 'Next', exact: true }).click()
    const frequency = page.getByLabel('One time')
    if (await frequency.isVisible()) {
      await frequency.check()
      await page.getByRole('button', { name: 'Next', exact: true }).click()
    }
    await fillContact(page, { zip: false })
    await page.getByRole('button', { name: 'See my price' }).click()
    await expect(page.getByRole('heading', { name: 'Your estimate' })).toBeFocused()
    await expectEstimate(page)
    await expectAccessible(page)
    await page.getByRole('button', { name: 'Book this' }).click()
    await expect(page).toHaveURL(/\/quote\/thank-you\?type=instant&booked=1$/)
  })

  test('the wizard keeps progress after a reload', async ({ page }) => {
    await page.goto('/quote/instant')
    await page.getByLabel('Postal code').fill('L5B 1M2')
    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await page.getByLabel('Townhouse').check()
    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'What can we help with?' })).toBeVisible()
    await page.reload()
    await expect(page.getByRole('heading', { name: 'What can we help with?' })).toBeVisible()
    await page.getByRole('button', { name: 'Back' }).click()
    await expect(page.getByLabel('Townhouse')).toBeChecked()
  })

  test('maintenance plans link into the wizard', async ({ page }) => {
    await page.goto('/maintenance-plans')
    await page.getByRole('link', { name: 'Get a price for Plus' }).click()
    await expect(page.getByText('You picked the Plus plan.')).toBeVisible()
  })

  test('the snow contract form sends', async ({ page }) => {
    await page.goto(`/quote/snow-contract?${E2E}`)
    await page.getByLabel('House', { exact: true }).check()
    await page.getByLabel('Driveway size').selectOption('2 cars')
    await page.getByLabel(/Walkway and sidewalk length/).fill('60')
    await page.getByLabel('5 cm').check()
    await page.getByLabel('Start date').fill('2026-11-15')
    await fillContact(page)
    await page.getByRole('button', { name: 'Request my snow contract' }).click()
    const estimate = page.getByRole('heading', { name: 'Your seasonal estimate' })
    const thanks = page.getByRole('heading', { name: 'Thanks, we’ve got your request' })
    await expect(estimate.or(thanks)).toBeVisible()
  })

  test('junk removal uploads photos and refuses files that aren’t photos', async ({ page }) => {
    await page.goto(`/quote/junk-removal?${E2E}`)
    await page.getByLabel('Describe the items').fill('An old couch and two mattresses')
    await page
      .locator('input[type="file"]')
      .setInputFiles([fixture('photo.jpg'), fixture('not-a-photo.jpg')])
    await expect(page.getByText(/^That file isn’t a photo we can open/)).toBeVisible()
    await page.getByRole('button', { name: 'Remove not-a-photo.jpg' }).click()
    await page.getByLabel('1/2 truck').check()
    await page.getByLabel('Garage').check()
    await fillContact(page)
    await page.getByRole('button', { name: 'Get my junk removal quote' }).click()
    await expect(page).toHaveURL(/\/quote\/thank-you\?type=junk$/)
  })

  test('a commercial bid can include an RFP', async ({ page }) => {
    await page.goto(`/quote/commercial?${E2E}`)
    await page.getByLabel('Company or HOA name').fill('E2E Test Co')
    await page.getByLabel('Property type').selectOption('hoa')
    await page.getByRole('textbox', { name: /^Size/ }).fill('120')
    await page.getByLabel('Commercial Cleaning', { exact: true }).check()
    await page.getByLabel('Twice a year').check()
    await page.locator('input[type="file"]').setInputFiles(fixture('rfp.pdf'))
    await expect(page.getByText('rfp.pdf', { exact: true })).toBeVisible()
    await fillContact(page)
    await page.getByRole('button', { name: 'Request a bid' }).click()
    await expect(page).toHaveURL(/\/quote\/thank-you\?type=commercial_bid$/)
  })

  for (const path of [
    '/quote/instant',
    '/quote/snow-contract',
    '/quote/holiday-lights',
    '/quote/junk-removal',
    '/quote/commercial',
    '/maintenance-plans',
  ]) {
    test(`${path} has no serious accessibility problems`, async ({ page }) => {
      await page.goto(path)
      await expect(page.locator('h1')).toBeVisible()
      await expectAccessible(page)
    })
  }
})

test.describe('slide-in quote', () => {
  test.beforeEach(async ({ page }) => {
    await skipCookieBanner(page)
  })

  /** Moves the mouse out through the top of the window, once the page has hydrated. */
  const exitIntent = async (page: Page) => {
    await page.waitForLoadState('networkidle')
    await page.evaluate(() =>
      document.documentElement.dispatchEvent(new MouseEvent('mouseleave', { clientY: 0 })),
    )
  }

  test('opens once on exit intent, then not again for a week', async ({ page }) => {
    await page.goto('/services')
    await exitIntent(page)
    const dialog = page.getByRole('dialog', { name: 'Get a quick quote' })
    await expect(dialog).toBeVisible()
    await expectAccessible(page)
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await page.reload()
    await exitIntent(page)
    await page.waitForTimeout(500)
    await expect(dialog).toBeHidden()
  })

  test('never opens on quote pages', async ({ page }) => {
    await page.goto('/quote')
    await exitIntent(page)
    await page.waitForTimeout(500)
    await expect(page.getByRole('dialog')).toHaveCount(0)
  })
})
