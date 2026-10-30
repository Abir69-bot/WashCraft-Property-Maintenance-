import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * New on every build (and every `next dev` start). Content queries include it in their cache
 * keys, so each deploy reads fresh data instead of reusing the previous build's data cache.
 */
const contentCacheVersion = Date.now().toString(36)

/**
 * Security headers for every route. Vercel serves HTTPS only and redirects HTTP; HSTS tells
 * browsers to never try HTTP again. The CSP is limited to directives that need no per-request
 * nonce (a nonce would make every page dynamic): no framing by other sites, no plugins, no
 * <base> or form hijacking.
 */
const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  {
    key: 'Content-Security-Policy',
    value: "frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self'",
  },
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // The custom quote form became the quote request form at /quote (query string kept).
  redirects: async () => [{ source: '/quote/custom', destination: '/quote', permanent: true }],
  env: { CONTENT_CACHE_VERSION: contentCacheVersion },
  images: {
    formats: ['image/avif', 'image/webp'],
    localPatterns: [{ pathname: '/api/media/file/**' }],
    // Site photos served from the public R2 bucket in production (see .env.example).
    remotePatterns: process.env.R2_PUBLIC_URL
      ? [new URL(`${process.env.R2_PUBLIC_URL}/media/**`)]
      : [],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

const config = withPayload(nextConfig, { devBundleServerPackages: false })
const payloadHeaders = config.headers

/**
 * Payload sends colour-scheme client hints on every route, for the admin's light/dark theme.
 * On public pages `Critical-CH` makes Chrome repeat each first request (an extra round trip) and
 * `Vary` splits the CDN cache, so the hints apply to the admin only.
 */
export default {
  ...config,
  headers: async () => [
    { source: '/:path*', headers: securityHeaders },
    ...(payloadHeaders ? await payloadHeaders() : []).map((rule) =>
      rule.source === '/:path*' ? { ...rule, source: '/admin/:path*' } : rule,
    ),
  ],
} satisfies NextConfig
