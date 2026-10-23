import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { CmsImage } from '@/components/cms-image'
import { ArticleBody, AuthorBox, PostCard } from '@/components/sections/article'
import { FinalCta } from '@/components/sections/home-blocks'
import { PageHero } from '@/components/sections/page-hero'
import { Section } from '@/components/sections/section'
import { RelatedLinks } from '@/components/sections/service-blocks'
import { postCategory } from '@/config/content'
import { getPostList } from '@/lib/data/content'
import { loadPost } from '@/lib/data/load'
import { quoteCta } from '@/lib/quote/flow'
import { fillContentTokens, type RichContent } from '@/lib/rich-text'
import { routes } from '@/lib/routes'
import { pageMetadata } from '@/lib/seo/metadata'
import { fillTokens } from '@/lib/text'
import { asMedia, formatDate } from '@/lib/view'
import type { Service } from '@/payload-types'

export async function generateStaticParams() {
  const posts = await getPostList()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: PageProps<'/blog/[slug]'>): Promise<Metadata> {
  const { layout, page } = await loadPost((await params).slug)
  if (!page) return {}
  const region = layout.site.region
  return pageMetadata({
    path: routes.post(page.slug),
    title: fillTokens(page.title, { region }),
    description: fillTokens(page.excerpt, { region }),
    seo: page.meta,
    image: asMedia(page.heroImage),
    siteName: layout.site.shortName,
  })
}

const docs = <T,>(items: (number | T)[] | null | undefined) =>
  (items ?? []).filter((item): item is T => typeof item === 'object')

/** Blog article (brief §9.7): contents, mid-article CTA, author, related services and posts. */
export default async function PostPage({ params }: PageProps<'/blog/[slug]'>) {
  const { layout, page: post } = await loadPost((await params).slug)
  if (!post) notFound()
  const { site } = layout
  const region = site.region
  const services = docs<Service>(post.relatedServices).filter((service) => service.enabled)
  const cta = services[0]
    ? quoteCta(services[0])
    : { href: routes.quoteInstant, label: 'Get instant price' }
  // Chosen related posts, topped up with the newest others in the same category. Cards come
  // from the listing, which has their photos.
  const chosenIds = (post.relatedPosts ?? []).map((doc) => (typeof doc === 'object' ? doc.id : doc))
  const listing = (await getPostList()).filter((other) => other.id !== post.id)
  const chosen = listing.filter((other) => chosenIds.includes(other.id))
  const others = listing.filter((other) => !chosenIds.includes(other.id))
  const morePosts = [
    ...chosen,
    ...others.filter((other) => other.category === post.category),
    ...others.filter((other) => other.category !== post.category),
  ].slice(0, 3)
  const category = postCategory(post.category)

  return (
    <>
      <PageHero
        crumbs={[
          { label: 'Blog', href: routes.blog },
          { label: post.title, href: routes.post(post.slug) },
        ]}
        eyebrow={category.label}
        title={fillTokens(post.title, { region })}
        intro={
          <>
            <p>{fillTokens(post.excerpt, { region })}</p>
            <p className="mt-3 text-base">
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            </p>
          </>
        }
        aside={
          <CmsImage
            media={post.heroImage}
            label={post.heroImageLabel}
            ratio="3/2"
            sizes="(min-width: 1024px) 560px, 100vw"
            priority
          />
        }
      />
      <ArticleBody
        content={fillContentTokens(post.content as RichContent, { region })}
        cta={cta}
        phone={site.phone}
        topic={services[0]?.title}
      >
        <AuthorBox author={post.author} region={region} />
      </ArticleBody>
      <RelatedLinks services={services} region={region} title="Services in this article" />
      {morePosts.length > 0 && (
        <Section id="more-articles" title="Keep reading">
          <ul className="grid gap-6 md:grid-cols-3">
            {morePosts.map((other) => (
              <li key={other.id}>
                <PostCard post={other} />
              </li>
            ))}
          </ul>
        </Section>
      )}
      <FinalCta region={region} cta={cta} />
    </>
  )
}
