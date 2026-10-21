import { draftMode } from 'next/headers'

import { getLayoutData } from './layout'
import { getCategoryPage, getCityPage, getServicePage } from './pages'

/**
 * Page loaders. Each slug is checked against the cached layout data first, so a mistyped or
 * junk URL never queries the database. Preview (draft mode) skips the check, so staff can see
 * documents that aren't published yet.
 */
async function context() {
  const [layout, draft] = await Promise.all([getLayoutData(), draftMode()])
  return { layout, draft: draft.isEnabled }
}

export async function loadService(slug: string) {
  const { layout, draft } = await context()
  const known = layout.services.some((service) => service.slug === slug)
  return { layout, page: known || draft ? await getServicePage(slug, draft) : null }
}

export async function loadCategory(slug: string) {
  const { layout, draft } = await context()
  const known = layout.categories.some((category) => category.slug === slug)
  return { layout, page: known || draft ? await getCategoryPage(slug, draft) : null }
}

export async function loadCity(slug: string) {
  const { layout, draft } = await context()
  const known = layout.cities.some((city) => city.slug === slug)
  return { layout, page: known || draft ? await getCityPage(slug, draft) : null }
}
