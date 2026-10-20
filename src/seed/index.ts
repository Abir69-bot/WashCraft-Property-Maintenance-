/**
 * `pnpm seed [--force]`: fills the database in .env with the starter content.
 * Safe to re-run: existing documents are kept unless --force is passed.
 */
import config from '@payload-config'
import { getPayload } from 'payload'

import { seed } from './seed'

const payload = await getPayload({ config })
const force = process.argv.includes('--force')

payload.logger.info(force ? 'Seeding (overwriting existing content)…' : 'Seeding…')
await seed(payload, { force, log: (message) => payload.logger.info(message) })
payload.logger.info('Seed complete.')
process.exit(0)
