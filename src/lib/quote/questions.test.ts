import { describe, expect, it } from 'vitest'

import { quoteQuestionsSchema, validateQuoteQuestions } from './questions'

const briefExample = [
  {
    id: 'storeys',
    type: 'select',
    label: 'How many storeys?',
    options: ['1', '2', '3'],
    required: true,
  },
  {
    id: 'area',
    type: 'number',
    label: 'Approximate area (sq ft)',
    min: 50,
    max: 20000,
    helpText: 'A rough guess is fine',
  },
  { id: 'screens', type: 'boolean', label: 'Clean screens too?' },
]

describe('quote questions', () => {
  it("accepts the brief's example", () => {
    expect(quoteQuestionsSchema.parse(briefExample)).toHaveLength(3)
    expect(validateQuoteQuestions(briefExample)).toBe(true)
  })

  it('treats a missing value as no questions', () => {
    expect(validateQuoteQuestions(null)).toBe(true)
  })

  it('rejects duplicate ids', () => {
    const result = validateQuoteQuestions([briefExample[2], briefExample[2]])
    expect(result).toMatch(/duplicate id "screens"/)
  })

  it('rejects unknown types, bad ids and one-option selects', () => {
    expect(validateQuoteQuestions([{ id: 'x', type: 'date', label: 'When?' }])).not.toBe(true)
    expect(validateQuoteQuestions([{ id: 'Bad Id', type: 'boolean', label: 'Hm?' }])).toMatch(
      /lowercase/,
    )
    expect(
      validateQuoteQuestions([{ id: 'size', type: 'select', label: 'Size', options: ['Only'] }]),
    ).toMatch(/at least two options/)
  })

  it('rejects number ranges where min exceeds max', () => {
    expect(
      validateQuoteQuestions([{ id: 'area', type: 'number', label: 'Area', min: 10, max: 5 }]),
    ).toMatch(/min must not be greater than max/)
  })
})
