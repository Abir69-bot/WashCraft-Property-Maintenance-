import type { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import { draftMode } from 'next/headers'

import {
  AnnouncementBar,
  announcementScript,
  pickAnnouncement,
} from '@/components/layout/announcement'
import { CallBand } from '@/components/layout/call-band'
import { CookieConsent } from '@/components/layout/cookie-consent'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import type { FeaturedCard } from '@/components/layout/main-nav'
import { MobileActionBar } from '@/components/layout/mobile-action-bar'
import { PreviewBanner } from '@/components/layout/preview-banner'
import { UtilityBar } from '@/components/layout/utility-bar'
import { isPlaceholder } from '@/config/site'
import { getLayoutData, type LayoutData } from '@/lib/data/layout'
import { seasonNow } from '@/lib/data/season'
import { env, isProductionSite } from '@/lib/env'
import { fillTokens } from '@/lib/text'

import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
})

/** Pages rebuild once a day (reusing cached content) so seasonal content switches by itself. */
export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getLayoutData()
  return {
    metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
    title: { default: site.name, template: `%s | ${site.shortName}` },
    description: isPlaceholder(site.tagline) ? undefined : site.tagline,
    applicationName: site.shortName,
    // Only the live site is indexed; dev and preview deployments never are.
    robots: isProductionSite ? undefined : { index: false, follow: false },
  }
}

export const viewport: Viewport = {
  themeColor: '#0E4D64',
}

function featuredCard(
  layout: LayoutData,
  variant: ReturnType<typeof seasonNow>['variant'],
): FeaturedCard | null {
  const manual = layout.navigation.featuredCard
  const region = layout.site.region
  if (manual && !manual.automatic && manual.title && manual.href) {
    return { title: manual.title, text: manual.text ?? '', href: manual.href, cta: 'Learn more' }
  }
  if (!variant) return null
  return {
    eyebrow: variant.eyebrow,
    title: fillTokens(variant.headline, { region }),
    text: fillTokens(variant.subline, { region }),
    href: variant.cta.href,
    cta: variant.cta.label,
  }
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [layout, draft] = await Promise.all([getLayoutData(), draftMode()])
  const { site } = layout
  const { season, active, variant } = seasonNow(layout)
  const announcement = pickAnnouncement(layout.seasonal, season, active)

  return (
    <html
      lang={isPlaceholder(site.locale) ? 'en' : site.locale}
      className={`${inter.variable} ${jakarta.variable}`}
    >
      <head>
        {announcement && (
          <script dangerouslySetInnerHTML={{ __html: announcementScript(announcement.id) }} />
        )}
      </head>
      <body className="pb-14 md:pb-0">
        <a
          href="#main"
          className="sr-only z-50 rounded-full bg-cta px-5 py-3 font-semibold text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to main content
        </a>
        {draft.isEnabled && <PreviewBanner />}
        <AnnouncementBar announcement={announcement} />
        <UtilityBar site={site} />
        <Header data={layout} featured={featuredCard(layout, variant)} />
        <main id="main" tabIndex={-1} className="focus:outline-none">
          {children}
        </main>
        <CallBand site={site} band={layout.footer.callBand} />
        <Footer data={layout} />
        <MobileActionBar phone={site.phone} />
        <CookieConsent />
      </body>
    </html>
  )
}
