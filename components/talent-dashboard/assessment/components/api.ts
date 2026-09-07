import {
  Assessment,
  Stats,
  TestResult,
  AssessmentStatus,
  TestSettings,
  Question,
  MCQApiResponse,
  TestData,
  AssessmentDifficulty,
  AssessmentCategory,
  CompletedAssessment,
} from './types'
import { FileText, CheckCircle, LineChart, Clock, Trophy } from 'lucide-react'

const DUMMY_QUESTIONS = [
  {
    _id: 'q1',
    question: "What is React's virtual DOM?",
    options: [
      'A real DOM that exists virtually',
      'A lightweight copy of the actual DOM',
      'A virtual reality interface for DOM manipulation',
      'A database for storing DOM elements',
    ],
    answer: 'A lightweight copy of the actual DOM',
    difficulty: 'Beginner',
    category: 'React',
    created_at: '2024-03-20T10:00:00Z',
    updated_at: '2024-03-20T10:00:00Z',
    aliases: ['Virtual DOM', 'VDOM'],
  },
  {
    _id: 'q2',
    question: 'What is the purpose of useEffect in React?',
    options: [
      'To create side effects in components',
      'To handle user effects',
      'To manage component lifecycle and side effects',
      'To affect the DOM directly',
    ],
    answer: 'To manage component lifecycle and side effects',
    difficulty: 'Intermediate',
    category: 'React',
    created_at: '2024-03-20T10:00:00Z',
    updated_at: '2024-03-20T10:00:00Z',
    aliases: ['Effects', 'Hooks'],
  },
  {
    _id: 'q3',
    question: 'What is TypeScript?',
    options: [
      'A programming language',
      'A superset of JavaScript with static typing',
      'A JavaScript framework',
      'A code editor',
    ],
    answer: 'A superset of JavaScript with static typing',
    difficulty: 'Beginner',
    category: 'TypeScript',
    created_at: '2024-03-20T10:00:00Z',
    updated_at: '2024-03-20T10:00:00Z',
    aliases: ['TS', 'JavaScript Types'],
  },
  {
    _id: 'q4',
    question: "What is the purpose of React's useCallback hook?",
    options: [
      'To memoize functions between renders',
      'To create callback functions',
      'To handle form submissions',
      'To manage component state',
    ],
    answer: 'To memoize functions between renders',
    difficulty: 'Intermediate',
    category: 'React',
    created_at: '2024-03-20T10:00:00Z',
    updated_at: '2024-03-20T10:00:00Z',
    aliases: ['Hooks', 'Performance'],
  },
  {
    _id: 'q5',
    question: 'What is a closure in JavaScript?',
    options: [
      'A way to close browser windows',
      'A function that has access to variables in its outer scope',
      'A method to end JavaScript execution',
      'A type of loop structure',
    ],
    answer: 'A function that has access to variables in its outer scope',
    difficulty: 'Intermediate',
    category: 'JavaScript',
    created_at: '2024-03-20T10:00:00Z',
    updated_at: '2024-03-20T10:00:00Z',
    aliases: ['Scope', 'Functions'],
  },
  {
    _id: 'q6',
    question: "What is the purpose of the 'key' prop in React lists?",
    options: [
      'To style list items',
      'To help React identify which items have changed',
      'To set the order of items',
      'To make items clickable',
    ],
    answer: 'To help React identify which items have changed',
    difficulty: 'Beginner',
    category: 'React',
    created_at: '2024-03-20T10:00:00Z',
    updated_at: '2024-03-20T10:00:00Z',
    aliases: ['Lists', 'Performance'],
  },
  {
    _id: 'q7',
    question: 'What is a Promise in JavaScript?',
    options: [
      'A guarantee of future payment',
      'An object representing a future value',
      'A type of function',
      'A way to store data',
    ],
    answer: 'An object representing a future value',
    difficulty: 'Intermediate',
    category: 'JavaScript',
    created_at: '2024-03-20T10:00:00Z',
    updated_at: '2024-03-20T10:00:00Z',
    aliases: ['Async', 'Promises'],
  },
  {
    _id: 'q8',
    question: 'What is the purpose of TypeScript interfaces?',
    options: [
      'To create user interfaces',
      'To define contracts for object structures',
      'To style components',
      'To handle HTTP requests',
    ],
    answer: 'To define contracts for object structures',
    difficulty: 'Intermediate',
    category: 'TypeScript',
    created_at: '2024-03-20T10:00:00Z',
    updated_at: '2024-03-20T10:00:00Z',
    aliases: ['Types', 'Interfaces'],
  },
  {
    _id: 'q9',
    question: 'What is Node.js?',
    options: [
      'A JavaScript framework',
      'A runtime environment for executing JavaScript outside the browser',
      'A database system',
      'A programming language',
    ],
    answer: 'A runtime environment for executing JavaScript outside the browser',
    difficulty: 'Beginner',
    category: 'Node.js',
    created_at: '2024-03-20T10:00:00Z',
    updated_at: '2024-03-20T10:00:00Z',
    aliases: ['Backend', 'JavaScript Runtime'],
  },
  {
    _id: 'q10',
    question: "What is the purpose of React's useMemo hook?",
    options: [
      'To create memos',
      'To memoize expensive computations',
      'To remember user input',
      'To store component state',
    ],
    answer: 'To memoize expensive computations',
    difficulty: 'Advanced',
    category: 'React',
    created_at: '2024-03-20T10:00:00Z',
    updated_at: '2024-03-20T10:00:00Z',
    aliases: ['Hooks', 'Performance'],
  },
]

