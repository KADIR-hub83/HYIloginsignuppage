'use client'

import Link from 'next/link'
import {
  FolderPlus,
  ChevronDown,
  Calendar,
  MoreVertical,
  CircleUserRound,
  FileText,
  UsersRound,
  TableOfContents,
  MessageSquareText,
  Edit,
  Trash,
} from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { getCompanyProjectDashboardData } from '@/lib/services/companyProjectDashboardData'
import { Button } from '@/components/ui/button'
import CreateProjectDialog from '@/components/company-dashboard/create-project-dialog'
import PostRequirementDialog from '@/components/company-dashboard/post-requirement-dialog'
import { companyDashboardApi } from '@/lib/services/companyDashboardApi'
import { getCookie } from '@/lib/cookies'
import ViewJobDescriptionDialog from './view-job-description-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import OverviewTab from '@/components/company-dashboard/project-tabs/overview-tab'
import TeamTab from '@/components/company-dashboard/project-tabs/teams-tab'
import { useApp } from '@/context/appContext'
import { useToast } from '@/hooks/use-toast'

interface Project {
  _id: string
  projectName: string
  industryType: string
  duration: string
  projectType: string
  projectDescription: string
  projectBudgetRange: { currency: string; budgetRangeFrom: string; budgetRangeTo: string }
}

interface Requirement {
  _id: string
  prDesignation: string
  prNumberOfCandidates: number
  prWorkExperience: string
  prWorkDuration: number
  prTechnicalSkills: string[]
  prDescription: string
  prCandidates: Candidate[]
  createdAt: string
  updatedAt: string
}

interface Candidate {
  candidateId: string
  fullName: string
  experience: Experience[]
  preference: Preference
  profilePicture: string
}

interface Experience {
  companyName: string
  workSince: string
  workTill: string
  designation: string
  currentlyWorking: boolean
  description: string
  totalYearsOfExperience: number
  _id: string
}

interface Preference {
  desiredSalary: {
    currency: string
    price: string
  }
  availableHours: {
    from: string
    to: string
  }
  employmentPreference: string
  hoursPerWeek: string
}

