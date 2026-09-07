import { Button } from '@/components/ui/button';
import type { Assessment } from './types';
import { AssessmentCard } from './AssessmentCard';

interface AssessmentListProps {
  assessments: Assessment[];
  visibleCount: number;
  onShowMore: () => void;
}

export function AssessmentList({
  assessments,
  visibleCount,
  onShowMore,
}: AssessmentListProps) {
  if (assessments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No assessments found matching your criteria
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {assessments.slice(0, visibleCount).map((assessment) => (
          <AssessmentCard key={assessment.title} {...assessment} />
        ))}
      </div>

      {assessments.length > visibleCount && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={onShowMore}
            className="w-full sm:w-[140px]"
          >
            Show More
          </Button>
        </div>
      )}
    </div>
  );
}