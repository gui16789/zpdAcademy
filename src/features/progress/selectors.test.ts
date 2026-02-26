import { describe, expect, it } from 'vitest'
import { getLearningUnitsWithStatus } from './selectors'
import type { LearningUnit } from '../../types/progress'

const testUnits: LearningUnit[] = [
  { id: 'u1', title: 'Unit 1', summary: 'S1', durationMin: 10 },
  { id: 'u2', title: 'Unit 2', summary: 'S2', durationMin: 10 },
  { id: 'u3', title: 'Unit 3', summary: 'S3', durationMin: 10 },
]

describe('getLearningUnitsWithStatus', () => {
  it('marks first unit unlocked when there is no progress', () => {
    const result = getLearningUnitsWithStatus(testUnits, [], 0)

    expect(result.map((item) => item.status)).toEqual(['unlocked', 'locked', 'locked'])
  })

  it('marks completed unit and unlocks next one', () => {
    const result = getLearningUnitsWithStatus(testUnits, ['u1'], 1)

    expect(result.map((item) => item.status)).toEqual(['completed', 'unlocked', 'locked'])
  })

  it('marks actionable correctly', () => {
    const result = getLearningUnitsWithStatus(testUnits, ['u1', 'u2'], 2)

    expect(result.map((item) => item.isActionable)).toEqual([true, true, true])
    expect(result[2]?.status).toBe('unlocked')
  })
})
