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

const nextConfig: NextConfig = {
  poweredByHeader: false,
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
  headers: async () =>
    (payloadHeaders ? await payloadHeaders() : []).map((rule) =>
      rule.source === '/:path*' ? { ...rule, source: '/admin/:path*' } : rule,
    ),
} satisfies NextConfig
