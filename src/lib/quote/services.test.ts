import { describe, expect, it } from 'vitest'

import { isWizardService, sharedFrequencies } from './services'

describe('wizard services', () => {
  it('offers instant and subscription services without a dedicated form', () => {
    expect(isWizardService({ quoteMode: 'instant', dedicatedFlow: null })).toBe(true)
    expect(isWizardService({ quoteMode: 'subscription', dedicatedFlow: null })).toBe(true)
    expect(isWizardService({ quoteMode: 'instant', dedicatedFlow: 'holiday-lights' })).toBe(false)
    expect(isWizardService({ quoteMode: 'custom', dedicatedFlow: null })).toBe(false)
  })

  it('offers only frequencies every chosen service allows', () => {
    const windows = { frequencies: ['one-time', 'twice-yearly', 'quarterly'] as const }
    const gutters = { frequencies: ['one-time', 'twice-yearly'] as const }
    const all = ['one-time', 'twice-yearly', 'quarterly', 'monthly'] as const
    expect(sharedFrequencies([{ ...windows, frequencies: [...windows.frequencies] }], all)).toEqual(
      ['one-time', 'twice-yearly', 'quarterly'],
    )
    expect(
      sharedFrequencies(
        [{ frequencies: [...windows.frequencies] }, { frequencies: [...gutters.frequencies] }],
        ['one-time', 'quarterly'],
      ),
    ).toEqual(['one-time'])
    expect(sharedFrequencies([], all)).toEqual(['one-time'])
  })
})
