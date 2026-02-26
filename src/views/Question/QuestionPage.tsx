import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { LEARNING_UNITS, QUESTION_MVP_TASK_ID, ROUTES, UI_CONFIG } from '../../config/constants'
import { questionService } from '../../services/question/questionService'
import { useProgressStore } from '../../store/progressStore'
import { useUserStore } from '../../store/userStore'
import type { QuestionEvaluation } from '../../types/question'

export function QuestionPage() {
  const navigate = useNavigate()
  const { unitId } = useParams()
  const user = useUserStore((state) => state.user)
  const markUnitCompleted = useProgressStore((state) => state.markUnitCompleted)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [evaluation, setEvaluation] = useState<QuestionEvaluation | null>(null)
  const unit = LEARNING_UNITS.find((item) => item.id === unitId)

  if (!user) {
    return <Navigate to={ROUTES.login} replace />
  }

  if (!unit) {
    return <Navigate to={ROUTES.map} replace />
  }

  const activeUnit = unit
  const questions = questionService.getQuestionsByUnit(activeUnit.id)
  const allAnswered =
    questions.length > 0 && questions.every((question) => typeof answers[question.id] === 'string')

  function handleSelectAnswer(questionId: string, optionId: string) {
    setEvaluation(null)
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }))
  }

  function handleSubmitAnswers() {
    if (!allAnswered) {
      return
    }

    const submissions = questions.map((question) => ({
      questionId: question.id,
      selectedOptionId: answers[question.id] ?? '',
    }))

    setEvaluation(questionService.evaluateQuestions(questions, submissions))
  }

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
          题目页答题任务：
          <span className="ml-1 font-semibold text-[color:var(--accent)]">{QUESTION_MVP_TASK_ID}</span>
        </p>
        <p className="mt-4 text-base text-[color:var(--ink-muted)]">{activeUnit.summary}</p>

        {questions.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-[color:var(--stroke)] bg-[#0a1d3b]/70 p-5">
            <p className="text-sm text-[color:var(--ink-muted)]">该单元暂无题目，请返回地图。</p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {questions.map((question, index) => {
              const questionResult = evaluation?.results.find((item) => item.questionId === question.id)

              return (
                <article
                  key={question.id}
                  className="rounded-2xl border border-[color:var(--stroke)] bg-[#0a1d3b]/70 p-5"
                >
                  <h2 className="text-base font-semibold">
                    {index + 1}. {question.prompt}
                  </h2>
                  <div className="mt-3 grid gap-2">
                    {question.options.map((option) => {
                      const isSelected = answers[question.id] === option.id
                      const shouldHighlightCorrect =
                        Boolean(evaluation) && option.id === question.correctOptionId
                      const shouldHighlightWrongSelected =
                        Boolean(evaluation) && isSelected && option.id !== question.correctOptionId

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => handleSelectAnswer(question.id, option.id)}
                          className="rounded-xl border px-4 text-left text-sm transition"
                          style={{
                            minHeight: UI_CONFIG.touchTargetMinPx,
                            borderColor: shouldHighlightCorrect
                              ? '#54f2bd'
                              : shouldHighlightWrongSelected
                                ? '#ff7f9d'
                                : isSelected
                                  ? '#9ab9ff'
                                  : 'var(--stroke)',
                            backgroundColor:
                              shouldHighlightCorrect || shouldHighlightWrongSelected
                                ? 'rgba(255,255,255,0.04)'
                                : 'transparent',
                          }}
                          disabled={Boolean(evaluation)}
                        >
                          {option.label}
                        </button>
                      )
                    })}
                  </div>
                  {evaluation ? (
                    <p
                      className="mt-3 text-xs"
                      style={{ color: questionResult?.isCorrect ? '#54f2bd' : '#ff7f9d' }}
                    >
                      {questionResult?.isCorrect ? '回答正确' : '回答错误'}
                    </p>
                  ) : null}
                </article>
              )
            })}
          </div>
        )}

        {evaluation ? (
          <div className="mt-6 rounded-2xl border border-[color:var(--stroke)] bg-[#0a1d3b]/70 p-5">
            <p className="text-base font-semibold">
              得分：{evaluation.score}（{evaluation.correctCount}/{evaluation.totalQuestions}）
            </p>
            <p
              className="mt-2 text-sm"
              style={{ color: evaluation.isPassed ? '#54f2bd' : '#ff7f9d' }}
            >
              {evaluation.isPassed
                ? `已达标（>= ${evaluation.passScore}），可完成单元。`
                : `未达标（需 >= ${evaluation.passScore}），请重试。`}
            </p>
          </div>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 md:flex-row">
          {!evaluation ? (
            <button
              type="button"
              onClick={handleSubmitAnswers}
              disabled={!allAnswered || questions.length === 0}
              className="inline-flex rounded-2xl bg-[color:var(--accent)] px-6 text-base font-semibold text-[#022125] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ minHeight: UI_CONFIG.touchTargetMinPx }}
            >
              提交答案
            </button>
          ) : evaluation.isPassed ? (
            <button
              type="button"
              onClick={handleCompleteAndBack}
              className="inline-flex rounded-2xl bg-[color:var(--accent)] px-6 text-base font-semibold text-[#022125] transition hover:brightness-110"
              style={{ minHeight: UI_CONFIG.touchTargetMinPx }}
            >
              完成当前单元并返回地图
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setEvaluation(null)}
              className="inline-flex rounded-2xl bg-[color:var(--accent)] px-6 text-base font-semibold text-[#022125] transition hover:brightness-110"
              style={{ minHeight: UI_CONFIG.touchTargetMinPx }}
            >
              继续重试
            </button>
          )}
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
