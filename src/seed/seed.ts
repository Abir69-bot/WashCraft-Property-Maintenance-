import { convertMarkdownToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import path from 'path'
import type {
  CollectionSlug,
  GlobalSlug,
  Payload,
  RequiredDataFromCollectionSlug,
  Where,
} from 'payload'

import type { Season } from '@/config/catalog'
import { isPlaceholder, site, type Country, type Currency, type Locale } from '@/config/site'

import { posts, solutions } from './data/articles'
import { categories } from './data/categories'
import { cities } from './data/cities'
import { faqs } from './data/faqs'
import { footer, homepage, navigation, pricingSettings, seasonalSettings } from './data/globals'
import { discounts, plans, pricingRules } from './data/pricing'
import { sampleClientLogos, sampleJobs, sampleTeam, sampleTestimonials } from './data/samples'
import { commercialServices } from './data/services-commercial'
import { exteriorServices } from './data/services-exterior'
import { holidayServices } from './data/services-holiday'
import { interiorServices } from './data/services-interior'
import { winterServices } from './data/services-winter'
import { yardServices } from './data/services-yard'
import type { CitySeed, ServiceSeed } from './types'
import {
  featuredServices,
  gallery,
  homeHeroImages,
  mediaFiles,
  serviceHeroImages,
  solutionHeroImages,
  whyChooseUsImages,
  type MediaKey,
} from './data/media'

export const allServices: ServiceSeed[] = [
  ...exteriorServices,
  ...interiorServices,
  ...winterServices,
  ...holidayServices,
  ...yardServices,
  ...commercialServices,
]

export type SeedOptions = {
  /** Overwrite documents and globals that already exist (owner edits are lost). */
  force?: boolean
  log?: (message: string) => void
}

export type SeedReport = Record<string, { created: number; updated: number; skipped: number }>

const PUBLISHED = { _status: 'published' as const }

const toSlug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/**
 * Idempotent seed (brief §16). Documents are matched by a natural key (slug, question, name);
 * existing ones are left alone unless `force` is set, so re-running never duplicates content
 * or overwrites the owner's edits.
 */
export async function seed(
  payload: Payload,
  { force = false, log = console.log }: SeedOptions = {},
) {
  const report: SeedReport = {}
  const tally = (collection: string, outcome: 'created' | 'updated' | 'skipped') => {
    report[collection] ??= { created: 0, updated: 0, skipped: 0 }
    report[collection][outcome] += 1
  }

  /** Create, or (with `force`) update, the document matching `where`. Returns its id. */
  async function upsert<S extends CollectionSlug>(
    collection: S,
    where: Where,
    data: RequiredDataFromCollectionSlug<S>,
  ): Promise<{ id: number; isNew: boolean }> {
    const existing = await payload.find({
      collection,
      where,
      limit: 1,
      depth: 0,
      pagination: false,
    })
    const found = existing.docs[0] as { id: number } | undefined
    if (found && !force) {
      tally(collection, 'skipped')
      return { id: found.id, isNew: false }
    }
    // Payload's create/update overloads can't be resolved for a generic slug, hence `as never`.
    if (found) {
      await payload.update({ collection, id: found.id, data, depth: 0 } as never)
      tally(collection, 'updated')
      return { id: found.id, isNew: true }
    }
    const created = (await payload.create({ collection, data, depth: 0 } as never)) as {
      id: number
    }
    tally(collection, 'created')
    return { id: created.id, isNew: true }
  }

  async function seedGlobal(slug: GlobalSlug, data: Record<string, unknown>) {
    const current = await payload.findGlobal({ slug, depth: 0 })
    if (current.updatedAt && !force) {
      tally(`global:${slug}`, 'skipped')
      return
    }
    await payload.updateGlobal({ slug, data } as never)
    tally(`global:${slug}`, current.updatedAt ? 'updated' : 'created')
  }

  const bySlug = (slug: string): Where => ({ slug: { equals: slug } })
  const idsFor = (map: Map<string, number>, keys: string[]) =>
    keys.map((key) => {
      const id = map.get(key)
      if (id === undefined) throw new Error(`Seed reference not found: "${key}"`)
      return id
    })

  const editorConfig = await editorConfigFactory.default({ config: payload.config })
  const richText = (markdown: string) => convertMarkdownToLexical({ editorConfig, markdown })

  // Site settings come from src/config/site.ts (brief §2). Cities are their own collection.
  await seedGlobal('site-settings', {
    name: site.name,
    shortName: site.shortName,
    tagline: site.tagline,
    phone: site.phone,
    email: site.email,
    address: site.address ?? '',
    hours: site.hours,
    region: site.region,
    ...(isPlaceholder(site.country) ? {} : { country: site.country as Country }),
    ...(isPlaceholder(site.currency) ? {} : { currency: site.currency as Currency }),
    ...(isPlaceholder(site.locale) ? {} : { locale: site.locale as Locale }),
    foundedYear: site.foundedYear,
    insuranceCoverage: site.insuranceCoverage,
    workersCompRegistration: site.workersCompRegistration,
    licenceNumbers: site.licenceNumbers,
    googlePlaceId: site.googlePlaceId,
    googleReviewUrl: site.googleReviewUrl,
    responseTimePromise: site.responseTimePromise,
    guarantee: site.guarantee,
    social: site.social,
    stats: site.stats,
    demo: site.demo,
  })

  // The owner's job photos (src/seed/media), matched by file name.
  const mediaIds = new Map<MediaKey, number>()
  for (const [key, alt] of Object.entries(mediaFiles) as [MediaKey, string][]) {
    const filename = `${key}.jpg`
    const existing = await payload.find({
      collection: 'media',
      where: { filename: { equals: filename } },
      limit: 1,
      depth: 0,
    })
    if (existing.docs[0]) {
      mediaIds.set(key, existing.docs[0].id)
      tally('media', 'skipped')
      continue
    }
    const created = await payload.create({
      collection: 'media',
      data: { alt },
      filePath: path.resolve(process.cwd(), 'src/seed/media', filename),
      depth: 0,
    })
    mediaIds.set(key, created.id)
    tally('media', 'created')
  }
  const mediaId = (key: MediaKey) => mediaIds.get(key)!

  // Categories, then services.
  const categoryIds = new Map<string, number>()
  const newCategories = new Set<string>()
  for (const [index, category] of categories.entries()) {
    const { id, isNew } = await upsert('service-categories', bySlug(category.slug), {
      ...PUBLISHED,
      title: category.title,
      slug: category.slug,
      generateSlug: false,
      headline: category.headline,
      intro: category.intro,
      heroImageLabel: category.heroImageLabel,
      bookingNote: category.bookingNote,
      icon: category.icon,
      tone: category.tone,
      menuLabel: category.menuLabel,
      summary: category.summary,
      outcomeLabel: category.outcomeLabel,
      order: (index + 1) * 10,
    })
    categoryIds.set(category.slug, id)
    if (isNew) newCategories.add(category.slug)
  }

  const serviceIds = new Map<string, number>()
  const newServices = new Set<string>()
  for (const [index, service] of allServices.entries()) {
    const { id, isNew } = await upsert('services', bySlug(service.slug), {
      ...PUBLISHED,
      title: service.title,
      slug: service.slug,
      generateSlug: false,
      category: idsFor(categoryIds, [service.category])[0],
      enabled: true,
      order: (index + 1) * 10,
      headline: service.headline,
      promise: service.promise,
      summary: service.summary,
      heroImageLabel: service.heroImageLabel,
      problem: service.problem,
      benefits: service.benefits,
      included: service.included.map((item) => ({ item })),
      method: service.method,
      safety: service.safety,
      process: service.process,
      faqs: service.faqs,
      icon: service.icon,
      outcomeLabel: service.outcomeLabel,
      cardBullets: service.bullets.map((text) => ({ text })),
      quoteMode: service.quoteMode,
      dedicatedFlow: service.dedicatedFlow,
      requiresSiteVisit: service.siteVisit ?? false,
      quoteQuestions: service.questions ?? [],
      priceFactors: service.priceFactors.map((factor) => ({ factor })),
      addOns: service.addOns ?? [],
      seasons: service.seasons,
      bookingWindowNote: service.bookingWindowNote,
    })
    serviceIds.set(service.slug, id)
    if (isNew) newServices.add(service.slug)
  }

  // Team (the founder authors the blog), then articles.
  const teamIds = new Map<string, number>()
  for (const [index, member] of sampleTeam.entries()) {
    const { id } = await upsert('team-members', bySlug(member.slug), {
      ...PUBLISHED,
      name: member.name,
      slug: member.slug,
      generateSlug: false,
      role: member.role,
      shortBio: member.shortBio,
      bio: member.bio,
      photoLabel: member.photoLabel,
      specialities: member.specialities.map((text) => ({ text })),
      isFounder: member.isFounder ?? false,
      isSample: true,
      order: (index + 1) * 10,
    })
    teamIds.set(member.slug, id)
  }
  const founderId = teamIds.get(sampleTeam.find((member) => member.isFounder)!.slug)

  const postIds = new Map<string, number>()
  for (const post of posts) {
    const { id } = await upsert('posts', bySlug(post.slug), {
      ...PUBLISHED,
      title: post.title,
      slug: post.slug,
      generateSlug: false,
      excerpt: post.excerpt,
      heroImageLabel: post.heroImageLabel,
      content: richText(post.markdown),
      relatedServices: idsFor(serviceIds, post.relatedServices),
      category: post.category,
      author: founderId,
      publishedAt: post.publishedAt,
    })
    postIds.set(post.slug, id)
  }

  const solutionIds = new Map<string, number>()
  for (const solution of solutions) {
    const { id } = await upsert('solutions', bySlug(solution.slug), {
      ...PUBLISHED,
      title: solution.title,
      slug: solution.slug,
      generateSlug: false,
      problem: solution.problem,
      heroImageLabel: solution.heroImageLabel,
      content: richText(solution.markdown),
      faqs: solution.faqs,
      relatedServices: idsFor(serviceIds, solution.relatedServices),
    })
    solutionIds.set(solution.slug, id)
  }

  // Second pass: links between documents created in this run (brief §13 internal linking).
  const linksTo = (articles: { slug: string; relatedServices: string[] }[], service: string) =>
    articles.filter((article) => article.relatedServices.includes(service)).map((a) => a.slug)

  for (const service of allServices) {
    if (!newServices.has(service.slug)) continue
    await payload.update({
      collection: 'services',
      id: serviceIds.get(service.slug)!,
      depth: 0,
      data: {
        relatedServices: idsFor(serviceIds, service.related),
        relatedPosts: idsFor(postIds, linksTo(posts, service.slug)),
        relatedSolutions: idsFor(solutionIds, linksTo(solutions, service.slug)),
        parentService: service.parent ? idsFor(serviceIds, [service.parent])[0] : null,
      },
    })
  }

  for (const category of categories) {
    if (!newCategories.has(category.slug)) continue
    await payload.update({
      collection: 'service-categories',
      id: categoryIds.get(category.slug)!,
      depth: 0,
      data: {
        bundles: category.bundles.map((bundle) => ({
          title: bundle.title,
          description: bundle.description,
          services: idsFor(serviceIds, bundle.services),
        })),
      },
    })
  }

  // Cities: one per service area. Unknown names get a placeholder page to fill in.
  const cityIds = new Map<string, number>()
  for (const [index, name] of site.serviceAreas.entries()) {
    if (isPlaceholder(name)) continue
    const city: CitySeed = cities.find((candidate) => candidate.name === name) ?? {
      name,
      state: 'TODO',
      lat: 0,
      lng: 0,
      zipPrefixes: [],
      intro: `TODO: write at least 150 words about homes, weather and your work in ${name}.`,
      heroImageLabel: `Street of homes in ${name}`,
      neighborhoods: [],
      whyChooseUs: '',
      faqs: [],
    }
    const { id } = await upsert(
      'cities',
      { name: { equals: name } },
      {
        ...PUBLISHED,
        name: city.name,
        slug: toSlug(city.name),
        generateSlug: false,
        state: city.state,
        intro: city.intro,
        heroImageLabel: city.heroImageLabel,
        neighborhoods: city.neighborhoods,
        whyChooseUs: city.whyChooseUs,
        faqs: city.faqs,
        zipPrefixes: city.zipPrefixes,
        lat: city.lat,
        lng: city.lng,
        order: (index + 1) * 10,
      },
    )
    cityIds.set(name, id)
  }

  for (const [index, faq] of faqs.entries()) {
    await upsert(
      'faqs',
      { question: { equals: faq.question } },
      {
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        services: idsFor(serviceIds, faq.services ?? []),
        showOnHome: faq.showOnHome ?? false,
        order: (index + 1) * 10,
      },
    )
  }

  // Sample social proof (hidden on the live site).
  const optionalCity = (name: string) => cityIds.get(name)
  for (const [index, testimonial] of sampleTestimonials.entries()) {
    await upsert(
      'testimonials',
      { name: { equals: testimonial.name } },
      {
        name: testimonial.name,
        quote: testimonial.quote,
        rating: testimonial.rating,
        source: 'direct',
        service: idsFor(serviceIds, [testimonial.service])[0],
        city: optionalCity(testimonial.city),
        featured: testimonial.featured ?? false,
        isSample: true,
        order: (index + 1) * 10,
      },
    )
  }

  // Real before/after pairs from the owner's jobs.
  for (const [index, item] of gallery.entries()) {
    await upsert(
      'gallery-items',
      { caption: { equals: item.caption } },
      {
        caption: item.caption,
        before: mediaId(item.before),
        after: mediaId(item.after),
        service: idsFor(serviceIds, [item.service])[0],
        featured: item.featured ?? false,
        isSample: false,
        order: (index + 1) * 10,
      },
    )
  }

  for (const [index, name] of sampleClientLogos.entries()) {
    await upsert(
      'client-logos',
      { name: { equals: name } },
      {
        name,
        isSample: true,
        order: (index + 1) * 10,
      },
    )
  }

  for (const [index, job] of sampleJobs.entries()) {
    await upsert('job-openings', bySlug(job.slug), {
      ...PUBLISHED,
      title: job.title,
      slug: job.slug,
      generateSlug: false,
      summary: job.summary,
      location: job.location,
      employmentType: job.employmentType,
      responsibilities: job.responsibilities.map((text) => ({ text })),
      requirements: job.requirements.map((text) => ({ text })),
      niceToHave: job.niceToHave.map((text) => ({ text })),
      active: true,
      isSample: true,
      order: (index + 1) * 10,
    })
  }

  // Placeholder pricing, all flagged for the owner's review.
  for (const rule of pricingRules) {
    const serviceId = idsFor(serviceIds, [rule.service])[0]
    await upsert(
      'pricing-rules',
      { service: { equals: serviceId } },
      {
        name: allServices.find((service) => service.slug === rule.service)!.title,
        service: serviceId,
        unit: rule.unit,
        quantityQuestion: rule.quantityQuestion,
        baseFee: rule.baseFee,
        unitRate: rule.unitRate,
        minCharge: rule.minCharge,
        multipliers: rule.multipliers ?? [],
        addOns: (rule.addOns ?? []).map((addOn) => ({ ...addOn, answer: addOn.answer ?? 'yes' })),
        needsReview: true,
      },
    )
  }

  for (const discount of discounts) {
    await upsert(
      'discounts',
      { name: { equals: discount.name } },
      {
        ...discount,
        active: true,
        needsReview: true,
      },
    )
  }

  for (const [index, plan] of plans.entries()) {
    await upsert(
      'plans',
      { name: { equals: plan.name } },
      {
        name: plan.name,
        kind: plan.kind,
        season: plan.season,
        tagline: plan.tagline,
        price: plan.price,
        priceUnit: plan.priceUnit,
        features: plan.features.map((text) => ({ text })),
        services: idsFor(serviceIds, plan.services),
        highlighted: plan.highlighted ?? false,
        needsReview: true,
        order: (index + 1) * 10,
      },
    )
  }

  await seedGlobal('seasonal-settings', seasonalSettings)
  await seedGlobal('navigation', navigation)
  await seedGlobal('footer', footer)
  await seedGlobal('homepage', homepage)
  await seedGlobal('feature-flags', {})
  await seedGlobal('pricing-settings', pricingSettings)

  // Photos and featured services: only filled where still empty, so admin choices survive.
  for (const [collection, heroes] of [
    ['services', serviceHeroImages],
    ['solutions', solutionHeroImages],
  ] as const) {
    for (const [slug, key] of Object.entries(heroes)) {
      const { docs } = await payload.find({ collection, where: bySlug(slug), limit: 1, depth: 0 })
      if (!docs[0] || docs[0].heroImage) continue
      await payload.update({
        collection,
        id: docs[0].id,
        data: { heroImage: mediaId(key) },
        depth: 0,
      } as never)
      tally(`${collection} photos`, 'updated')
    }
  }

  const home = await payload.findGlobal({ slug: 'homepage', depth: 0 })
  let homeChanged = false
  const heroVariants = (home.heroVariants ?? []).map((variant) => {
    const key = homeHeroImages[variant.season as Season]
    if (variant.image || !key) return variant
    homeChanged = true
    return { ...variant, image: mediaId(key) }
  })
  const whyChooseUs = (home.whyChooseUs ?? []).map((card) => {
    const key = whyChooseUsImages[card.title]
    if (card.image || !key) return card
    homeChanged = true
    return { ...card, image: mediaId(key) }
  })
  const featured = home.featuredServices?.length
    ? home.featuredServices
    : idsFor(serviceIds, featuredServices)
  if (!home.featuredServices?.length) homeChanged = true
  if (homeChanged) {
    await payload.updateGlobal({
      slug: 'homepage',
      data: { heroVariants, whyChooseUs, featuredServices: featured },
      depth: 0,
    })
    tally('global:homepage photos', 'updated')
  }

  for (const [collection, counts] of Object.entries(report)) {
    log(
      `${collection.padEnd(28)} ${counts.created} created, ${counts.updated} updated, ${counts.skipped} unchanged`,
    )
  }
  return report
}
