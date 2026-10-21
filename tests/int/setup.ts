import nextEnv from '@next/env'
import { rmSync } from 'fs'
import os from 'os'
import path from 'path'

// Load .env for PAYLOAD_SECRET, then point the app at the test database. Integration tests
// never use DATABASE_URI, so they can't touch a Neon branch by accident.
nextEnv.loadEnvConfig(process.cwd())

const testDatabase =
  process.env.TEST_DATABASE_URI || 'postgresql://postgres:postgres@127.0.0.1:5433/washcraft_test'

process.env.DATABASE_URI = testDatabase
process.env.DATABASE_URI_DIRECT = testDatabase
process.env.PAYLOAD_SECRET ||= 'integration-test-secret-integration-test'

// Uploads go to a fresh temporary folder, never the dev `media/` folder.
const uploads = path.join(os.tmpdir(), 'washcraft-int-uploads')
rmSync(uploads, { recursive: true, force: true })
process.env.UPLOADS_DIR = uploads

// Private uploads and failed-lead backups too.
const privateUploads = path.join(os.tmpdir(), 'washcraft-int-private')
rmSync(privateUploads, { recursive: true, force: true })
process.env.PRIVATE_UPLOADS_DIR = privateUploads
// Integration tests never send real messages.
for (const key of ['TWILIO_ACCOUNT_SID', 'RESEND_API_KEY', 'R2_ENDPOINT']) delete process.env[key]
