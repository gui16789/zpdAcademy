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
    }

    expect(normalizeProgressSnapshot(malformed)).toEqual({
      completedUnitIds: [],
      currentUnlockedIndex: 0,
    })
  })

  it('clears persisted snapshot', () => {
    saveProgressSnapshot({
      completedUnitIds: ['unit-01'],
      currentUnlockedIndex: 1,
    })

    clearProgressSnapshot()

    expect(window.localStorage.getItem(PROGRESS_STORAGE_KEY)).toBeNull()
  })
})
