import { describe, expect, it } from 'vitest'

import { parseEnv, r2Config } from './env'

const base = {
  DATABASE_URI: 'postgresql://u:p@ep-x-pooler.example.neon.tech/washcraft?sslmode=require',
  PAYLOAD_SECRET: 'a'.repeat(32),
}

describe('parseEnv', () => {
  it('fails fast when DATABASE_URI is missing', () => {
    expect(() => parseEnv({ PAYLOAD_SECRET: base.PAYLOAD_SECRET })).toThrow(
      /DATABASE_URI is missing/,
    )
  })

  it('treats blank values as missing', () => {
    expect(() => parseEnv({ ...base, DATABASE_URI: '  ' })).toThrow(/DATABASE_URI is missing/)
  })

  it('rejects non-postgres connection strings', () => {
    expect(() => parseEnv({ ...base, DATABASE_URI: 'mysql://x' })).toThrow(/postgres/)
  })

  it('rejects a short PAYLOAD_SECRET', () => {
    expect(() => parseEnv({ ...base, PAYLOAD_SECRET: 'short' })).toThrow(/PAYLOAD_SECRET/)
  })

  it('maps the Vercel–Neon integration variable names', () => {
    const env = parseEnv({
      PAYLOAD_SECRET: base.PAYLOAD_SECRET,
      DATABASE_URL: 'postgresql://pooled',
      DATABASE_URL_UNPOOLED: 'postgresql://direct',
    })
    expect(env.DATABASE_URI).toBe('postgresql://pooled')
    expect(env.DATABASE_URI_DIRECT).toBe('postgresql://direct')
  })

  it('prefers the project names over the integration names', () => {
    const env = parseEnv({ ...base, DATABASE_URL: 'postgresql://other' })
    expect(env.DATABASE_URI).toBe(base.DATABASE_URI)
  })

  it('falls back to the pooled string when no direct string is set', () => {
    expect(parseEnv(base).DATABASE_URI_DIRECT).toBe(base.DATABASE_URI)
  })

  it('applies defaults', () => {
    const env = parseEnv(base)
    expect(env.DB_STORAGE_LIMIT_MB).toBe(512)
    expect(env.NEXT_PUBLIC_SITE_URL).toBe('http://localhost:3000')
    expect(env.SITE_ENV).toBe('development')
  })

  it('coerces DB_STORAGE_LIMIT_MB', () => {
    expect(parseEnv({ ...base, DB_STORAGE_LIMIT_MB: '3072' }).DB_STORAGE_LIMIT_MB).toBe(3072)
  })

  describe('DB_PUSH', () => {
    it('is on only when NODE_ENV is explicitly development', () => {
      expect(parseEnv({ ...base, NODE_ENV: 'development' }).DB_PUSH).toBe(true)
      expect(parseEnv(base).DB_PUSH).toBe(false)
      expect(parseEnv({ ...base, NODE_ENV: 'test' }).DB_PUSH).toBe(false)
      expect(parseEnv({ ...base, NODE_ENV: 'production' }).DB_PUSH).toBe(false)
    })
  })

  describe('SITE_ENV', () => {
    it('is production for a production build outside Vercel', () => {
      expect(parseEnv({ ...base, NODE_ENV: 'production' }).SITE_ENV).toBe('production')
    })

    it('follows VERCEL_ENV so previews keep sample content and noindex', () => {
      expect(parseEnv({ ...base, NODE_ENV: 'production', VERCEL_ENV: 'preview' }).SITE_ENV).toBe(
        'preview',
      )
    })

    it('can be overridden explicitly', () => {
      expect(parseEnv({ ...base, SITE_ENV: 'production' }).SITE_ENV).toBe('production')
    })
  })
})

describe('optional integrations', () => {
  it('treats blank keys as not configured', () => {
    const env = parseEnv({ ...base, TWILIO_ACCOUNT_SID: ' ', RESEND_API_KEY: '' })
    expect(env.TWILIO_ACCOUNT_SID).toBeUndefined()
    expect(env.RESEND_API_KEY).toBeUndefined()
  })

  it('uses R2 for a bucket only when every key for it is set', () => {
    const keys = {
      R2_ENDPOINT: 'https://account.r2.cloudflarestorage.com',
      R2_ACCESS_KEY_ID: 'id',
      R2_SECRET_ACCESS_KEY: 'secret',
      R2_PRIVATE_BUCKET: 'washcraft-private',
    }
    const env = parseEnv({ ...base, ...keys })
    expect(r2Config(env, 'private')).toEqual({
      bucket: 'washcraft-private',
      endpoint: keys.R2_ENDPOINT,
      accessKeyId: 'id',
      secretAccessKey: 'secret',
    })
    expect(r2Config(env, 'public')).toBeNull()
    expect(r2Config(parseEnv({ ...base, ...keys, R2_SECRET_ACCESS_KEY: '' }), 'private')).toBeNull()
  })
})
