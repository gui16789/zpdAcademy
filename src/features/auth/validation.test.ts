import { describe, expect, it } from 'vitest'
import { validateLoginInput } from './validation'

describe('validateLoginInput', () => {
  it('returns invalid result when credentials are too short', () => {
    const result = validateLoginInput({ username: 'a', password: '12345' })

    expect(result.isValid).toBe(false)
    expect(result.errors.username).toContain('至少')
    expect(result.errors.password).toContain('至少')
  })

  it('returns valid result for valid credentials', () => {
    const result = validateLoginInput({ username: 'valid_user', password: '123456' })

    expect(result.isValid).toBe(true)
    expect(result.errors).toEqual({})
  })
})
