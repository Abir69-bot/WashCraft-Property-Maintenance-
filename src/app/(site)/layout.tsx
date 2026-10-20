import type { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'

import { isPlaceholder, site } from '@/config/site'
import { env, isProductionSite } from '@/lib/env'

import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: { default: site.name, template: `%s | ${site.shortName}` },
  description: isPlaceholder(site.tagline) ? undefined : site.tagline,
  applicationName: site.shortName,
  // Only the live site is indexed; dev and preview deployments never are.
  robots: isProductionSite ? undefined : { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: '#0E4D64',
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={isPlaceholder(site.locale) ? 'en' : site.locale}
      className={`${inter.variable} ${jakarta.variable}`}
    >
      <body>
        <a
          href="#main"
          className="sr-only z-50 rounded-full bg-cta px-5 py-3 font-semibold text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to main content
        </a>
        <main id="main" tabIndex={-1} className="focus:outline-none">
          {children}
        </main>
      </body>
    </html>
  )
}
