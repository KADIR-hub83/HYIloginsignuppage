import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Clock, FileText } from 'lucide-react';
import { useState } from 'react';
import { AssessmentDetailsDialog } from './AssessmentDetailsDialog';
import type { CompletedAssessment } from './types';

interface CompletedAssessmentCardProps {
  assessment: CompletedAssessment;
}

export function CompletedAssessmentCard({ assessment }: CompletedAssessmentCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const {
    title,
    score,
    completedAt,
    timeSpent,
    questions,
    status,
    tags
  } = assessment;

  const formattedDate = new Date(completedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Card className="p-4 sm:p-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-bold">{title}</h3>
            <p className="text-sm text-gray-500">Completed on {formattedDate}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm ${
            status === 'passed' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {status === 'passed' ? 'Passed' : 'Failed'}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-500">Score</p>
              <p className="font-semibold">{score}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Time</p>
              <p className="font-semibold">{timeSpent}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-500" />
            <div>
              <p className="text-sm text-gray-500">Questions</p>
              <p className="font-semibold">{questions}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => setShowDetails(true)}>
            View Details
          </Button>
        </div>
      </div>
      <AssessmentDetailsDialog
        assessment={assessment}
        open={showDetails}
        onOpenChange={setShowDetails}
      />
    </Card>
  );
}