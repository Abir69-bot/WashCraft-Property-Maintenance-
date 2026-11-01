import type {
  Faq,
  GalleryItem,
  Homepage,
  Media,
  Plan,
  Post,
  TeamMember,
  Testimonial,
} from '@/payload-types'

import { cachedQuery, getPayloadClient } from './cache'

export type HomeData = {
  homepage: Homepage
  gallery: GalleryItem[]
  testimonials: Testimonial[]
  faqs: Faq[]
  posts: Post[]
  plans: Plan[]
  founder: TeamMember | null
  /** Service photos set in the admin, by service slug (home page service cards). */
  servicePhotos: Record<string, Media>
}

export const getHomeData = cachedQuery('home', async (): Promise<HomeData> => {
  const payload = await getPayloadClient()
  const common = { overrideAccess: false } as const
  const all = { overrideAccess: false, pagination: false } as const
  const [homepage, gallery, testimonials, faqs, posts, plans, founder, photos] = await Promise.all([
    payload.findGlobal({ slug: 'homepage', depth: 1 }),
    payload.find({
      ...common,
      collection: 'gallery-items',
      where: { featured: { equals: true } },
      sort: 'order',
      limit: 6,
      depth: 1,
    }),
    payload.find({ ...common, collection: 'testimonials', sort: 'order', limit: 7, depth: 1 }),
    payload.find({
      ...all,
      collection: 'faqs',
      where: { showOnHome: { equals: true } },
      sort: 'order',
      depth: 0,
    }),
    payload.find({
      ...common,
      collection: 'posts',
      sort: '-publishedAt',
      limit: 3,
      depth: 1,
      select: {
        title: true,
        slug: true,
        excerpt: true,
        heroImage: true,
        heroImageLabel: true,
        publishedAt: true,
        category: true,
      },
    }),
    payload.find({
      ...all,
      collection: 'plans',
      where: { kind: { equals: 'tier' } },
      sort: 'order',
      depth: 0,
    }),
    payload.find({
      ...common,
      collection: 'team-members',
      where: { isFounder: { equals: true } },
      limit: 1,
      depth: 1,
    }),
    payload.find({
      ...all,
      collection: 'services',
      where: { heroImage: { exists: true } },
      depth: 1,
      select: { slug: true, heroImage: true },
    }),
  ])

  return {
    homepage,
    gallery: gallery.docs,
    testimonials: testimonials.docs,
    faqs: faqs.docs,
    posts: posts.docs as Post[],
    plans: plans.docs,
    founder: founder.docs[0] ?? null,
    servicePhotos: Object.fromEntries(
      photos.docs.flatMap((service) =>
        service.heroImage && typeof service.heroImage === 'object'
          ? [[service.slug, service.heroImage]]
          : [],
      ),
    ),
  }
})
