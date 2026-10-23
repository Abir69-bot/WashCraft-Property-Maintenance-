'use client'

import { Search } from 'lucide-react'
import Link from 'next/link'
import { useId, useState } from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils'

export type FaqGroup = {
  value: string
  label: string
  faqs: { id: number; question: string; answer: string }[]
}

/**
 * The FAQ page's grouped accordions with a search box (brief §9.7). Every answer is in the
 * server-rendered HTML; searching only hides what doesn't match.
 */
export function FaqSearch({ groups }: { groups: FaqGroup[] }) {
  const id = useId()
  const [query, setQuery] = useState('')
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  const matches = (faq: FaqGroup['faqs'][number]) => {
    const text = `${faq.question} ${faq.answer}`.toLowerCase()
    return words.every((word) => text.includes(word))
  }
  const total = groups.reduce((sum, group) => sum + group.faqs.length, 0)
  const found = groups.reduce((sum, group) => sum + group.faqs.filter(matches).length, 0)

  return (
    <div className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <label htmlFor={`${id}-search`} className="mb-1 block font-semibold">
          Search questions
        </label>
        <div className="relative">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted"
          />
          <Input
            id={`${id}-search`}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="pl-10"
            autoComplete="off"
          />
        </div>
        <p role="status" className="mt-3 text-small text-muted">
          {words.length ? `${found} of ${total} questions match` : `${total} questions`}
        </p>
        <nav aria-label="Question topics" className="mt-6 hidden lg:block">
          <ul className="grid gap-1">
            {groups.map((group) => (
              <li key={group.value}>
                <a
                  href={`#${id}-${group.value}`}
                  className="block py-1.5 text-ink no-underline hover:text-primary hover:underline"
                >
                  {group.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="min-w-0">
        {found === 0 && (
          <p className="rounded-card bg-surface p-6">
            No questions match “{query}”. Try another word, or{' '}
            <Link href={routes.contact}>ask us directly</Link>.
          </p>
        )}
        {groups.map((group) => {
          const visible = group.faqs.filter(matches)
          return (
            <section
              key={group.value}
              id={`${id}-${group.value}`}
              aria-labelledby={`${id}-${group.value}-heading`}
              className={cn('scroll-mt-28 not-first:mt-12', visible.length === 0 && 'hidden')}
            >
              <h2 id={`${id}-${group.value}-heading`} className="text-h3">
                {group.label}
              </h2>
              <Accordion type="multiple" className="mt-2">
                {visible.map((faq) => (
                  <AccordionItem key={faq.id} value={String(faq.id)}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          )
        })}
      </div>
    </div>
  )
}
