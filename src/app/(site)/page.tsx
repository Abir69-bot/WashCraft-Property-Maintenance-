import { Fragment } from 'react'

import { categoryTiles } from '@/assets/home-tiles'
import { stockPhotos, type StockPhoto } from '@/assets/photos'
import { seasonPhotos } from '@/assets/season-photos'
import { serviceFeaturePhotos } from '@/assets/service-feature-photos'
import { GoogleReviews } from '@/components/sections/google-reviews'
import {
  ComparisonTable,
  LatestArticles,
  NeedUsNow,
  PlansTeaser,
  QuickQuoteStrip,
} from '@/components/sections/home-blocks'
import {
  NightBeforeAfter,
  NightCommercial,
  NightFaq,
  NightFinalCta,
  NightGuarantee,
  NightHero,
  NightHowItWorks,
  NightIntro,
  NightSeasons,
  NightServiceAreas,
  NightServices,
  NightStats,
  NightWhyChooseUs,
  PhotoCredits,
  type SeasonPanel,
  type ServiceTile,
} from '@/components/sections/home-night'
import { SEASON_LABELS, type Season } from '@/config/catalog'
import { consentText } from '@/config/consent'
import { isPlaceholder } from '@/config/site'
import type { HOME_SECTIONS } from '@/globals/settings'
import { getHomeData } from '@/lib/data/home'
import { getLayoutData } from '@/lib/data/layout'
import { getServicePhotos } from '@/lib/data/service-photos'
import { getFeatureFlags } from '@/lib/data/pages'
import { seasonNow } from '@/lib/data/season'
import { fromMedia, fromStock, servicePhoto, type Photo } from '@/lib/photos'
import { shownGuarantee } from '@/lib/proof'
import { generalCta } from '@/lib/quote/flow'
import { homeReviews } from '@/lib/reviews/view'
import { categoryHref, COMMERCIAL_CATEGORY, routes } from '@/lib/routes'
import { fillTokens } from '@/lib/text'
import { asMedia, mediaSrc, publishedServices, serviceGroups } from '@/lib/view'
import type { Media, Service } from '@/payload-types'

type HomeSection = (typeof HOME_SECTIONS)[number]

/** Home page grid: up to eight service cards. */
const SERVICE_CARDS = 8
const TAB_SEASONS: Season[] = ['spring', 'summer', 'fall', 'winter', 'holiday']

