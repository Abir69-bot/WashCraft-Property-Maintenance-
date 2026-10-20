import Link from 'next/link'

import { Logo } from '@/components/brand/logo'
import { site } from '@/config/site'
import { isProductionSite } from '@/lib/env'

// Temporary holding page. The full home page (brief §9.1) replaces it in Phase 3.
export default function HomePage() {
  return (
    <section className="container grid gap-6 section-y">
      <Logo height={160} priority />
      <h1>{site.name}</h1>
      <p className="max-w-prose text-muted">Our new website is on its way.</p>
      {!isProductionSite && (
        <p>
          <Link href="/styleguide">View the styleguide</Link> · <Link href="/admin">Admin</Link>
        </p>
      )}
    </section>
  )
}
