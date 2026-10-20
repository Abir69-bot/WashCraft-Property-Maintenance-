import { z } from 'zod'

/**
 * The only module that reads `process.env`. Validated at import time so a misconfigured
 * deploy fails at startup rather than at the first quote submission. Server-only.
 */

const blankToUndefined = (value: unknown) =>
  typeof value === 'string' && value.trim() === '' ? undefined : value

const required = (what: string) => ({
  error: (issue: { input: unknown }) =>
    issue.input === undefined ? `is missing (${what})` : undefined,
})

const postgresUrl = (what: string) =>
  z
    .string(required(what))
    .regex(/^postgres(ql)?:\/\//, 'must be a postgres:// or postgresql:// connection string')

const deployEnv = z.enum(['development', 'preview', 'production'])

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  VERCEL_ENV: z.preprocess(blankToUndefined, deployEnv.optional()),
  SITE_ENV: z.preprocess(blankToUndefined, deployEnv.optional()),
  DATABASE_URI: z.preprocess(blankToUndefined, postgresUrl('Neon pooled connection string')),
  DATABASE_URI_DIRECT: z.preprocess(
    blankToUndefined,
    postgresUrl('Neon direct connection string').optional(),
  ),
  PAYLOAD_SECRET: z.preprocess(
    blankToUndefined,
    z.string(required('random string, 32+ characters')).min(32, 'must be at least 32 characters'),
  ),
  NEXT_PUBLIC_SITE_URL: z.preprocess(blankToUndefined, z.url().default('http://localhost:3000')),
  DB_STORAGE_LIMIT_MB: z.preprocess(
    blankToUndefined,
    z.coerce.number().int().positive().default(512),
  ),
})

export type SiteEnv = z.infer<typeof deployEnv>

export function parseEnv(source: Record<string, string | undefined>) {
  const result = schema.safeParse({
    ...source,
    // Names injected by the Vercel–Neon integration.
    DATABASE_URI: source.DATABASE_URI || source.DATABASE_URL,
    DATABASE_URI_DIRECT: source.DATABASE_URI_DIRECT || source.DATABASE_URL_UNPOOLED,
  })

  if (!result.success) {
    const problems = result.error.issues.map(
      (issue) => `  - ${issue.path.join('.')} ${issue.message}`,
    )
    throw new Error(`Invalid environment variables:\n${problems.join('\n')}\nSee .env.example.`)
  }

  const data = result.data
  const siteEnv: SiteEnv =
    data.SITE_ENV ??
    data.VERCEL_ENV ??
    (data.NODE_ENV === 'production' ? 'production' : 'development')

  return {
    ...data,
    // Migrations and backups need a direct connection; fall back to the pooled one locally.
    DATABASE_URI_DIRECT: data.DATABASE_URI_DIRECT ?? data.DATABASE_URI,
    SITE_ENV: siteEnv,
  }
}

export type Env = ReturnType<typeof parseEnv>

export const env = parseEnv(process.env)

/** True only on the live site: hides sample content, enables indexing. */
export const isProductionSite = env.SITE_ENV === 'production'
