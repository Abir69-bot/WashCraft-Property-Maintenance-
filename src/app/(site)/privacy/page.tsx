import { LegalDocument, legalMetadata } from '@/components/sections/legal'
import { routes } from '@/lib/routes'

export const generateMetadata = () => legalMetadata('privacy', routes.privacy)

export default function PrivacyPage() {
  return <LegalDocument page="privacy" path={routes.privacy} />
}
