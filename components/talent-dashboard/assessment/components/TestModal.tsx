import { useEffect, useState, useCallback } from 'react'
import type { ClipboardEvent } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Clock, ChevronRight, AlertCircle, Timer, AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { submitTestResults } from './api'
import { TestResults } from './TestResults'
import type { Question, TestState, TestSettings } from './types'

// Security utility functions with proper types
const preventDevTools = () => {
  document.addEventListener('contextmenu', e => e.preventDefault())
  document.addEventListener('keydown', e => {
    if (
      (e.ctrlKey && (e.key === 'u' || e.key === 's' || e.key === 'p')) || // Prevent view source, save, print
      (e.ctrlKey && e.shiftKey && (e.key === 'i' || e.key === 'j' || e.key === 'c')) || // Prevent dev tools
      e.key === 'F12' // Prevent dev tools
    ) {
      e.preventDefault()
      return false
    }
  })
}

const preventCopyPaste = () => {
  document.addEventListener('copy', e => e.preventDefault())
  document.addEventListener('cut', e => e.preventDefault())
  document.addEventListener('paste', e => e.preventDefault())
}

const preventTextSelection = () => {
  document.addEventListener('selectstart', e => e.preventDefault())
}

const preventNavigation = () => {
  window.history.pushState(null, '', window.location.href)
  window.addEventListener('popstate', () => {
    window.history.pushState(null, '', window.location.href)
  })
}

interface TestModalProps {
  open: boolean
  onClose: () => void
  title: string
  selectedLevel: string
  questions: Question[]
  settings?: Partial<TestSettings>
}

