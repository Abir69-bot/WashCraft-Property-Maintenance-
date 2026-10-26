import {
  getPayload,
  type AccessArgs,
  type CollectionSlug,
  type Migration,
  type Payload,
  type Where,
} from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { publicRead } from '@/access/public-read'
import { site } from '@/config/site'
import { migrations } from '@/migrations'
import config from '@/payload.config'
import type { Media } from '@/payload-types'
import { faqs } from '@/seed/data/faqs'
import { commercialPages } from '@/seed/data/globals'
import { gallery, mediaFiles } from '@/seed/data/media'
import { sampleClientLogos } from '@/seed/data/samples'
import { allServices, seed } from '@/seed/seed'

let payload: Payload
const quiet = { log: () => {} }

const COUNTED: CollectionSlug[] = [
  'services',
  'service-categories',
  'cities',
  'faqs',
  'posts',
  'solutions',
  'testimonials',
  'gallery-items',
  'client-logos',
  'team-members',
  'job-openings',
  'pricing-rules',
  'discounts',
  'plans',
]

async function counts() {
  const entries = await Promise.all(
    COUNTED.map(async (collection) => [
      collection,
      (await payload.count({ collection })).totalDocs,
    ]),
  )
  return Object.fromEntries(entries) as Record<string, number>
}

beforeAll(async () => {
  payload = await getPayload({ config })
  await payload.db.migrate({ migrations: migrations as unknown as Migration[] })
  await seed(payload, quiet)
}, 300_000)

afterAll(async () => {
  await payload.destroy()
})

describe('seed', () => {
  it('fills every collection from the brief', async () => {
    const totals = await counts()
    expect(totals).toMatchObject({
      services: allServices.length,
      'service-categories': 6,
      cities: site.serviceAreas.length,
      faqs: faqs.length,
      posts: 6,
      solutions: 6,
      testimonials: 6,
      'job-openings': 2,
      plans: 7,
      'gallery-items': gallery.length,
    })
    expect(allServices.length).toBeGreaterThanOrEqual(45)
    expect(totals.faqs).toBeGreaterThanOrEqual(30)
    expect(totals['pricing-rules']).toBeGreaterThan(20)
  })

  it('creates no duplicates when run again', async () => {
    const before = await counts()
    const report = await seed(payload, quiet)
    expect(Object.values(report).every((outcome) => outcome.created === 0)).toBe(true)
    expect(await counts()).toEqual(before)
  })

  it('seeds the globals once', async () => {
    const settings = await payload.findGlobal({ slug: 'site-settings' })
    expect(settings.region).toBe(site.region)
    expect(settings.demo).toEqual(site.demo)
    const homepage = await payload.findGlobal({ slug: 'homepage' })
    expect(homepage.sections).toHaveLength(20)
    const commercial = await payload.findGlobal({ slug: 'commercial-pages', depth: 1 })
    expect(commercial.points).toHaveLength(commercialPages.points.length)
    expect(
      (commercial.hoa.services ?? []).map((service) => (service as { slug: string }).slug),
    ).toEqual(commercialPages.hoa.services)
  })

  it('links services, articles and solutions both ways', async () => {
    const { docs } = await payload.find({
      collection: 'services',
      where: { slug: { equals: 'gutter-cleaning' } },
      depth: 1,
    })
    const gutters = docs[0]
    const slugs = (items: unknown[] | null | undefined) =>
      (items ?? []).map((item) => (item as { slug: string }).slug)
    expect(slugs(gutters.relatedServices)).toEqual([
      'gutter-brightening',
      'roof-cleaning',
      'ice-control',
    ])
    expect(slugs(gutters.relatedPosts)).toContain('how-often-should-gutters-be-cleaned')
    expect(slugs(gutters.relatedSolutions)).toContain('overflowing-gutters')
  })

  it('stores article bodies as rich text', async () => {
    const { docs } = await payload.find({ collection: 'posts', limit: 1 })
    expect(docs[0].content.root.children.length).toBeGreaterThan(3)
  })

  it('hides samples from visitors on the live site, but not real content', async () => {
    const liveWhere = publicRead({ samples: true, production: true })({
      req: { user: null },
    } as unknown as AccessArgs) as Where
    for (const collection of ['testimonials', 'client-logos'] as const) {
      expect((await payload.count({ collection })).totalDocs).toBeGreaterThan(0)
      expect((await payload.count({ collection, where: liveWhere })).totalDocs).toBe(0)
    }
    expect((await payload.count({ collection: 'gallery-items', where: liveWhere })).totalDocs).toBe(
      gallery.length,
    )
  })

  it("uploads the owner's photos and the sample logos, and fills empty photo slots", async () => {
    expect((await payload.count({ collection: 'media' })).totalDocs).toBe(
      Object.keys(mediaFiles).length + sampleClientLogos.length,
    )
    const logos = await payload.find({ collection: 'client-logos', depth: 1, pagination: false })
    expect(logos.docs.every((client) => (client.logo as Media | null)?.filename)).toBe(true)
    const featured = await payload.find({
      collection: 'testimonials',
      where: { featured: { equals: true } },
      depth: 1,
    })
    expect(featured.docs[0].photo).toMatchObject({ filename: 'siding-after.jpg' })
    const { docs } = await payload.find({
      collection: 'services',
      where: { slug: { equals: 'gutter-cleaning' } },
      depth: 1,
    })
    expect(docs[0].heroImage).toMatchObject({ filename: 'gutter-after.jpg' })
    const home = await payload.findGlobal({ slug: 'homepage', depth: 0 })
    expect(home.featuredServices).toHaveLength(6)
    expect(home.heroVariants?.find((variant) => variant.season === 'fall')?.image).toBeTruthy()
  })

  it('adds a 301 when a published slug changes, without loops', async () => {
    const { docs } = await payload.find({
      collection: 'services',
      where: { slug: { equals: 'fence-cleaning' } },
    })
    const id = docs[0].id
    const findRedirect = async (from: string) =>
      (await payload.find({ collection: 'redirects', where: { from: { equals: from } } })).docs

    await payload.update({ collection: 'services', id, data: { slug: 'fence-washing' } })
    expect((await findRedirect('/services/fence-cleaning'))[0]?.to?.url).toBe(
      '/services/fence-washing',
    )

    await payload.update({ collection: 'services', id, data: { slug: 'fence-cleaning' } })
    expect(await findRedirect('/services/fence-cleaning')).toHaveLength(0)
    expect((await findRedirect('/services/fence-washing'))[0]?.to?.url).toBe(
      '/services/fence-cleaning',
    )
  })
})
