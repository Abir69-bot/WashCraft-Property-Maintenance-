import { draftMode } from 'next/headers'

import {
  getJobPage,
  getJobs,
  getPostList,
  getPostPage,
  getSolutionList,
  getSolutionPage,
  getTeam,
  getTeamMemberPage,
} from './content'
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

/** Content pages: the slug is checked against the cached listing first. */
async function loadFrom<T>(
  slug: string,
  list: () => Promise<{ slug: string }[]>,
  read: (slug: string, draft: boolean) => Promise<T | null>,
) {
  const { layout, draft } = await context()
  const known = draft || (await list()).some((doc) => doc.slug === slug)
  return { layout, page: known ? await read(slug, draft) : null }
}

export const loadPost = (slug: string) => loadFrom(slug, getPostList, getPostPage)
export const loadSolution = (slug: string) => loadFrom(slug, getSolutionList, getSolutionPage)
export const loadTeamMember = (slug: string) => loadFrom(slug, getTeam, getTeamMemberPage)
export const loadJob = (slug: string) => loadFrom(slug, getJobs, getJobPage)
