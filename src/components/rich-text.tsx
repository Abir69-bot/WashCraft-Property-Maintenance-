import { RichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'

import { headingId, type RichContent, type RichNode } from '@/lib/rich-text'
import { cn } from '@/lib/utils'

type EditorState = Parameters<typeof RichText>[0]['data']

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  heading: ({ node, nodesToJSX }) => {
    const Tag = (['h2', 'h3', 'h4'].includes(node.tag) ? node.tag : 'h2') as 'h2' | 'h3' | 'h4'
    return (
      <Tag id={headingId(node as RichNode)} className="scroll-mt-28">
        {nodesToJSX({ nodes: node.children })}
      </Tag>
    )
  },
})

/** Rich text with the site's article styles and linkable headings (ids match the contents). */
export function Prose({ content, className }: { content: RichContent; className?: string }) {
  return (
    <RichText
      data={content as unknown as EditorState}
      converters={converters}
      className={cn('prose', className)}
    />
  )
}
