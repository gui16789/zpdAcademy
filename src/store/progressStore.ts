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
  wrongQuestionRecords: ProgressSnapshot['wrongQuestionRecords']
  wrongQuestionUpdatedAt: ProgressSnapshot['wrongQuestionUpdatedAt']
  submitUnitResult: (
    unitId: string,
    score: number,
    isPassed: boolean,
    wrongQuestionIds?: string[],
  ) => void
  clearWrongQuestionsForUnit: (unitId: string) => void
  clearAllWrongQuestions: () => void
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
    wrongQuestionRecords: snapshot.wrongQuestionRecords,
    wrongQuestionUpdatedAt: snapshot.wrongQuestionUpdatedAt,
  })
}

export const useProgressStore = create<ProgressStoreState>((set) => ({
  completedUnitIds: persistedSnapshot.completedUnitIds.filter((unitId) => unitIdSet.has(unitId)),
  currentUnlockedIndex: clampUnlockedIndex(persistedSnapshot.currentUnlockedIndex),
  unitScoreRecords: Object.fromEntries(
    Object.entries(persistedSnapshot.unitScoreRecords).filter(([unitId]) => unitIdSet.has(unitId)),
  ),
  wrongQuestionRecords: Object.fromEntries(
    Object.entries(persistedSnapshot.wrongQuestionRecords)
      .filter(([unitId, questionIds]) => unitIdSet.has(unitId) && Array.isArray(questionIds))
      .map(([unitId, questionIds]) => [unitId, Array.from(new Set(questionIds))]),
  ),
  wrongQuestionUpdatedAt: Object.fromEntries(
    Object.entries(persistedSnapshot.wrongQuestionUpdatedAt).filter(
      ([unitId, updatedAt]) =>
        unitIdSet.has(unitId) && typeof updatedAt === 'number' && Number.isFinite(updatedAt) && updatedAt > 0,
    ),
  ),
  submitUnitResult: (unitId, score, isPassed, wrongQuestionIds = []) =>
    set((state) => {
      const safeScore = Math.max(0, Math.min(100, Math.round(score)))
      const nextWrongQuestionIds = Array.from(
        new Set(wrongQuestionIds.filter((questionId) => typeof questionId === 'string' && questionId.length > 0)),
      )
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
      const wrongQuestionRecords = { ...state.wrongQuestionRecords }
      const wrongQuestionUpdatedAt = { ...state.wrongQuestionUpdatedAt }

      if (nextWrongQuestionIds.length > 0) {
        wrongQuestionRecords[unitId] = nextWrongQuestionIds
        wrongQuestionUpdatedAt[unitId] = Date.now()
      } else {
        delete wrongQuestionRecords[unitId]
        delete wrongQuestionUpdatedAt[unitId]
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
        wrongQuestionRecords,
        wrongQuestionUpdatedAt,
      }

      persistSnapshot(nextSnapshot)

      return nextSnapshot
    }),
  clearWrongQuestionsForUnit: (unitId) =>
    set((state) => {
      if (!state.wrongQuestionRecords[unitId]) {
        return state
      }

      const wrongQuestionRecords = { ...state.wrongQuestionRecords }
      const wrongQuestionUpdatedAt = { ...state.wrongQuestionUpdatedAt }
      delete wrongQuestionRecords[unitId]
      delete wrongQuestionUpdatedAt[unitId]

      persistSnapshot({
        completedUnitIds: state.completedUnitIds,
        currentUnlockedIndex: state.currentUnlockedIndex,
        unitScoreRecords: state.unitScoreRecords,
        wrongQuestionRecords,
        wrongQuestionUpdatedAt,
      })

      return {
        wrongQuestionRecords,
        wrongQuestionUpdatedAt,
      }
    }),
  clearAllWrongQuestions: () =>
    set((state) => {
      if (
        Object.keys(state.wrongQuestionRecords).length === 0 &&
        Object.keys(state.wrongQuestionUpdatedAt).length === 0
      ) {
        return state
      }

      persistSnapshot({
        completedUnitIds: state.completedUnitIds,
        currentUnlockedIndex: state.currentUnlockedIndex,
        unitScoreRecords: state.unitScoreRecords,
        wrongQuestionRecords: {},
        wrongQuestionUpdatedAt: {},
      })

      return {
        wrongQuestionRecords: {},
        wrongQuestionUpdatedAt: {},
      }
    }),
  resetProgress: () => {
    clearProgressSnapshot()
    set({
      completedUnitIds: [],
      currentUnlockedIndex: INITIAL_UNLOCKED_INDEX,
      unitScoreRecords: {},
      wrongQuestionRecords: {},
      wrongQuestionUpdatedAt: {},
    })
  },
}))
