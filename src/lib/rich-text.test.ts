import { describe, expect, it } from 'vitest'

import {
  fillContentTokens,
  nodeText,
  splitAtMiddle,
  tableOfContents,
  type RichContent,
} from './rich-text'

const text = (value: string) => ({ type: 'text', text: value })
const heading = (tag: 'h2' | 'h3', value: string) => ({
  type: 'heading',
  tag,
  children: [text(value)],
})
const paragraph = (value: string) => ({ type: 'paragraph', children: [text(value)] })
const doc = (...children: RichContent['root']['children']): RichContent => ({
  root: { children },
})

describe('nodeText', () => {
  it('joins the text of nested nodes', () => {
    expect(
      nodeText({ children: [text('Soft '), { type: 'link', children: [text('washing')] }] }),
    ).toBe('Soft washing')
  })
})

describe('tableOfContents', () => {
  it('lists h2 and h3 headings with linkable ids', () => {
    const content = doc(
      paragraph('Intro'),
      heading('h2', 'The short answer: twice a year'),
      heading('h3', 'Signs of trouble'),
      { type: 'heading', tag: 'h4', children: [text('Too deep')] },
    )
    expect(tableOfContents(content)).toEqual([
      { id: 'the-short-answer-twice-a-year', text: 'The short answer: twice a year', level: 2 },
      { id: 'signs-of-trouble', text: 'Signs of trouble', level: 3 },
    ])
  })
})

describe('splitAtMiddle', () => {
  it('splits at the h2 nearest the middle', () => {
    const content = doc(
      paragraph('a'),
      heading('h2', 'One'),
      paragraph('b'),
      heading('h2', 'Two'),
      paragraph('c'),
      heading('h2', 'Three'),
      paragraph('d'),
      paragraph('e'),
    )
    const [first, second] = splitAtMiddle(content)
    expect(first.root.children).toHaveLength(3)
    expect(second?.root.children[0]).toMatchObject({ tag: 'h2', children: [text('Two')] })
    expect(first.root.children.length + second!.root.children.length).toBe(8)
  })

  it('leaves short articles whole', () => {
    const content = doc(paragraph('a'), heading('h2', 'Only one'), paragraph('b'))
    expect(splitAtMiddle(content)).toEqual([content, null])
  })

  it('never splits before the first paragraph', () => {
    const content = doc(heading('h2', 'Start'), paragraph('a'), heading('h2', 'Next'))
    expect(splitAtMiddle(content)).toEqual([content, null])
  })
})

describe('fillContentTokens', () => {
  it('fills tokens in nested text and leaves the original untouched', () => {
    const content = doc(paragraph('Homes in {region}'), heading('h2', 'Winter in {region}'))
    const filled = fillContentTokens(content, { region: 'Denver Metro' })
    expect(nodeText(filled.root.children[0])).toBe('Homes in Denver Metro')
    expect(tableOfContents(filled)[0]).toMatchObject({
      id: 'winter-in-denver-metro',
      text: 'Winter in Denver Metro',
    })
    expect(nodeText(content.root.children[0])).toBe('Homes in {region}')
  })
})
