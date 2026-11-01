import Link from 'next/link'

import { JsonLd } from '@/components/json-ld'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { FaqEntry } from '@/lib/faqs'
import { routes } from '@/lib/routes'
import { faqPage } from '@/lib/seo/json-ld'
import { fillTokens } from '@/lib/text'

import { Section, type SectionTone } from './section'

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
  const filled = faqs.map((faq) => ({
    id: faq.id,
    question: fillTokens(faq.question, { region }),
    answer: fillTokens(faq.answer, { region }),
  }))
  return (
    <Section id={id} tone={tone} eyebrow="FAQ" title={title}>
      <JsonLd data={faqPage(filled)} />
      <Accordion type="multiple" className="max-w-3xl">
        {filled.map((faq) => (
          <AccordionItem key={faq.id} value={String(faq.id)}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Link href={routes.faq} className="mt-6 inline-block font-semibold">
        More questions and answers
      </Link>
    </Section>
  )
}