export function TestModal({
  open,
  onClose,
  title,
  selectedLevel,
  questions,
  settings = {
    questionTimeLimit: 60,
    questionsPerTest: 10,
  },
}: TestModalProps) {
  const [state, setState] = useState<TestState>({
    currentQuestion: 0,
    answers: Array(questions.length).fill(null),
    timeRemaining: settings.questionTimeLimit || 0,
    settings: settings as Required<TestSettings>,
  })
  const [showResults, setShowResults] = useState(false)
  const [showExitAlert, setShowExitAlert] = useState(false)
  const [testStartTime] = useState(Date.now())
  const [totalTimeRemaining, setTotalTimeRemaining] = useState(questions.length * 60)

  const handleSubmit = useCallback(async () => {
    const timeSpent = Math.round((Date.now() - testStartTime) / 1000)
    const correctAnswers = state.answers.reduce(
      (acc, answer, index) => (answer === questions[index].correctAnswer ? acc + 1 : acc),
      0
    )
    const score = Math.round((correctAnswers / questions.length) * 100)
    const status = score >= 70 ? 'passed' : 'failed'

    try {
      await submitTestResults({
        title,
        score,
        status,
        answers: state.answers,
      })
    } catch (error) {
      console.error('Failed to submit results:', error)
    }

    setShowResults(true)
  }, [questions, state.answers, testStartTime, title])

  const handleCloseAttempt = useCallback(() => {
    if (!showResults) {
      setShowExitAlert(true)
    } else {
      onClose()
    }
  }, [showResults, onClose])

  // Apply security measures when test starts
  useEffect(() => {
    if (!open) return

    // Add CSS to prevent selection
    document.body.style.userSelect = 'none'
    document.body.style.webkitUserSelect = 'none'
    // document.body.style.msUserSelect = 'none'
    // document.body.style.mozUserSelect = 'none'

    // Enable security measures
    preventDevTools()
    preventCopyPaste()
    preventTextSelection()
    preventNavigation()

    // Cleanup function
    return () => {
      // Reset CSS
      document.body.style.userSelect = ''
      document.body.style.webkitUserSelect = ''
      // document.body.style.msUserSelect = ''
      // document.body.style.mozUserSelect = ''

      // Remove event listeners
      document.removeEventListener('contextmenu', preventDevTools)
      document.removeEventListener('copy', preventCopyPaste)
      document.removeEventListener('cut', preventCopyPaste)
      document.removeEventListener('paste', preventCopyPaste)
      document.removeEventListener('selectstart', preventTextSelection)
    }
  }, [open])

  // Timer effect
  useEffect(() => {
    if (!open) return

    // Timer for both question and total time
    const timer = setInterval(() => {
      setState(prev => {
        const newTime = prev.timeRemaining - 1
        setTotalTimeRemaining(time => {
          const newTotalTime = time - 1
          if (newTotalTime <= 0) {
            handleSubmit()
            return 0
          }
          return newTotalTime
        })

        // If time is up for current question
        if (newTime <= 0) {
          // If this was the last question
          if (prev.currentQuestion === questions.length - 1) {
            handleSubmit()
            return prev
          }

          // Move to next question
          return {
            ...prev,
            currentQuestion: prev.currentQuestion + 1,
            timeRemaining: prev.settings.questionTimeLimit,
          }
        }

        return {
          ...prev,
          timeRemaining: newTime,
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [open, questions.length, handleSubmit])

  const formatTotalTime = (seconds: number) => {
    if (seconds <= 0) return '0:00'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Reset timer when manually changing questions
  useEffect(() => {
    setState(prev => ({
      ...prev,
      timeRemaining: prev.settings.questionTimeLimit,
    }))
  }, [state.currentQuestion])

  const formatTime = (seconds: number) => {
    const remainingSeconds = seconds % 60
    return `0:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleAnswer = (optionIndex: number) => {
    setState(prev => ({
      ...prev,
      answers: prev.answers.map((ans, i) => (i === prev.currentQuestion ? optionIndex : ans)),
    }))
  }

  const currentQuestion = questions[state.currentQuestion]
  const progress = (state.currentQuestion / questions.length) * 100
  const timeProgress = (state.timeRemaining / state.settings.questionTimeLimit) * 100
  const totalDuration = (questions.length * state.settings.questionTimeLimit) / 60

  return (
    <>
      <Dialog open={open} onOpenChange={handleCloseAttempt}>
        <DialogContent
          className="max-w-[100vw] w-[100vw] h-[100vh] flex flex-col p-0 rounded-none border-0 select-none"
          style={{
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
          }}
          onCopy={(e: ClipboardEvent<HTMLDivElement>) => e.preventDefault()}
          onPaste={(e: ClipboardEvent<HTMLDivElement>) => e.preventDefault()}
        >
          <div className="p-6 border-b">
            <DialogTitle className="sr-only">{title} Assessment</DialogTitle>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">{title}</h2>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Level:</span>
                    <span className="font-medium capitalize">{selectedLevel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-600 font-mono">
                      Question: {formatTime(state.timeRemaining)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span className="text-purple-600 font-mono">
                      Total: {formatTotalTime(totalTimeRemaining)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  {questions[0].difficulty}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {['React', 'ReactJS', 'HTML', 'CSS', 'Java'].map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">{questions.length} Questions</span>
                <span className="text-gray-500">{totalDuration}:00</span>
              </div>
              <span className="text-gray-500">{Math.round(progress)}%</span>
            </div>
            {/* <Progress value={timeProgress} className="h-2" /> */}
          </div>

          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-3xl mx-auto">
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-sm text-gray-500">
                      Question {state.currentQuestion + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-purple-600">
                    <Timer className="w-4 h-4" />
                    <span className="text-sm">
                      Question {state.currentQuestion + 1} of {questions.length}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-medium mb-6">{currentQuestion.question}</h3>
                <div className="space-y-4">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        state.answers[state.currentQuestion] === index
                          ? 'border-purple-500 bg-purple-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                      onClick={() => handleAnswer(index)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            state.answers[state.currentQuestion] === index
                              ? 'border-purple-500 bg-purple-500'
                              : 'border-gray-300'
                          }`}
                        >
                          {state.answers[state.currentQuestion] === index && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <span>{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {state.answers[state.currentQuestion] === null && (
                <Alert className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Select an answer or skip this question</AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          <div className="p-6 border-t">
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setState(prev => {
                    const nextQuestion = prev.currentQuestion + 1
                    if (nextQuestion >= questions.length) return prev

                    return {
                      ...prev,
                      answers: prev.answers.map((ans, i) => (i === prev.currentQuestion ? 0 : ans)),
                      currentQuestion: nextQuestion,
                      timeRemaining: prev.settings.questionTimeLimit,
                    }
                  })
                }}
                disabled={state.currentQuestion >= questions.length - 1}
              >
                Skip Question
              </Button>
              {state.currentQuestion < questions.length - 1 ? (
                <Button
                  onClick={() =>
                    setState(prev => ({
                      ...prev,
                      currentQuestion: prev.currentQuestion + 1,
                      timeRemaining: prev.settings.questionTimeLimit,
                    }))
                  }
                  disabled={state.answers[state.currentQuestion] === undefined}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={state.answers.every(ans => ans === null)}>
                  Submit Test
                </Button>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Note: You cannot return to previous questions once answered or skipped
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showExitAlert} onOpenChange={setShowExitAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Exit Assessment?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Are you sure you want to exit? Your progress will be lost and you'll need to start
              over.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Assessment</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={onClose}>
              Exit Assessment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <TestResults
        open={showResults}
        onClose={() => {
          setShowResults(false)
          onClose()
        }}
        title={title}
        questions={questions}
        answers={state.answers}
        // timeSpent={`${Math.floor((Date.now() - testStartTime) / 60000)}:${(
        //   Math.floor((Date.now() - testStartTime) / 1000) % 60
        // )
        //   .toString()
        //   .padStart(2, '0')}`}
      />
    </>
  )
}
