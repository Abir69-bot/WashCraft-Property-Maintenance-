import type { QuoteQuestion } from '@/lib/quote/questions'

/** Short builders for the seed's quote questions. Pricing rules refer to these ids. */
export const ask = {
  select: (id: string, label: string, options: string[], helpText?: string): QuoteQuestion => ({
    id,
    type: 'select',
    label,
    options,
    required: true,
    ...(helpText ? { helpText } : {}),
  }),
  number: (
    id: string,
    label: string,
    range: { min: number; max: number; unit?: string; helpText?: string },
  ): QuoteQuestion => ({ id, type: 'number', label, required: true, ...range }),
  yesNo: (id: string, label: string, helpText?: string): QuoteQuestion => ({
    id,
    type: 'boolean',
    label,
    ...(helpText ? { helpText } : {}),
  }),
}

export const HOME_SIZES = [
  'Under 1,500 sq ft',
  '1,500–2,500 sq ft',
  '2,500–3,500 sq ft',
  'Over 3,500 sq ft',
]

export const homeSize = ask.select(
  'home_size',
  'About how big is the home?',
  HOME_SIZES,
  'Finished living space. A rough guess is fine.',
)

export const stories = ask.select('stories', 'How many stories?', ['1', '2', '3'])

export const yardSize = ask.select(
  'yard_size',
  'How big is the yard?',
  ['Small', 'Medium', 'Large'],
  'Small: under 2,000 sq ft. Medium: up to 6,000 sq ft. Large: more than that.',
)

export const garageSize = ask.select('garage_size', 'What size is the garage?', [
  '1-car',
  '2-car',
  '3-car',
])

export const bedrooms = ask.select('bedrooms', 'Bedrooms', ['1', '2', '3', '4', '5+'])
export const bathrooms = ask.select('bathrooms', 'Bathrooms', ['1', '2', '3', '4+'])
