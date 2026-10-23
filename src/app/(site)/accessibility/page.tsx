import { LegalDocument, legalMetadata } from '@/components/sections/legal'
import { routes } from '@/lib/routes'

export const generateMetadata = () => legalMetadata('accessibility', routes.accessibility)

export default function AccessibilityPage() {
  return <LegalDocument page="accessibility" path={routes.accessibility} />
}
