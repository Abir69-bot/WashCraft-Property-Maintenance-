'use client'

import { ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { routes } from '@/lib/routes'

export type ExplorerService = {
  slug: string
  title: string
  summary: string
  /** Drawn on the server, so the icon set never ships to the browser. */
  icon?: React.ReactNode
  bullets: string[]
  outcomeLabel: string
}

/** Tabbed service explorer (brief §9.1.5). Arrow keys move between tabs. */
export function ServiceExplorer({ services }: { services: ExplorerService[] }) {
  if (services.length === 0) return null
  return (
    <Tabs defaultValue={services[0].slug} className="mt-14">
      <TabsList aria-label="Featured services" className="w-full justify-start">
        {services.map((service) => (
          <TabsTrigger key={service.slug} value={service.slug}>
            {service.icon}
            {service.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {services.map((service) => (
        <TabsContent
          key={service.slug}
          value={service.slug}
          className="grid gap-6 rounded-card border border-border bg-white p-6 md:grid-cols-[1fr_auto] md:items-end md:p-10"
        >
          <div>
            <h3 className="text-h3">{service.title}</h3>
            <p className="mt-3 max-w-2xl text-muted">{service.summary}</p>
            <ul className="mt-5 grid gap-2">
              {service.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2">
                  <Check aria-hidden className="mt-1 size-4 shrink-0 text-success-strong" />
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
          <Button asChild size="lg">
            <Link href={routes.service(service.slug)}>
              {service.outcomeLabel} <ArrowRight aria-hidden />
            </Link>
          </Button>
        </TabsContent>
      ))}
    </Tabs>
  )
}
