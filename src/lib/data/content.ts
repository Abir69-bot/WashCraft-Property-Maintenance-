import type {
  AboutPage,
  CareersPage,
  Faq,
  GalleryItem,
  GoogleReview,
  JobOpening,
  LegalPage,
  Post,
  Solution,
  TeamMember,
  Testimonial,
} from '@/payload-types'

import { cachedQuery, getPayloadClient, readAs } from './cache'

/**
 * Queries for the content pages (brief §9.7). Lists use `overrideAccess: false`, so drafts and,
 * on the live site, samples never show; single pages read drafts in preview.
 */

const POPULATE = {
  services: {
    title: true,
    slug: true,
    summary: true,
    icon: true,
    outcomeLabel: true,
    enabled: true,
    category: true,
    quoteMode: true,
    dedicatedFlow: true,
    parentService: true,
  },
  posts: { title: true, slug: true, excerpt: true, category: true, publishedAt: true },
  solutions: { title: true, slug: true, problem: true },
  'team-members': {
    name: true,
    slug: true,
    role: true,
    shortBio: true,
    photo: true,
    photoLabel: true,
    isSample: true,
  },
  cities: { name: true, slug: true },
  'service-categories': { title: true, slug: true },
} as const

const LIST = { overrideAccess: false, pagination: false } as const

export const getPostList = cachedQuery('post-list', async (): Promise<Post[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    ...LIST,
    sort: '-publishedAt',
    depth: 1,
    select: {
      title: true,
      slug: true,
      excerpt: true,
      category: true,
      publishedAt: true,
      heroImage: true,
      heroImageLabel: true,
    },
  })
  return docs as Post[]
})

export const getPostPage = cachedQuery(
  'post-page',
  async (slug: string, draft: boolean): Promise<Post | null> => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'posts',
      ...readAs(draft),
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
      populate: POPULATE,
    })
    return docs[0] ?? null
  },
)

export const getSolutionList = cachedQuery('solution-list', async (): Promise<Solution[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'solutions',
    ...LIST,
    sort: 'title',
    depth: 1,
    select: {
      title: true,
      slug: true,
      problem: true,
      heroImage: true,
      heroImageLabel: true,
      relatedServices: true,
    },
    populate: POPULATE,
  })
  return docs as Solution[]
})

export const getSolutionPage = cachedQuery(
  'solution-page',
  async (slug: string, draft: boolean): Promise<Solution | null> => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'solutions',
      ...readAs(draft),
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
      populate: POPULATE,
    })
    return docs[0] ?? null
  },
)

export const getFaqList = cachedQuery('faq-list', async (): Promise<Faq[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'faqs', ...LIST, sort: 'order', depth: 0 })
  return docs
})

export const getGallery = cachedQuery('gallery', async (): Promise<GalleryItem[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'gallery-items',
    ...LIST,
    sort: 'order',
    depth: 1,
    populate: POPULATE,
  })
  return docs
})

export type ReviewsData = { testimonials: Testimonial[]; google: GoogleReview[] }

export const getReviews = cachedQuery('reviews', async (): Promise<ReviewsData> => {
  const payload = await getPayloadClient()
  const [testimonials, google] = await Promise.all([
    payload.find({
      collection: 'testimonials',
      ...LIST,
      sort: 'order',
      depth: 1,
      populate: POPULATE,
    }),
    payload.find({
      collection: 'google-reviews',
      ...LIST,
      where: { hidden: { not_equals: true } },
      sort: '-publishedAt',
      depth: 0,
    }),
  ])
  return { testimonials: testimonials.docs, google: google.docs }
})

export const getTeam = cachedQuery('team', async (): Promise<TeamMember[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'team-members',
    ...LIST,
    sort: 'order',
    depth: 1,
  })
  return docs
})

export const getTeamMemberPage = cachedQuery(
  'team-member-page',
  async (slug: string, draft: boolean): Promise<TeamMember | null> => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'team-members',
      ...readAs(draft),
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
    })
    return docs[0] ?? null
  },
)

export const getJobs = cachedQuery('jobs', async (): Promise<JobOpening[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'job-openings',
    ...LIST,
    where: { active: { equals: true } },
    sort: 'order',
    depth: 0,
  })
  return docs
})

export const getJobPage = cachedQuery(
  'job-page',
  async (slug: string, draft: boolean): Promise<JobOpening | null> => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'job-openings',
      ...readAs(draft),
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    })
    return docs[0] ?? null
  },
)

export const getAboutPage = cachedQuery('about-page', async (): Promise<AboutPage> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'about-page', depth: 1 })
})

export const getCareersPage = cachedQuery('careers-page', async (): Promise<CareersPage> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'careers-page', depth: 0 })
})

export const getLegalPages = cachedQuery('legal-pages', async (): Promise<LegalPage> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'legal-pages', depth: 0 })
})
