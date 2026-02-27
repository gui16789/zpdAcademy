export interface QuestionOption {
  id: string
  label: string
}

export interface SingleChoiceQuestion {
  id: string
  unitId: string
  prompt: string
  options: QuestionOption[]
  correctOptionId: string
  explanation: string
}

export interface QuestionSubmission {
  questionId: string
  selectedOptionId: string
}

export interface QuestionResultItem {
  questionId: string
  selectedOptionId: string | null
  correctOptionId: string
  isCorrect: boolean
}

export interface QuestionEvaluation {
  totalQuestions: number
  correctCount: number
  score: number
  passScore: number
  isPassed: boolean
  results: QuestionResultItem[]
}
