export interface AssessmentStats {
  title: string
  value: string
  icon: any
  iconClass: string
}

export interface Course {
  id: string
  title: string
  description: string
  duration: string
  questions: number
  points: number
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  tags: string[]
}

export interface AssessmentData {
  stats: AssessmentStats[]
  courses: Course[]
}
