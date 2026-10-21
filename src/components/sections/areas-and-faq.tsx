import { MapPin } from 'lucide-react'
import Link from 'next/link'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { AreaCity } from '@/lib/data/layout'
import type { FaqEntry } from '@/lib/faqs'
import { routes } from '@/lib/routes'
import { fillTokens } from '@/lib/text'

import { Section, type SectionTone } from './section'
import { ServiceAreaMap } from './service-area-map'
import { ZipChecker } from './zip-checker'

/** City grid, map and ZIP checker (brief §9.1.17). */
export function ServiceAreas({ cities, region }: { cities: AreaCity[]; region: string }) {
  if (cities.length === 0) return null
  return (
    <Section
      id="service-areas"
      tone="surface"
      eyebrow="Service areas"
      title={`Proudly serving ${region}`}
      intro="Find your city, or check your ZIP code."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="grid content-start gap-6">
          <ul className="grid grid-cols-2 gap-3">
            {cities.map((city) => (
              <li key={city.id}>
                <Link
                  href={routes.city(city.slug)}
                  className="flex min-h-12 items-center gap-2 rounded-card border border-border bg-white px-4 font-semibold no-underline hover:border-primary"
                >
                  <MapPin aria-hidden className="size-4 shrink-0 text-secondary-strong" />
                  {city.name}
                </Link>
              </li>
            ))}
          </ul>
          <ZipChecker cities={cities} />
        </div>
        <ServiceAreaMap cities={cities.map(({ name, lat, lng }) => ({ name, lat, lng }))} />
      </div>
    </Section>
  )
}

/** Accordion of questions. Answers stay in the HTML for search engines (brief §9.1.18). */
export function FaqList({
  faqs,
  region,
  title = 'Questions people ask',
  id = 'faq',
  tone,
}: {
  faqs: FaqEntry[]
  region: string
  title?: string
  id?: string
  tone?: SectionTone
}) {
  if (faqs.length === 0) return null
  return (
    <Section id={id} tone={tone} eyebrow="FAQ" title={title}>
      <Accordion type="multiple" className="max-w-3xl">
        {faqs.map((faq) => (
          <AccordionItem key={faq.id} value={String(faq.id)}>
            <AccordionTrigger>{fillTokens(faq.question, { region })}</AccordionTrigger>
            <AccordionContent>{fillTokens(faq.answer, { region })}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Link href={routes.faq} className="mt-6 inline-block font-semibold">
        More questions and answers
      </Link>
    </Section>
  )
}
