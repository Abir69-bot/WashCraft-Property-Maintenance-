/**
 * Colour tokens as documented in the styleguide. `src/app/(site)/globals.css` holds the live
 * CSS variables; `brand-tokens.test.ts` fails if the two drift or a pair loses contrast.
 *
 * The brief's base hues are kept for fills and accents. "-strong" shades are darker variants
 * that reach 4.5:1 on white and --surface, for text and meaningful icons (see DECISIONS.md).
 */

export type ColorToken = { name: string; hex: string; use: string }

export const colorTokens: ColorToken[] = [
  { name: 'primary', hex: '#0E4D64', use: 'Header, footer, headings, dark sections' },
  { name: 'primary-hover', hex: '#0B3E51', use: 'Hover on primary fills' },
  { name: 'secondary', hex: '#2CB1BC', use: 'Decorative accents; icons on dark sections' },
  { name: 'secondary-strong', hex: '#1F7B83', use: 'Links and icons on light backgrounds' },
  { name: 'secondary-on-dark', hex: '#68C7CF', use: 'Teal text on primary backgrounds' },
  { name: 'cta', hex: '#F5B700', use: 'Primary buttons only, with ink text' },
  { name: 'cta-hover', hex: '#E0A700', use: 'Hover on CTA buttons' },
  { name: 'ink', hex: '#14202B', use: 'Body text' },
  { name: 'muted', hex: '#5B6B78', use: 'Secondary text' },
  { name: 'surface', hex: '#F4F8FA', use: 'Alternating section backgrounds' },
  { name: 'border', hex: '#D9E3E9', use: 'Decorative dividers and card outlines' },
  { name: 'border-strong', hex: '#7B8C98', use: 'Form field borders (3:1 non-text minimum)' },
  { name: 'success', hex: '#2E9E5B', use: 'Success fills and icons' },
  { name: 'success-strong', hex: '#257F49', use: 'Success text and badges' },
  { name: 'error', hex: '#C62828', use: 'Error text, borders and icons' },
  { name: 'winter', hex: '#3B82C4', use: 'Winter accents and icons' },
  { name: 'winter-strong', hex: '#3473AE', use: 'Winter badges and text' },
  { name: 'holiday', hex: '#B83A3A', use: 'Holiday badges, text and icons' },
  { name: 'yard', hex: '#4C9A50', use: 'Yard-care accents and icons' },
  { name: 'yard-strong', hex: '#3E7E41', use: 'Yard-care badges and text' },
  { name: 'todo', hex: '#FFE066', use: 'TODO chips and Sample badges (never in production)' },
]

export type ContrastPair = { fg: string; bg: string; min: 3 | 4.5; where: string }

/** Every foreground/background combination the UI uses. `white` is #FFFFFF. */
export const contrastPairs: ContrastPair[] = [
  { fg: 'ink', bg: 'white', min: 4.5, where: 'Body text' },
  { fg: 'ink', bg: 'surface', min: 4.5, where: 'Body text on alternating sections' },
  { fg: 'muted', bg: 'white', min: 4.5, where: 'Secondary text' },
  { fg: 'muted', bg: 'surface', min: 4.5, where: 'Secondary text on alternating sections' },
  { fg: 'primary', bg: 'white', min: 4.5, where: 'Headings' },
  { fg: 'primary', bg: 'surface', min: 4.5, where: 'Headings on alternating sections' },
  { fg: 'white', bg: 'primary', min: 4.5, where: 'Header, footer, dark sections, primary buttons' },
  { fg: 'white', bg: 'primary-hover', min: 4.5, where: 'Primary buttons on hover' },
  { fg: 'secondary-on-dark', bg: 'primary', min: 4.5, where: 'Teal text on dark sections' },
  { fg: 'ink', bg: 'cta', min: 4.5, where: 'CTA buttons' },
  { fg: 'ink', bg: 'cta-hover', min: 4.5, where: 'CTA buttons on hover' },
  { fg: 'secondary-strong', bg: 'white', min: 4.5, where: 'Links' },
  { fg: 'secondary-strong', bg: 'surface', min: 4.5, where: 'Links on alternating sections' },
  { fg: 'error', bg: 'white', min: 4.5, where: 'Error messages' },
  { fg: 'error', bg: 'surface', min: 4.5, where: 'Error messages on alternating sections' },
  { fg: 'success-strong', bg: 'white', min: 4.5, where: 'Success messages' },
  { fg: 'white', bg: 'secondary-strong', min: 4.5, where: 'Exterior badges' },
  { fg: 'white', bg: 'winter-strong', min: 4.5, where: 'Winter badges' },
  { fg: 'white', bg: 'holiday', min: 4.5, where: 'Holiday badges' },
  { fg: 'white', bg: 'yard-strong', min: 4.5, where: 'Yard-care badges' },
  { fg: 'white', bg: 'success-strong', min: 4.5, where: 'Success badges' },
  { fg: 'ink', bg: 'todo', min: 4.5, where: 'TODO chips and Sample badges' },
  { fg: 'border-strong', bg: 'white', min: 3, where: 'Form field borders' },
  { fg: 'primary', bg: 'white', min: 3, where: 'Focus ring on light sections' },
  { fg: 'cta', bg: 'primary', min: 3, where: 'Focus ring on dark sections' },
]

export function tokenHex(name: string): string {
  if (name === 'white') return '#FFFFFF'
  const token = colorTokens.find((candidate) => candidate.name === name)
  if (!token) throw new Error(`Unknown colour token: ${name}`)
  return token.hex
}
