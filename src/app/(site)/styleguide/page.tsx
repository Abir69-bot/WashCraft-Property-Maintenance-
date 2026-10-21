import {
  ArrowRight,
  Building2,
  Droplets,
  Gift,
  House,
  Info,
  Leaf,
  MessageSquare,
  Phone,
  Snowflake,
} from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Logo } from '@/components/brand/logo'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { FormField } from '@/components/ui/form-field'
import { Input, Textarea } from '@/components/ui/input'
import { NativeSelect } from '@/components/ui/native-select'
import { PhotoPlaceholder } from '@/components/ui/photo-placeholder'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SiteValue, TodoChip } from '@/components/ui/todo-chip'
import { colorTokens, contrastPairs, tokenHex } from '@/config/brand-tokens'
import { site, type DemoField } from '@/config/site'
import { contrastRatio } from '@/lib/contrast'
import { isProductionSite } from '@/lib/env'

export const metadata: Metadata = {
  title: 'Styleguide',
  robots: { index: false, follow: false },
}

const SECTIONS = [
  ['colors', 'Colors'],
  ['typography', 'Typography'],
  ['layout', 'Layout'],
  ['buttons', 'Buttons'],
  ['forms', 'Form fields'],
  ['badges', 'Badges'],
  ['interactive', 'Interactive'],
  ['photos', 'Photo placeholders'],
  ['logo', 'Logo'],
  ['facts', 'Site facts'],
] as const

function Block({
  id,
  title,
  children,
}: {
  id: (typeof SECTIONS)[number][0]
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="border-t border-border py-12">
      <h2 id={`${id}-title`} className="mb-6">
        {title}
      </h2>
      {children}
    </section>
  )
}

const SITE_FACTS: { field: DemoField; label: string; value: string }[] = [
  { field: 'tagline', label: 'tagline', value: site.tagline },
  { field: 'phone', label: 'phone', value: site.phone },
  { field: 'email', label: 'email', value: site.email },
  {
    field: 'address',
    label: 'address',
    value: site.address ?? 'Service-area business (no street address shown)',
  },
  { field: 'hours', label: 'hours', value: site.hours },
  { field: 'country', label: 'country', value: site.country },
  { field: 'currency', label: 'currency', value: site.currency },
  { field: 'locale', label: 'locale', value: site.locale },
  { field: 'region', label: 'region', value: site.region },
  ...site.serviceAreas.map((city, index) => ({
    field: 'serviceAreas' as const,
    label: `service area ${index + 1}`,
    value: city,
  })),
]

