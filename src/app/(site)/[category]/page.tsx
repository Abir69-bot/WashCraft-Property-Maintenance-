import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { CategoryHub } from '@/components/sections/category-hub'
import { getLayoutData } from '@/lib/data/layout'
import { loadCategory } from '@/lib/data/load'
import { notFoundUnlessMoved } from '@/lib/data/redirects'
import { categoryCta } from '@/lib/quote/flow'
import { COMMERCIAL_CATEGORY, routes } from '@/lib/routes'
import { categoryMetadata } from '@/lib/seo/metadata'

/** This route catches every top-level path; /commercial has its own page. */
export async function generateStaticParams() {
  const { categories } = await getLayoutData()
  return categories
    .filter((category) => category.slug !== COMMERCIAL_CATEGORY)
    .map((category) => ({ category: category.slug }))
}

export async function generateMetadata({ params }: PageProps<'/[category]'>): Promise<Metadata> {
  const { layout, page } = await loadCategory((await params).category)
  return page ? categoryMetadata(layout.site, page.category) : {}
}

/** Category hub (brief §9.2), e.g. /exterior-cleaning. */
export default async function CategoryPage({ params }: PageProps<'/[category]'>) {
  const { category: slug } = await params
  if (slug === COMMERCIAL_CATEGORY) notFound()
  const { layout, page } = await loadCategory(slug)
  if (!page) return notFoundUnlessMoved(routes.category(slug))
  return <CategoryHub layout={layout} page={page} cta={categoryCta(page.category.tone)} />
}
