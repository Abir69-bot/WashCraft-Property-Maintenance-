import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Media } from './collections/media'
import { Users } from './collections/users'
import { env } from './lib/env'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' · WashCraft admin' },
  },
  collections: [Users, Media],
  editor: lexicalEditor(),
  secret: env.PAYLOAD_SECRET,
  serverURL: env.NEXT_PUBLIC_SITE_URL,
  graphQL: { disable: true },
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: {
      // `payload migrate` sets PAYLOAD_MIGRATING: migrations must bypass Neon's pooler.
      connectionString:
        process.env.PAYLOAD_MIGRATING === 'true' ? env.DATABASE_URI_DIRECT : env.DATABASE_URI,
      max: 5,
      connectionTimeoutMillis: 15_000, // Neon scale-to-zero cold starts
      idleTimeoutMillis: 10_000,
    },
    // Auto-sync the schema only under `next dev`. Tests, CI and production use migrations.
    push: env.NODE_ENV === 'development',
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
})