export default function StyleguidePage() {
  if (isProductionSite) notFound()

  return (
    <div className="container pb-24">
      <header className="section-y pb-8">
        <p className="font-semibold text-secondary-strong">Development only</p>
        <h1>WashCraft styleguide</h1>
        <p className="mt-4 max-w-prose text-muted">
          Tokens, type and every component state. Hidden in production.
        </p>
        <nav aria-label="Styleguide sections" className="mt-6">
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {SECTIONS.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`}>{label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <Block id="colors" title="Colors">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {colorTokens.map((token) => (
            <li key={token.name} className="overflow-hidden rounded-card border border-border">
              <div className="h-16" style={{ backgroundColor: token.hex }} />
              <div className="p-3">
                <p className="font-mono text-small font-semibold">--{token.name}</p>
                <p className="font-mono text-small text-muted">{token.hex}</p>
                <p className="mt-1 text-small">{token.use}</p>
              </div>
            </li>
          ))}
        </ul>

        <h3 className="mt-10 mb-4">Contrast pairs</h3>
        <div
          role="region"
          aria-label="Contrast pairs table"
          tabIndex={0}
          className="overflow-x-auto"
        >
          <table className="w-full min-w-xl text-left text-small">
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="py-2 pr-4">
                  Sample
                </th>
                <th scope="col" className="py-2 pr-4">
                  Pair
                </th>
                <th scope="col" className="py-2 pr-4">
                  Ratio
                </th>
                <th scope="col" className="py-2">
                  Used for
                </th>
              </tr>
            </thead>
            <tbody>
              {contrastPairs.map((pair) => {
                const ratio = contrastRatio(tokenHex(pair.fg), tokenHex(pair.bg))
                return (
                  <tr key={`${pair.fg}-${pair.bg}-${pair.min}`} className="border-b border-border">
                    <td className="py-2 pr-4">
                      <span
                        className="inline-block rounded-md px-3 py-1 font-semibold"
                        style={{ color: tokenHex(pair.fg), backgroundColor: tokenHex(pair.bg) }}
                      >
                        Aa Sample
                      </span>
                    </td>
                    <td className="py-2 pr-4 font-mono">
                      {pair.fg} / {pair.bg}
                    </td>
                    <td className="py-2 pr-4">
                      {ratio.toFixed(2)}:1{' '}
                      <span className="font-semibold text-success-strong">
                        (needs {pair.min}:1)
                      </span>
                    </td>
                    <td className="py-2">{pair.where}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Block>

      <Block id="typography" title="Typography">
        <div className="grid gap-6">
          <div>
            <p className="text-small text-muted">H1 · Plus Jakarta Sans 800 · 34 → 48px</p>
            <p className="text-h1 text-primary">Gutters cleared before the fall rain</p>
          </div>
          <div>
            <p className="text-small text-muted">H2 · Plus Jakarta Sans 700 · 28 → 36px</p>
            <p className="text-h2 text-primary">How it works</p>
          </div>
          <div>
            <p className="text-small text-muted">H3 · Plus Jakarta Sans 700 · 20 → 24px</p>
            <p className="text-h3 text-primary">Soft washing for delicate siding</p>
          </div>
          <div>
            <p className="text-small text-muted">Body · Inter 400 · 16 → 17px · line-height 1.6</p>
            <p className="max-w-prose">
              We rinse the whole house at low pressure, so paint, seals and window frames stay
              intact. Most homes take half a day, and you don&apos;t need to be home. Read about{' '}
              <a href="#typography">our soft-washing method</a>.
            </p>
          </div>
          <div>
            <p className="text-small text-muted">Small · Inter 400 · 14px</p>
            <p className="text-small text-muted">Prices include all equipment and clean-up.</p>
          </div>
        </div>
      </Block>

      <Block id="layout" title="Layout">
        <ul className="grid gap-3">
          {[8, 16, 24, 32, 48, 64, 96].map((size) => (
            <li key={size} className="flex items-center gap-4">
              <span className="w-14 font-mono text-small">{size}px</span>
              <span className="h-4 rounded-sm bg-secondary" style={{ width: size }} />
            </li>
          ))}
        </ul>
        <dl className="mt-8 grid gap-2 text-small sm:grid-cols-[max-content_1fr] sm:gap-x-6">
          <dt className="font-semibold">Container</dt>
          <dd>1200px max, 24px gutters (16px below 480px)</dd>
          <dt className="font-semibold">Section padding</dt>
          <dd>56px mobile, 96px from 1024px</dd>
          <dt className="font-semibold">Breakpoints</dt>
          <dd>sm 480 · md 768 · lg 1024 · xl 1280</dd>
          <dt className="font-semibold">Radius</dt>
          <dd>12px cards, pill buttons</dd>
          <dt className="font-semibold">Tap targets</dt>
          <dd>44px minimum</dd>
        </dl>
      </Block>

      <Block id="buttons" title="Buttons">
        <div className="grid gap-8">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Get instant price</Button>
            <Button variant="primary">Book this</Button>
            <Button variant="outline">Request a call-back</Button>
            <Button variant="ghost">Cancel</Button>
            <Button variant="link">See all services</Button>
            <Button disabled>Sending…</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">
              Large <ArrowRight aria-hidden />
            </Button>
            <Button size="icon" variant="outline" aria-label="Call us">
              <Phone aria-hidden />
            </Button>
            <Button asChild variant="outline">
              <Link href="#buttons">
                <MessageSquare aria-hidden /> Link styled as a button
              </Link>
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-3 rounded-card on-dark p-6">
            <Button>Get instant price</Button>
            <Button variant="inverse">
              <Phone aria-hidden /> Call us
            </Button>
            <a href="#buttons">Plain link on dark</a>
          </div>
        </div>
      </Block>

      <Block id="forms" title="Form fields">
        <form className="grid max-w-xl gap-6" noValidate>
          <FormField id="sg-name" label="Your name">
            {(control) => <Input {...control} autoComplete="name" />}
          </FormField>
          <FormField
            id="sg-zip"
            label="ZIP code"
            hint="We use it to check that you're in our service area."
          >
            {(control) => <Input {...control} autoComplete="postal-code" />}
          </FormField>
          <FormField id="sg-phone" label="Phone" error="Enter a phone number with area code">
            {(control) => <Input {...control} type="tel" autoComplete="tel" defaultValue="555" />}
          </FormField>
          <FormField id="sg-email" label="Email" optional>
            {(control) => <Input {...control} type="email" autoComplete="email" />}
          </FormField>
          <FormField id="sg-disabled" label="Disabled field" optional>
            {(control) => <Input {...control} disabled defaultValue="Not editable" />}
          </FormField>
          <FormField id="sg-service" label="Service">
            {(control) => (
              <NativeSelect {...control} defaultValue="">
                <option value="" disabled>
                  Choose a service
                </option>
                <optgroup label="Exterior cleaning">
                  <option>Gutter cleaning</option>
                  <option>Window cleaning</option>
                </optgroup>
                <optgroup label="Winter services">
                  <option>Driveway snow clearing</option>
                </optgroup>
              </NativeSelect>
            )}
          </FormField>
          <FormField id="sg-notes" label="Anything else we should know?" optional>
            {(control) => <Textarea {...control} />}
          </FormField>
          <Checkbox
            id="sg-consent"
            label="Text me about my quote. Reply STOP at any time to opt out."
          />
          <div>
            <Button type="button">Get my quote</Button>
          </div>
        </form>
      </Block>

      <Block id="badges" title="Badges">
        <div className="flex flex-wrap gap-3">
          <Badge tone="exterior">
            <Droplets aria-hidden /> Exterior
          </Badge>
          <Badge tone="interior">
            <House aria-hidden /> Interior
          </Badge>
          <Badge tone="winter">
            <Snowflake aria-hidden /> Winter
          </Badge>
          <Badge tone="holiday">
            <Gift aria-hidden /> Holiday
          </Badge>
          <Badge tone="yard">
            <Leaf aria-hidden /> Yard care
          </Badge>
          <Badge tone="commercial">
            <Building2 aria-hidden /> Commercial
          </Badge>
          <Badge tone="success">Booking open</Badge>
          <Badge>Neutral</Badge>
          <Badge tone="sample">Sample</Badge>
        </div>
      </Block>

      <Block id="interactive" title="Interactive">
        <div className="grid gap-12">
          <Tabs defaultValue="moss">
            <TabsList aria-label="Roof cleaning benefits">
              <TabsTrigger value="moss">Stops moss</TabsTrigger>
              <TabsTrigger value="life">Longer roof life</TabsTrigger>
              <TabsTrigger value="curb">Curb appeal</TabsTrigger>
            </TabsList>
            <TabsContent value="moss">Moss holds water against shingles. We remove it.</TabsContent>
            <TabsContent value="life">Clean shingles shed water and last longer.</TabsContent>
            <TabsContent value="curb">A clean roof makes the whole house look newer.</TabsContent>
          </Tabs>

          <Accordion type="single" collapsible className="max-w-2xl">
            <AccordionItem value="home">
              <AccordionTrigger>Do I need to be home?</AccordionTrigger>
              <AccordionContent>No. We only need access to an outdoor tap.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="weather">
              <AccordionTrigger>What if it rains?</AccordionTrigger>
              <AccordionContent>Light rain is fine. We reschedule for storms.</AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex flex-wrap gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Open dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Centred dialog</DialogTitle>
                <DialogDescription>Focus is trapped here. Press Esc to close.</DialogDescription>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Open slide-in panel</Button>
              </DialogTrigger>
              <DialogContent side="right">
                <DialogTitle>Get a quick quote</DialogTitle>
                <DialogDescription>Used for the desktop slide-in quote form.</DialogDescription>
              </DialogContent>
            </Dialog>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost">
                  <Info aria-hidden /> What affects the price?
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                Size, height, access and how long since the last clean.
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </Block>

      <Block id="photos" title="Photo placeholders">
        <div className="grid gap-6 md:grid-cols-3">
          <PhotoPlaceholder ratio="16/9" label="Crew soft-washing a two-story house" />
          <PhotoPlaceholder ratio="4/3" label="Cleared driveway after a snowfall" />
          <PhotoPlaceholder ratio="1/1" label="Founder portrait outdoors, natural light" />
        </div>
      </Block>

      <Block id="logo" title="Logo">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex items-center justify-center gap-8 rounded-card border border-border p-8">
            <Logo height={160} />
            <Logo height={64} />
            <Logo height={40} />
          </div>
          <div className="flex items-center justify-center gap-8 rounded-card on-dark p-8">
            <Logo height={160} />
            <Logo height={64} />
            <Logo height={40} />
          </div>
        </div>
      </Block>

      <Block id="facts" title="Site facts">
        <p className="mb-4 max-w-prose text-muted">
          Unset values show as <TodoChip label="example" />. Values marked{' '}
          <Badge tone="sample">Demo</Badge> are stand-ins. Production builds fail until every
          required value is set and confirmed (<code>pnpm check-config</code>).
        </p>
        <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-[max-content_1fr]">
          {SITE_FACTS.map(({ field, label, value }) => (
            <div key={label} className="contents">
              <dt className="font-semibold">{label}</dt>
              <dd className="flex flex-wrap items-center gap-2">
                <SiteValue value={value} label={label} />
                {site.demo.includes(field) && <Badge tone="sample">Demo</Badge>}
              </dd>
            </div>
          ))}
        </dl>
      </Block>
    </div>
  )
}
