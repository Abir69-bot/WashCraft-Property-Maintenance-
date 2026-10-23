import type { Metadata } from 'next'

import { FilteredList } from '@/components/filtered-list'
import { PostCard } from '@/components/sections/article'
import { FinalCta } from '@/components/sections/home-blocks'
import { PageHero, QuoteActions } from '@/components/sections/page-hero'
import { Section } from '@/components/sections/section'
import { POST_CATEGORIES } from '@/config/content'
import { getPostList } from '@/lib/data/content'
import { getLayoutData } from '@/lib/data/layout'
import { routes } from '@/lib/routes'
import { pageMetadata } from '@/lib/seo/metadata'

const title = (region: string) => `Home Care Tips for ${region}`
const intro =
  'Practical advice for every season: cleaning, gutters, snow and ice, holiday lights and yard care. Written by the people who do the work.'

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getLayoutData()
  return pageMetadata({
    path: routes.blog,
    title: title(site.region),
    description: intro,
    siteName: site.shortName,
  })
}

/** Blog listing with category filter (brief §9.7). */
export default async function BlogPage() {
  const [{ site }, posts] = await Promise.all([getLayoutData(), getPostList()])

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Blog', href: routes.blog }]}
        eyebrow="Blog"
        title={title(site.region)}
        intro={intro}
        actions={
          <QuoteActions
            cta={{ href: routes.quoteInstant, label: 'Get instant price' }}
            phone={site.phone}
          />
        }
      />
      <Section id="articles" title="All articles">
        {posts.length > 0 ? (
          <FilteredList
            label="Filter by category"
            noun={['article', 'articles']}
            options={POST_CATEGORIES.map(({ value, label }) => ({ value, label }))}
            items={posts.map((post) => ({ key: post.slug, tags: [post.category] }))}
            cards={Object.fromEntries(
              posts.map((post) => [post.slug, <PostCard key={post.slug} post={post} />]),
            )}
            listClassName="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          />
        ) : (
          <p className="rounded-card bg-surface p-6">
            New articles are on the way. Check back soon.
          </p>
        )}
      </Section>
      <FinalCta region={site.region} />
    </>
  )
}
