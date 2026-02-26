import { PROGRESS_STORAGE_KEY } from '../../config/constants'
import type { ProgressSnapshot } from '../../types/progress'

const DEFAULT_UNLOCKED_INDEX = 0

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

export function getDefaultProgressSnapshot(): ProgressSnapshot {
  return {
    completedUnitIds: [],
    currentUnlockedIndex: DEFAULT_UNLOCKED_INDEX,
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