export default function Projects() {
  const { companyId } = useApp()
  const [selectedFilter, setSelectedFilter] = useState('All Projects')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProjectLoading, setIsProjectLoading] = useState(true)
  const [isDashboardLoading, setIsDashboardLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<{ projects: any[] }>({ projects: [] })
  const [open, setOpen] = useState(false)
  const [openPostRequirement, setOpenPostRequirement] = useState(false)
  const [projectsList, setProjectsList] = useState<any[]>([])
  const [postRequirementList, setPostRequirementList] = useState<any[]>([])
  const [openViewJobDescription, setOpenViewJobDescription] = useState(false)
  const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null)
  const token = getCookie('token') || ''
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData = await getCompanyProjectDashboardData(companyId)
        setData(dashboardData)
      } catch (err) {
        setError('Failed to load dashboard data')
      } finally {
        setIsDashboardLoading(false)
      }
    }
    if (companyId) {
      fetchData()
    }
  }, [companyId])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectData = await companyDashboardApi.getProjectsByCompany(token)
        setProjectsList(projectData?.projects || [])
      } catch (err) {
        console.log(err)
      } finally {
        setIsProjectLoading(false)
      }
    }
    fetchData()
  }, [open])

  useEffect(() => {
    setIsLoading(isProjectLoading || isDashboardLoading)
  }, [isProjectLoading, isDashboardLoading])

  const fetchPostRequirementList = async () => {
    if (!selectedProject) return
    try {
      setIsLoading(true)
      const postRequirementData = await companyDashboardApi.listOfPostRequirements({
        projectId: selectedProject._id,
      })
      setPostRequirementList(postRequirementData?.data?.postRequirements || [])
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPostRequirementList()
  }, [selectedProject])

  const handleEdit = (project: Project) => {
    setSelectedProject(project)
    setOpen(true)
  }

  const handleDelete = async (projectId: string) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this project? This action cannot be undone.'
    )
    if (!confirmDelete) return
    try {
      const response = await companyDashboardApi.deleteProject({ projectId })
      if (!response.success) {
        toast({
          title: 'Deletion Failed',
          description: response.message || 'Failed to delete project.',
          variant: 'destructive',
        })
        return
      }
      setProjectsList(prevProjects => prevProjects.filter(project => project._id !== projectId))
      toast({
        title: 'Project Deleted',
        description: 'The project has been successfully deleted.',
      })
    } catch (error) {
      console.error('Error deleting project:', error)
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again later.',
        variant: 'destructive',
      })
    }
  }

  const filteredProjects = useMemo(() => {
    if (selectedFilter === 'All Projects') {
      return projectsList
    }
    return projectsList.filter(project => project.projectStatus === selectedFilter)
  }, [projectsList, selectedFilter])

  const hasOngoingProjects =
    Array.isArray(projectsList) &&
    projectsList.some(project => project?.projectStatus?.toLowerCase() === 'ongoing')
  const hasUpcomingProjects =
    Array.isArray(projectsList) &&
    projectsList.some(project => project?.projectStatus?.toLowerCase() === 'upcoming')

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-8 pt-2">
        {selectedProject ? (
          <div className="container mx-auto">
            <Breadcrumb className="mb-4">
              <BreadcrumbList>
                <BreadcrumbItem className="text-base font-semibold text-text-600">
                  <BreadcrumbLink>
                    <Link
                      href="/company/company-dashboard"
                      onClick={() => setSelectedProject(null)}
                    >
                      Projects
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="text-base font-semibold text-text-900">
                  <BreadcrumbPage>
                    {selectedProject.projectName.length > 40
                      ? selectedProject.projectName.substring(0, 40) + '...'
                      : selectedProject.projectName}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-primary/10 p-3 rounded-full">
                <CircleUserRound className="text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-text-900">
                  {selectedProject.projectName.length > 40
                    ? selectedProject.projectName.substring(0, 40) + '...'
                    : selectedProject.projectName}
                </h2>
                <p className="text-base font-semibold text-text-600">
                  {selectedProject.industryType}
                </p>
              </div>
            </div>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="flex w-full border-b rounded-none space-x-6 bg-white">
                <TabsTrigger value="overview" className="tabs-trigger">
                  <FileText className="text-inherit" />
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger value="team" className="tabs-trigger">
                  <UsersRound className="text-inherit" />
                  <span>Team</span>
                </TabsTrigger>
                <TabsTrigger value="tasks" className="tabs-trigger">
                  <TableOfContents className="text-inherit" />
                  <span>Tasks</span>
                </TabsTrigger>
                <TabsTrigger value="messages" className="tabs-trigger">
                  <MessageSquareText className="text-inherit" />
                  <span>Messages</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <OverviewTab
                  selectedProject={selectedProject}
                  setSelectedProject={setSelectedProject}
                />
              </TabsContent>
              <TabsContent value="team">
                <TeamTab
                  postRequirementList={postRequirementList}
                  setPostRequirementList={setPostRequirementList}
                  setOpenPostRequirement={setOpenPostRequirement}
                  setSelectedProject={setSelectedProject}
                  setSelectedRequirement={setSelectedRequirement}
                  setOpenViewJobDescription={setOpenViewJobDescription}
                  projectId={selectedProject?._id}
                />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold">Projects</h1>
                <p className="text-text-600 font-normal">Create and manage projects</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <Card key={i} className="p-6 w-full">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg animate-pulse" />
                      <div>
                        <div className="h-4 w-16 bg-muted animate-pulse rounded mb-1" />
                        <div className="h-6 w-8 bg-muted animate-pulse rounded" />
                      </div>
                    </div>
                  </Card>
                ))
              ) : error ? (
                <Card className="p-6 col-span-full">
                  <p className="text-destructive">{error}</p>
                </Card>
              ) : (
                data.projects.map((proj, i) => (
                  <Card key={i} className="p-6 w-full">
                    <div className="flex items-center gap-4">
                      <div
                        className="p-3 bg-primary/10 rounded-full shrink-0"
                        style={{ backgroundColor: proj.bgColor }}
                      >
                        <proj.icon className="w-6 h-6" style={{ color: proj.iconColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-text-600 font-normal truncate">{proj.title}</p>
                        <p className="text-2xl font-semibold truncat">{proj.value}</p>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
            {filteredProjects.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="bg-white">
                      <Button
                        variant="outline"
                        className="w-[180px] flex justify-between items-center"
                      >
                        {selectedFilter}
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[180px]">
                      <DropdownMenuItem onClick={() => setSelectedFilter('All Projects')}>
                        All Projects
                      </DropdownMenuItem>
                      {hasOngoingProjects && (
                        <DropdownMenuItem onClick={() => setSelectedFilter('ongoing')}>
                          Ongoing
                        </DropdownMenuItem>
                      )}
                      {hasUpcomingProjects && (
                        <DropdownMenuItem onClick={() => setSelectedFilter('upcoming')}>
                          Upcoming
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button onClick={() => setOpen(true)}>+ Create a Project</Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredProjects.map(project => (
                    <Card
                      key={project._id}
                      className="p-5 border flex flex-col gap-2 justify-between h-full"
                      onClick={() => setSelectedProject(project)}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                          <Badge
                            variant="outline"
                            className={`inline-flex items-center gap-1 py-1 px-4 ${project.projectStatus.toLowerCase() === 'ongoing' ? 'bg-[#FFFAEB] text-[#B54708] border-[#FEDF89]' : ''} ${project.projectStatus.toLowerCase() === 'upcoming' ? 'bg-[#F5F5F5] text-[#535862] border-[#E0E0E0]' : ''}`}
                          >
                            <span className="text-lg">●</span>
                            <span className="text-sm">
                              {project.projectStatus.charAt(0).toUpperCase() +
                                project.projectStatus.slice(1)}
                            </span>
                          </Badge>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={e => e.stopPropagation()}>
                              <MoreVertical className="h-6" color="#717680" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" side="left">
                            <DropdownMenuItem
                              onClick={e => {
                                e.stopPropagation()
                                handleEdit(project)
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-500 hover:text-red-500"
                              onClick={e => {
                                e.stopPropagation()
                                handleDelete(project._id)
                              }}
                            >
                              <Trash className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
              </>
            ) : (
              <>
                {isProjectLoading ? (
                  <div className="flex flex-col mt-48 items-center gap-4">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[250px]" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center mt-16">
                    <div className="border border-[#E9EAEB] rounded-full w-16 h-16 flex items-center justify-center">
                      <FolderPlus className="opacity-75" size={30} />
                    </div>
                    <p className="font-semibold text-lg mt-6">No projects found</p>
                    <div className="mt-2">
                      <p className="font-medium text-sm text-text-600">
                        Your project list is empty. Once you create a project,
                      </p>
                      <p className="font-medium text-sm text-text-600">
                        it will appear here for easy access and management.
                      </p>
                    </div>
                    <Button onClick={() => setOpen(true)} className="mt-4">
                      + Create a Project
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
      {open && (
        <CreateProjectDialog
          selectedProject={selectedProject}
          open={open}
          onClose={() => {
            setOpen(false)
            setSelectedProject(null)
          }}
        />
      )}
      {openPostRequirement && selectedProject && (
        <PostRequirementDialog
          open={openPostRequirement}
          onClose={() => setOpenPostRequirement(false)}
          selectedProject={selectedProject}
          onRequirementAdded={fetchPostRequirementList}
        />
      )}
      {openViewJobDescription && (
        <ViewJobDescriptionDialog
          open={openViewJobDescription}
          onClose={() => setOpenViewJobDescription(false)}
          requirement={selectedRequirement}
        />
      )}
    </div>
  )
}
