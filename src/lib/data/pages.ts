import type { BasePayload, Where } from 'payload'

import type {
  CaseStudy,
  City,
  ClientLogo,
  CommercialPage,
  Faq,
  GalleryItem,
  Homepage,
  Plan,
  Service,
  ServiceCategory,
  Testimonial,
} from '@/payload-types'

import { cachedQuery, getPayloadClient, readAs } from './cache'

/** Fields loaded for related services: enough for a card and its quote button. */
const CARD = {
  _status: true,
  title: true,
  slug: true,
  summary: true,
  icon: true,
  outcomeLabel: true,
  enabled: true,
  quoteMode: true,
  dedicatedFlow: true,
} as const
const LINK = { title: true, slug: true } as const
const POPULATE = {
  services: CARD,
  solutions: { ...LINK, problem: true },
  posts: { ...LINK, excerpt: true },
  'service-categories': { ...LINK, tone: true, icon: true },
  cities: { name: true, slug: true },
} as const

export type Proof = { gallery: GalleryItem[]; testimonials: Testimonial[] }

/** Before/after pairs and testimonials matching a filter (samples hidden on the live site). */
async function findProof(
  payload: BasePayload,
  draft: boolean,
  where: { gallery: Where; testimonials: Where },
): Promise<Proof> {
  const options = { ...readAs(draft), sort: 'order', limit: 6, depth: 1, populate: POPULATE }
  const [gallery, testimonials] = await Promise.all([
    payload.find({ collection: 'gallery-items', where: where.gallery, ...options }),
    payload.find({ collection: 'testimonials', where: where.testimonials, ...options }),
  ])
  return { gallery: gallery.docs, testimonials: testimonials.docs }
}

export type SharedBlocks = Pick<
  Homepage,
  'comparison' | 'howItWorks' | 'recurringUpsell' | 'whyChooseUs'
>

/** Blocks edited once on the Home page global and reused on inner pages. */
export const getSharedBlocks = cachedQuery('shared-blocks', async (): Promise<SharedBlocks> => {
  const payload = await getPayloadClient()
  const home = await payload.findGlobal({ slug: 'homepage', depth: 1 })
  return {
    comparison: home.comparison,
    howItWorks: home.howItWorks,
    recurringUpsell: home.recurringUpsell,
    whyChooseUs: home.whyChooseUs,
  }
})

export const getFeatureFlags = cachedQuery('feature-flags', async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'feature-flags', depth: 0 })
})

export type ServicePage = Proof & { service: Service; faqs: Faq[] }

export const getServicePage = cachedQuery(
  'service-page',
  async (slug: string, draft: boolean): Promise<ServicePage | null> => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'services',
      ...readAs(draft),
      where: { slug: { equals: slug }, enabled: { equals: true } },
      limit: 1,
      depth: 1,
      populate: POPULATE,
    })
    const service = docs[0]
    if (!service) return null
    const [proof, faqs] = await Promise.all([
      findProof(payload, draft, {
        gallery: { service: { equals: service.id } },
        testimonials: { service: { equals: service.id } },
      }),
      payload.find({
        collection: 'faqs',
        overrideAccess: false,
        where: { services: { in: [service.id] } },
        sort: 'order',
        pagination: false,
        depth: 0,
      }),
    ])
    return { service, faqs: faqs.docs, ...proof }
  },
)

export type CategoryPage = Proof & { category: ServiceCategory; faqs: Faq[] }

export const getCategoryPage = cachedQuery(
  'category-page',
  async (slug: string, draft: boolean): Promise<CategoryPage | null> => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'service-categories',
      ...readAs(draft),
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
      populate: POPULATE,
    })
    const category = docs[0]
    if (!category) return null
    const services = await payload.find({
      collection: 'services',
      overrideAccess: false,
      where: { category: { equals: category.id }, enabled: { equals: true } },
      pagination: false,
      depth: 0,
      select: { slug: true },
    })
    const serviceIds = services.docs.map((service) => service.id)
    const [proof, faqs] = await Promise.all([
      findProof(payload, draft, {
        gallery: { category: { equals: category.id } },
        testimonials: { service: { in: serviceIds } },
      }),
      payload.find({
        collection: 'faqs',
        overrideAccess: false,
        where: { category: { equals: category.tone } },
        sort: 'order',
        pagination: false,
        depth: 0,
      }),
    ])
    return { category, faqs: faqs.docs, ...proof }
  },
)

export type CityPage = Proof & { city: City }

export const getCityPage = cachedQuery(
  'city-page',
  async (slug: string, draft: boolean): Promise<CityPage | null> => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'cities',
      ...readAs(draft),
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
      populate: POPULATE,
    })
    const city = docs[0]
    if (!city) return null
    const proof = await findProof(payload, draft, {
      gallery: { city: { equals: city.id } },
      testimonials: { city: { equals: city.id } },
    })
    return { city, ...proof }
  },
)

export type CommercialData = {
  pages: CommercialPage
  caseStudies: CaseStudy[]
  clientLogos: ClientLogo[]
}

export const getCommercialData = cachedQuery('commercial', async (): Promise<CommercialData> => {
  const payload = await getPayloadClient()
  const [pages, caseStudies, clientLogos] = await Promise.all([
    payload.findGlobal({ slug: 'commercial-pages', depth: 1, populate: POPULATE }),
    payload.find({
      collection: 'case-studies',
      overrideAccess: false,
      sort: 'order',
      limit: 6,
      depth: 1,
      populate: POPULATE,
    }),
    payload.find({
      collection: 'client-logos',
      overrideAccess: false,
      sort: 'order',
      pagination: false,
      depth: 1,
    }),
  ])
  return { pages, caseStudies: caseStudies.docs, clientLogos: clientLogos.docs }
})

export const getPlans = cachedQuery('plans', async (): Promise<Plan[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'plans',
    overrideAccess: false,
    sort: 'order',
    pagination: false,
    depth: 1,
    populate: POPULATE,
  })
  return docs
})
