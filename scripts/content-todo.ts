/**
 * `pnpm content-todo`: regenerates the confirmation, photo and pricing lists in CONTENT_TODO.md
 * from the seed data and from every <PhotoPlaceholder label="…"> in the page code (brief §19).
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'fs'
import path from 'path'
import { format, resolveConfig } from 'prettier'

import type { Season } from '../src/config/catalog'
import { confirmedServices, pendingServiceAreas } from '../src/config/site'

import { posts, solutions } from '../src/seed/data/articles'
import { categories } from '../src/seed/data/categories'
import { cities } from '../src/seed/data/cities'
import { homepage } from '../src/seed/data/globals'
import { aboutPage } from '../src/seed/data/pages'
import { discounts, plans, pricingRules } from '../src/seed/data/pricing'
import { homeHeroImages, serviceHeroImages, solutionHeroImages } from '../src/seed/data/media'
import { sampleTeam } from '../src/seed/data/samples'
import { allServices } from '../src/seed/data/services'

const FILE = path.resolve('CONTENT_TODO.md')

function codeLabels(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name)
    if (statSync(full).isDirectory()) return name === 'styleguide' ? [] : codeLabels(full)
    if (!full.endsWith('.tsx')) return []
    const source = readFileSync(full, 'utf8')
    return [...source.matchAll(/<PhotoPlaceholder[^>]*?label="([^"]+)"/g)].map((match) => match[1])
  })
}

const section = (title: string, items: string[]) =>
  items.length ? [`**${title}**`, '', ...items.map((item) => `- [ ] ${item}`), ''] : []

// Slots that already have one of the owner's photos are left out.
const photos = [
  ...section('Home page', [
    ...homepage.heroVariants
      .filter((variant) => !homeHeroImages[variant.season as Season])
      .map((variant) => `Hero (${variant.season}): ${variant.imageLabel}`),
  ]),
  ...section('Category and commercial pages', [
    ...categories
      .filter((category) =>
        allServices.some(
          (service) =>
            service.category === category.slug && confirmedServices.includes(service.slug),
        ),
      )
      .map((category) => `${category.title} (optional): ${category.heroImageLabel}`),
    `About page: ${aboutPage.heroImageLabel}`,
  ]),
  ...section(
    'Service pages',
    allServices
      .filter(
        (service) => confirmedServices.includes(service.slug) && !serviceHeroImages[service.slug],
      )
      .map((service) => `${service.title} (optional): ${service.heroImageLabel}`),
  ),
  ...section(
    'City pages',
    cities.flatMap((city) => [
      `${city.name}: ${city.heroImageLabel}`,
      ...city.neighborhoods.map((n) => `${city.name}, ${n.name}: ${n.imageLabel}`),
    ]),
  ),
  ...section(
    'Articles',
    [...posts, ...solutions]
      .filter((article) => !solutionHeroImages[article.slug])
      .map((article) => `${article.title}: ${article.heroImageLabel}`),
  ),
  ...section('More before & after pairs, from your own jobs only (same angle for both shots)', [
    'Winter: a driveway and walkway before and after snow removal',
    'Holiday: a home before and after light installation (daytime and dusk)',
    'Interior: a kitchen or bathroom before and after cleaning',
    'Post-construction: a room before and after the final clean',
  ]),
  ...section(
    'Team',
    sampleTeam.map((member) => `${member.role.replace(' (sample)', '')}: ${member.photoLabel}`),
  ),
  ...section('Other pages', [...new Set(codeLabels(path.resolve('src')))]),
]

const confirmations = [
  ...section(
    'Published: confirmed by you on 2026-10-30',
    allServices
      .filter((service) => confirmedServices.includes(service.slug))
      .map((service) => service.title),
  ),
  ...section(
    'Unpublished drafts: publish one in the admin (Services → open it → Publish) only once you offer it',
    allServices
      .filter((service) => !confirmedServices.includes(service.slug))
      .map((service) => service.title),
  ),
  ...section(
    'Possible service areas: add each as a city in the admin, with its own page copy, once confirmed',
    pendingServiceAreas,
  ),
]

const titleOf = (slug: string) =>
  allServices.find((service) => service.slug === slug)?.title ?? slug

const pricing = [
  'Every number below is a placeholder. While a rule is marked **Needs review** in the admin, the',
  'live site shows "Request a quote" instead of a price. Review each one under **Pricing**.',
  '',
  ...section(
    'Pricing rules',
    pricingRules.map((rule) => `${titleOf(rule.service)} (${rule.unit.replace('_', ' ')})`),
  ),
  ...section(
    'Discounts',
    discounts.map((discount) => `${discount.name}: ${discount.percent}%`),
  ),
  ...section(
    'Plans and packages',
    plans.map((plan) => `${plan.name}: $${plan.price} ${plan.priceUnit}`),
  ),
]

function replaceBetween(text: string, marker: string, lines: string[]) {
  const start = `<!-- ${marker}:start -->`
  const end = `<!-- ${marker}:end -->`
  const from = text.indexOf(start)
  const to = text.indexOf(end)
  if (from === -1 || to === -1) throw new Error(`CONTENT_TODO.md is missing the ${marker} markers`)
  return `${text.slice(0, from + start.length)}\n\n${lines.join('\n').trim()}\n\n${text.slice(to)}`
}

let text = readFileSync(FILE, 'utf8')
text = replaceBetween(text, 'confirmations', confirmations)
text = replaceBetween(text, 'photos', photos)
text = replaceBetween(text, 'pricing', pricing)
writeFileSync(FILE, await format(text, { ...(await resolveConfig(FILE)), filepath: FILE }))
console.log(
  `CONTENT_TODO.md updated: ${photos.filter((l) => l.startsWith('- [ ]')).length} photos, ${pricingRules.length} pricing rules.`,
)
