import nextEnv from '@next/env'

// Load .env for PAYLOAD_SECRET, then point the app at the test database. Integration tests
// never use DATABASE_URI, so they can't touch a Neon branch by accident.
nextEnv.loadEnvConfig(process.cwd())

const testDatabase =
  process.env.TEST_DATABASE_URI || 'postgresql://postgres:postgres@127.0.0.1:5433/washcraft_test'

process.env.DATABASE_URI = testDatabase
process.env.DATABASE_URI_DIRECT = testDatabase
process.env.PAYLOAD_SECRET ||= 'integration-test-secret-integration-test'
