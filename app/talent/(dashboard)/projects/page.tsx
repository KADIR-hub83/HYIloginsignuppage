'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FileText, Users, Calendar, MoreVertical } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { useState, useEffect, Key } from 'react'
import { getCookie } from '@/lib/cookies'
import { userApi } from '@/lib/services/api'
import React from 'react'
import { ProjectFilters } from '@/components/talent-dashboard/projects/projectFilters'
import { useRouter } from 'next/navigation'

const iconMap: Record<string, React.ElementType> = {
  FileText,
  Calendar,
  MoreVertical,
  Users,
}

interface Project {
  title: string
  description: string
  duration: string
  questions: number
  tags: string[]
  points: number
}

type TeamMembers = {
  id: string
  name: string
  avatar: string
}[]

interface ProjectProps {
  companyId: string
  projectId: string
  duration: string
  projectType: string
  projectDescription: string
  projectName: string
  projectBudgetRange: {
    budgetRangeFrom: string
    budgetRangeTo: string
    currency: string
  }
  projectActiveTeam: {
    fullName: string
    profilePicture: string
  }[]
  postRequirementId: string
  industryType: string
  assignedRmIds: string[]
  progress: number
  status: string
  projectStatus: string
}

interface StatsProps {
  title: string
  value: string | number
  icon: string
}

const stats = [
  { title: 'Upcoming', value: 0, icon: 'FileText' },
  { title: 'Ongoing', value: 0, icon: 'FileText' },
  { title: 'Completed', value: 0, icon: 'FileText' },
  { title: 'Tasks', value: 0, icon: 'Users' },
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<ProjectProps[]>([])
  const [searchQuery, setSearchQuery] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [projectsData, setProjectsData] = useState<ProjectProps[]>()
  const [statsData, setstatsData] = useState<StatsProps[]>(stats)

  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const token = getCookie('token')
      try {
        if (token) {
          const projectsData = await userApi.getTalentProjectData(token)

          setProjectsData(projectsData.userData.talentAssignedProjects || [])
        }
      } catch (err) {
        setError('Failed to load projects data')
        console.error('Error fetching projects data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (!projectsData) return

    const searchFilter = (item: ProjectProps) => {
      if (searchQuery === 'all') return true
      return item.projectStatus.toLowerCase() === searchQuery.toLowerCase()
    }

    setFilteredProjects(projectsData.filter(searchFilter))
  }, [searchQuery, projectsData])

  function handleClick(projectId: string) {
    router.push(`/talent/projects/${projectId}`)
  }

  return (
    <div className="w-full min-h-screen bg-background">
      <main className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Projects</h1>
            <p className="text-muted-foreground">Manage your projects</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-primary/10 rounded animate-pulse" />
                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  </div>
                  <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                </div>
              </Card>
            ))
          ) : error ? (
            <Card className="p-6 col-span-full">
              <p className="text-destructive">{error}</p>
            </Card>
          ) : (
            statsData.map((stat, i) => (
              <Card key={i} className="p-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {iconMap[stat.icon] ? (
                      React.createElement(iconMap[stat.icon], { className: 'w-6 h-6 text-primary' })
                    ) : (
                      <div className="w-6 h-6 bg-gray-300" />
                    )}
                    <h3 className="font-medium">{stat.title}</h3>
                  </div>
                  <p className="text-3xl font-semibold">{stat.value}</p>
                </div>
              </Card>
            ))
          )}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div className="space-y-2">
                      <div className="h-5 w-24 bg-muted animate-pulse rounded" />
                      <div className="h-6 w-48 bg-muted animate-pulse rounded" />
                      <div className="h-4 w-64 bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="p-6">
            <p className="text-destructive">{error}</p>
          </Card>
        ) : projectsData?.length === 0 ? (
          <Card className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No projects Assigned</h2>
            <p className="text-muted-foreground">
              Hang tight! Your next project will appear once you're selected.
            </p>
          </Card>
        ) : (
          <>
            <ProjectFilters searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            {filteredProjects?.length === 0 && (
              <Card className="w-full p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-lg font-medium mb-2">No Data Found</h2>
              </Card>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProjects?.map((project, i) => (
                <Card
                  key={project.projectId}
                  className="p-6 cursor-pointer"
                  onClick={() => handleClick(project.projectId)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border ${project?.projectStatus === 'ongoing' ? 'bg-warning-50 border-warning-200 text-warning-700' : project?.projectStatus === 'completed' ? 'bg-scucess-50 border-scucess-200 text-scucess-700' : 'bg-brand-50 border-brand-200 text-brand-700'}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 flex rounded-full ${project?.projectStatus === 'ongoing' ? 'bg-warning-500' : project?.projectStatus === 'completed' ? 'bg-scucess-500' : 'bg-brand-500'}`}
                          />
                          {project?.projectStatus}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold">{project.projectName}</h3>
                      <p className="text-sm text-muted-foreground">{project.projectDescription}</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Progress</p>
                      {/* <Progress value={project.progress || 50} className="h-2" /> */}
                      <p className="text-sm text-right">{project.progress || 50}%</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{project.duration}</span>
                      </div>
                      <div className="flex -space-x-2">
                        {project.projectActiveTeam.length >= 4
                          ? project.projectActiveTeam.slice(0, 4).map((member, idx) =>
                              member.profilePicture && member.profilePicture !== 'N/A' ? (
                                <img
                                  key={idx}
                                  className="h-8 w-8 rounded-full border-2 border-background object-cover"
                                  src={member.profilePicture}
                                  alt={member.fullName}
                                />
                              ) : (
                                <div
                                  key={idx}
                                  className="h-8 w-8 rounded-full border-2 border-background"
                                >
                                  <span>
                                    {member.fullName
                                      .split(' ')
                                      .map((word, index) =>
                                        index === 0 ? word.charAt(0).toUpperCase() : ''
                                      )
                                      .join('')}
                                  </span>
                                </div>
                              )
                            )
                          : project.projectActiveTeam.map((member, idx) =>
                              member.profilePicture && member.profilePicture !== 'N/A' ? (
                                <img
                                  key={idx}
                                  className="h-8 w-8 rounded-full border-2 border-background object-cover"
                                  src={member.profilePicture}
                                  alt={member.fullName}
                                />
                              ) : (
                                <div
                                  key={idx}
                                  className={`h-8 w-8 flex items-center justify-center rounded-full bg-green-500 border-2 border-background z-${idx + 1}`}
                                >
                                  <span className="text-sm">
                                    {member.fullName
                                      .split(' ')
                                      .map(word => word.charAt(0).toUpperCase())
                                      .join('')}
                                  </span>
                                </div>
                              )
                            )}

                        {project.projectActiveTeam.length > 4 && (
                          <div className="flex items-center justify-center h-8 w-8 rounded-full border-2 border-background bg-muted text-xs font-medium">
                            +{project.projectActiveTeam.length - 4}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
