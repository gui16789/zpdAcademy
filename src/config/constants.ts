import type { LearningUnit } from '../types/progress'

export const TASK_ID = 'DEV-20260226-001'
export const MAP_PROGRESS_TASK_ID = 'DEV-20260226-002'
export const PROGRESS_PERSIST_TASK_ID = 'DEV-20260226-003'
export const QUESTION_MVP_TASK_ID = 'DEV-20260226-004'
export const SCORE_HISTORY_TASK_ID = 'DEV-20260226-005'
export const PROGRESS_STORAGE_KEY = 'zpd-academy-progress-v1'

export const ROUTES = {
  root: '/',
  login: '/login',
  map: '/map',
  question: '/question/:unitId',
  wrongBook: '/wrong-book',
} as const

export function buildQuestionRoute(unitId: string): string {
  return ROUTES.question.replace(':unitId', unitId)
}

export const QUESTION_MODES = {
  wrong: 'wrong',
} as const

export function buildWrongOnlyQuestionRoute(unitId: string): string {
  return `${buildQuestionRoute(unitId)}?mode=${QUESTION_MODES.wrong}`
}

export const UI_CONFIG = {
  touchTargetMinPx: 44,
  baseFontSizePx: 16,
} as const

export const AUTH_CONFIG = {
  usernameMinLength: 2,
  passwordMinLength: 6,
  mockLatencyMs: 200,
} as const

export const QUESTION_CONFIG = {
  passScore: 70,
} as const

export const LEARNING_UNITS: LearningUnit[] = [
  {
    id: 'unit-01',
    title: 'Unit 01 · 入门',
    summary: '认识学习路径和目标，完成起步检查。',
    durationMin: 20,
  },
  {
    id: 'unit-02',
    title: 'Unit 02 · 基础训练',
    summary: '完成基础技能训练与首次挑战。',
    durationMin: 30,
  },
  {
    id: 'unit-03',
    title: 'Unit 03 · 进阶实践',
    summary: '进入综合题组，提升稳定性与速度。',
    durationMin: 35,
  },
  {
    id: 'unit-04',
    title: 'Unit 04 · 巩固与复盘',
    summary: '针对薄弱点复盘，完成阶段结业。',
    durationMin: 25,
  },
]
