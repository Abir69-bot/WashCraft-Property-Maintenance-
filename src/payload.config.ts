import { postgresAdapter } from '@payloadcms/db-postgres'
import { importExportPlugin } from '@payloadcms/plugin-import-export'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { s3Storage } from '@payloadcms/storage-s3'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { isOwner, isSignedIn } from './access/roles'
import { Posts, Solutions } from './collections/articles'
import { Cities } from './collections/cities'
import { JobOpenings, TeamMembers } from './collections/company'
import { Faqs } from './collections/faqs'
import { Applications, LeadFiles, Leads } from './collections/leads'
import { Media } from './collections/media'
import { Discounts, Plans, PricingRules } from './collections/pricing'
import { ServiceCategories } from './collections/service-categories'
import { Services } from './collections/services'
import {
  CaseStudies,
  ClientLogos,
  GalleryItems,
  GoogleReviews,
  Testimonials,
} from './collections/social-proof'
import { Users } from './collections/users'
import {
  CommercialPages,
  FeatureFlags,
  Footer,
  Homepage,
  Navigation,
  PricingSettings,
  SeasonalSettings,
} from './globals/settings'
import { AboutPage, CareersPage, LegalPages } from './globals/pages'
import { SiteSettings } from './globals/site-settings'
import { withGlobalRevalidation, withRevalidation } from './hooks/revalidate'
import { env, r2Config } from './lib/env'
import { generateSeoTitle, generateSeoUrl } from './lib/seo/generate'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const publicBucket = r2Config(env, 'public')

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' · WashCraft admin' },
    components: {
      beforeDashboard: ['@/components/admin/lead-dashboard#LeadDashboard'],
      graphics: {
        Logo: '@/components/admin/brand#AdminLogo',
        Icon: '@/components/admin/brand#AdminIcon',
      },
    },
  },
  collections: [
    // Content shown on public pages: saving any of these refreshes the cached site.
    ...[
      Services,
      ServiceCategories,
      PricingRules,
      Discounts,
      Plans,
      Cities,
      Posts,
      Solutions,
      Faqs,
      Testimonials,
      GoogleReviews,
      GalleryItems,
      ClientLogos,
      CaseStudies,
      TeamMembers,
      JobOpenings,
      Media,
    ].map(withRevalidation),
    Leads,
    Applications,
    LeadFiles,
    Users,
  ],

  globals: [
    SiteSettings,
    SeasonalSettings,
    Navigation,
    Footer,
    Homepage,
    CommercialPages,
    AboutPage,
    CareersPage,
    LegalPages,
    FeatureFlags,
    PricingSettings,
  ].map(withGlobalRevalidation),

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
    // Auto-sync the schema only when NODE_ENV is explicitly "development" (`next dev`,
    // `pnpm seed`). Tests, CI, scripts and production use the committed migrations.
    push: env.DB_PUSH,
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  plugins: [
    seoPlugin({ generateTitle: generateSeoTitle, generateURL: generateSeoUrl }),
    redirectsPlugin({
      collections: ['services', 'service-categories', 'cities', 'posts', 'solutions'],
      redirectTypes: ['301', '302'],
      overrides: {
        admin: { group: 'Admin' },
        access: { read: () => true, create: isSignedIn, update: isSignedIn, delete: isOwner },
      },
    }),
    // Site photos on Cloudflare R2 in production (local disk otherwise). Customer files use a
    // separate private bucket through src/lib/storage, never this public one.
    s3Storage({
      enabled: Boolean(publicBucket),
      alwaysInsertFields: true,
      bucket: publicBucket?.bucket ?? 'unused',
      config: {
        region: 'auto',
        endpoint: publicBucket?.endpoint,
        forcePathStyle: true,
        credentials: publicBucket
          ? {
              accessKeyId: publicBucket.accessKeyId,
              secretAccessKey: publicBucket.secretAccessKey,
            }
          : undefined,
      },
      collections: {
        media: {
          prefix: 'media',
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) =>
            `${env.R2_PUBLIC_URL}/${prefix ? `${prefix}/` : ''}${filename}`,
        },
      },
    }),
    // CSV export of leads and job applications (brief §11), downloaded straight from the list.
    importExportPlugin({
      collections: (['leads', 'applications'] as const).map((slug) => ({
        slug,
        import: false,
        export: { format: 'csv', disableSave: true, disableJobsQueue: true },
      })),
    }),
  ],
  sharp,
})
