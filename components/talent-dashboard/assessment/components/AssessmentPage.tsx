import { useEffect, useState } from 'react'
import { Assessment, CompletedAssessment, Stats } from './types'
import { fetchAssessments, fetchCompletedAssessments, fetchStats } from './api'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Lightbulb } from 'lucide-react'
import { SkeletonStats } from './SkeletonStats'
import { Skeleton } from '@/components/ui/skeleton'
import { SkeletonCard } from './SkeletonCard'
import { StatsGrid } from './StatsGrid'
import { AssessmentFilters } from './AssessmentFilters'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AssessmentList } from './AssessmentList'
import { CompletedAssessmentCard } from './CompletedAssessmentCard'
import { Button } from '@/components/ui/button'

export default function AssessmentPage() {
  const [stats, setStats] = useState<Stats[]>([])
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [filteredAssessments, setFilteredAssessments] = useState<Assessment[]>([])
  const [filteredCompletedAssessments, setFilteredCompletedAssessments] = useState<
    CompletedAssessment[]
  >([])
  const [completedAssessments, setCompletedAssessments] = useState<CompletedAssessment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [visibleCount, setVisibleCount] = useState(3)
  const [completedVisibleCount, setCompletedVisibleCount] = useState(3)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [statsData, assessmentsData, completedData] = await Promise.all([
          fetchStats(),
          fetchAssessments(),
          fetchCompletedAssessments(),
        ])
        setStats(statsData)
        setAssessments(assessmentsData)
        setFilteredAssessments(assessmentsData)
        setCompletedAssessments(completedData)
        setFilteredCompletedAssessments(completedData)
      } catch (err) {
        setError('Failed to load data. Please try again later.')
        console.error('Error loading data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    const searchFilter = (item: Assessment | CompletedAssessment) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (searchQuery && item.level.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesTrack =
        selectedLevel === 'all' ||
        (selectedLevel === 'frontend' && item.title.toLowerCase().includes('frontend')) ||
        (selectedLevel === 'backend' && item.title.toLowerCase().includes('backend')) ||
        (selectedLevel === 'fullstack' && item.title.toLowerCase().includes('full stack')) ||
        (selectedLevel === 'cto' && item.title.toLowerCase().includes('cto')) ||
        (selectedLevel === 'manager' && item.title.toLowerCase().includes('engineering manager'))

      return matchesSearch && matchesTrack
    }

    setFilteredAssessments(assessments.filter(searchFilter))
    setFilteredCompletedAssessments(completedAssessments.filter(searchFilter))
  }, [searchQuery, selectedLevel, assessments, completedAssessments])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold">Assessment</h1>

          <Alert>
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <AlertDescription className="ml-2">
              Complete assessments to significantly improve your chances of getting shortlisted.
              Showcase your skills with verified scores!
            </AlertDescription>
          </Alert>

          <SkeletonStats />

          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
            <div className="w-full sm:w-[200px]">
              <Skeleton className="h-10" />
            </div>
            <div className="w-full sm:w-[300px]">
              <Skeleton className="h-10" />
            </div>
          </div>

          <h2 className="text-2xl font-semibold">Available Assessments</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map(i => (
              <SkeletonCard key={i} />
            ))}
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Completed Assessments</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2].map(i => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Assessment</h1>

        <Alert>
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          <AlertDescription className="ml-2">
            Complete assessments to significantly improve your chances of getting shortlisted.
            Showcase your skills with verified scores!
          </AlertDescription>
        </Alert>

        <StatsGrid stats={stats} />

        <AssessmentFilters
          selectedLevel={selectedLevel}
          searchQuery={searchQuery}
          onLevelChange={setSelectedLevel}
          onSearchChange={setSearchQuery}
        />

        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="available">Available Assessments</TabsTrigger>
            <TabsTrigger value="completed">Completed Assessments</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-6">
            <AssessmentList
              assessments={filteredAssessments}
              visibleCount={visibleCount}
              onShowMore={() => setVisibleCount(prev => prev + 3)}
            />
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredCompletedAssessments.slice(0, completedVisibleCount).map(assessment => (
                <CompletedAssessmentCard
                  key={`${assessment.title}-${assessment.completedAt}`}
                  assessment={assessment}
                />
              ))}
            </div>
            {filteredCompletedAssessments.length > completedVisibleCount && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => setCompletedVisibleCount(prev => prev + 3)}
                  className="w-full sm:w-[140px]"
                >
                  Show More
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
