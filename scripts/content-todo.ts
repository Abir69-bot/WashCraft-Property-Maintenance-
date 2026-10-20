/**
 * `pnpm content-todo`: regenerates the photo and pricing lists in CONTENT_TODO.md from the seed
 * data and from every <PhotoPlaceholder label="…"> in the page code (brief §19).
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'fs'
import path from 'path'
import { format, resolveConfig } from 'prettier'

import { posts, solutions } from '../src/seed/data/articles'
import { categories } from '../src/seed/data/categories'
import { cities } from '../src/seed/data/cities'
import { homepage } from '../src/seed/data/globals'
import { discounts, plans, pricingRules } from '../src/seed/data/pricing'
import { sampleGallery, sampleTeam } from '../src/seed/data/samples'
import { allServices } from '../src/seed/seed'

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

const photos = [
  ...section('Home page', [
    ...homepage.heroVariants.map((variant) => `Hero (${variant.season}): ${variant.imageLabel}`),
    ...homepage.whyChooseUs.map((card) => `Why choose us, "${card.title}": ${card.imageLabel}`),
  ]),
  ...section(
    'Category pages',
    categories.map((category) => `${category.title}: ${category.heroImageLabel}`),
  ),
  ...section(
    'Service pages',
    allServices.map((service) => `${service.title}: ${service.heroImageLabel}`),
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
    [...posts, ...solutions].map((article) => `${article.title}: ${article.heroImageLabel}`),
  ),
  ...section(
    'Before & after pairs (same angle and distance for both)',
    sampleGallery.map((item) => `${item.caption}: before "${item.before}", after "${item.after}"`),
  ),
  ...section(
    'Team',
    sampleTeam.map((member) => `${member.role.replace(' (sample)', '')}: ${member.photoLabel}`),
  ),
  ...section('Other pages', [...new Set(codeLabels(path.resolve('src')))]),
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
text = replaceBetween(text, 'photos', photos)
text = replaceBetween(text, 'pricing', pricing)
writeFileSync(FILE, await format(text, { ...(await resolveConfig(FILE)), filepath: FILE }))
console.log(
  `CONTENT_TODO.md updated: ${photos.filter((l) => l.startsWith('- [ ]')).length} photos, ${pricingRules.length} pricing rules.`,
)
