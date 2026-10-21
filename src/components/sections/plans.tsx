import { Check } from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SEASON_LABELS, type Season } from '@/config/catalog'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils'
import type { Plan, Service } from '@/payload-types'

import { planPrice } from './home-blocks'
import { Section, type SectionTone } from './section'

/** Opens the instant-price wizard with the plan's services pre-selected (brief §9.6). */
const planHref = (plan: Plan) => `${routes.quoteInstant}?plan=${plan.id}`

const planServices = (plan: Plan) =>
  (plan.services ?? []).filter((service): service is Service => typeof service === 'object')

function PriceTag({ plan }: { plan: Plan }) {
  const price = planPrice(plan)
  return (
    <>
      <span className="text-h3 font-heading font-extrabold text-primary">
        {price ?? 'Custom quote'}
      </span>
      {price && plan.needsReview && (
        <Badge tone="sample" className="mt-1 w-fit">
          Placeholder price
        </Badge>
      )}
    </>
  )
}

/** Plan or package cards with a quote button each. */
export function PlanCards({
  id,
  plans,
  eyebrow,
  title,
  intro,
  tone,
}: {
  id: string
  plans: Plan[]
  eyebrow: string
  title: string
  intro?: string
  tone?: SectionTone
}) {
  if (plans.length === 0) return null
  return (
    <Section id={id} tone={tone} eyebrow={eyebrow} title={title} intro={intro}>
      <ul
        className={cn(
          'grid gap-6 md:grid-cols-2',
          plans.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4',
        )}
      >
        {plans.map((plan) => (
          <li
            key={plan.id}
            className={cn(
              'flex flex-col rounded-card border bg-white p-6',
              plan.highlighted ? 'border-2 border-primary shadow-lg' : 'border-border',
            )}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3>{plan.name}</h3>
              {plan.highlighted && <Badge tone="interior">Recommended</Badge>}
              {plan.season && <Badge tone="neutral">{SEASON_LABELS[plan.season as Season]}</Badge>}
            </div>
            <p className="mt-2 text-muted">{plan.tagline}</p>
            <p className="mt-4 flex flex-col">
              <PriceTag plan={plan} />
            </p>
            <ul className="mt-4 grid gap-2">
              {plan.features.map((feature) => (
                <li key={feature.id ?? feature.text} className="flex items-start gap-2">
                  <Check aria-hidden className="mt-1 size-4 shrink-0 text-success-strong" />
                  {feature.text}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-6">
              <Button asChild variant={plan.highlighted ? 'cta' : 'outline'}>
                <Link href={planHref(plan)} aria-label={`Get a price for ${plan.name}`}>
                  Get a price
                </Link>
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  )
}

/** Side-by-side comparison of plans (brief §9.6), scrollable on phones. */
export function PlanTable({
  id,
  plans,
  title,
  tone,
}: {
  id: string
  plans: Plan[]
  title: string
  tone?: SectionTone
}) {
  if (plans.length === 0) return null
  return (
    <Section id={id} tone={tone} eyebrow="Compare" title={title}>
      <div
        role="region"
        aria-label={title}
        tabIndex={0}
        className="overflow-x-auto rounded-card border border-border bg-white"
      >
        <table className="w-full min-w-2xl text-left">
          <caption className="sr-only">{title}</caption>
          <thead className="bg-primary text-white">
            <tr>
              <th scope="col" className="p-4">
                <span className="sr-only">Plan detail</span>
              </th>
              {plans.map((plan) => (
                <th key={plan.id} scope="col" className="p-4 font-heading">
                  {plan.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="align-top">
            <tr className="border-t border-border">
              <th scope="row" className="p-4 font-semibold">
                Price
              </th>
              {plans.map((plan) => (
                <td key={plan.id} className="p-4">
                  <span className="flex flex-col">
                    <PriceTag plan={plan} />
                  </span>
                </td>
              ))}
            </tr>
            <tr className="border-t border-border">
              <th scope="row" className="p-4 font-semibold">
                Best for
              </th>
              {plans.map((plan) => (
                <td key={plan.id} className="p-4 text-muted">
                  {plan.tagline}
                </td>
              ))}
            </tr>
            <tr className="border-t border-border">
              <th scope="row" className="p-4 font-semibold">
                What’s included
              </th>
              {plans.map((plan) => (
                <td key={plan.id} className="p-4">
                  <ul className="grid gap-1">
                    {plan.features.map((feature) => (
                      <li key={feature.id ?? feature.text} className="flex items-start gap-2">
                        <Check aria-hidden className="mt-1 size-4 shrink-0 text-success-strong" />
                        {feature.text}
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
            <tr className="border-t border-border">
              <th scope="row" className="p-4 font-semibold">
                Services
              </th>
              {plans.map((plan) => (
                <td key={plan.id} className="p-4">
                  <ul className="grid gap-1">
                    {planServices(plan).map((service) => (
                      <li key={service.id}>
                        <Link href={routes.service(service.slug)}>{service.title}</Link>
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </Section>
  )
}
