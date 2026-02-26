export type UnitStatus = 'completed' | 'unlocked' | 'locked'

export interface LearningUnit {
  id: string
  title: string
  summary: string
  durationMin: number
}

export interface LearningUnitWithStatus extends LearningUnit {
  status: UnitStatus
  isActionable: boolean
}

export interface UnitScoreRecord {
  attempts: number
  lastScore: number
  bestScore: number
}

export interface ProgressSnapshot {
  completedUnitIds: string[]
  currentUnlockedIndex: number
  unitScoreRecords: Record<string, UnitScoreRecord>
}
