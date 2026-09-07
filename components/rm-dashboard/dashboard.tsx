'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  BriefcaseIcon,
  Calendar,
  FileText,
  MessageSquare,
  Users,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Clock,
  Loader2,
  ChevronDown,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  managerApi,
  type ManagerStats,
  type Project,
  type User,
} from '@/lib/services/relationship_manager'
import Link from 'next/link'

interface RelationshipManagerProps {
  user: User
}

export default function RelationshipManager({ user }: RelationshipManagerProps) {
  const { toast } = useToast()
  const [stats, setStats] = useState<ManagerStats | null>(null)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejection, setRejection] = useState({
    reason: '',
    technicalFeedback: '',
    suggestedImprovements: '',
    category: '',
    nextSteps: '',
  })
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [isRejecting, setIsRejecting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [visiblePendingProjects, setVisiblePendingProjects] = useState(2)
  const [visibleAcceptedProjects, setVisibleAcceptedProjects] = useState(2)
  const [visibleRejectedProjects, setVisibleRejectedProjects] = useState(2)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await managerApi.getManagerStats()
        setStats(data)
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load dashboard data',
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [toast])

  const openRejectDialog = (projectId: string) => {
    setSelectedProjectId(projectId)
    setRejection({
      reason: '',
      technicalFeedback: '',
      suggestedImprovements: '',
      category: '',
      nextSteps: '',
    })
    setRejectDialogOpen(true)
  }

  const closeRejectDialog = () => {
    setSelectedProjectId(null)
    setRejection({
      reason: '',
      technicalFeedback: '',
      suggestedImprovements: '',
      category: '',
      nextSteps: '',
    })
    setRejectDialogOpen(false)
  }

  const handleAccept = async (projectId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Update local state
      setStats(prev => {
        if (!prev) return prev

        const project = prev.pendingProjects.find(p => p.id === projectId)
        if (!project) return prev

        return {
          ...prev,
          pendingProjects: prev.pendingProjects.filter(p => p.id !== projectId),
          acceptedProjects: [...prev.acceptedProjects, { ...project, status: 'active' }],
        }
      })

      toast({
        title: 'Success',
        description: 'Project accepted successfully',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to accept project',
      })
    }
  }

  const handleReject = async () => {
    if (!selectedProjectId || !rejection.reason.trim() || !rejection.category) return

    try {
      setIsRejecting(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Update local state
      setStats(prev => {
        if (!prev) return prev

        const project = prev.pendingProjects.find(p => p.id === selectedProjectId)
        if (!project) return prev

        return {
          ...prev,
          pendingProjects: prev.pendingProjects.filter(p => p.id !== selectedProjectId),
          rejectedProjects: [
            ...prev.rejectedProjects,
            {
              ...project,
              status: 'rejected',
              rejection: {
                reason: rejection.reason,
                technicalFeedback: rejection.technicalFeedback,
                suggestedImprovements: rejection.suggestedImprovements,
                category: rejection.category as any,
                nextSteps: rejection.nextSteps,
              },
            },
          ],
        }
      })

      closeRejectDialog()

      toast({
        title: 'Success',
        description: 'Project rejected successfully',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to reject project',
      })
    } finally {
      setIsRejecting(false)
    }
  }

  const openDetailsDialog = (project: Project) => {
    setSelectedProject(project)
    setDetailsDialogOpen(true)
  }

  const renderProject = (project: Project) => (
    <Card
      key={project.id}
      className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {project.name}
            </CardTitle>
            <CardDescription className="line-clamp-2">{project.description}</CardDescription>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-primary/80" />
            <span className="text-muted-foreground">
              {new Date(project.submittedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          <Badge variant="secondary" className="font-medium">
            {project.company}
          </Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => openDetailsDialog(project)}
        >
          View Details
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
        {project.status === 'pending' && (
          <div className="flex items-center gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1 text-destructive hover:bg-destructive/5"
              onClick={() => openRejectDialog(project.id)}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              onClick={() => handleAccept(project.id)}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Accept
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6 container mx-auto p-8">
      <div className="flex items-center justify-between">
        <div className="relative">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">Welcome back, {user?.fullName}</p>
          <div className="absolute -z-10 w-[200px] h-[200px] bg-primary/10 rounded-full blur-3xl -top-20 -left-10 animate-pulse" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <BriefcaseIcon className="h-4 w-4 text-primary/80 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.projects || 0}</div>
            <p className="text-xs text-muted-foreground">Active projects</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-primary/80 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.messages || 0}</div>
            <p className="text-xs text-muted-foreground">Unread messages</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requests</CardTitle>
            <FileText className="h-4 w-4 text-primary/80 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.requests || 0}</div>
            <p className="text-xs text-muted-foreground">Pending requests</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Talents</CardTitle>
            <Users className="h-4 w-4 text-primary/80 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.talents || 0}</div>
            <p className="text-xs text-muted-foreground">Active talents</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="project-requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="project-requests">Project Requests</TabsTrigger>
          <TabsTrigger value="accepted">Accepted Projects</TabsTrigger>
          <TabsTrigger value="rejected">Rejected Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="project-requests" className="space-y-4 animate-in fade-in-50">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Project Requests</CardTitle>
                  <CardDescription>Manage incoming project requests</CardDescription>
                </div>
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <Clock className="h-3 w-3" />
                  Pending
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {stats?.pendingProjects.length ? (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {stats.pendingProjects.slice(0, visiblePendingProjects).map(renderProject)}
                  </div>
                  {stats.pendingProjects.length > visiblePendingProjects && (
                    <div className="mt-6 text-center">
                      <Button
                        variant="outline"
                        onClick={() => setVisiblePendingProjects(prev => prev + 2)}
                        className="group"
                      >
                        Show More
                        <ChevronDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center text-muted-foreground py-6">No pending requests</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accepted" className="space-y-4 animate-in fade-in-50">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Accepted Projects</CardTitle>
                  <CardDescription>View and manage accepted projects</CardDescription>
                </div>
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors"
                >
                  <CheckCircle2 className="h-3 w-3" />
                  Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {stats?.acceptedProjects.length ? (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {stats.acceptedProjects.slice(0, visibleAcceptedProjects).map(project => (
                      <Card
                        key={project.id}
                        className="group hover:shadow-lg transition-all duration-300"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold group-hover:text-primary transition-colors">
                                  {project.name}
                                </h3>
                                <Badge
                                  variant="secondary"
                                  className="bg-green-500/10 text-green-500"
                                >
                                  Active
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{project.description}</p>
                              <div className="flex items-center gap-4 mt-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-primary/80" />
                                  <span className="text-muted-foreground">
                                    Accepted on {new Date(project.submittedAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <BriefcaseIcon className="h-4 w-4 text-primary/80" />
                                  <span className="font-medium">{project.company}</span>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="shrink-0"
                              onClick={() => openDetailsDialog(project)}
                            >
                              View Details
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {stats.acceptedProjects.length > visibleAcceptedProjects && (
                    <div className="mt-6 text-center">
                      <Button
                        variant="outline"
                        onClick={() => setVisibleAcceptedProjects(prev => prev + 2)}
                        className="group"
                      >
                        Show More
                        <ChevronDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center text-muted-foreground py-6">
                  No accepted projects yet
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4 animate-in fade-in-50">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Rejected Requests</CardTitle>
                  <CardDescription>View rejected project requests</CardDescription>
                </div>
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                >
                  <XCircle className="h-3 w-3" />
                  Rejected
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {stats?.rejectedProjects.length ? (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {stats.rejectedProjects.slice(0, visibleRejectedProjects).map(project => (
                      <Card
                        key={project.id}
                        className="group hover:shadow-lg transition-all duration-300"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-muted-foreground">
                                  {project.name}
                                </h3>
                                <Badge
                                  variant="secondary"
                                  className="bg-destructive/10 text-destructive"
                                >
                                  Rejected
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{project.description}</p>
                              <div className="flex items-center gap-4 mt-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-destructive/80" />
                                  <span className="text-muted-foreground">
                                    Rejected on {new Date(project.submittedAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <BriefcaseIcon className="h-4 w-4 text-destructive/80" />
                                  <span className="text-muted-foreground">{project.company}</span>
                                </div>
                              </div>
                              <div className="mt-4 p-3 bg-destructive/5 rounded-lg border border-destructive/10">
                                <p className="text-sm text-destructive">
                                  <strong>Rejection Reason:</strong> {project.rejection?.reason}
                                  {project.rejection?.technicalFeedback && (
                                    <>
                                      <br />
                                      <strong>Technical Feedback:</strong>{' '}
                                      {project.rejection.technicalFeedback}
                                    </>
                                  )}
                                  {project.rejection?.suggestedImprovements && (
                                    <>
                                      <br />
                                      <strong>Suggested Improvements:</strong>{' '}
                                      {project.rejection.suggestedImprovements}
                                    </>
                                  )}
                                  {project.rejection?.nextSteps && (
                                    <>
                                      <br />
                                      <strong>Next Steps:</strong> {project.rejection.nextSteps}
                                    </>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {stats.rejectedProjects.length > visibleRejectedProjects && (
                    <div className="mt-6 text-center">
                      <Button
                        variant="outline"
                        onClick={() => setVisibleRejectedProjects(prev => prev + 2)}
                        className="group"
                      >
                        Show More
                        <ChevronDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center text-muted-foreground py-6">No rejected requests</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Project</DialogTitle>
            <DialogDescription>
              Please provide detailed feedback to help improve future submissions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rejection Category</label>
              <Select
                value={rejection.category}
                onValueChange={value => setRejection(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rejection category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scope">Project Scope</SelectItem>
                  <SelectItem value="technical">Technical Issues</SelectItem>
                  <SelectItem value="budget">Budget Constraints</SelectItem>
                  <SelectItem value="timeline">Timeline Concerns</SelectItem>
                  <SelectItem value="resources">Resource Requirements</SelectItem>
                  <SelectItem value="compliance">Compliance Issues</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Primary Reason</label>
              <Textarea
                placeholder="Enter the main reason for rejection..."
                value={rejection.reason}
                onChange={e => setRejection(prev => ({ ...prev, reason: e.target.value }))}
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Technical Feedback</label>
              <Textarea
                placeholder="Provide specific technical feedback..."
                value={rejection.technicalFeedback}
                onChange={e =>
                  setRejection(prev => ({ ...prev, technicalFeedback: e.target.value }))
                }
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Suggested Improvements</label>
              <Textarea
                placeholder="Suggest specific improvements..."
                value={rejection.suggestedImprovements}
                onChange={e =>
                  setRejection(prev => ({ ...prev, suggestedImprovements: e.target.value }))
                }
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Next Steps</label>
              <Textarea
                placeholder="Outline next steps for resubmission..."
                value={rejection.nextSteps}
                onChange={e => setRejection(prev => ({ ...prev, nextSteps: e.target.value }))}
                className="min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeRejectDialog} disabled={isRejecting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejection.reason.trim() || !rejection.category || isRejecting}
            >
              {isRejecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                'Reject Project'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl">{selectedProject?.name}</DialogTitle>
                <DialogDescription>{selectedProject?.company}</DialogDescription>
              </div>
              <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                {selectedProject
                  ? selectedProject?.status.charAt(0).toUpperCase() +
                    selectedProject?.status.slice(1)
                  : 'JD'}
              </Badge>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary/80" />
                <span className="text-sm text-muted-foreground">
                  Started on{' '}
                  {selectedProject && new Date(selectedProject.submittedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <BriefcaseIcon className="h-4 w-4 text-primary/80" />
                <span className="text-sm font-medium">{selectedProject?.company}</span>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-muted-foreground">{selectedProject?.description}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Project Timeline</CardTitle>
                  <CardDescription>Key milestones and deadlines</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Project Start</p>
                        <p className="text-xs text-muted-foreground">
                          {selectedProject &&
                            new Date(selectedProject.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Team Members</CardTitle>
                  <CardDescription>Project team and roles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Project Manager</p>
                        <p className="text-xs text-muted-foreground">Sarah Wilson</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/dashboard/messages">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message Team
                </Link>
              </Button>
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                View Team
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
