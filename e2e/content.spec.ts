import path from 'path'

import { expect, test } from '@playwright/test'

import { site } from '../src/config/site'
import { posts, solutions } from '../src/seed/data/articles'
import { faqs } from '../src/seed/data/faqs'
import { gallery } from '../src/seed/data/media'
import { expectAccessible, expectTemplate, quiet } from './helpers'

const { region, shortName } = site
const fill = (text: string) => text.replaceAll('{region}', region)
const fixture = (name: string) => path.resolve('e2e', 'fixtures', name)

const PAGES: [string, string][] = [
  ['/blog', `Home Care Tips for ${region}`],
  ['/solutions', `Common Property Problems in ${region}, and How to Fix Them`],
  ['/faq', 'Frequently Asked Questions'],
  ['/before-and-after', `Before and After Photos from ${region} Jobs`],
  ['/reviews', `Customer Reviews from ${region}`],
  ['/about', `About ${shortName}`],
  ['/careers', `Careers at ${shortName} in ${region}`],
  ['/contact', `Contact ${shortName}`],
  ['/privacy', 'Privacy Policy'],
  ['/terms', 'Terms of Use'],
  ['/accessibility', 'Accessibility Statement'],
]

test.describe('content pages render with correct metadata', () => {
  test.beforeEach(({ isMobile }) => {
    test.skip(isMobile, 'Metadata is the same on every screen size')
  })

  for (const [path, heading] of PAGES) {
    test(`page: ${path}`, async ({ page }) => {
      await expectTemplate(page, path, heading)
    })
  }

  for (const post of posts) {
    test(`post: ${post.slug}`, async ({ page }) => {
      await expectTemplate(page, `/blog/${post.slug}`, fill(post.title))
    })
  }

  for (const solution of solutions) {
    test(`solution: ${solution.slug}`, async ({ page }) => {
      await expectTemplate(page, `/solutions/${solution.slug}`, fill(solution.title))
    })
  }
})

