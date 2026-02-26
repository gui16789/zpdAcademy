import type { LearningUnit, LearningUnitWithStatus, UnitStatus } from '../../types/progress'

function resolveUnitStatus(
  unitId: string,
  unitIndex: number,
  completedUnitIds: string[],
  currentUnlockedIndex: number,
): UnitStatus {
  if (completedUnitIds.includes(unitId)) {
    return 'completed'
  }

  if (unitIndex <= currentUnlockedIndex) {
    return 'unlocked'
  }

  return 'locked'
}

export function getLearningUnitsWithStatus(
  units: LearningUnit[],
  completedUnitIds: string[],
  currentUnlockedIndex: number,
): LearningUnitWithStatus[] {
  return units.map((unit, index) => {
    const status = resolveUnitStatus(unit.id, index, completedUnitIds, currentUnlockedIndex)

    return {
      ...unit,
      status,
      isActionable: status !== 'locked',
    }
  })
}
