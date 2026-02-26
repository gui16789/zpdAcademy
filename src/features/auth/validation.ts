import { AUTH_CONFIG } from '../../config/constants'
import type { LoginInput, LoginValidationErrors, LoginValidationResult } from '../../types/auth'

export function validateLoginInput(input: LoginInput): LoginValidationResult {
  const errors: LoginValidationErrors = {}
  const username = input.username.trim()
  const password = input.password.trim()

  if (username.length < AUTH_CONFIG.usernameMinLength) {
    errors.username = `用户名至少 ${AUTH_CONFIG.usernameMinLength} 个字符`
  }

  if (password.length < AUTH_CONFIG.passwordMinLength) {
    errors.password = `密码至少 ${AUTH_CONFIG.passwordMinLength} 个字符`
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  }
}
