import { beforeEach, describe, expect, it } from 'vitest'
import { PROGRESS_STORAGE_KEY } from '../../config/constants'
import {
  clearProgressSnapshot,
  getDefaultProgressSnapshot,
  loadProgressSnapshot,
  normalizeProgressSnapshot,
  saveProgressSnapshot,
} from './progressStorage'

describe('progressStorage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('returns default snapshot when storage is empty', () => {
    expect(loadProgressSnapshot()).toEqual(getDefaultProgressSnapshot())
  })

  it('saves and loads snapshot from localStorage', () => {
    const snapshot = {
      completedUnitIds: ['unit-01', 'unit-02'],
      currentUnlockedIndex: 2,
      unitScoreRecords: {
        'unit-01': { attempts: 2, lastScore: 80, bestScore: 90 },
      },
      wrongQuestionRecords: {
        'unit-01': ['u1-q1', 'u1-q3'],
      },
      wrongQuestionUpdatedAt: {
        'unit-01': 1700000000000,
      },
    }

    saveProgressSnapshot(snapshot)

    expect(loadProgressSnapshot()).toEqual(snapshot)
  })

  it('falls back to default when stored json is invalid', () => {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, 'not-json')

    expect(loadProgressSnapshot()).toEqual(getDefaultProgressSnapshot())
  })

  it('normalizes malformed payloads', () => {
    const malformed = {
      completedUnitIds: ['unit-01', 5],
      currentUnlockedIndex: -2,
      unitScoreRecords: {
        'unit-01': {
          attempts: -1,
          lastScore: 120,
          bestScore: 120,
        },
      },
      wrongQuestionRecords: {
        'unit-01': ['u1-q1', 1],
      },
      wrongQuestionUpdatedAt: {
        'unit-01': -1,
      },
    }

    expect(normalizeProgressSnapshot(malformed)).toEqual({
      completedUnitIds: [],
      currentUnlockedIndex: 0,
      unitScoreRecords: {},
      wrongQuestionRecords: {},
      wrongQuestionUpdatedAt: {},
    })
  })

  it('keeps compatibility with old snapshots without score records', () => {
    const oldSnapshot = {
      completedUnitIds: ['unit-02'],
      currentUnlockedIndex: 1,
    }

    expect(normalizeProgressSnapshot(oldSnapshot)).toEqual({
      completedUnitIds: ['unit-02'],
      currentUnlockedIndex: 1,
      unitScoreRecords: {},
      wrongQuestionRecords: {},
      wrongQuestionUpdatedAt: {},
    })
  })

  it('normalizes and de-duplicates wrong question records', () => {
    expect(
      normalizeProgressSnapshot({
        wrongQuestionRecords: {
          'unit-01': ['u1-q1', 'u1-q1', 'u1-q2'],
        },
      }),
    ).toEqual({
      completedUnitIds: [],
      currentUnlockedIndex: 0,
      unitScoreRecords: {},
      wrongQuestionRecords: {
        'unit-01': ['u1-q1', 'u1-q2'],
      },
      wrongQuestionUpdatedAt: {},
    })
  })

  it('normalizes wrong question updated timestamps', () => {
    expect(
      normalizeProgressSnapshot({
        wrongQuestionUpdatedAt: {
          'unit-01': 1700000000999.9,
          'unit-02': 'bad',
          'unit-03': -3,
        },
      }),
    ).toEqual({
      completedUnitIds: [],
      currentUnlockedIndex: 0,
      unitScoreRecords: {},
      wrongQuestionRecords: {},
      wrongQuestionUpdatedAt: {
        'unit-01': 1700000000999,
      },
    })
  })

  it('clears persisted snapshot', () => {
    saveProgressSnapshot({
      completedUnitIds: ['unit-01'],
      currentUnlockedIndex: 1,
      unitScoreRecords: {
        'unit-01': { attempts: 1, lastScore: 75, bestScore: 75 },
      },
      wrongQuestionRecords: {
        'unit-01': ['u1-q2'],
      },
      wrongQuestionUpdatedAt: {
        'unit-01': 1700000000000,
      },
    })

    clearProgressSnapshot()

    expect(window.localStorage.getItem(PROGRESS_STORAGE_KEY)).toBeNull()
  })
})
