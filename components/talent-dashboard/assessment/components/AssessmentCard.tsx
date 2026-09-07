import type { AssessmentLevel, TestData } from './types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Clock, Settings2 } from 'lucide-react';
import { useState, useCallback } from 'react';
import { TestModal } from './TestModal';
import { fetchQuestions } from './api';

interface AssessmentCardProps {
  title: string;
  description: string;
  duration: string;
  questions: number;
  tags: string[];
  points: number;
  level: AssessmentLevel;
}

export function AssessmentCard({
  title,
  description,
  duration,
  questions: totalQuestions,
  tags,
  points,
  level,
}: AssessmentCardProps) {
  const [selectedLevel, setSelectedLevel] = useState<AssessmentLevel | ''>('');
  const [isOpen, setIsOpen] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [testData, setTestData] = useState<TestData | null>(null);
  
  const handleStartTest = useCallback(async () => {
    const data = await fetchQuestions(title);
    setTestData(data);
    setSelectedLevel(level);
    setShowTest(true);
  }, [title]);

  return (
    <>
      <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        <h3 className="text-lg sm:text-xl font-bold">{title}</h3>
        <p className="text-gray-500">{description}</p>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-gray-600 text-sm sm:text-base">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>{totalQuestions} Questions</span>
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

        <p className="text-gray-600">Points - {points}</p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-4">
          <Select 
            value={selectedLevel} 
            onValueChange={(value: AssessmentLevel) => setSelectedLevel(value)}
            open={isOpen}
            onOpenChange={setIsOpen}
          >
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Select Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            className="w-full sm:w-auto"
            disabled={selectedLevel === ''}
            onClick={handleStartTest}
          >
            Start Test
          </Button>
        </div>
      </div>
      </Card>
      
      {showTest && testData && (
        <TestModal
          open={showTest}
          onClose={() => setShowTest(false)}
          title={title}
          selectedLevel={selectedLevel}
          questions={testData.questions}
          settings={testData.settings}
        />
      )}
    </>
  );
}