test.describe('content pages', () => {
  test.beforeEach(async ({ page }) => {
    await quiet(page)
  })

  for (const path of [
    ...PAGES.map(([path]) => path),
    `/blog/${posts[0].slug}`,
    `/solutions/${solutions[0].slug}`,
    '/old/page/that/moved',
  ]) {
    test(`${path} has no serious accessibility problems`, async ({ page }) => {
      await page.goto(path)
      // A 404 is drawn in the browser (Next.js sends an empty shell for notFound()).
      await expect(page.locator('html')).toHaveAttribute('lang', /^en/)
      await expectAccessible(page)
    })
  }

  test('articles have contents, a mid-article CTA and related links', async ({ page }) => {
    const post = posts[0]
    await page.goto(`/blog/${post.slug}`)
    const contents = page.getByRole('navigation', { name: 'On this page' })
    const first = contents.getByRole('link').first()
    const target = (await first.getAttribute('href'))!
    await expect(page.locator(target)).toHaveCount(1)
    await first.click()
    await expect(page).toHaveURL(new RegExp(`${target}$`))
    await expect(page.getByText('Rather leave it to us?')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Services in this article' })).toBeVisible()
    await expect(page.locator('#more-articles li')).toHaveCount(3)
    // Tokens are filled in: no "{region}" anywhere on the page.
    await expect(page.getByText('{region}')).toHaveCount(0)
  })

  test('blog posts can be filtered by category', async ({ page }) => {
    await page.goto('/blog')
    const status = page.getByRole('status').filter({ hasText: /articles?$/ })
    await expect(status).toHaveText(`${posts.length} articles`)
    await page.getByRole('button', { name: 'How-to', exact: true }).click()
    const howTo = posts.filter((post) => post.category === 'how-to')
    await expect(page.locator('#articles li')).toHaveCount(howTo.length)
    await page.getByRole('button', { name: 'All', exact: true }).click()
    await expect(page.locator('#articles li')).toHaveCount(posts.length)
  })

  test('FAQs are grouped and searchable', async ({ page }) => {
    await page.goto('/faq')
    const status = page.getByRole('status').filter({ hasText: /questions/ })
    await expect(status).toHaveText(`${faqs.length} questions`)
    await page.getByLabel('Search questions').fill('salting')
    await expect(page.getByRole('button', { name: 'Is salting included?' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'How do you price your services?' })).toBeHidden()
    await page.getByRole('button', { name: 'Is salting included?' }).click()
    await expect(page.getByRole('region', { name: 'Is salting included?' })).toBeVisible()
    await page.getByLabel('Search questions').fill('zzzz')
    await expect(page.getByText('No questions match “zzzz”')).toBeVisible()
  })

  test('before-and-after photos can be filtered and enlarged', async ({ page }) => {
    await page.goto('/before-and-after')
    const status = page.getByRole('status').filter({ hasText: /projects/ })
    await expect(status).toHaveText(`${gallery.length} projects`)
    const gutters = gallery.filter((item) => item.service === 'gutter-cleaning')
    await page.getByLabel('Service', { exact: true }).selectOption({ label: 'Gutter Cleaning' })
    await expect(status).toHaveText(`Showing ${gutters.length} of ${gallery.length} projects`)
    await page.getByRole('button', { name: `View larger: ${gutters[0].caption}` }).click()
    const dialog = page.getByRole('dialog', { name: gutters[0].caption })
    await expect(dialog).toBeVisible()
    await expect(dialog.getByText(`1 of ${gutters.length}`)).toBeVisible()
    await dialog.getByRole('button', { name: 'Next' }).click()
    await expect(page.getByRole('dialog', { name: gutters[1].caption })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toBeHidden()
  })

  test('unknown addresses at any depth get the site’s 404 with search', async ({ page }) => {
    const response = await page.goto('/old/page/that/moved')
    expect(response?.status()).toBe(404)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('We couldn’t find that page')
    await expect(page.getByRole('banner')).toBeVisible()
    await page.getByLabel('Search the site').fill('gutter')
    await page
      .getByRole('link', { name: /Gutter Cleaning/ })
      .first()
      .click()
    await expect(page).toHaveURL(/\/services\/gutter-cleaning$/)
  })

  test('legal pages show when they were last updated', async ({ page }) => {
    for (const path of ['/privacy', '/terms', '/accessibility']) {
      await page.goto(path)
      await expect(page.getByText(/^Last updated /)).toBeVisible()
    }
  })

  test('never shows sample content on the production build', async ({ page }) => {
    for (const path of ['/about', '/reviews', '/careers', `/blog/${posts[0].slug}`]) {
      await page.goto(path)
      await expect(page.getByText('Sample', { exact: true }), path).toHaveCount(0)
    }
    // Sample team members and job openings have no public pages.
    expect((await page.goto('/team/alex-morgan'))?.status()).toBe(404)
    expect((await page.goto('/careers/exterior-cleaning-technician'))?.status()).toBe(404)
    // With only samples seeded, the honest empty states show instead.
    await page.goto('/careers')
    await expect(page.getByText('There are no open roles right now')).toBeVisible()
    await page.goto('/reviews')
    await expect(page.getByText('We’re just getting started with online reviews')).toBeVisible()
    await page.goto(`/blog/${posts[0].slug}`)
    await expect(page.getByText('Written by')).toHaveCount(0)
  })
})

test.describe('contact and careers forms', () => {
  test.beforeEach(async ({ page }) => {
    await quiet(page)
  })

  test('the contact form sends a message', async ({ page }) => {
    await page.goto('/contact?utm_source=e2e&utm_medium=test')
    await page.getByRole('button', { name: 'Send message' }).click()
    await expect(page.getByText('Tell us how we can help')).toBeVisible()
    await page.getByLabel('How can we help?').fill('Do you clean solar panels on flat roofs?')
    await page.getByLabel('Name', { exact: true }).fill('E2E Test')
    await page.getByLabel('Phone').fill('(303) 555-0199')
    await page.getByLabel(/I agree to receive/).check()
    await page.getByRole('button', { name: 'Send message' }).click()
    const done = page.getByRole('heading', { name: 'Thanks, we got your message' })
    await expect(done).toBeVisible()
    await expect(done).toBeFocused()
  })

  test('a job application can include a PDF résumé', async ({ page }) => {
    await page.goto('/careers')
    const form = page.locator('#apply form')
    await form.getByLabel('Name', { exact: true }).fill('E2E Test')
    await form.getByLabel('Email', { exact: true }).fill('e2e@example.com')
    await form.getByLabel('Phone', { exact: true }).fill('(303) 555-0199')
    await form.locator('input[type="file"]').setInputFiles(fixture('rfp.pdf'))
    await expect(form.getByText('rfp.pdf uploaded.')).toBeAttached()
    await form.getByLabel(/Tell us about yourself/).fill('Two seasons of exterior cleaning.')
    await form.getByRole('button', { name: 'Send application' }).click()
    await expect(
      page.getByRole('heading', { name: 'Thanks, we got your application' }),
    ).toBeVisible()
  })
})
