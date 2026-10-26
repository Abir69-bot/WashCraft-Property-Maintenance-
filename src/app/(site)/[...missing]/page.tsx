import { notFoundUnlessMoved } from '@/lib/data/redirects'

/**
 * Any URL no other route matches (e.g. /old/page/path) follows a redirect from the admin if
 * there is one, otherwise gets the site's own 404 with the header, search and footer.
 */
export default async function MissingPage({ params }: PageProps<'/[...missing]'>) {
  const { missing } = await params
  return notFoundUnlessMoved(`/${missing.join('/')}`)
}
