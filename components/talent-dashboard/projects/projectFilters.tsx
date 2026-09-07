import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ProjectFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
}

export function ProjectFilters({ searchQuery, onSearchChange }: ProjectFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pb-5">
      <Select value={searchQuery} onValueChange={onSearchChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Engineering Tracks" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Projects</SelectItem>
          <SelectItem value="upcoming">Upcoming</SelectItem>
          <SelectItem value="ongoing">Ongoing</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
