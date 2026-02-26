import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES, TASK_ID, UI_CONFIG } from '../../config/constants'
import { validateLoginInput } from '../../features/auth/validation'
import { authService } from '../../services/auth/authService'
import { useUserStore } from '../../store/userStore'

export function LoginPage() {
  const navigate = useNavigate()
  const setUser = useUserStore((state) => state.setUser)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const validation = useMemo(
    () => validateLoginInput({ username, password }),
    [username, password],
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!validation.isValid || isSubmitting) {
      return
    }

    setSubmitError(null)
    setSubmitting(true)

    try {
      const user = await authService.login({ username, password })
      setUser(user)
      navigate(ROUTES.map)
    } catch {
      setSubmitError('登录失败，请稍后重试')
    } finally {
      setSubmitting(false)
    }
  }

  const controlClassName =
    'w-full rounded-xl border border-[color:var(--stroke)] bg-[color:var(--surface)] px-4 text-base text-[color:var(--ink)] placeholder:text-[color:var(--ink-muted)] focus:border-[color:var(--accent-soft)] focus:outline-none'

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center px-6 py-12">
      <section className="rounded-3xl border border-[color:var(--stroke)] bg-[color:var(--surface)] p-8 shadow-[0_20px_70px_rgba(0,0,0,0.35)] backdrop-blur-sm md:p-10">
        <p className="text-sm uppercase tracking-[0.32em] text-[color:var(--ink-muted)]">ZPD Academy</p>
        <h1 className="mt-3 text-4xl font-bold text-[color:var(--ink)]">登录学习控制台</h1>
        <p className="mt-2 text-base text-[color:var(--ink-muted)]">
          MVP Task: <span className="font-semibold text-[color:var(--accent)]">{TASK_ID}</span>
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
          <label className="block space-y-2 text-base font-medium">
            <span>用户名</span>
            <input
              className={controlClassName}
              style={{ minHeight: UI_CONFIG.touchTargetMinPx }}
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="输入用户名"
            />
            {validation.errors.username ? (
              <span className="text-sm text-[#ff7f9d]">{validation.errors.username}</span>
            ) : null}
          </label>

          <label className="block space-y-2 text-base font-medium">
            <span>密码</span>
            <input
              className={controlClassName}
              style={{ minHeight: UI_CONFIG.touchTargetMinPx }}
              autoComplete="current-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="至少 6 位"
            />
            {validation.errors.password ? (
              <span className="text-sm text-[#ff7f9d]">{validation.errors.password}</span>
            ) : null}
          </label>

          {submitError ? <p className="text-sm text-[#ff7f9d]">{submitError}</p> : null}

          <button
            type="submit"
            disabled={!validation.isValid || isSubmitting}
            className="w-full rounded-2xl bg-[color:var(--accent)] px-6 text-base font-semibold text-[#022125] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            style={{ minHeight: UI_CONFIG.touchTargetMinPx }}
          >
            {isSubmitting ? '登录中...' : '进入系统'}
          </button>
        </form>
      </section>
    </main>
  )
}
