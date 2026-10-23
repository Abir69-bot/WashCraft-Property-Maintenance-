import type { Field, GlobalConfig } from 'payload'

import { isSignedIn } from '@/access/roles'
import { photoLabelField, TOKENS_HINT } from '@/fields/common'

const editable = { read: () => true, update: isSignedIn }

const titled = (name: string, label: string, description?: string): Field => ({
  name,
  label,
  type: 'array',
  admin: description ? { description } : undefined,
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'body', type: 'textarea', required: true },
  ],
})

/** /about (brief §9.7). Every section hides itself until it has content. */
export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'About page',
  admin: { group: 'Pages', description: `Sections without content are hidden. ${TOKENS_HINT}` },
  access: editable,
  fields: [
    { name: 'headline', type: 'text', required: true },
    { name: 'intro', type: 'textarea', required: true },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    photoLabelField('heroImageLabel', 'Hero photo needed'),
    {
      name: 'story',
      type: 'textarea',
      admin: {
        description:
          'How WashCraft started and who is behind it, in your own words. Hidden until written.',
      },
    },
    { name: 'mission', type: 'textarea' },
    titled('values', 'Values'),
    {
      name: 'community',
      label: 'Community involvement',
      type: 'textarea',
      admin: { description: 'Local teams, causes or events you support. Hidden until written.' },
    },
    {
      name: 'certificates',
      label: 'Downloadable certificates',
      type: 'array',
      admin: {
        description:
          'e.g. certificate of insurance or a license, uploaded as PDFs to Media. Only add documents you are happy to publish.',
      },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'file', type: 'upload', relationTo: 'media', required: true },
      ],
    },
  ],
}

/** /careers (brief §9.7). Benefits stay hidden until the owner lists real ones. */
export const CareersPage: GlobalConfig = {
  slug: 'careers-page',
  label: 'Careers page',
  admin: { group: 'Pages', description: TOKENS_HINT },
  access: editable,
  fields: [
    { name: 'headline', type: 'text', required: true },
    { name: 'intro', type: 'textarea', required: true },
    titled('whyWorkHere', 'Why work here'),
    {
      name: 'benefits',
      type: 'array',
      admin: {
        description: 'Pay, schedule, equipment, training… Only list what you actually offer.',
      },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
  ],
}

const legalPage = (name: string, label: string): Field => ({
  type: 'collapsible',
  label,
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: `${name}Updated`,
          label: 'Last updated',
          type: 'date',
          required: true,
          admin: { date: { pickerAppearance: 'dayOnly' } },
        },
      ],
    },
    { name, label, type: 'richText', required: true },
  ],
})

/** /privacy, /terms and /accessibility. Starter text to be reviewed by a lawyer before launch. */
export const LegalPages: GlobalConfig = {
  slug: 'legal-pages',
  label: 'Legal pages',
  admin: {
    group: 'Pages',
    description:
      'Starter text written for this site. Have it reviewed (ideally by a lawyer) before launch.',
  },
  access: editable,
  fields: [
    legalPage('privacy', 'Privacy policy'),
    legalPage('terms', 'Terms of use'),
    legalPage('accessibility', 'Accessibility statement'),
  ],
}
