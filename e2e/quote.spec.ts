import path from 'path'

import { expect, test, type Page } from '@playwright/test'

import { expectAccessible, skipCookieBanner } from './helpers'

const fixture = (name: string) => path.resolve('e2e', 'fixtures', name)

/** Every lead made by the tests is named "E2E Test" and tagged utm_source=e2e. */
const E2E = 'utm_source=e2e&utm_medium=test'

/** No cookie banner, and the slide-in counts as already shown, so neither gets in the way. */
async function quiet(page: Page) {
  await skipCookieBanner(page)
  await page.addInitScript(() => localStorage.setItem('wc-slide-in', String(Date.now())))
}

async function fillContact(page: Page, { address = true, zip = true } = {}) {
  await page.getByLabel('Name', { exact: true }).fill('E2E Test')
  await page.getByLabel('Phone').fill('(303) 555-0199')
  await page.getByLabel(/^Email/).fill('e2e@example.com')
  if (address) await page.getByLabel('Street address').fill('123 Test Street')
  if (zip) await page.getByLabel('ZIP code').fill('80202')
  await page.getByLabel(/I agree to receive/).check()
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
 * The estimate, or on the live site (where every seeded price is still a placeholder) the
 * "we'll price it" message, with no placeholder price or dollar figure anywhere (brief §10.4).
 */
async function expectEstimate(page: Page, line?: string) {
  const total = page.getByText('Estimated total')
  const pending = page.getByText('We have your details. We’ll review them')
  await expect(total.or(pending)).toBeVisible()
  if (await pending.isVisible()) {
    await expect(page.getByRole('main').getByText(/Placeholder price|\$\d/)).toHaveCount(0)
    return
  }
  await expect(page.getByText(/^\$[\d,]+–\$[\d,]+$/).last()).toBeVisible()
  if (line) await expect(page.getByRole('main').getByText(line)).toBeVisible()
}

test.describe('quote system', () => {
  test.beforeEach(async ({ page }) => {
    await quiet(page)
  })

  test('the quick quote form goes to the thank-you page', async ({ page }) => {
    await page.goto(`/?${E2E}`)
    const form = page.locator('#quick-quote-heading').locator('..')
    await form.getByLabel('Name').fill('E2E Test')
    await form.getByLabel('Phone').fill('(303) 555-0199')
    await form.getByLabel('ZIP code').fill('80202')
    await form.getByLabel('Service').selectOption({ label: 'Gutter Cleaning' })
    await form.getByRole('button', { name: 'Get my quote' }).click()
    await expect(page).toHaveURL(/\/quote\/thank-you\?type=quick$/)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Thanks, we’ve got your request',
    )
  })

  test('the instant wizard prices three services and books them', async ({ page }) => {
    await page.goto(`/quote/instant?${E2E}`)
    await page.getByLabel('ZIP code').fill('80202')
    await expect(page.getByText('Good news: we serve Denver.')).toBeVisible()
    await page.getByRole('button', { name: 'Next', exact: true }).click()

    await expect(page.getByRole('heading', { name: 'What kind of property is it?' })).toBeFocused()
    await page.getByLabel('House', { exact: true }).check()
    await page.getByRole('button', { name: 'Next', exact: true }).click()

    for (const service of ['Gutter Cleaning', 'Window Cleaning', 'House Washing']) {
      await page.getByLabel(service, { exact: true }).check()
    }
    await page.getByRole('button', { name: 'Next', exact: true }).click()

    await expect(page.getByRole('heading', { name: 'A few details' })).toBeVisible()
    await expect(page.getByRole('group', { name: 'About your property' })).toBeVisible()
    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await expect(page.getByText(/Choose an answer for/).first()).toBeVisible()
    await answerVisibleQuestions(page)
    await page.getByRole('button', { name: 'Next', exact: true }).click()

    await page.getByLabel('Twice a year').check()
    await page.getByRole('button', { name: 'Next', exact: true }).click()

    await fillContact(page, { zip: false })
    await page.getByRole('button', { name: 'See my price' }).click()

    await expect(page.getByRole('heading', { name: 'Your estimate' })).toBeFocused()
    await expectEstimate(page, 'Window Cleaning')
    await expectAccessible(page)

    await page.getByRole('button', { name: 'Book this' }).click()
    await expect(page).toHaveURL(/\/quote\/thank-you\?type=instant&booked=1$/)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Thanks, we’ve got your booking request',
    )
  })

  test('the wizard keeps progress after a reload', async ({ page }) => {
    await page.goto('/quote/instant')
    await page.getByLabel('ZIP code').fill('80014')
    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await page.getByLabel('Townhouse').check()
    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'What can we help with?' })).toBeVisible()

    await page.reload()
    await expect(page.getByRole('heading', { name: 'What can we help with?' })).toBeVisible()
    await page.getByRole('button', { name: 'Back' }).click()
    await expect(page.getByLabel('Townhouse')).toBeChecked()
  })

  test('a maintenance plan books as a subscription', async ({ page }) => {
    await page.goto(`/maintenance-plans?${E2E}`)
    await page.getByRole('link', { name: 'Get a price for Plus' }).click()
    await expect(page.getByText('You picked the Plus plan.')).toBeVisible()
    await page.getByLabel('ZIP code').fill('80202')
    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await page.getByLabel('House', { exact: true }).check()
    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await expect(page.getByLabel('House Washing', { exact: true })).toBeChecked()
    await expect(page.getByLabel('Window Cleaning', { exact: true })).toBeChecked()
    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await answerVisibleQuestions(page)
    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await fillContact(page, { zip: false })
    await page.getByRole('button', { name: 'See my price' }).click()
    await expect(page.getByText(/Plus plan:/)).toBeVisible()
    await page.getByRole('button', { name: 'Book this' }).click()
    await expect(page).toHaveURL(/\/quote\/thank-you\?type=subscription&booked=1$/)
  })

  test('a link from a service page preselects the service', async ({ page }) => {
    await page.goto('/quote/instant?service=window-cleaning')
    await page.getByLabel('ZIP code').fill('80202')
    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await page.getByLabel('House', { exact: true }).check()
    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await expect(page.getByLabel('Window Cleaning', { exact: true })).toBeChecked()
  })

  test('commercial properties are sent to the bid form', async ({ page }) => {
    await page.goto('/quote/instant')
    await page.getByLabel('ZIP code').fill('80202')
    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await page.getByLabel(/Commercial, HOA/).check()
    await expect(page.getByRole('link', { name: 'Request a commercial bid' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeDisabled()
  })

  test('the snow contract shows a seasonal estimate', async ({ page }) => {
    await page.goto(`/quote/snow-contract?${E2E}`)
    await page.getByLabel('House', { exact: true }).check()
    await page.getByLabel('Driveway size').selectOption('2 cars')
    await page.getByLabel(/Walkway and sidewalk length/).fill('60')
    await page.getByLabel('Salting & De-Icing').check()
    await page.getByLabel('2 inches').check()
    await page.getByLabel('Start date').fill('2026-11-15')
    await fillContact(page)
    await page.getByRole('button', { name: 'Request my snow contract' }).click()
    // With prices: the seasonal estimate. On the live site with placeholder prices: thank-you.
    const estimate = page.getByRole('heading', { name: 'Your seasonal estimate' })
    const thanks = page.getByRole('heading', { name: 'Thanks, we’ve got your request' })
    await expect(estimate.or(thanks)).toBeVisible()
    if (await estimate.isVisible()) await expectEstimate(page, 'Salting & De-Icing')
  })

  test('holiday lights estimate the roofline from the home size', async ({ page }) => {
    await page.goto(`/quote/holiday-lights?${E2E}`)
    await page.getByLabel('I’m not sure how long the roofline is').check()
    await page.getByLabel('About how big is the home?').selectOption('1,500–2,500 sq ft')
    await page.getByLabel('How many stories?').selectOption('2')
    await page.getByLabel(/Trees to wrap/).fill('2')
    await page.getByLabel(/Shrubs to light/).fill('0')
    await page.getByLabel('Whose lights?').selectOption('Supply lights for me')
    await page.getByLabel('Warm white').check()
    await page.getByLabel('When should we install them?').selectOption('Early November')
    await page.getByLabel('When should we take them down?').selectOption('Early January')
    await fillContact(page)
    await page.getByRole('button', { name: 'See my price' }).click()
    await expect(page.getByRole('heading', { name: 'Your estimate' })).toBeVisible()
    await expectEstimate(page, 'Christmas Light Removal')
  })

  test('junk removal uploads photos and refuses files that aren’t photos', async ({ page }) => {
    await page.goto(`/quote/junk-removal?${E2E}`)
    await page.getByLabel('Describe the items').fill('An old couch and two mattresses')
    const upload = page.locator('input[type="file"]')
    await upload.setInputFiles([fixture('photo.jpg'), fixture('not-a-photo.jpg')])
    await expect(page.getByText('photo.jpg', { exact: true })).toBeVisible()
    await expect(page.getByText(/^That file isn’t a photo we can open/)).toBeVisible()
    await expect(page.getByText(/\d+ KB/)).toBeVisible()
    await page.getByRole('button', { name: 'Remove not-a-photo.jpg' }).click()
    await page.getByLabel('1/2 truck').check()
    await page.getByLabel('Garage').check()
    await fillContact(page)
    await page.getByRole('button', { name: 'Get my junk removal quote' }).click()
    await expect(page).toHaveURL(/\/quote\/thank-you\?type=junk$/)
  })

  test('a custom quote can include photos', async ({ page }) => {
    await page.goto(`/quote/custom?service=garage-cleaning&${E2E}`)
    await expect(page.getByLabel('Garage Cleaning', { exact: true })).toBeChecked()
    await page
      .getByLabel('Tell us about the job')
      .fill('Clear out and deep clean a two-car garage.')
    await page.locator('input[type="file"]').setInputFiles(fixture('photo.jpg'))
    await expect(page.getByText(/\d+ KB/)).toBeVisible()
    await page.getByLabel('Within a month').check()
    await fillContact(page)
    await page.getByRole('button', { name: 'Request my quote' }).click()
    await expect(page).toHaveURL(/\/quote\/thank-you\?type=custom$/)
  })

  test('a commercial bid can include an RFP', async ({ page }) => {
    await page.goto(`/quote/commercial?${E2E}`)
    await page.getByLabel('Company or HOA name').fill('E2E Test HOA')
    await page.getByLabel('Property type').selectOption('hoa')
    await page.getByRole('textbox', { name: /^Size/ }).fill('120')
    await page.getByLabel('HOA & Condo Building Washing').check()
    await page.getByLabel('Twice a year').check()
    await page.locator('input[type="file"]').setInputFiles(fixture('rfp.pdf'))
    await expect(page.getByText('rfp.pdf', { exact: true })).toBeVisible()
    await expect(page.getByText(/\d+ KB/)).toBeVisible()
    await page.getByLabel(/certificate of insurance/).check()
    await fillContact(page)
    await page.getByRole('button', { name: 'Request a bid' }).click()
    await expect(page).toHaveURL(/\/quote\/thank-you\?type=commercial_bid$/)
  })

  test('forms explain what is missing', async ({ page }) => {
    await page.goto('/quote/junk-removal')
    await page.getByRole('button', { name: 'Get my junk removal quote' }).click()
    await expect(page.getByText('Tell us what needs to go')).toBeVisible()
    await expect(page.getByLabel('Describe the items')).toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByText('Enter a 10-digit phone number')).toBeVisible()
  })

  for (const path of [
    '/quote',
    '/quote/instant',
    '/quote/snow-contract',
    '/quote/holiday-lights',
    '/quote/junk-removal',
    '/quote/custom',
    '/quote/commercial',
    '/quote/thank-you',
  ]) {
    test(`${path} has no serious accessibility problems`, async ({ page }) => {
      await page.goto(path)
      await expect(page.locator('h1')).toBeVisible()
      await expectAccessible(page)
    })
  }

  test('quote pages hide the call band and the mobile action bar', async ({ page }) => {
    await page.goto('/quote/instant')
    await expect(page.getByRole('heading', { name: /Let’s talk/ })).toHaveCount(0)
    await expect(page.getByRole('navigation', { name: 'Quick actions' })).toBeHidden()
  })
})

test.describe('slide-in quote', () => {
  test.beforeEach(async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop only')
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
    await expect(dialog.getByLabel('Name')).toBeVisible()
    await expectAccessible(page)
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()

    await page.reload()
    await exitIntent(page)
    await page.waitForTimeout(500)
    await expect(dialog).toBeHidden()
  })

  test('never opens on quote pages', async ({ page }) => {
    await page.goto('/quote/custom')
    await exitIntent(page)
    await page.waitForTimeout(500)
    await expect(page.getByRole('dialog')).toHaveCount(0)
  })
})
