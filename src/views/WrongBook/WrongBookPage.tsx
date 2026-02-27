import { Navigate, useNavigate } from 'react-router-dom'
import {
  LEARNING_UNITS,
  ROUTES,
  UI_CONFIG,
  buildWrongOnlyQuestionRoute,
} from '../../config/constants'
import { questionService } from '../../services/question/questionService'
import { useProgressStore } from '../../store/progressStore'
import { useUserStore } from '../../store/userStore'
import type { SingleChoiceQuestion } from '../../types/question'

interface WrongBookUnitSection {
  unitId: string
  unitTitle: string
  unitSummary: string
  wrongQuestionIds: string[]
  questions: SingleChoiceQuestion[]
  updatedAt: number
}

function buildWrongBookSections(
  wrongQuestionRecords: Record<string, string[]>,
  wrongQuestionUpdatedAt: Record<string, number>,
): WrongBookUnitSection[] {
  return LEARNING_UNITS.map((unit) => {
    const wrongQuestionIds = wrongQuestionRecords[unit.id] ?? []
    const questionsById = new Map(
      questionService.getQuestionsByIds(wrongQuestionIds).map((question) => [question.id, question]),
    )
    const questions = wrongQuestionIds
      .map((questionId) => questionsById.get(questionId))
      .filter((question): question is SingleChoiceQuestion => Boolean(question))

    return {
      unitId: unit.id,
      unitTitle: unit.title,
      unitSummary: unit.summary,
      wrongQuestionIds,
      questions,
      updatedAt: wrongQuestionUpdatedAt[unit.id] ?? 0,
    }
  })
    .filter((section) => section.questions.length > 0)
    .sort((left, right) => right.updatedAt - left.updatedAt)
}

export function WrongBookPage() {
  const navigate = useNavigate()
  const user = useUserStore((state) => state.user)
  const wrongQuestionRecords = useProgressStore((state) => state.wrongQuestionRecords)
  const wrongQuestionUpdatedAt = useProgressStore((state) => state.wrongQuestionUpdatedAt)
  const clearWrongQuestionsForUnit = useProgressStore((state) => state.clearWrongQuestionsForUnit)

  if (!user) {
    return <Navigate to={ROUTES.login} replace />
  }

  const sections = buildWrongBookSections(wrongQuestionRecords, wrongQuestionUpdatedAt)
  const totalWrongCount = sections.reduce((total, section) => total + section.questions.length, 0)

  function resolveCorrectAnswerLabel(question: SingleChoiceQuestion): string {
    return (
      question.options.find((option) => option.id === question.correctOptionId)?.label ??
      question.correctOptionId
    )
  }

  function formatUpdatedAt(timestamp: number): string {
    if (timestamp <= 0) {
      return '未知'
    }

    return new Date(timestamp).toLocaleString('zh-CN', { hour12: false })
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-12">
      <section className="rounded-3xl border border-[color:var(--stroke)] bg-[color:var(--surface)] p-8 shadow-[0_16px_50px_rgba(0,0,0,0.3)] backdrop-blur-sm md:p-10">
        <p className="text-sm uppercase tracking-[0.28em] text-[color:var(--ink-muted)]">Wrong Book</p>
        <h1 className="mt-3 text-4xl font-bold text-[color:var(--ink)]">错题本</h1>
        <p className="mt-3 text-base text-[color:var(--ink-muted)]">
          当前累计 {totalWrongCount} 题待复盘，按单元组织。
        </p>

        {sections.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-[color:var(--stroke)] bg-[#0a1d3b]/70 p-5">
            <p className="text-base font-semibold text-[color:var(--ink)]">暂无错题</p>
            <p className="mt-2 text-sm text-[color:var(--ink-muted)]">
              继续完成单元答题后，错题会自动收录到这里。
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {sections.map((section) => (
              <article
                key={section.unitId}
                className="rounded-2xl border border-[color:var(--stroke)] bg-[#0a1d3b]/70 p-5"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-[color:var(--ink)]">{section.unitTitle}</h2>
                    <p className="mt-1 text-sm text-[color:var(--ink-muted)]">{section.unitSummary}</p>
                    <p className="mt-1 text-xs text-[color:var(--ink-muted)]">
                      错题 {section.questions.length} 题
                    </p>
                    <p className="mt-1 text-xs text-[color:var(--ink-muted)]">
                      最近更新：{formatUpdatedAt(section.updatedAt)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 md:items-end">
                    <button
                      type="button"
                      onClick={() => navigate(buildWrongOnlyQuestionRoute(section.unitId))}
                      className="inline-flex rounded-xl border border-[color:var(--stroke)] px-4 text-sm font-semibold transition hover:border-[color:var(--accent)]"
                      style={{ minHeight: UI_CONFIG.touchTargetMinPx }}
                    >
                      重做本单元错题
                    </button>
                    <button
                      type="button"
                      onClick={() => clearWrongQuestionsForUnit(section.unitId)}
                      className="inline-flex rounded-xl border border-[#ff7f9d] px-4 text-sm font-semibold text-[#ff9db3] transition hover:bg-[rgba(255,127,157,0.08)]"
                      style={{ minHeight: UI_CONFIG.touchTargetMinPx }}
                    >
                      清空本单元错题
                    </button>
                  </div>
                </div>
                <div className="mt-4 grid gap-3">
                  {section.questions.map((question, index) => (
                    <div key={question.id} className="rounded-xl border border-[color:var(--stroke)] p-3">
                      <p className="text-sm font-semibold text-[color:var(--ink)]">
                        {index + 1}. {question.prompt}
                      </p>
                      <p className="mt-1 text-xs text-[#54f2bd]">
                        正确答案：{resolveCorrectAnswerLabel(question)}
                      </p>
                      <p className="mt-1 text-xs text-[color:var(--ink-muted)]">
                        解释：{question.explanation || '暂无解释'}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-8">
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
