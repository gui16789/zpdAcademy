import { describe, expect, it } from 'vitest'
import { questionService } from './questionService'

describe('questionService', () => {
  it('returns questions for target unit', () => {
    const questions = questionService.getQuestionsByUnit('unit-01')

    expect(questions.length).toBeGreaterThan(0)
    expect(questions.every((question) => question.unitId === 'unit-01')).toBe(true)
  })

  it('returns questions by ids', () => {
    const questions = questionService.getQuestionsByIds(['q-0101', 'q-0301', 'invalid'])

    expect(questions.map((question) => question.id)).toEqual(['q-0101', 'q-0301'])
  })

  it('evaluates full correct answers as passed', () => {
    const questions = questionService.getQuestionsByUnit('unit-01')
    const submissions = questions.map((question) => ({
      questionId: question.id,
      selectedOptionId: question.correctOptionId,
    }))

    const result = questionService.evaluateQuestions(questions, submissions)

    expect(result.correctCount).toBe(questions.length)
    expect(result.score).toBe(100)
    expect(result.isPassed).toBe(true)
  })

  it('evaluates partial correct answers by score threshold', () => {
    const questions = questionService.getQuestionsByUnit('unit-02')
    const submissions = [
      {
        questionId: questions[0]?.id ?? '',
        selectedOptionId: questions[0]?.correctOptionId ?? '',
      },
      {
        questionId: questions[1]?.id ?? '',
        selectedOptionId: 'invalid',
      },
    ]

    const result = questionService.evaluateQuestions(questions, submissions)

    expect(result.correctCount).toBe(1)
    expect(result.score).toBe(50)
    expect(result.isPassed).toBe(false)
  })

  it('extracts wrong question ids from evaluation', () => {
    const questions = questionService.getQuestionsByUnit('unit-03')
    const submissions = questions.map((question, index) => ({
      questionId: question.id,
      selectedOptionId: index === 0 ? 'invalid' : question.correctOptionId,
    }))

    const evaluation = questionService.evaluateQuestions(questions, submissions)
    const wrongQuestionIds = questionService.getWrongQuestionIds(evaluation)

    expect(wrongQuestionIds).toEqual([questions[0]?.id])
  })
})
