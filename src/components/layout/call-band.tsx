import Link from 'next/link'

import { Button } from '@/components/ui/button'
import type { SiteConfig } from '@/config/site'
import type { QuoteCta } from '@/lib/quote/flow'
import { smsHref, telHref } from '@/lib/text'
import type { Footer } from '@/payload-types'

import { CallLink } from './contact-links'
import { HideOn, QUOTE_AND_LEGAL } from './route-visibility'

/**
 * "Let's talk" band before the footer, except on quote and legal pages (brief §8). Only shown
 * with a confirmed phone number; without one it would just repeat the page's closing CTA.
 */
export function CallBand({
  site,
  band,
  cta,
}: {
  site: SiteConfig
  band: Footer['callBand']
  cta: QuoteCta
}) {
  const phrases = (band.marquee ?? []).map((item) => item.text)
  const text = smsHref(site.phone)
  if (!telHref(site.phone)) return null

  return (
    <HideOn prefixes={QUOTE_AND_LEGAL}>
      <section aria-labelledby="call-band-heading" className="overflow-hidden on-dark">
        <div className="container grid items-center gap-8 section-y lg:grid-cols-[1fr_auto]">
          <div>
            <h2 id="call-band-heading">{band.heading}</h2>
            {band.text && <p className="mt-3 text-white/90">{band.text}</p>}
            <CallLink
              phone={site.phone}
              className="mt-6 text-h2 font-heading font-extrabold text-white no-underline hover:underline"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
            {text && (
              <Button asChild size="lg" variant="inverse">
                <a href={text} data-track="sms_click">
                  Text us
                </a>
              </Button>
            )}
          </div>
        </div>
        {phrases.length > 0 && (
          <div
            aria-hidden
            className="group flex overflow-hidden border-t border-white/15 py-4 text-h3 font-heading font-bold whitespace-nowrap text-white/80"
          >
            {[0, 1].map((copy) => (
              <ul
                key={copy}
                className="flex shrink-0 animate-marquee items-center gap-10 pr-10 group-hover:[animation-play-state:paused] motion-reduce:animate-none"
              >
                {phrases.map((phrase) => (
                  <li key={phrase} className="flex items-center gap-10">
                    {phrase}
                    <span className="text-cta">✦</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        )}
      </section>
    </HideOn>
  )
}
