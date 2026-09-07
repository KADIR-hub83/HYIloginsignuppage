import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Trophy, CheckCircle, XCircle, Medal, Star, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Question } from './types';

interface TestResultsProps {
  open: boolean;
  onClose: () => void;
  title: string;
  questions: Question[];
  answers: number[];
}

export function TestResults({
  open,
  onClose,
  title,
  questions,
  answers
}: TestResultsProps) {
  const correctAnswers = answers.reduce<number>((acc, answer, index) => 
    answer === questions[index].correctAnswer ? acc + 1 : acc, 0
  );
  
  const score = Math.round((correctAnswers / questions.length) * 100);
  const status = score >= 70 ? 'passed' : 'failed';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-b from-white to-gray-50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Assessment Complete!</DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-6">
          <div className="text-center space-y-2">
            <div className="relative inline-flex justify-center items-center">
              <div className={`w-32 h-32 rounded-full flex items-center justify-center ${
                status === 'passed' 
                  ? 'bg-gradient-to-br from-green-50 to-emerald-100'
                  : 'bg-gradient-to-br from-red-50 to-rose-100'
              }`}>
                {status === 'passed' ? (
                  <Trophy className="w-16 h-16 text-yellow-500" />
                ) : (
                  <Medal className="w-16 h-16 text-gray-400" />
                )}
              </div>
              <div className="absolute -top-2 -right-2">
                {status === 'passed' && (
                  <div className="bg-yellow-400 text-white p-2 rounded-full">
                    <Star className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>
            <h3 className={`text-4xl font-bold ${
              status === 'passed' ? 'text-green-600' : 'text-red-600'
            }`}>
              {score}%
            </h3>
            <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-full ${
              status === 'passed' 
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {status === 'passed' ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              <span className="font-medium capitalize">{status}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-500" />
              Assessment Details
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Track</p>
                <p className="font-medium">{title}</p>
              </div>
              <div>
                <p className="text-gray-500">Questions</p>
                <p className="font-medium">{questions.length} questions</p>
              </div>
              <div>
                <p className="text-gray-500">Correct Answers</p>
                <p className="font-medium text-green-600">{correctAnswers} correct</p>
              </div>
              <div>
                <p className="text-gray-500">Incorrect Answers</p>
                <p className="font-medium text-red-600">
                  {questions.length - correctAnswers} incorrect
                </p>
              </div>
            </div>
          </div>

          <div className={`rounded-lg p-4 ${
            status === 'passed'
              ? 'bg-green-50 border border-green-100'
              : 'bg-red-50 border border-red-100'
          }`}>
            <p className={`text-sm ${
              status === 'passed' ? 'text-green-700' : 'text-red-700'
            }`}>
              {status === 'passed'
                ? 'Congratulations! You have successfully passed the assessment. Your results demonstrate a strong understanding of the subject matter.'
                : 'Keep practicing! While you didn\'t pass this time, each attempt is a learning opportunity. Review the topics and try again.'
              }
            </p>
          </div>

          <DialogFooter className="flex gap-2 pt-4">
            <Button onClick={onClose} className="w-full">
              Close Results
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}