/** Home page (brief §9.1): sections in the order set in the admin, each hiding when empty. */
export default async function HomePage() {
  const [layout, home, servicePhotos] = await Promise.all([
    getLayoutData(),
    getHomeData(),
    getServicePhotos(),
  ])
  const { site, categories, services, cities, quote } = layout
  const cta = generalCta(quote)
  const commercial = categories.find((category) => category.slug === COMMERCIAL_CATEGORY)
  const flags = await getFeatureFlags()
  const region = site.region
  const { season, variant } = seasonNow(layout)

  // Which section shows each stock photo, so the credits list only photos on the page.
  const stockUse: { photo: StockPhoto; section: HomeSection }[] = []
  const stock = (photo: StockPhoto, section: HomeSection): Photo => {
    stockUse.push({ photo, section })
    return fromStock(photo)
  }
  const variantImage = (key: Season | undefined) =>
    asMedia(layout.heroVariants.find((item) => item.season === key)?.image)

  // The hero fills the screen, so an admin photo is used only when it's large and landscape;
  // otherwise a licensed photo for the season.
  const heroMedia = variantImage(variant?.season as Season | undefined)
  const heroPhoto =
    heroMedia?.width &&
    heroMedia.height &&
    heroMedia.width >= 1600 &&
    heroMedia.width > heroMedia.height
      ? fromMedia(heroMedia)
      : stock(
          variant?.season === 'winter'
            ? stockPhotos.heroWinter
            : variant?.season === 'holiday'
              ? stockPhotos.heroHoliday
              : stockPhotos.heroHome,
          'hero',
        )

  // Featured services first (Home page settings), then the rest; each with its card photo.
  const featured = publishedServices<Service>(home.homepage.featuredServices).map((s) => s.slug)
  const ordered = [
    ...featured.flatMap((slug) => services.filter((service) => service.slug === slug)),
    ...services.filter((service) => !featured.includes(service.slug)),
  ]
  const cardPhoto = (slug: string): Photo | null => {
    const photo = servicePhoto(slug, servicePhotos[slug])
    if (photo?.stock) stockUse.push({ photo: photo.stock, section: 'services' })
    return photo
  }
  const withPhotos = ordered.filter(
    (service) =>
      featured.includes(service.slug) || servicePhoto(service.slug, servicePhotos[service.slug]),
  )
  const tiles: ServiceTile[] = withPhotos.slice(0, SERVICE_CARDS).map((service) => {
    // A category card (assets/home-tiles.ts) takes this service's place while its hub exists.
    const tile = categoryTiles[service.slug]
    const category = tile && categories.find((item) => item.slug === tile.category)
    if (tile && category && category.services.length > 1) {
      return {
        slug: category.slug,
        href: categoryHref(category),
        title: category.title,
        summary: tile.summary,
        icon: category.icon ?? service.icon,
        photo: tile.photo,
      }
    }
    return {
      slug: service.slug,
      href: routes.service(service.slug),
      title: service.title,
      summary: service.summary,
      icon: service.icon,
      photo: cardPhoto(service.slug),
    }
  })

  // Season tabs: the owner's photo for that season, else the season's hero photo, else a service
  // photo from that season, else stock.
  const panels: SeasonPanel[] = TAB_SEASONS.flatMap((key) => {
    const inSeason = services.filter((service) => service.seasons?.includes(key))
    if (inSeason.length === 0) return []
    const media =
      variantImage(key) ??
      inSeason.map((service) => servicePhotos[service.slug]).find(Boolean) ??
      null
    const fallback =
      key === 'winter' ? stockPhotos.heroWinter : key === 'holiday' ? stockPhotos.heroHoliday : null
    const eyebrow = layout.heroVariants.find((item) => item.season === key)?.eyebrow
    return [
      {
        season: key,
        label: SEASON_LABELS[key],
        title: eyebrow ? fillTokens(eyebrow, { region }) : `${SEASON_LABELS[key]} services`,
        current: key === season,
        services: inSeason.map(({ slug, title }) => ({ slug, title })),
        photo:
          seasonPhotos[key] ??
          (media ? fromMedia(media) : fallback ? stock(fallback, 'seasonal-spotlight') : null),
      },
    ]
  })

  // The owner's own job photos (never samples) for the photo wall above the closing panel.
  const wall = home.gallery
    .filter((item) => !item.isSample)
    .flatMap((item) => [asMedia(item.after), asMedia(item.before)])
    .filter((media): media is Media => media !== null)
    .map(mediaSrc)

  const sections: Record<HomeSection, React.ReactNode> = {
    hero: variant && <NightHero variant={variant} site={site} cta={cta} photo={heroPhoto} />,
    intro: <NightIntro intro={home.homepage.introduction} region={region} />,
    // The quick form, plans and comparison belong to switched-off features (Feature switches).
    'quick-quote': quote.instantPricing && (
      <QuickQuoteStrip
        groups={serviceGroups(categories)}
        consentLabel={consentText(site.country, site.shortName)}
      />
    ),
    // Removed from the home page at the owner's request (2026-11-01).
    'client-logos': null,
    'trust-strip': <NightStats site={site} />,
    services: <NightServices tiles={tiles} region={region} />,
    'seasonal-spotlight': <NightSeasons panels={panels} cta={cta} />,
    'how-it-works': (
      <NightHowItWorks
        steps={home.homepage.howItWorks}
        upsell={quote.instantPricing ? home.homepage.recurringUpsell : null}
        cta={cta}
      />
    ),
    'before-after': <NightBeforeAfter items={home.gallery} />,
    guarantee: <NightGuarantee guarantee={shownGuarantee(site)} />,
    'need-us-now': <NeedUsNow phone={site.phone} tone="night" />,
    testimonials: (
      <GoogleReviews reviews={homeReviews(home.googleReviews, home.testimonials)} site={site} />
    ),
    'why-choose-us': <NightWhyChooseUs cards={home.homepage.whyChooseUs} region={region} />,
    comparison: flags.comparisonTable && <ComparisonTable comparison={home.homepage.comparison} />,
    commercial: commercial && (
      <NightCommercial
        site={site}
        cta={cta}
        servicesHref={categoryHref(commercial)}
        photo={serviceFeaturePhotos['commercial-cleaning']}
      />
    ),
    plans: quote.instantPricing && <PlansTeaser plans={home.plans} />,
    // Removed at the owner's request (2026-11-05).
    founder: null,
    'service-areas': <NightServiceAreas cities={cities} region={region} />,
    faq: <NightFaq faqs={home.faqs} region={region} />,
    articles: <LatestArticles posts={home.posts} />,
    'final-cta': (
      <NightFinalCta
        region={region}
        cta={cta}
        email={isPlaceholder(site.email) ? null : site.email}
        phone={site.phone}
        wall={wall}
      />
    ),
  }

  const enabled = (home.homepage.sections ?? []).filter((item) => item.enabled !== false)
  const shown = new Set(
    enabled.filter((item) => sections[item.section]).map((item) => item.section),
  )
  const credits = [
    ...new Set(stockUse.filter((use) => shown.has(use.section)).map((use) => use.photo)),
  ]
  return (
    <div className="night-theme">
      {enabled.map((item) => (
        <Fragment key={item.id ?? item.section}>{sections[item.section]}</Fragment>
      ))}
      <PhotoCredits photos={credits} />
    </div>
  )
}
