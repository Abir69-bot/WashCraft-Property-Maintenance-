/**
 * Every public URL in one place (brief §6). Menus, footer, breadcrumbs, sitemap, redirects and
 * the CMS all build paths here, so a URL can't drift between them.
 */
export const routes = {
  home: '/',
  services: '/services',
  service: (slug: string) => `/services/${slug}`,
  /** Category hubs live at the top level, e.g. /exterior-cleaning. */
  category: (slug: string) => `/${slug}`,
  hoa: '/commercial/hoa',
  maintenancePlans: '/maintenance-plans',
  areas: '/areas',
  city: (slug: string) => `/areas/${slug}`,
  cityService: (city: string, service: string) => `/areas/${city}/${service}`,
  quote: '/quote',
  quoteInstant: '/quote/instant',
  quoteCustom: '/quote/custom',
  quoteSnowContract: '/quote/snow-contract',
  quoteHolidayLights: '/quote/holiday-lights',
  quoteJunkRemoval: '/quote/junk-removal',
  quoteCommercial: '/quote/commercial',
  quoteThankYou: '/quote/thank-you',
  beforeAndAfter: '/before-and-after',
  reviews: '/reviews',
  about: '/about',
  teamMember: (slug: string) => `/team/${slug}`,
  careers: '/careers',
  job: (slug: string) => `/careers/${slug}`,
  blog: '/blog',
  post: (slug: string) => `/blog/${slug}`,
  solutions: '/solutions',
  solution: (slug: string) => `/solutions/${slug}`,
  faq: '/faq',
  contact: '/contact',
  privacy: '/privacy',
  terms: '/terms',
  accessibility: '/accessibility',
} as const

/** Collections whose documents have their own page, and how to build that page's path. */
export const DOC_PATHS = {
  services: routes.service,
  'service-categories': routes.category,
  cities: routes.city,
  posts: routes.post,
  solutions: routes.solution,
  'team-members': routes.teamMember,
  'job-openings': routes.job,
} as const satisfies Record<string, (slug: string) => string>

export type PageCollection = keyof typeof DOC_PATHS
