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

export default withPayload(nextConfig, { devBundleServerPackages: false })
