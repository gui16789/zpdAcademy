export const TASK_ID = 'DEV-20260226-001'

export const ROUTES = {
  root: '/',
  login: '/login',
  map: '/map',
} as const

export const UI_CONFIG = {
  touchTargetMinPx: 44,
  baseFontSizePx: 16,
} as const

export const AUTH_CONFIG = {
  usernameMinLength: 2,
  passwordMinLength: 6,
  mockLatencyMs: 200,
} as const
