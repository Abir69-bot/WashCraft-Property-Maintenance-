import { getSearchIndex } from '@/lib/data/search'

/**
 * The 404 page's search index, fetched only when someone uses the search box. The 404 page is
 * part of every page's payload (Next keeps it ready), so the index must not be.
 */
export const revalidate = 86400

export async function GET() {
  return Response.json(await getSearchIndex())
}
