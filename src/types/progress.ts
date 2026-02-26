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

export interface ProgressSnapshot {
  completedUnitIds: string[]
  currentUnlockedIndex: number
}
