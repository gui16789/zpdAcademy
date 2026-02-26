import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { LEARNING_UNITS, PROGRESS_PERSIST_TASK_ID, ROUTES, UI_CONFIG } from '../../config/constants'
import { useProgressStore } from '../../store/progressStore'
import { useUserStore } from '../../store/userStore'

export function QuestionPage() {
  const navigate = useNavigate()
  const { unitId } = useParams()
  const user = useUserStore((state) => state.user)
  const markUnitCompleted = useProgressStore((state) => state.markUnitCompleted)
  const unit = LEARNING_UNITS.find((item) => item.id === unitId)

  if (!user) {
    return <Navigate to={ROUTES.login} replace />
  }

  if (!unit) {
    return <Navigate to={ROUTES.map} replace />
  }

  const activeUnit = unit

  function handleCompleteAndBack() {
    markUnitCompleted(activeUnit.id)
    navigate(ROUTES.map)
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-6 py-12">
      <section className="rounded-3xl border border-[color:var(--stroke)] bg-[color:var(--surface)] p-8 shadow-[0_16px_50px_rgba(0,0,0,0.3)] backdrop-blur-sm md:p-10">
        <p className="text-sm uppercase tracking-[0.28em] text-[color:var(--ink-muted)]">MVP Question</p>
        <h1 className="mt-3 text-3xl font-bold text-[color:var(--ink)]">{activeUnit.title}</h1>
        <p className="mt-2 text-base text-[color:var(--ink-muted)]">
          题目页骨架任务：
          <span className="ml-1 font-semibold text-[color:var(--accent)]">{PROGRESS_PERSIST_TASK_ID}</span>
        </p>
        <p className="mt-4 text-base text-[color:var(--ink-muted)]">{activeUnit.summary}</p>

        <div className="mt-6 rounded-2xl border border-[color:var(--stroke)] bg-[#0a1d3b]/70 p-5">
          <p className="text-sm text-[color:var(--ink-muted)]">
            这里预留真实题目流（题干、选项、提交、反馈）。当前 MVP 只验证路由与进度闭环。
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 md:flex-row">
          <button
            type="button"
            onClick={handleCompleteAndBack}
            className="inline-flex rounded-2xl bg-[color:var(--accent)] px-6 text-base font-semibold text-[#022125] transition hover:brightness-110"
            style={{ minHeight: UI_CONFIG.touchTargetMinPx }}
          >
            完成当前单元并返回地图
          </button>
          <button
            type="button"
            onClick={() => navigate(ROUTES.map)}
            className="inline-flex rounded-2xl border border-[color:var(--stroke)] bg-transparent px-6 text-base font-semibold text-[color:var(--ink)] transition hover:border-[color:var(--accent)]"
            style={{ minHeight: UI_CONFIG.touchTargetMinPx }}
          >
            返回地图
          </button>
        </div>
      </section>
    </main>
  )
}