const DEFAULT_TEST_SETTINGS = {
  questionTimeLimit: 60,
  questionsPerTest: 10,
}

let currentTestSettings = { ...DEFAULT_TEST_SETTINGS }

const FALLBACK_COMPLETED_ASSESSMENTS = [
  {
    title: 'Frontend Engineer Track',
    description:
      'Master modern frontend engineering with React, Next.js, and advanced TypeScript patterns',
    duration: '90 min',
    questions: 45,
    tags: ['React', 'Next.js', 'TypeScript', 'System Design', 'Performance'],
    points: 100,
    level: 'medium',
    completedAt: '2024-03-15',
    score: 85,
    status: 'passed' as AssessmentStatus,
    timeSpent: '82 min',
    answers: {
      correct: 38,
      incorrect: 5,
      skipped: 2,
    },
    breakdown: [
      { category: 'React Fundamentals', score: 18, total: 20 },
      { category: 'TypeScript', score: 15, total: 18 },
      { category: 'System Design', score: 12, total: 15 },
      { category: 'Performance', score: 10, total: 12 },
    ],
  },
  {
    title: 'Backend Engineer Track',
    description:
      'Design and build scalable distributed systems, microservices, and cloud infrastructure',
    duration: '120 min',
    questions: 50,
    tags: ['System Design', 'Cloud Architecture', 'Databases', 'Security', 'APIs'],
    points: 120,
    level: 'medium',
    completedAt: '2024-03-10',
    score: 78,
    status: 'passed' as AssessmentStatus,
    timeSpent: '115 min',
    answers: {
      correct: 39,
      incorrect: 8,
      skipped: 3,
    },
    breakdown: [
      { category: 'System Design', score: 16, total: 20 },
      { category: 'Databases', score: 14, total: 18 },
      { category: 'Security', score: 12, total: 15 },
      { category: 'APIs', score: 9, total: 12 },
    ],
  },
  {
    title: 'Full Stack Engineer Track',
    description:
      'End-to-end development expertise from frontend to backend, including architecture and deployment',
    duration: '120 min',
    questions: 60,
    tags: ['Full Stack', 'Architecture', 'DevOps', 'Cloud', 'System Design'],
    points: 150,
    level: 'hard',
    completedAt: '2024-03-05',
    score: 92,
    status: 'passed' as AssessmentStatus,
    timeSpent: '118 min',
    answers: {
      correct: 55,
      incorrect: 3,
      skipped: 2,
    },
    breakdown: [
      { category: 'Frontend Development', score: 19, total: 20 },
      { category: 'Backend Development', score: 18, total: 20 },
      { category: 'DevOps & Cloud', score: 16, total: 18 },
      { category: 'System Design', score: 17, total: 18 },
    ],
  },
  {
    title: 'Engineering Manager Track',
    description:
      'Lead engineering teams, manage technical projects, and drive organizational growth',
    duration: '120 min',
    questions: 55,
    tags: ['Team Leadership', 'Project Management', 'Agile', 'Technical Planning', 'Mentorship'],
    points: 150,
    level: 'hard',
    completedAt: '2024-03-01',
    score: 88,
    status: 'passed' as AssessmentStatus,
    timeSpent: '115 min',
    answers: {
      correct: 48,
      incorrect: 5,
      skipped: 2,
    },
    breakdown: [
      { category: 'Team Leadership', score: 18, total: 20 },
      { category: 'Project Management', score: 16, total: 18 },
      { category: 'Technical Planning', score: 14, total: 15 },
      { category: 'Mentorship', score: 12, total: 14 },
    ],
  },
  {
    title: 'CTO Leadership Track',
    description:
      'Strategic technical leadership, architecture decision making, and engineering team management',
    duration: '150 min',
    questions: 75,
    tags: ['Leadership', 'Architecture', 'Strategy', 'Team Management', 'Innovation'],
    points: 200,
    level: 'hard',
    completedAt: '2024-02-25',
    score: 95,
    status: 'passed' as AssessmentStatus,
    timeSpent: '142 min',
    answers: {
      correct: 71,
      incorrect: 2,
      skipped: 2,
    },
    breakdown: [
      { category: 'Technical Leadership', score: 24, total: 25 },
      { category: 'Architecture', score: 23, total: 25 },
      { category: 'Strategy', score: 22, total: 23 },
      { category: 'Innovation', score: 20, total: 22 },
    ],
  },
] as CompletedAssessment[]

