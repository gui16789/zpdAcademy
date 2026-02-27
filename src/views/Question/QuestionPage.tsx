import { useState } from 'react'
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  LEARNING_UNITS,
  QUESTION_MODES,
  QUESTION_MVP_TASK_ID,
  ROUTES,
  UI_CONFIG,
} from '../../config/constants'
import { questionService } from '../../services/question/questionService'
import { useProgressStore } from '../../store/progressStore'
import { useUserStore } from '../../store/userStore'
import type { QuestionEvaluation, SingleChoiceQuestion } from '../../types/question'

export function QuestionPage() {
  const navigate = useNavigate()
  const { unitId } = useParams()
  const [searchParams] = useSearchParams()
  const user = useUserStore((state) => state.user)
  const submitUnitResult = useProgressStore((state) => state.submitUnitResult)
  const wrongQuestionRecords = useProgressStore((state) => state.wrongQuestionRecords)
  const unit = LEARNING_UNITS.find((item) => item.id === unitId)
  const entryMode = searchParams.get('mode')
  const initialWrongQuestionIds =
    entryMode === QUESTION_MODES.wrong && unit ? wrongQuestionRecords[unit.id] ?? [] : []
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [evaluation, setEvaluation] = useState<QuestionEvaluation | null>(null)
  const [activeQuestionIds, setActiveQuestionIds] = useState<string[] | null>(
    initialWrongQuestionIds.length > 0 ? initialWrongQuestionIds : null,
  )
  const [modeFeedback] = useState<string | null>(() =>
    entryMode === QUESTION_MODES.wrong
      ? initialWrongQuestionIds.length > 0
        ? `已进入错题重做模式，共 ${initialWrongQuestionIds.length} 题。`
        : '当前单元暂无历史错题，已切换为全量作答模式。'
      : null,
  )

  if (!user) {
    return <Navigate to={ROUTES.login} replace />
  }

  if (!unit) {
    return <Navigate to={ROUTES.map} replace />
  }

  const activeUnit = unit
  const questions = questionService.getQuestionsByUnit(activeUnit.id)
  const activeQuestions =
    activeQuestionIds && activeQuestionIds.length > 0
      ? questions.filter((question) => activeQuestionIds.includes(question.id))
      : questions
  const allAnswered =
    activeQuestions.length > 0 &&
    activeQuestions.every((question) => typeof answers[question.id] === 'string')

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

    const submissions = activeQuestions.map((question) => ({
      questionId: question.id,
      selectedOptionId: answers[question.id] ?? '',
    }))

    const nextEvaluation = questionService.evaluateQuestions(activeQuestions, submissions)
    submitUnitResult(
      activeUnit.id,
      nextEvaluation.score,
      nextEvaluation.isPassed,
      questionService.getWrongQuestionIds(nextEvaluation),
    )
    setEvaluation(nextEvaluation)
  }

  function handleCompleteAndBack() {
    navigate(ROUTES.map)
  }

  function resetAnswersForQuestions(targetQuestions: SingleChoiceQuestion[]) {
    setAnswers((prev) => {
      const next = { ...prev }

      targetQuestions.forEach((question) => {
        delete next[question.id]
      })

      return next
    })
  }

  function handleRetryCurrentSet() {
    resetAnswersForQuestions(activeQuestions)
    setEvaluation(null)
  }

  function handleRetryWrongOnly() {
    if (!evaluation) {
      return
    }

    const wrongQuestionIds = questionService.getWrongQuestionIds(evaluation)

    if (wrongQuestionIds.length === 0) {
      return
    }

    const wrongQuestions = questions.filter((question) => wrongQuestionIds.includes(question.id))
    setActiveQuestionIds(wrongQuestionIds)
    resetAnswersForQuestions(wrongQuestions)
    setEvaluation(null)
  }

  function resolveOptionLabel(question: SingleChoiceQuestion, optionId: string | null): string {
    if (!optionId) {
      return '未作答'
    }

    return question.options.find((option) => option.id === optionId)?.label ?? optionId
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
        <p className="mt-1 text-sm text-[color:var(--ink-muted)]">
          当前模式：{activeQuestionIds ? `错题重做（${activeQuestionIds.length} 题）` : '全量作答'}
        </p>
        {modeFeedback ? <p className="mt-1 text-sm text-[color:var(--accent)]">{modeFeedback}</p> : null}

        {activeQuestions.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-[color:var(--stroke)] bg-[#0a1d3b]/70 p-5">
            <p className="text-sm text-[color:var(--ink-muted)]">该单元暂无题目，请返回地图。</p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {activeQuestions.map((question, index) => {
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

        {evaluation && !evaluation.isPassed ? (
          <div className="mt-4 rounded-2xl border border-[color:var(--stroke)] bg-[#0a1d3b]/70 p-5">
            <p className="text-sm font-semibold text-[color:var(--ink)]">错题复盘</p>
            <div className="mt-3 space-y-3">
              {evaluation.results
                .filter((item) => !item.isCorrect)
                .map((item) => {
                  const question = questions.find((question) => question.id === item.questionId)

                  if (!question) {
                    return null
                  }

                  return (
                    <article key={item.questionId} className="rounded-xl border border-[color:var(--stroke)] p-3">
                      <p className="text-sm">{question.prompt}</p>
                      <p className="mt-1 text-xs text-[#ff9db3]">
                        你的答案：{resolveOptionLabel(question, item.selectedOptionId)}
                      </p>
                      <p className="mt-1 text-xs text-[#54f2bd]">
                        正确答案：{resolveOptionLabel(question, item.correctOptionId)}
                      </p>
                      <p className="mt-1 text-xs text-[color:var(--ink-muted)]">
                        解释：{question.explanation || '暂无解释'}
                      </p>
                    </article>
                  )
                })}
            </div>
          </div>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 md:flex-row">
          {!evaluation ? (
            <button
              type="button"
              onClick={handleSubmitAnswers}
              disabled={!allAnswered || activeQuestions.length === 0}
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
              onClick={handleRetryCurrentSet}
              className="inline-flex rounded-2xl bg-[color:var(--accent)] px-6 text-base font-semibold text-[#022125] transition hover:brightness-110"
              style={{ minHeight: UI_CONFIG.touchTargetMinPx }}
            >
              重做当前题集
            </button>
          )}
          {evaluation && !evaluation.isPassed ? (
            <button
              type="button"
              onClick={handleRetryWrongOnly}
              className="inline-flex rounded-2xl border border-[color:var(--stroke)] bg-transparent px-6 text-base font-semibold text-[color:var(--ink)] transition hover:border-[color:var(--accent)]"
              style={{ minHeight: UI_CONFIG.touchTargetMinPx }}
            >
              仅重做错题
            </button>
          ) : null}
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
