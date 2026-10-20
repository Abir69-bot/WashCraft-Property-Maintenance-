/**
 * Lists unset or demo business facts. Strict mode (exit 1) blocks production builds:
 * `--strict`, STRICT_CONFIG=true, or automatically on Vercel production builds.
 * CI runs it in report mode so the pipeline stays green while content is pending.
 *
 * Checks the admin's saved Site settings when the database is reachable (that's what the live
 * site shows), otherwise src/config/site.ts.
 */
import nextEnv from '@next/env'

import { checkSiteConfig } from '../src/config/check-site'
import { site, type SiteConfig } from '../src/config/site'

nextEnv.loadEnvConfig(process.cwd())

const strict =
  process.argv.includes('--strict') ||
  process.env.STRICT_CONFIG === 'true' ||
  process.env.VERCEL_ENV === 'production'

async function loadSite(): Promise<{ config: SiteConfig; source: string }> {
  const fallback = { config: site, source: 'src/config/site.ts' }
  if (!process.env.DATABASE_URI && !process.env.DATABASE_URL) return fallback

  try {
    const { getPayload } = await import('payload')
    const { default: payloadConfig } = await import('../src/payload.config')
    const { getSite } = await import('../src/lib/site-settings')
    const payload = await getPayload({ config: payloadConfig })
    try {
      const config = await getSite(payload)
      return config === site ? fallback : { config, source: 'Site settings in the admin' }
    } finally {
      await payload.destroy()
    }
  } catch (error) {
    console.warn(`Could not read Site settings (${(error as Error).message.split('\n')[0]}).`)
    return fallback
  }
}

const { config, source } = await loadSite()
const problems = checkSiteConfig(config)

if (problems.length === 0) {
  console.log(`✓ Site config is complete (${source}).`)
  process.exit(0)
}

console.log(`Site config has ${problems.length} unresolved item(s) in ${source}:`)
for (const problem of problems) console.log(`  - ${problem.field} ${problem.message}`)

if (strict) {
  console.error('\n✗ Production builds are blocked until these are set.')
  process.exit(1)
}

console.log('\n(Report only. Production builds run this check in strict mode.)')
process.exit(0)
