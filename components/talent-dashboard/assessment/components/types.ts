export type AssessmentLevel = 'beginner' | 'medium' | 'hard'
export type AssessmentDifficulty = 'Beginner' | 'Intermediate' | 'Advanced'
export type AssessmentCategory = 'JavaScript' | 'TypeScript' | 'React' | 'Node.js'

export interface Assessment {
  title: string
  description: string
  duration: string
  questions: number
  tags: string[]
  points: number
  level: AssessmentLevel
}

export interface CompletedAssessment extends Assessment {
  completedAt: string
  score: number
  status: 'passed' | 'failed'
  timeSpent: string
  answers?: {
    correct: number
    incorrect: number
    skipped: number
  }
  breakdown?: {
    category: string
    score: number
    total: number
  }[]
}

export interface Stats {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
}

export interface MCQApiResponse {
  pagination: {
    total: number
    page: string
    limit: number
    totalPages: number
  }
  success: boolean
  data: {
    _id: string
    question: string
    options: string[]
    answer: string
    difficulty: string
    category: string
    created_at: string
    updated_at: string
    aliases: string[]
  }[]
}

export interface TestSettings {
  questionTimeLimit: number // Time per question in seconds
  questionsPerTest: number // Number of questions to show in test
}

export interface TestData {
  questions: Question[]
  settings: TestSettings
}

export interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  answer: string
  difficulty: string
  category: string
  created_at: string
  updated_at: string
  aliases: string[]
}

export type AssessmentStatus = 'passed' | 'failed'

export interface TestResult {
  title: string
  score: number
  status: 'passed' | 'failed'
  answers: number[]
}

export interface TestState {
  currentQuestion: number
  answers: number[]
  timeRemaining: number
  settings: TestSettings
}
