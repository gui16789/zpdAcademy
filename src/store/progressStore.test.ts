import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PROGRESS_STORAGE_KEY } from '../config/constants'

async function loadProgressStore() {
  vi.resetModules()
  const module = await import('./progressStore')

  return module.useProgressStore
}

describe('progressStore', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    window.localStorage.clear()
  })

  it('stores de-duplicated wrong question ids when submitting unit result', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(1700000000000)
    const useProgressStore = await loadProgressStore()

    useProgressStore.getState().submitUnitResult('unit-01', 45, false, ['q-0101', 'q-0101', ''])

    expect(useProgressStore.getState().wrongQuestionRecords['unit-01']).toEqual(['q-0101'])
    expect(useProgressStore.getState().wrongQuestionUpdatedAt['unit-01']).toBe(1700000000000)

    const rawSnapshot = window.localStorage.getItem(PROGRESS_STORAGE_KEY)
    const snapshot = JSON.parse(rawSnapshot ?? '{}')

    expect(snapshot.wrongQuestionRecords['unit-01']).toEqual(['q-0101'])
    expect(snapshot.wrongQuestionUpdatedAt['unit-01']).toBe(1700000000000)
  })

  it('clears wrong questions for a specific unit only', async () => {
    const nowSpy = vi.spyOn(Date, 'now')
    nowSpy.mockReturnValueOnce(1700000000100).mockReturnValueOnce(1700000000200)
    const useProgressStore = await loadProgressStore()

    useProgressStore.getState().submitUnitResult('unit-01', 45, false, ['q-0101'])
    useProgressStore.getState().submitUnitResult('unit-02', 45, false, ['q-0201'])
    useProgressStore.getState().clearWrongQuestionsForUnit('unit-01')

    expect(useProgressStore.getState().wrongQuestionRecords['unit-01']).toBeUndefined()
    expect(useProgressStore.getState().wrongQuestionRecords['unit-02']).toEqual(['q-0201'])
    expect(useProgressStore.getState().wrongQuestionUpdatedAt['unit-01']).toBeUndefined()
    expect(useProgressStore.getState().wrongQuestionUpdatedAt['unit-02']).toBe(1700000000200)

    const rawSnapshot = window.localStorage.getItem(PROGRESS_STORAGE_KEY)
    const snapshot = JSON.parse(rawSnapshot ?? '{}')

    expect(snapshot.wrongQuestionRecords['unit-01']).toBeUndefined()
    expect(snapshot.wrongQuestionRecords['unit-02']).toEqual(['q-0201'])
    expect(snapshot.wrongQuestionUpdatedAt['unit-01']).toBeUndefined()
    expect(snapshot.wrongQuestionUpdatedAt['unit-02']).toBe(1700000000200)
  })

  it('removes wrong questions after a fully correct submission', async () => {
    const nowSpy = vi.spyOn(Date, 'now')
    nowSpy.mockReturnValueOnce(1700000000300).mockReturnValueOnce(1700000000400)
    const useProgressStore = await loadProgressStore()

    useProgressStore.getState().submitUnitResult('unit-03', 50, false, ['q-0301'])
    useProgressStore.getState().submitUnitResult('unit-03', 100, true, [])

    expect(useProgressStore.getState().wrongQuestionRecords['unit-03']).toBeUndefined()
    expect(useProgressStore.getState().wrongQuestionUpdatedAt['unit-03']).toBeUndefined()
  })

  it('clears all wrong questions without resetting progress and score records', async () => {
    const nowSpy = vi.spyOn(Date, 'now')
    nowSpy.mockReturnValueOnce(1700000000500).mockReturnValueOnce(1700000000600)
    const useProgressStore = await loadProgressStore()

    useProgressStore.getState().submitUnitResult('unit-01', 50, false, ['q-0101'])
    useProgressStore.getState().submitUnitResult('unit-02', 100, true, ['q-0201'])
    useProgressStore.getState().clearAllWrongQuestions()

    const state = useProgressStore.getState()
    expect(state.wrongQuestionRecords).toEqual({})
    expect(state.wrongQuestionUpdatedAt).toEqual({})
    expect(state.completedUnitIds).toEqual(['unit-02'])
    expect(state.unitScoreRecords['unit-01']?.attempts).toBe(1)
    expect(state.unitScoreRecords['unit-02']?.lastScore).toBe(100)

    const rawSnapshot = window.localStorage.getItem(PROGRESS_STORAGE_KEY)
    const snapshot = JSON.parse(rawSnapshot ?? '{}')
    expect(snapshot.wrongQuestionRecords).toEqual({})
    expect(snapshot.wrongQuestionUpdatedAt).toEqual({})
    expect(snapshot.completedUnitIds).toEqual(['unit-02'])
  })

  it('clears stale wrong question timestamps when records are already empty', async () => {
    const staleSnapshot = {
      completedUnitIds: [],
      currentUnlockedIndex: 0,
      unitScoreRecords: {},
      wrongQuestionRecords: {},
      wrongQuestionUpdatedAt: {
        'unit-01': 1700000000700,
      },
    }
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(staleSnapshot))
    const useProgressStore = await loadProgressStore()

    useProgressStore.getState().clearAllWrongQuestions()

    const state = useProgressStore.getState()
    expect(state.wrongQuestionRecords).toEqual({})
    expect(state.wrongQuestionUpdatedAt).toEqual({})

    const rawSnapshot = window.localStorage.getItem(PROGRESS_STORAGE_KEY)
    const snapshot = JSON.parse(rawSnapshot ?? '{}')
    expect(snapshot.wrongQuestionRecords).toEqual({})
    expect(snapshot.wrongQuestionUpdatedAt).toEqual({})
  })
})
