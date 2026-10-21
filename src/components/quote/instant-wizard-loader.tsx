'use client'

import dynamic from 'next/dynamic'

/**
 * The wizard runs in the browser only: it restores saved progress from localStorage and reads
 * ?service= / ?plan=, neither of which exists on the server.
 */
export const InstantWizardLoader = dynamic(
  () => import('./instant-wizard').then((module) => module.InstantWizard),
  {
    ssr: false,
    loading: () => (
      <p role="status" className="rounded-card bg-surface p-6 text-muted">
        Loading the price calculator…
      </p>
    ),
  },
)
