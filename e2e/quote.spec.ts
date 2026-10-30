import path from 'path'

import { expect, test, type Page } from '@playwright/test'

import { E2E, expectAccessible, quiet } from './helpers'

const fixture = (name: string) => path.resolve('e2e', 'fixtures', name)

/** The quote request form's details: phone and/or email, address and/or postal code. */
async function fillDetails(
  page: Page,
  { phone = true, email = true, zip = true, address = false } = {},
) {
  await page.getByLabel('Name', { exact: true }).fill('E2E Test')
  if (phone) await page.getByLabel(/^Phone/).fill('(416) 555-0199')
  if (email) await page.getByLabel(/^Email/).fill('e2e@example.com')
  if (address) await page.getByLabel(/^Street address/).fill('123 Test Street')
  if (zip) await page.getByLabel(/^Postal code/).fill('M1B 2K3')
}

async function describeJob(page: Page) {
  await page.getByLabel('Describe the job').fill('Front and back gutters on a two-storey semi.')
  await page.getByLabel('Within a month').check()
}

const send = (page: Page) => page.getByRole('button', { name: /^Send my/ }).click()

test.describe('quote request form', () => {
  test.beforeEach(async ({ page }) => {
    await quiet(page)
  })

  test('a service page button opens the form with that service picked', async ({ page }) => {
    await page.goto('/services/gutter-cleaning')
    await page
      .getByRole('main')
      .getByRole('link', { name: /^Request a (Free )?Quote$/ })
      .first()
      .click()
    await expect(page).toHaveURL(/\/quote\?service=gutter-cleaning$/)
    await expect(page.getByLabel('Gutter Cleaning', { exact: true })).toBeChecked()
  })

  test('sends with only an email address and a postal code', async ({ page }) => {
    await page.goto(`/quote?service=gutter-cleaning&${E2E}`)
    await describeJob(page)
    await fillDetails(page, { phone: false })
    await send(page)
    await expect(page).toHaveURL(/\/quote\/thank-you\?type=custom$/)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Thanks, we’ve got your request',
    )
    await expect(page.getByText('WashCraft reviews your request')).toBeVisible()
  })

  test('sends with only a phone number and a street address, plus a photo', async ({ page }) => {
    await page.goto(`/quote?service=soft-washing&${E2E}`)
    await describeJob(page)
    await page.locator('input[type="file"]').setInputFiles(fixture('photo.jpg'))
    await expect(page.getByText(/\d+ KB/)).toBeVisible()
    await fillDetails(page, { email: false, zip: false, address: true })
    await send(page)
    await expect(page).toHaveURL(/\/quote\/thank-you\?type=custom$/)
  })

  test('explains what is missing, including a way to reach the visitor', async ({ page }) => {
    await page.goto('/quote')
    await send(page)
    await expect(page.getByText('Choose the service you need, or “Something else”')).toBeVisible()
    await expect(page.getByLabel('Describe the job')).toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByText('Enter a phone number or an email address').first()).toBeVisible()
    await expect(
      page.getByText('Enter the postal code or the street address').first(),
    ).toBeVisible()
    await expect(page).toHaveURL(/\/quote$/)
  })

  test('accepts real JPEG and PNG photos and refuses disguised files, checked by their content', async ({
    page,
  }) => {
    await page.goto('/quote')
    await page
      .locator('input[type="file"]')
      .setInputFiles([fixture('photo.jpg'), fixture('photo.png'), fixture('not-a-photo.jpg')])
    const item = (name: string) =>
      page.getByRole('listitem').filter({ has: page.getByText(name, { exact: true }) })
    // An accepted file shows its size; a refused one shows why.
    await expect(item('photo.jpg')).toContainText(/\d+ KB/)
    await expect(item('photo.png')).toContainText(/\d+ KB/)
    await expect(item('not-a-photo.jpg')).toContainText(/That file isn’t a photo we can open/)
  })

  test('sends once, however often the button is pressed', async ({ page }) => {
    await page.goto(`/quote?service=window-cleaning&${E2E}`)
    await describeJob(page)
    await fillDetails(page)
    const button = page.getByRole('button', { name: /^Send my/ })
    let posts = 0
    page.on('request', (request) => {
      if (request.method() === 'POST' && request.url().includes('/quote')) posts += 1
    })
    await button.dblclick()
    await expect(page).toHaveURL(/\/quote\/thank-you/)
    expect(posts).toBe(1)
  })

  test('switched-off quote pages send visitors to the quote form', async ({ page }) => {
    for (const path of [
      '/quote/instant',
      '/quote/snow-contract',
      '/quote/holiday-lights',
      '/quote/junk-removal',
      '/quote/commercial',
      '/maintenance-plans',
    ]) {
      await page.goto(path)
      await expect(page, path).toHaveURL(/\/quote$/)
    }
    await page.goto('/quote/custom?service=roof-cleaning')
    await expect(page).toHaveURL(/\/quote\?service=roof-cleaning$/)
  })

  for (const path of ['/quote', '/quote/thank-you']) {
    test(`${path} has no serious accessibility problems`, async ({ page }) => {
      await page.goto(path)
      await expect(page.locator('h1')).toBeVisible()
      await expectAccessible(page)
    })
  }

  test('quote pages hide the call band and the mobile action bar', async ({ page }) => {
    await page.goto('/quote')
    await expect(page.getByRole('heading', { name: /Let’s talk/ })).toHaveCount(0)
    await expect(page.getByRole('navigation', { name: 'Quick actions' })).toBeHidden()
  })

  test('the quote page explains how quotes work and what happens to the details', async ({
    page,
  }) => {
    await page.goto('/quote')
    await expect(page.getByRole('heading', { name: 'Your details and photos' })).toBeVisible()
    const steps = page.locator('#how-it-works ol > li')
    await expect(steps).toHaveCount(5)
    await expect(steps.nth(2)).toContainText('written estimate')
  })
})
