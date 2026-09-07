'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { getCompanyDashboardData } from '@/lib/services/companyDashboard'
import { companyDashboardApi } from '@/lib/services/companyDashboardApi'
import { getCookie } from '@/lib/cookies'
import { Badge } from '@/components/ui/badge'
import { Calendar } from 'lucide-react'

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<{ stats: any[] }>({ stats: [] })
  const [projectsList, setProjectsList] = useState<any[]>([])
  const [isProjectLoading, setIsProjectLoading] = useState(true)
  const token = getCookie('token') || ''

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData = await getCompanyDashboardData()
        setData(dashboardData)
      } catch (err) {
        setError('Failed to load dashboard data')
        console.error('Error fetching dashboard data:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectData = await companyDashboardApi.getProjectsByCompany(token)
        setProjectsList(projectData?.projects || [])
      } catch (err) {
        console.log(err)
      } finally {
        setIsProjectLoading(false)
      }
    }
    fetchProjects()
  }, [])

  // Filter only ongoing projects
  const ongoingProjects = projectsList.filter(
    project => project.projectStatus?.toLowerCase() === 'ongoing'
  )

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="text-text-600 font-normal">
              Unified Dashboard for Overseeing Projects, Recruitment, and Finances.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <Card key={i} className="p-6 w-full animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg" />
                  <div>
                    <div className="h-4 w-16 bg-muted rounded mb-1" />
                    <div className="h-6 w-8 bg-muted rounded" />
                  </div>
                </div>
              </Card>
            ))
          ) : error ? (
            <Card className="p-6 col-span-full">
              <p className="text-destructive">{error}</p>
            </Card>
          ) : (
            data.stats.map((stat, i) => (
              <Card key={i} className="p-6 w-full">
                <div className="flex items-center gap-4">
                  <div
                    className="p-3 bg-primary/10 rounded-full shrink-0"
                    style={{ backgroundColor: stat.bgColor }}
                  >
                    <stat.icon className="w-6 h-6" style={{ color: stat.iconColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-600 font-normal truncate">{stat.title}</p>
                    <p className="text-2xl font-semibold truncate">{stat.value}</p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
        <div>
          <p className="text-lg font-semibold mb-8">Ongoing Projects</p>
          {isProjectLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(2)].map((_, i) => (
                <Card key={i} className="p-5 border flex flex-col gap-2 animate-pulse">
                  <div className="h-4 w-24 bg-muted rounded mb-2" />
                  <div className="h-6 w-48 bg-muted rounded mb-2" />
                  <div className="h-4 w-36 bg-muted rounded" />
                </Card>
              ))}
            </div>
          ) : ongoingProjects.length === 0 ? (
            <p className="text-gray-500">No ongoing projects found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ongoingProjects.map(project => (
                <Card
                  key={project.id}
                  className="p-5 border flex flex-col gap-2 justify-between h-full"
                >
                  <div className="space-y-1">
                    <Badge
                      variant="outline"
                      className="inline-flex items-center gap-1 py-1 px-4 bg-[#FFFAEB] text-[#B54708] border-[#FEDF89]"
                    >
                      <span className="text-lg">●</span>
                      <span className="text-sm">
                        {project?.projectStatus.charAt(0).toUpperCase() +
                          project?.projectStatus.slice(1)}
                      </span>
                    </Badge>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold">
                      {project.projectName.length > 50
                        ? project.projectName.substring(0, 50) + '...'
                        : project.projectName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {project.projectDescription.length > 135
                        ? project.projectDescription.substring(0, 135) + '...'
                        : project.projectDescription}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <Calendar color="#717680" />
                    <span className="text-sm text-text-700 font-semibold">
                      {new Date(project.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                      })}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
