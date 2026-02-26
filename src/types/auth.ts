export interface LoginInput {
  username: string
  password: string
}

export interface LoginValidationErrors {
  username?: string
  password?: string
}

export interface LoginValidationResult {
  errors: LoginValidationErrors
  isValid: boolean
}

export interface AuthUser {
  id: string
  username: string
}
