import { create } from 'zustand'
import { LEARNING_UNITS } from '../config/constants'

interface ProgressStoreState {
  completedUnitIds: string[]
  currentUnlockedIndex: number
  markUnitCompleted: (unitId: string) => void
  resetProgress: () => void
}

const INITIAL_UNLOCKED_INDEX = 0

export const useProgressStore = create<ProgressStoreState>((set) => ({
  completedUnitIds: [],
  currentUnlockedIndex: INITIAL_UNLOCKED_INDEX,
  markUnitCompleted: (unitId) =>
    set((state) => {
      const completedUnitIds = state.completedUnitIds.includes(unitId)
        ? state.completedUnitIds
        : [...state.completedUnitIds, unitId]

      const completedIndex = LEARNING_UNITS.findIndex((unit) => unit.id === unitId)
      const nextUnlockedIndex =
        completedIndex >= state.currentUnlockedIndex
          ? Math.min(completedIndex + 1, LEARNING_UNITS.length - 1)
          : state.currentUnlockedIndex

      return {
        completedUnitIds,
        currentUnlockedIndex: nextUnlockedIndex,
      }
    }),
  resetProgress: () =>
    set({
      completedUnitIds: [],
      currentUnlockedIndex: INITIAL_UNLOCKED_INDEX,
    }),
}))
