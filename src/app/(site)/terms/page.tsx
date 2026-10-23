import { LegalDocument, legalMetadata } from '@/components/sections/legal'
import { routes } from '@/lib/routes'

export const generateMetadata = () => legalMetadata('terms', routes.terms)

export default function TermsPage() {
  return <LegalDocument page="terms" path={routes.terms} />
}
