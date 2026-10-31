import { defineConfig, devices } from '@playwright/test'

/**
 * E2E tests run against a production build (`pnpm build` first), on desktop and phone sizes.
 * Port 3100 keeps them clear of `pnpm dev` on 3000.
 */
const PORT = Number(process.env.E2E_PORT ?? 3100)
const BASE_URL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /(seasons|features)\.spec\.ts/,
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'] },
      testIgnore: /(seasons|features)\.spec\.ts/,
    },
    // Switch features on and force a season site-wide, so they wait until every other test has
    // finished, and run one after the other.
    {
      name: 'features',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /features\.spec\.ts/,
      dependencies: ['desktop', 'mobile'],
    },
    {
      name: 'seasons',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /seasons\.spec\.ts/,
      dependencies: ['features'],
    },
  ],
  webServer: {
    command: `pnpm start --port ${PORT}`,
    url: BASE_URL,
    // The site's own address: Payload only accepts signed-in writes from it (CSRF check).
    env: Object.fromEntries(
      Object.entries({ ...process.env, NEXT_PUBLIC_SITE_URL: BASE_URL }).filter(
        (entry): entry is [string, string] => entry[1] !== undefined,
      ),
    ),
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
