import { fillTokens, toSlug, type TokenValues } from '@/lib/text'

/** Rich text as stored by Payload (posts, solutions, legal pages). */
export type RichContent = { root: { children: { type: unknown; [key: string]: unknown }[] } }

export type RichNode = { type?: unknown; text?: unknown; tag?: unknown; children?: RichNode[] }

/** The plain text inside a node, e.g. a heading's words. */
export function nodeText(node: RichNode): string {
  if (typeof node.text === 'string') return node.text
  return (node.children ?? []).map(nodeText).join('')
}

/** Fills {region} and friends in every text node (the CMS stores the tokens, not the text). */
export function fillContentTokens(content: RichContent, values: TokenValues): RichContent {
  const fill = (node: RichNode): RichNode => ({
    ...node,
    ...(typeof node.text === 'string' && { text: fillTokens(node.text, values) }),
    ...(node.children && { children: node.children.map(fill) }),
  })
  return {
    ...content,
    root: {
      ...content.root,
      children: content.root.children.map(fill) as RichContent['root']['children'],
    },
  }
}

type LinkNode = RichNode & { fields?: { url?: unknown } }

/**
 * Turns links to service pages that aren't published (unconfirmed services) into plain text, so
 * articles never link to a missing page or advertise a service that isn't offered.
 */
export function unlinkUnpublishedServices(
  content: RichContent,
  publishedSlugs: string[],
): RichContent {
  const live = new Set(publishedSlugs)
  const unlink = (nodes: RichNode[]): RichNode[] =>
    nodes.flatMap((node) => {
      const url = (node as LinkNode).fields?.url
      const slug =
        node.type === 'link' && typeof url === 'string'
          ? url.match(/^\/services\/([^/?#]+)\/?(?:[?#].*)?$/)?.[1]
          : undefined
      if (slug && !live.has(slug)) return unlink(node.children ?? [])
      return [node.children ? { ...node, children: unlink(node.children) } : node]
    })
  return {
    ...content,
    root: {
      ...content.root,
      children: unlink(content.root.children as RichNode[]) as RichContent['root']['children'],
    },
  }
}

/** A heading's anchor, e.g. "The short answer" → "the-short-answer". */
export const headingId = (node: RichNode) => toSlug(nodeText(node)) || 'section'

export type TocEntry = { id: string; text: string; level: 2 | 3 }

/** h2/h3 headings for an article's table of contents. */
export function tableOfContents(content: RichContent): TocEntry[] {
  return (content.root.children as RichNode[])
    .filter((node) => node.type === 'heading' && (node.tag === 'h2' || node.tag === 'h3'))
    .map((node) => ({
      id: headingId(node),
      text: nodeText(node),
      level: node.tag === 'h2' ? 2 : 3,
    }))
}

/**
 * Splits an article in two at the h2 closest to its middle, for a call to action in between.
 * Short articles (fewer than two h2 sections) come back whole.
 */
export function splitAtMiddle(content: RichContent): [RichContent, RichContent | null] {
  const children = content.root.children as RichNode[]
  const sections = children.flatMap((node, index) =>
    node.type === 'heading' && node.tag === 'h2' && index > 0 ? [index] : [],
  )
  if (sections.length < 2) return [content, null]
  const middle = sections.reduce((best, index) =>
    Math.abs(index - children.length / 2) < Math.abs(best - children.length / 2) ? index : best,
  )
  const part = (nodes: RichNode[]) =>
    ({ ...content, root: { ...content.root, children: nodes } }) as RichContent
  return [part(children.slice(0, middle)), part(children.slice(middle))]
}
