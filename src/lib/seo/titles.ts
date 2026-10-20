/** Page title patterns (brief §13). The layout appends " | WashCraft" via its title template. */

export type TitleContext = { region: string }

export function serviceTitle(service: string, { region }: TitleContext) {
  return `${service} in ${region}`
}

export function categoryTitle(category: string, { region }: TitleContext) {
  return `${category} Services in ${region}`
}

export function cityTitle(city: string) {
  return `Property Maintenance in ${city}`
}

/** Default title for any page document, by collection. */
export function documentTitle(
  collection: string | undefined,
  doc: { title?: unknown; name?: unknown },
  context: TitleContext,
): string {
  const label = String(doc.title ?? doc.name ?? '')
  switch (collection) {
    case 'services':
      return serviceTitle(label, context)
    case 'service-categories':
      return categoryTitle(label, context)
    case 'cities':
      return cityTitle(label)
    default:
      return label
  }
}
