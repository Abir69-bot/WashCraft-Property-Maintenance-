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

const optionalText = z.preprocess(blankToUndefined, z.string().trim().optional())

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
  /** Local upload folder (dev and tests). Production uploads go to Cloudflare R2. */
  UPLOADS_DIR: z.preprocess(blankToUndefined, z.string().default('media')),
  DB_STORAGE_LIMIT_MB: z.preprocess(
    blankToUndefined,
    z.coerce.number().int().positive().default(512),
  ),
  /** Private files (customer photos, RFPs, failed-lead backups) when R2 isn't configured. */
  PRIVATE_UPLOADS_DIR: z.preprocess(blankToUndefined, z.string().default('.private-uploads')),

  // Every integration below is optional. Missing values fall back to console logging or skip
  // the feature, so the site works with none of them (brief §3, CLAUDE.md).
  TURNSTILE_SECRET_KEY: optionalText,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: optionalText,
  TWILIO_ACCOUNT_SID: optionalText,
  TWILIO_AUTH_TOKEN: optionalText,
  /** Sending number in E.164 form, e.g. +17205550100. */
  TWILIO_FROM: optionalText,
  RESEND_API_KEY: optionalText,
  /** e.g. "WashCraft <quotes@yourdomain.com>" on a domain verified in Resend. */
  EMAIL_FROM: optionalText,
  /** Cloudflare R2 (any S3-compatible store), e.g. https://<account>.r2.cloudflarestorage.com */
  R2_ENDPOINT: z.preprocess(blankToUndefined, z.url().optional()),
  R2_ACCESS_KEY_ID: optionalText,
  R2_SECRET_ACCESS_KEY: optionalText,
  /** Public bucket for site photos (Media), served from R2_PUBLIC_URL. */
  R2_PUBLIC_BUCKET: optionalText,
  R2_PUBLIC_URL: z.preprocess(blankToUndefined, z.url().optional()),
  /** Private bucket: customer uploads, failed-lead backups and database dumps. */
  R2_PRIVATE_BUCKET: optionalText,
  /** Google Places API (New) key, restricted to that API. Fetches the rating and reviews daily. */
  GOOGLE_PLACES_API_KEY: optionalText,
  /** Shared secret for scheduled jobs; Vercel Cron sends it as "Authorization: Bearer …". */
  CRON_SECRET: optionalText,
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
    // Schema push only when NODE_ENV is explicitly "development" (`next dev`, `pnpm seed`).
    // Scripts with NODE_ENV unset must never push, in case they point at production.
    DB_PUSH: source.NODE_ENV === 'development',
  }
}

export type Env = ReturnType<typeof parseEnv>

/** R2 settings when every key for that bucket is present, otherwise null (local fallback). */
export function r2Config(data: Env, bucket: 'public' | 'private') {
  const name = bucket === 'public' ? data.R2_PUBLIC_BUCKET : data.R2_PRIVATE_BUCKET
  if (!data.R2_ENDPOINT || !data.R2_ACCESS_KEY_ID || !data.R2_SECRET_ACCESS_KEY || !name) {
    return null
  }
  return {
    bucket: name,
    endpoint: data.R2_ENDPOINT,
    accessKeyId: data.R2_ACCESS_KEY_ID,
    secretAccessKey: data.R2_SECRET_ACCESS_KEY,
  }
}

export const env = parseEnv(process.env)

/** True only on the live site: hides sample content, enables indexing. */
export const isProductionSite = env.SITE_ENV === 'production'

/**
 * Set per build by next.config.ts and inlined at compile time (so it must be read as a literal
 * `process.env` property). Scripts run outside Next and get "scripts".
 */
export const CONTENT_CACHE_VERSION = process.env.CONTENT_CACHE_VERSION ?? 'scripts'
