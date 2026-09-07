import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AssessmentFiltersProps {
  selectedLevel: string;
  searchQuery: string;
  onLevelChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

export function AssessmentFilters({
  selectedLevel,
  searchQuery,
  onLevelChange,
  onSearchChange,
}: AssessmentFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
      <Select value={selectedLevel} onValueChange={onLevelChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Engineering Tracks" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Tracks</SelectItem>
          <SelectItem value="frontend">Frontend Engineer</SelectItem>
          <SelectItem value="backend">Backend Engineer</SelectItem>
          <SelectItem value="fullstack">Full Stack Engineer</SelectItem>
          <SelectItem value="cto">CTO Leadership</SelectItem>
          <SelectItem value="manager">Engineering Manager</SelectItem>
        </SelectContent>
      </Select>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
        <Input
          className="pl-10 w-full sm:w-[300px]"
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search"
        />
      </div>
    </div>
  );
}