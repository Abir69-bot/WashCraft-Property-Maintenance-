/** Blog categories: the Posts collection's options and the labels and colors on the site. */
export const POST_CATEGORIES = [
  { value: 'seasonal', label: 'Seasonal tips', short: 'Seasonal tips', tone: 'winter' },
  { value: 'how-to', label: 'How-to', short: 'How-to', tone: 'exterior' },
  { value: 'guides', label: 'Buying guides', short: 'Guide', tone: 'interior' },
  { value: 'news', label: 'Company news', short: 'News', tone: 'neutral' },
] as const

export const postCategory = (value: string) =>
  POST_CATEGORIES.find((category) => category.value === value) ?? POST_CATEGORIES[3]

/** FAQ page groups, in page order. */
export const FAQ_CATEGORIES = [
  { label: 'General', value: 'general' },
  { label: 'Quotes & estimates', value: 'pricing' },
  { label: 'Booking & scheduling', value: 'scheduling' },
  { label: 'Exterior cleaning', value: 'exterior' },
  { label: 'Interior cleaning', value: 'interior' },
  { label: 'Snow removal', value: 'winter' },
  { label: 'Holiday lighting', value: 'holiday' },
  { label: 'Yard care', value: 'yard' },
  { label: 'Commercial & restaurant', value: 'commercial' },
] as const
