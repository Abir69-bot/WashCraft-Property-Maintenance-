/**
 * Lists unset business facts. Strict mode (exit 1) blocks production builds:
 * `--strict`, STRICT_CONFIG=true, or automatically on Vercel production builds.
 * CI runs it in report mode so the pipeline stays green while content is pending.
 */
import { checkSiteConfig } from '../src/config/check-site'
import { site } from '../src/config/site'

const strict =
  process.argv.includes('--strict') ||
  process.env.STRICT_CONFIG === 'true' ||
  process.env.VERCEL_ENV === 'production'

const problems = checkSiteConfig(site)

if (problems.length === 0) {
  console.log('✓ Site config is complete.')
  process.exit(0)
}

console.log(`Site config has ${problems.length} unresolved item(s) in src/config/site.ts:`)
for (const problem of problems) console.log(`  - ${problem.field} ${problem.message}`)

if (strict) {
  console.error('\n✗ Production builds are blocked until these are set.')
  process.exit(1)
}

console.log('\n(Report only. Production builds run this check in strict mode.)')
