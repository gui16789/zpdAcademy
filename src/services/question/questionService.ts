import { QUESTION_BANK } from '../../data/questionBank'
import { QUESTION_CONFIG } from '../../config/constants'
import type {
  QuestionEvaluation,
  QuestionSubmission,
  SingleChoiceQuestion,
} from '../../types/question'

export interface IQuestionService {
  getQuestionsByUnit(unitId: string): SingleChoiceQuestion[]
  evaluateQuestions(
    questions: SingleChoiceQuestion[],
    submissions: QuestionSubmission[],
  ): QuestionEvaluation
}

class QuestionService implements IQuestionService {
  public getQuestionsByUnit(unitId: string): SingleChoiceQuestion[] {
    return QUESTION_BANK.filter((question) => question.unitId === unitId)
  }

  public evaluateQuestions(
    questions: SingleChoiceQuestion[],
    submissions: QuestionSubmission[],
  ): QuestionEvaluation {
    const submissionMap = new Map(submissions.map((item) => [item.questionId, item.selectedOptionId]))

    const results = questions.map((question) => {
      const selectedOptionId = submissionMap.get(question.id) ?? null
      const isCorrect = selectedOptionId === question.correctOptionId

      return {
        questionId: question.id,
        selectedOptionId,
        correctOptionId: question.correctOptionId,
        isCorrect,
      }
    })

    const correctCount = results.filter((result) => result.isCorrect).length
    const totalQuestions = questions.length
    const score = totalQuestions === 0 ? 0 : Math.round((correctCount / totalQuestions) * 100)
    const passScore = QUESTION_CONFIG.passScore

    return {
      totalQuestions,
      correctCount,
      score,
      passScore,
      isPassed: score >= passScore,
      results,
    }
  }
}

export const questionService: IQuestionService = new QuestionService()
