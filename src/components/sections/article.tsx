import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { CmsImage } from '@/components/cms-image'
import { CallLink } from '@/components/layout/contact-links'
import { Prose } from '@/components/rich-text'
import { splitAtMiddle, tableOfContents, type RichContent } from '@/lib/rich-text'
import { SampleBadge } from '@/components/sample-badge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { postCategory } from '@/config/content'
import type { QuoteCta } from '@/lib/quote/flow'
import { routes } from '@/lib/routes'
import { fillTokens, telHref } from '@/lib/text'
import { cn } from '@/lib/utils'
import { asMedia, formatDate } from '@/lib/view'
import type { Post, Solution, TeamMember } from '@/payload-types'

/** Blog post card for listings and "latest articles". */
export function PostCard({
  post,
  headingLevel = 'h3',
}: {
  post: Pick<
    Post,
    'title' | 'slug' | 'excerpt' | 'category' | 'publishedAt' | 'heroImage' | 'heroImageLabel'
  >
  headingLevel?: 'h2' | 'h3'
}) {
  const Heading = headingLevel
  const category = postCategory(post.category)
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-card border border-border bg-white">
      <CmsImage
        media={post.heroImage}
        label={post.heroImageLabel}
        ratio="16/9"
        sizes="(min-width: 768px) 33vw, 100vw"
        className="rounded-none"
      />
      <div className="flex flex-1 flex-col p-6">
        <Badge tone={category.tone} className="w-fit">
          {category.short}
        </Badge>
        <Heading className="mt-3 text-h3">
          <Link href={routes.post(post.slug)} className="text-primary no-underline hover:underline">
            {post.title}
          </Link>
        </Heading>
        <p className="mt-2 text-muted">{post.excerpt}</p>
        <p className="mt-auto pt-4 text-small text-muted">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        </p>
      </div>
    </article>
  )
}

function TableOfContents({ content, className }: { content: RichContent; className?: string }) {
  const entries = tableOfContents(content)
  if (entries.length < 2) return null
  return (
    <nav
      aria-labelledby="toc-heading"
      className={cn('rounded-card border border-border bg-surface p-5', className)}
    >
      <p id="toc-heading" className="font-heading font-bold text-primary">
        On this page
      </p>
      <ol className="mt-3 grid gap-1 text-small">
        {entries.map((entry) => (
          <li key={entry.id} className={cn(entry.level === 3 && 'pl-4')}>
            <a
              href={`#${entry.id}`}
              className="block py-1.5 text-ink no-underline hover:text-primary hover:underline"
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

/** The call to action placed halfway through an article. */
function ArticleCta({ cta, phone, topic }: { cta: QuoteCta; phone: string; topic?: string }) {
  return (
    <aside
      aria-labelledby="article-cta-heading"
      className="my-10 max-w-[70ch] rounded-card border-l-4 border-cta bg-surface p-6"
    >
      <p id="article-cta-heading" className="font-heading text-xl font-bold text-primary">
        Rather leave it to us?
      </p>
      <p className="mt-2 text-muted">
        {topic
          ? `Tell us about your property and we’ll price your ${topic} job. No obligation.`
          : 'Tell us about your property and we’ll give you a price. No obligation.'}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button asChild>
          <Link href={cta.href}>{cta.label}</Link>
        </Button>
        {telHref(phone) && (
          <CallLink phone={phone} label={`or call ${phone}`} className="font-semibold" />
        )}
      </div>
    </aside>
  )
}

/**
 * Article body (brief §9.7): table of contents (sticky beside the text on wide screens), the
 * content with a call to action in the middle, then whatever follows (e.g. the author box).
 */
export function ArticleBody({
  content,
  cta,
  phone,
  topic,
  children,
}: {
  content: RichContent
  cta: QuoteCta
  phone: string
  topic?: string
  children?: React.ReactNode
}) {
  const [first, second] = splitAtMiddle(content)
  const callToAction = <ArticleCta cta={cta} phone={phone} topic={topic} />
  return (
    <div className="container grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_16rem] lg:py-16">
      <TableOfContents
        content={content}
        className="lg:sticky lg:top-28 lg:col-start-2 lg:row-start-1 lg:self-start"
      />
      <div className="min-w-0 lg:col-start-1 lg:row-start-1">
        <Prose content={first} />
        {callToAction}
        {second && <Prose content={second} />}
        {children}
      </div>
    </div>
  )
}

/** "Written by" box. Renders nothing when the author is missing or hidden (e.g. a sample). */
export function AuthorBox({
  author,
  region,
}: {
  author: number | TeamMember | null | undefined
  region: string
}) {
  if (!author || typeof author !== 'object') return null
  return (
    <aside
      aria-labelledby="author-heading"
      className="mt-12 flex max-w-[70ch] flex-col gap-5 rounded-card border border-border p-6 sm:flex-row"
    >
      {asMedia(author.photo) && (
        <CmsImage media={author.photo} ratio="1/1" sizes="96px" className="w-24 shrink-0" />
      )}
      <div>
        <p className="text-small font-semibold tracking-wide text-secondary-strong uppercase">
          Written by
        </p>
        <p id="author-heading" className="mt-1 font-heading text-xl font-bold text-primary">
          {author.name}
          <SampleBadge show={author.isSample} className="ml-2 align-middle" />
        </p>
        <p className="text-muted">{author.role}</p>
        <p className="mt-2">{fillTokens(author.shortBio, { region })}</p>
        <Link
          href={routes.teamMember(author.slug)}
          className="mt-2 inline-flex min-h-11 items-center gap-2 font-semibold"
        >
          More about {author.name.split(' ')[0]} <ArrowRight aria-hidden className="size-4" />
        </Link>
      </div>
    </aside>
  )
}

/** Solution card: the problem in the customer's words and a link to the fix. */
export function SolutionCard({
  solution,
  region,
}: {
  solution: Pick<Solution, 'title' | 'slug' | 'problem' | 'heroImage' | 'heroImageLabel'>
  region: string
}) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-card border border-border bg-white">
      <CmsImage
        media={solution.heroImage}
        label={solution.heroImageLabel}
        ratio="16/9"
        sizes="(min-width: 768px) 33vw, 100vw"
        className="rounded-none"
      />
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-h3">
          <Link
            href={routes.solution(solution.slug)}
            className="text-primary no-underline hover:underline"
          >
            {fillTokens(solution.title, { region })}
          </Link>
        </h3>
        <p className="mt-2 text-muted">{fillTokens(solution.problem, { region })}</p>
        <p className="mt-auto inline-flex items-center gap-2 pt-4 font-semibold text-secondary-strong">
          See the fix <ArrowRight aria-hidden className="size-4" />
        </p>
      </div>
    </article>
  )
}
