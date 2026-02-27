import { PROGRESS_STORAGE_KEY } from '../../config/constants'
import type {
  ProgressSnapshot,
  UnitScoreRecord,
  WrongQuestionRecords,
  WrongQuestionUpdatedAt,
} from '../../types/progress'

const DEFAULT_UNLOCKED_INDEX = 0

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function isValidScoreRecord(value: unknown): value is UnitScoreRecord {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<UnitScoreRecord>

  return (
    typeof candidate.attempts === 'number' &&
    candidate.attempts >= 0 &&
    typeof candidate.lastScore === 'number' &&
    candidate.lastScore >= 0 &&
    candidate.lastScore <= 100 &&
    typeof candidate.bestScore === 'number' &&
    candidate.bestScore >= 0 &&
    candidate.bestScore <= 100
  )
}

function normalizeUnitScoreRecords(value: unknown): Record<string, UnitScoreRecord> {
  if (!value || typeof value !== 'object') {
    return {}
  }

  const entries = Object.entries(value as Record<string, unknown>).filter((entry) =>
    isValidScoreRecord(entry[1]),
  )

  return Object.fromEntries(entries) as Record<string, UnitScoreRecord>
}

function normalizeWrongQuestionRecords(value: unknown): WrongQuestionRecords {
  if (!value || typeof value !== 'object') {
    return {}
  }

  const entries = Object.entries(value as Record<string, unknown>)
    .filter((entry) => Array.isArray(entry[1]) && entry[1].every((item) => typeof item === 'string'))
    .map(([unitId, questionIds]) => [unitId, Array.from(new Set(questionIds as string[]))])

  return Object.fromEntries(entries) as WrongQuestionRecords
}

function normalizeWrongQuestionUpdatedAt(value: unknown): WrongQuestionUpdatedAt {
  if (!value || typeof value !== 'object') {
    return {}
  }

  const entries = Object.entries(value as Record<string, unknown>).filter(
    (entry) => typeof entry[1] === 'number' && Number.isFinite(entry[1]) && entry[1] > 0,
  )

  return Object.fromEntries(entries.map(([unitId, updatedAt]) => [unitId, Math.floor(updatedAt as number)]))
}

export function getDefaultProgressSnapshot(): ProgressSnapshot {
  return {
    completedUnitIds: [],
    currentUnlockedIndex: DEFAULT_UNLOCKED_INDEX,
    unitScoreRecords: {},
    wrongQuestionRecords: {},
    wrongQuestionUpdatedAt: {},
  }
}

export function normalizeProgressSnapshot(value: unknown): ProgressSnapshot {
  if (!value || typeof value !== 'object') {
    return getDefaultProgressSnapshot()
  }

  const candidate = value as Partial<ProgressSnapshot>
  const completedUnitIds = isStringArray(candidate.completedUnitIds) ? candidate.completedUnitIds : []
  const currentUnlockedIndex =
    typeof candidate.currentUnlockedIndex === 'number' && candidate.currentUnlockedIndex >= 0
      ? Math.floor(candidate.currentUnlockedIndex)
      : DEFAULT_UNLOCKED_INDEX

  return {
    completedUnitIds,
    currentUnlockedIndex,
    unitScoreRecords: normalizeUnitScoreRecords(candidate.unitScoreRecords),
    wrongQuestionRecords: normalizeWrongQuestionRecords(candidate.wrongQuestionRecords),
    wrongQuestionUpdatedAt: normalizeWrongQuestionUpdatedAt(candidate.wrongQuestionUpdatedAt),
  }
}

export function loadProgressSnapshot(): ProgressSnapshot {
  if (typeof window === 'undefined') {
    return getDefaultProgressSnapshot()
  }

  try {
    const rawValue = window.localStorage.getItem(PROGRESS_STORAGE_KEY)

    if (!rawValue) {
      return getDefaultProgressSnapshot()
    }

    return normalizeProgressSnapshot(JSON.parse(rawValue))
  } catch {
    return getDefaultProgressSnapshot()
  }
}

export function saveProgressSnapshot(snapshot: ProgressSnapshot): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(snapshot))
  } catch {
    // keep runtime resilient when storage is blocked
  }
}

export function clearProgressSnapshot(): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.removeItem(PROGRESS_STORAGE_KEY)
  } catch {
    // ignore storage cleanup errors
  }
}
