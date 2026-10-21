import { describe, expect, it } from 'vitest'

import { mergeFaqs } from './faqs'

describe('mergeFaqs', () => {
  it('keeps order and drops repeated questions', () => {
    const merged = mergeFaqs(
      [
        { id: 'a', question: 'How often should gutters be cleaned?', answer: 'Twice a year.' },
        { id: 'b', question: 'Do I need to be home?', answer: 'No.' },
      ],
      [
        { id: 1, question: ' how often should gutters be cleaned? ', answer: 'Other answer.' },
        { id: 2, question: 'Do you haul debris away?', answer: 'Yes.' },
      ],
    )
    expect(merged.map((faq) => faq.id)).toEqual(['a', 'b', 2])
  })
})
