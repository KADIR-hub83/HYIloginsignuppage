import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Trophy, Clock, FileText, CheckCircle, XCircle, HelpCircle } from 'lucide-react'
import type { CompletedAssessment } from './types'

interface AssessmentDetailsDialogProps {
  assessment: CompletedAssessment
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AssessmentDetailsDialog({
  assessment,
  open,
  onOpenChange,
}: AssessmentDetailsDialogProps) {
  const { title, score, completedAt, timeSpent, questions, answers, breakdown, status, tags } =
    assessment

  const formattedDate = new Date(completedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assessment Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-sm text-gray-500">Completed on {formattedDate}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-500">Score</p>
                <p className="font-semibold">{score}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-semibold">{timeSpent}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-500">Questions</p>
                <p className="font-semibold">{questions}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`p-1.5 rounded-full ${
                  status === 'passed' ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                {status === 'passed' ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p
                  className={`font-semibold ${
                    status === 'passed' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {status === 'passed' ? 'Passed' : 'Failed'}
                </p>
              </div>
            </div>
          </div>

          {answers && (
            <div className="space-y-3">
              <h4 className="font-semibold">Answer Distribution</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">Correct</p>
                    <p className="font-semibold">{answers.correct}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-500">Incorrect</p>
                    <p className="font-semibold">{answers.incorrect}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Skipped</p>
                    <p className="font-semibold">{answers.skipped}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {breakdown && (
            <div className="space-y-3">
              <h4 className="font-semibold">Category Breakdown</h4>
              <div className="space-y-4">
                {breakdown.map(item => (
                  <div key={item.category} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{item.category}</span>
                      <span className="font-medium">
                        {item.score}/{item.total}
                      </span>
                    </div>
                    {/* <Progress value={(item.score / item.total) * 100} /> */}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="font-semibold mb-2">Topics Covered</h4>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
