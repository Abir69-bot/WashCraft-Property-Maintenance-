import { routes } from '@/lib/routes'
import type { SearchEntry } from '@/lib/search'
import { fillTokens } from '@/lib/text'

import { getPostList, getSolutionList } from './content'
import { getLayoutData } from './layout'

const PAGES: SearchEntry[] = [
  { title: 'All services', href: routes.services, kind: 'Page', text: 'services list' },
  {
    title: 'Get instant price',
    href: routes.quoteInstant,
    kind: 'Page',
    text: 'quote estimate price cost',
  },
  {
    title: 'Request a custom quote',
    href: routes.quoteCustom,
    kind: 'Page',
    text: 'quote large job',
  },
  {
    title: 'Commercial & HOA',
    href: routes.commercial,
    kind: 'Page',
    text: 'business property manager bid',
  },
  {
    title: 'Maintenance plans',
    href: routes.maintenancePlans,
    kind: 'Page',
    text: 'plans packages subscription',
  },
  {
    title: 'Service areas',
    href: routes.areas,
    kind: 'Page',
    text: 'cities postal code zip code area',
  },
  {
    title: 'Before & after',
    href: routes.beforeAndAfter,
    kind: 'Page',
    text: 'photos gallery results',
  },
  { title: 'Reviews', href: routes.reviews, kind: 'Page', text: 'testimonials google rating' },
  { title: 'About us', href: routes.about, kind: 'Page', text: 'company team founder' },
  { title: 'Careers', href: routes.careers, kind: 'Page', text: 'jobs hiring work apply' },
  { title: 'Blog', href: routes.blog, kind: 'Page', text: 'articles tips guides' },
  { title: 'FAQ', href: routes.faq, kind: 'Page', text: 'questions answers help' },
  { title: 'Contact', href: routes.contact, kind: 'Page', text: 'phone email hours address' },
]

/** Everything the 404 search looks through: services, cities, solutions, articles, main pages. */
export async function getSearchIndex(): Promise<SearchEntry[]> {
  const [layout, posts, solutions] = await Promise.all([
    getLayoutData(),
    getPostList(),
    getSolutionList(),
  ])
  const fill = (text: string) => fillTokens(text, { region: layout.site.region })
  return [
    ...layout.services.map((service) => ({
      title: service.title,
      href: routes.service(service.slug),
      kind: 'Service',
      text: fill(service.summary),
    })),
    ...layout.cities.map((city) => ({
      title: city.name,
      href: routes.city(city.slug),
      kind: 'Service area',
      text: city.zipPrefixes?.join(' ') ?? '',
    })),
    ...solutions.map((solution) => ({
      title: fill(solution.title),
      href: routes.solution(solution.slug),
      kind: 'Solution',
      text: fill(solution.problem),
    })),
    ...posts.map((post) => ({
      title: fill(post.title),
      href: routes.post(post.slug),
      kind: 'Article',
      text: fill(post.excerpt),
    })),
    ...PAGES,
  ]
}
