import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import {
  LEARNING_UNITS,
  MAP_PROGRESS_TASK_ID,
  PROGRESS_PERSIST_TASK_ID,
  ROUTES,
  UI_CONFIG,
  buildQuestionRoute,
} from '../../config/constants'
import { getLearningUnitsWithStatus } from '../../features/progress/selectors'
import { useProgressStore } from '../../store/progressStore'
import { useUserStore } from '../../store/userStore'
import type { LearningUnitWithStatus } from '../../types/progress'

export function MapPage() {
  const navigate = useNavigate()
  const user = useUserStore((state) => state.user)
  const clearUser = useUserStore((state) => state.clearUser)
  const completedUnitIds = useProgressStore((state) => state.completedUnitIds)
  const currentUnlockedIndex = useProgressStore((state) => state.currentUnlockedIndex)
  const resetProgress = useProgressStore((state) => state.resetProgress)
  const [feedback, setFeedback] = useState<string | null>(null)

  const units = getLearningUnitsWithStatus(LEARNING_UNITS, completedUnitIds, currentUnlockedIndex)

  const completedCount = completedUnitIds.length

  if (!user) {
    return <Navigate to={ROUTES.login} replace />
  }

  function handleLogout() {
    clearUser()
    navigate(ROUTES.login)
  }

  function getButtonLabel(unit: LearningUnitWithStatus): string {
    if (unit.status === 'completed') {
      return '复习单元'
    }

    if (unit.status === 'unlocked') {
      return '进入单元'
    }

    return '未解锁'
  }

  function handleUnitAction(unit: LearningUnitWithStatus) {
    if (unit.status === 'locked') {
      setFeedback(`${unit.title} 尚未解锁。`)
      return
    }

    navigate(buildQuestionRoute(unit.id))
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-12">
      <section className="rounded-3xl border border-[color:var(--stroke)] bg-[color:var(--surface)] p-8 shadow-[0_16px_50px_rgba(0,0,0,0.3)] backdrop-blur-sm md:p-10">
        <p className="text-sm uppercase tracking-[0.28em] text-[color:var(--ink-muted)]">MVP Map</p>
        <h1 className="mt-3 text-4xl font-bold text-[color:var(--ink)]">欢迎，{user.username}</h1>
        <p className="mt-3 max-w-2xl text-base text-[color:var(--ink-muted)]">
          学习进度任务：<span className="font-semibold text-[color:var(--accent)]">{MAP_PROGRESS_TASK_ID}</span>
        </p>
        <p className="mt-1 max-w-2xl text-base text-[color:var(--ink-muted)]">
          持久化任务：
          <span className="ml-1 font-semibold text-[color:var(--accent)]">
            {PROGRESS_PERSIST_TASK_ID}
          </span>
        </p>
        <p className="mt-3 text-base text-[color:var(--ink-muted)]">
          进度：{completedCount} / {LEARNING_UNITS.length} 单元已完成
        </p>

        {feedback ? <p className="mt-4 text-sm text-[color:var(--accent)]">{feedback}</p> : null}

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {units.map((unit) => (
            <article
              key={unit.id}
              className="rounded-2xl border border-[color:var(--stroke)] bg-[#0a1d3b]/70 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-semibold">{unit.title}</h2>
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
                  style={{
                    backgroundColor:
                      unit.status === 'completed'
                        ? 'rgba(84,242,189,0.16)'
                        : unit.status === 'unlocked'
                          ? 'rgba(123,169,255,0.2)'
                          : 'rgba(173,196,239,0.14)',
                    color:
                      unit.status === 'completed'
                        ? '#54f2bd'
                        : unit.status === 'unlocked'
                          ? '#9ab9ff'
                          : '#adc4ef',
                  }}
                >
                  {unit.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-[color:var(--ink-muted)]">{unit.summary}</p>
              <p className="mt-2 text-sm text-[color:var(--ink-muted)]">预计 {unit.durationMin} 分钟</p>
              <button
                type="button"
                disabled={!unit.isActionable}
                onClick={() => handleUnitAction(unit)}
                className="mt-4 w-full rounded-xl border border-[color:var(--stroke)] px-4 text-base font-semibold transition enabled:hover:border-[color:var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
                style={{ minHeight: UI_CONFIG.touchTargetMinPx }}
              >
                {getButtonLabel(unit)}
              </button>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 md:flex-row">
          <button
            type="button"
            onClick={resetProgress}
            className="inline-flex rounded-2xl border border-[color:var(--stroke)] bg-transparent px-6 text-base font-semibold text-[color:var(--ink)] transition hover:border-[color:var(--accent)]"
            style={{ minHeight: UI_CONFIG.touchTargetMinPx }}
          >
            重置进度
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex rounded-2xl border border-[color:var(--stroke)] bg-transparent px-6 text-base font-semibold text-[color:var(--ink)] transition hover:border-[color:var(--accent)]"
            style={{ minHeight: UI_CONFIG.touchTargetMinPx }}
          >
            退出登录
          </button>
        </div>
      </section>
    </main>
  )
}
