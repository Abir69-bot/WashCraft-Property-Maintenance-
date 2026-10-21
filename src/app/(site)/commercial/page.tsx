import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { CategoryHub } from '@/components/sections/category-hub'
import { CaseStudies, HoaCard, ManagerPoints } from '@/components/sections/commercial-blocks'
import { ClientLogos } from '@/components/sections/home-blocks'
import { loadCategory } from '@/lib/data/load'
import { getCommercialData } from '@/lib/data/pages'
import { categoryCta } from '@/lib/quote/flow'
import { COMMERCIAL_CATEGORY } from '@/lib/routes'
import { categoryMetadata } from '@/lib/seo/metadata'

export async function generateMetadata(): Promise<Metadata> {
  const { layout, page } = await loadCategory(COMMERCIAL_CATEGORY)
  return page ? categoryMetadata(layout.site, page.category) : {}
}

/** Commercial hub (brief §9.5): the category hub plus sections for managers and boards. */
export default async function CommercialPage() {
  const [{ layout, page }, commercial] = await Promise.all([
    loadCategory(COMMERCIAL_CATEGORY),
    getCommercialData(),
  ])
  if (!page) notFound()
  return (
    <CategoryHub layout={layout} page={page} cta={categoryCta(page.category.tone)}>
      <ManagerPoints points={commercial.pages.points} site={layout.site} />
      <HoaCard hoa={commercial.pages.hoa} region={layout.site.region} />
      <ClientLogos logos={commercial.clientLogos} />
      <CaseStudies items={commercial.caseStudies} />
    </CategoryHub>
  )
}
