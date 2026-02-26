import { AUTH_CONFIG } from '../../config/constants'
import type { AuthUser, LoginInput } from '../../types/auth'

export interface IAuthService {
  login(input: LoginInput): Promise<AuthUser>
}

class MockAuthService implements IAuthService {
  public async login(input: LoginInput): Promise<AuthUser> {
    const sanitizedUsername = input.username.trim()

    await new Promise((resolve) => {
      window.setTimeout(resolve, AUTH_CONFIG.mockLatencyMs)
    })

    return {
      id: `user-${sanitizedUsername.toLowerCase()}`,
      username: sanitizedUsername,
    }
  }
}

export const authService: IAuthService = new MockAuthService()
