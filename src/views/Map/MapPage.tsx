import { Navigate, useNavigate } from 'react-router-dom'
import { ROUTES, UI_CONFIG } from '../../config/constants'
import { useUserStore } from '../../store/userStore'

export function MapPage() {
  const navigate = useNavigate()
  const user = useUserStore((state) => state.user)
  const clearUser = useUserStore((state) => state.clearUser)

  if (!user) {
    return <Navigate to={ROUTES.login} replace />
  }

  function handleLogout() {
    clearUser()
    navigate(ROUTES.login)
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-6 py-12">
      <section className="rounded-3xl border border-[color:var(--stroke)] bg-[color:var(--surface)] p-8 shadow-[0_16px_50px_rgba(0,0,0,0.3)] backdrop-blur-sm md:p-10">
        <p className="text-sm uppercase tracking-[0.28em] text-[color:var(--ink-muted)]">MVP Landing</p>
        <h1 className="mt-3 text-4xl font-bold text-[color:var(--ink)]">欢迎，{user.username}</h1>
        <p className="mt-3 max-w-2xl text-base text-[color:var(--ink-muted)]">
          登录闭环已打通。下一阶段将在此页面继续接入课程地图、学习进度和关卡流程。
        </p>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-8 inline-flex rounded-2xl border border-[color:var(--stroke)] bg-transparent px-6 text-base font-semibold text-[color:var(--ink)] transition hover:border-[color:var(--accent)]"
          style={{ minHeight: UI_CONFIG.touchTargetMinPx }}
        >
          退出登录
        </button>
      </section>
    </main>
  )
}
