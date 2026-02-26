import { create } from 'zustand'
import { LEARNING_UNITS } from '../config/constants'
import {
  clearProgressSnapshot,
  loadProgressSnapshot,
  saveProgressSnapshot,
} from '../services/storage/progressStorage'
import type { ProgressSnapshot } from '../types/progress'

interface ProgressStoreState {
  completedUnitIds: string[]
  currentUnlockedIndex: number
  unitScoreRecords: ProgressSnapshot['unitScoreRecords']
  submitUnitResult: (unitId: string, score: number, isPassed: boolean) => void
  resetProgress: () => void
}

const INITIAL_UNLOCKED_INDEX = 0
const MAX_UNLOCKED_INDEX = LEARNING_UNITS.length - 1
const persistedSnapshot = loadProgressSnapshot()
const unitIdSet = new Set(LEARNING_UNITS.map((unit) => unit.id))

function clampUnlockedIndex(index: number): number {
  if (index < INITIAL_UNLOCKED_INDEX) {
    return INITIAL_UNLOCKED_INDEX
  }

  return Math.min(index, MAX_UNLOCKED_INDEX)
}

function persistSnapshot(snapshot: ProgressSnapshot): void {
  saveProgressSnapshot({
    completedUnitIds: snapshot.completedUnitIds,
    currentUnlockedIndex: clampUnlockedIndex(snapshot.currentUnlockedIndex),
    unitScoreRecords: snapshot.unitScoreRecords,
  })
}

export const useProgressStore = create<ProgressStoreState>((set) => ({
  completedUnitIds: persistedSnapshot.completedUnitIds.filter((unitId) => unitIdSet.has(unitId)),
  currentUnlockedIndex: clampUnlockedIndex(persistedSnapshot.currentUnlockedIndex),
  unitScoreRecords: Object.fromEntries(
    Object.entries(persistedSnapshot.unitScoreRecords).filter(([unitId]) => unitIdSet.has(unitId)),
  ),
  submitUnitResult: (unitId, score, isPassed) =>
    set((state) => {
      const safeScore = Math.max(0, Math.min(100, Math.round(score)))
      const existingRecord = state.unitScoreRecords[unitId]
      const nextRecord = {
        attempts: (existingRecord?.attempts ?? 0) + 1,
        lastScore: safeScore,
        bestScore: Math.max(existingRecord?.bestScore ?? 0, safeScore),
      }
      const unitScoreRecords = {
        ...state.unitScoreRecords,
        [unitId]: nextRecord,
      }

      const completedUnitIds =
        isPassed && !state.completedUnitIds.includes(unitId)
          ? [...state.completedUnitIds, unitId]
          : state.completedUnitIds

      const completedIndex = LEARNING_UNITS.findIndex((unit) => unit.id === unitId)
      const nextUnlockedIndex =
        isPassed && completedIndex >= state.currentUnlockedIndex
          ? Math.min(completedIndex + 1, LEARNING_UNITS.length - 1)
          : state.currentUnlockedIndex

      const nextSnapshot = {
        completedUnitIds,
        currentUnlockedIndex: nextUnlockedIndex,
        unitScoreRecords,
      }

      persistSnapshot(nextSnapshot)

      return nextSnapshot
    }),
  resetProgress: () => {
    clearProgressSnapshot()
    set({
      completedUnitIds: [],
      currentUnlockedIndex: INITIAL_UNLOCKED_INDEX,
      unitScoreRecords: {},
    })
  },
}))
