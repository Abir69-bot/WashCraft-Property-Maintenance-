import type { Thing, WithContext } from 'schema-dts'

/** Renders structured data. `<` is escaped so text from the CMS can't close the script tag. */
export function JsonLd({ data }: { data: WithContext<Thing> | WithContext<Thing>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
