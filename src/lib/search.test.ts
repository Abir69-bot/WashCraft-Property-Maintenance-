import { describe, expect, it } from 'vitest'

import { searchEntries, type SearchEntry } from './search'

const entry = (title: string, text = ''): SearchEntry => ({
  title,
  text,
  href: `/${title.toLowerCase().replace(/\s+/g, '-')}`,
  kind: 'Service',
})

const entries = [
  entry('Gutter Cleaning', 'Gutters cleared by hand, downspouts flushed'),
  entry('Gutter Brightening', 'Black streaks removed from the outside of gutters'),
  entry('Roof Cleaning', 'Moss and streaks removed with a soft wash'),
  entry('Snow Removal', 'Driveways and walkways cleared after a storm'),
]

describe('searchEntries', () => {
  it('needs at least one word of two letters', () => {
    expect(searchEntries(entries, '')).toEqual([])
    expect(searchEntries(entries, ' a ')).toEqual([])
  })

  it('matches every word, in the title or the text, ignoring case', () => {
    expect(searchEntries(entries, 'STREAKS').map((e) => e.title)).toEqual([
      'Gutter Brightening',
      'Roof Cleaning',
    ])
    expect(searchEntries(entries, 'gutter streaks').map((e) => e.title)).toEqual([
      'Gutter Brightening',
    ])
  })

  it('ranks title matches first', () => {
    expect(searchEntries(entries, 'cleaning').map((e) => e.title)).toEqual([
      'Gutter Cleaning',
      'Roof Cleaning',
    ])
    expect(searchEntries(entries, 'gutters')[0].title).toBe('Gutter Cleaning')
  })

  it('puts titles that start with the query first among equals', () => {
    const similar = [
      entry('Commercial Gutter Cleaning'),
      entry('Gutter Cleaning'),
      entry('Gutter Brightening'),
    ]
    expect(searchEntries(similar, 'gutter').map((e) => e.title)).toEqual([
      'Gutter Cleaning',
      'Gutter Brightening',
      'Commercial Gutter Cleaning',
    ])
  })

  it('returns at most eight results', () => {
    const many = Array.from({ length: 12 }, (_, i) => entry(`Window ${i}`))
    expect(searchEntries(many, 'window')).toHaveLength(8)
  })
})
