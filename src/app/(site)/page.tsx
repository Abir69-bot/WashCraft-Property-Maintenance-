import { Fragment } from 'react'

import { FaqList, ServiceAreas } from '@/components/sections/areas-and-faq'
import { Hero } from '@/components/sections/hero'
import type { HeroImage } from '@/components/sections/hero-media'
import {
  ClientLogos,
  CommercialBlock,
  ComparisonTable,
  FinalCta,
  Founder,
  GuaranteeBand,
  HowItWorks,
  LatestArticles,
  NeedUsNow,
  PlansTeaser,
  QuickQuoteStrip,
  SeasonalSpotlight,
  ServiceCategories,
  TrustStrip,
  WhyChooseUs,
} from '@/components/sections/home-blocks'
import { BeforeAfter, Testimonials } from '@/components/sections/proof'
import type { ExplorerService } from '@/components/sections/service-explorer'
import { ServiceIcon } from '@/components/service-icon'
import { consentText } from '@/config/consent'
import type { HOME_SECTIONS } from '@/globals/settings'
import { getHomeData } from '@/lib/data/home'
import { getLayoutData } from '@/lib/data/layout'
import { seasonNow } from '@/lib/data/season'
import { inSeasonNow } from '@/lib/seasons'
import { fillTokens } from '@/lib/text'
import { asMedia, mediaSrc, serviceGroups } from '@/lib/view'
import type { Media, Service } from '@/payload-types'

/** Home page (brief §9.1): sections in the order set in the admin, each hiding when empty. */
export default async function HomePage() {
  const [layout, home] = await Promise.all([getLayoutData(), getHomeData()])
  const { site, categories, services, cities } = layout
  const region = site.region
  const { season, active, variant } = seasonNow(layout)

  // The seasonal hero photo first. Cleaning-season heroes add up to two "after" photos from
  // featured jobs; snow and holiday heroes show only their own photo (or the placeholder).
  const variantImage = asMedia(
    home.homepage.heroVariants?.find((item) => item.season === variant?.season)?.image,
  )
  const offSeasonPhotos = variant?.season === 'winter' || variant?.season === 'holiday'
  const heroMedia = (
    variantImage
      ? [variantImage, ...(offSeasonPhotos ? [] : home.gallery.map((item) => asMedia(item.after)))]
      : []
  ).filter((media): media is Media => media !== null)
  const heroImages: HeroImage[] = heroMedia
    .filter((media, index) => heroMedia.findIndex((other) => other.id === media.id) === index)
    .slice(0, 3)
    .map((media) => ({ url: mediaSrc(media), alt: media.alt }))

  const explorer: ExplorerService[] = (home.homepage.featuredServices ?? [])
    .filter(
      (service): service is Service => typeof service === 'object' && service.enabled !== false,
    )
    .map((service) => ({
      slug: service.slug,
      title: service.title,
      summary: fillTokens(service.summary, { region }),
      icon: <ServiceIcon name={service.icon} />,
      bullets: (service.cardBullets ?? []).map((bullet) => bullet.text),
      outcomeLabel: service.outcomeLabel,
    }))

  const sections: Record<(typeof HOME_SECTIONS)[number], React.ReactNode> = {
    hero: variant && <Hero variant={variant} site={site} images={heroImages} />,
    'quick-quote': (
      <QuickQuoteStrip
        groups={serviceGroups(categories)}
        consentLabel={consentText(site.country, site.shortName)}
      />
    ),
    'client-logos': <ClientLogos logos={home.clientLogos} />,
    'trust-strip': <TrustStrip site={site} />,
    services: <ServiceCategories categories={categories} explorer={explorer} region={region} />,
    'seasonal-spotlight': (
      <SeasonalSpotlight season={season} services={inSeasonNow(services, active)} />
    ),
    'how-it-works': (
      <HowItWorks steps={home.homepage.howItWorks} upsell={home.homepage.recurringUpsell} />
    ),
    'before-after': <BeforeAfter items={home.gallery} />,
    guarantee: <GuaranteeBand guarantee={site.guarantee} />,
    'need-us-now': <NeedUsNow phone={site.phone} />,
    testimonials: <Testimonials testimonials={home.testimonials} site={site} />,
    'why-choose-us': <WhyChooseUs cards={home.homepage.whyChooseUs} region={region} />,
    comparison: <ComparisonTable comparison={home.homepage.comparison} />,
    commercial: <CommercialBlock site={site} />,
    plans: <PlansTeaser plans={home.plans} />,
    founder: <Founder founder={home.founder} region={region} />,
    'service-areas': <ServiceAreas cities={cities} region={region} />,
    faq: <FaqList faqs={home.faqs} region={region} />,
    articles: <LatestArticles posts={home.posts} />,
    'final-cta': <FinalCta region={region} />,
  }

  return (
    <>
      {(home.homepage.sections ?? [])
        .filter((item) => item.enabled !== false)
        .map((item) => (
          <Fragment key={item.id ?? item.section}>{sections[item.section]}</Fragment>
        ))}
    </>
  )
}
