import { notFound } from 'next/navigation'

/**
 * Any URL no other route matches (e.g. /old/page/path) gets the site's own 404 with the header,
 * search and footer, instead of Next's bare default.
 */
export default function MissingPage() {
  notFound()
}