// Since we don't have a real API yet, we'll use fallback data
const FALLBACK_ASSESSMENTS: Assessment[] = [
  {
    title: 'Frontend Engineer Track',
    description:
      'Master modern frontend engineering with React, Next.js, and advanced TypeScript patterns',
    duration: '90 min',
    questions: 45,
    tags: ['React', 'Next.js', 'TypeScript', 'System Design', 'Performance'],
    points: 100,
    level: 'medium',
  },
  {
    title: 'Backend Engineer Track',
    description:
      'Design and build scalable distributed systems, microservices, and cloud infrastructure',
    duration: '120 min',
    questions: 50,
    tags: ['System Design', 'Cloud Architecture', 'Databases', 'Security', 'APIs'],
    points: 120,
    level: 'medium',
  },
  {
    title: 'Full Stack Engineer Track',
    description:
      'End-to-end development expertise from frontend to backend, including architecture and deployment',
    duration: '120 min',
    questions: 60,
    tags: ['Full Stack', 'Architecture', 'DevOps', 'Cloud', 'System Design'],
    points: 150,
    level: 'hard',
  },
  {
    title: 'CTO Leadership Track',
    description:
      'Strategic technical leadership, architecture decision making, and engineering team management',
    duration: '150 min',
    questions: 75,
    tags: ['Leadership', 'Architecture', 'Strategy', 'Team Management', 'Innovation'],
    points: 200,
    level: 'hard',
  },
  {
    title: 'Engineering Manager Track',
    description:
      'Lead engineering teams, manage technical projects, and drive organizational growth',
    duration: '120 min',
    questions: 55,
    tags: ['Team Leadership', 'Project Management', 'Agile', 'Technical Planning', 'Mentorship'],
    points: 150,
    level: 'hard',
  },
]

const FALLBACK_STATS: Stats[] = [
  { icon: FileText, label: 'Total Assessment', value: '12' },
  { icon: CheckCircle, label: 'Assessment Passed', value: '8' },
  { icon: LineChart, label: 'Average Score', value: '85%' },
  { icon: Clock, label: 'Time Spent', value: '24h' },
]

export async function fetchAssessments(): Promise<Assessment[]> {
  // For now, return fallback data directly since we don't have an API
  return FALLBACK_ASSESSMENTS
}

export async function fetchStats(): Promise<Stats[]> {
  // For now, return fallback data directly since we don't have an API
  return FALLBACK_STATS
}

export async function fetchCompletedAssessments() {
  return FALLBACK_COMPLETED_ASSESSMENTS
}

// Function to update test settings - simulates API call
export async function updateTestSettings(
  newSettings: Partial<TestSettings>
): Promise<TestSettings> {
  currentTestSettings = {
    ...currentTestSettings,
    ...newSettings,
  }
  return currentTestSettings
}

// Function to get current test settings - simulates API call
export async function getTestSettings(): Promise<TestSettings> {
  return currentTestSettings
}

export async function fetchQuestions(
  assessmentTitle: string,
  difficulty: AssessmentDifficulty = 'Beginner',
  category: AssessmentCategory = 'JavaScript',
  page: number = 1
): Promise<TestData> {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock API response
    const mockResponse: MCQApiResponse = {
      pagination: {
        total: DUMMY_QUESTIONS.length,
        page: '1',
        limit: 10,
        totalPages: 1,
      },
      success: true,
      data: DUMMY_QUESTIONS,
    }

    // Transform API response to match our Question type
    const questions: Question[] = mockResponse.data.map(q => ({
      id: parseInt(q._id.slice(-6), 16), // Generate a numeric ID from the last 6 chars of _id
      question: q.question,
      options: q.options,
      correctAnswer: q.options.findIndex(opt => opt === q.answer),
      answer: q.answer,
      difficulty: q.difficulty,
      category: q.category,
      created_at: q.created_at,
      updated_at: q.updated_at,
      aliases: q.aliases,
    }))

    return {
      questions: questions.slice(0, currentTestSettings.questionsPerTest),
      settings: currentTestSettings,
    }
  } catch (error) {
    console.error('Error fetching questions:', error)
    throw error
  }
}

export async function submitTestResults(results: TestResult): Promise<void> {
  // Simulate API call with delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log('Test results submitted:', results)
}
