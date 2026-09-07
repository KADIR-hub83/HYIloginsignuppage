'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useState, useEffect, Key } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { X, FileText, Users, CreditCard, Clock, Calendar, MoreVertical } from 'lucide-react'
import { getCookie } from '@/lib/cookies'
import { userApi } from '@/lib/services/api'
import React from 'react'

const iconMap: Record<string, React.ElementType> = {
  FileText,
  Calendar,
  MoreVertical,
  Clock,
  CreditCard,
  Users,
}

type TeamMembers = {
  id: string
  name: string
  avatar: string
}[]

interface ProjectProps {
  id: string
  date: string
  description: string
  name: string
  progress: number
  status: string
  teamMembers: TeamMembers
  teamSize: number
}

interface StatsProps {
  title: string
  value: string
  icon: string
}
export default function Home() {
  const [showAlert, setShowAlert] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<{ stats: StatsProps[]; projects: ProjectProps[] }>({
    stats: [],
    projects: [],
  })

  useEffect(() => {
    const alertDismissed = localStorage.getItem('assessmentAlertDismissed')
    if (alertDismissed) {
      setShowAlert(false)
    }

    const fetchData = async () => {
      const token = getCookie('token')
      try {
        if (token) {
          const dashboardData = await userApi.getTalentDashboardData(token)
          const { stats, projects } = dashboardData.userData || {}

          setData({
            stats: stats || [],
            projects: projects || [],
          })
        }
      } catch (err) {
        setError('Failed to load dashboard data')
        console.error('Error fetching dashboard data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDismiss = () => {
    setShowAlert(false)
    localStorage.setItem('assessmentAlertDismissed', 'true')
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: showAlert ? 1 : 0, y: showAlert ? 0 : -20 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`${!showAlert && 'hidden'}`}
        >
          <Card className="mb-6 p-4 overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">Increase Your Chances of Getting Shortlisted!</h2>
                  <p className="text-sm text-muted-foreground">
                    Take our technical assessment to showcase your skills and stand out to potential
                    employers. Talents who complete assessments are 3x more likely to get
                    shortlisted for interviews.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button asChild className="bg-primary text-white hover:bg-primary/90">
                  <Link href="/assessment">Take Assessment</Link>
                </Button>
                <Button variant="ghost" size="icon" onClick={handleDismiss}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="text-muted-foreground">Overview</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <Card key={i} className="p-6">
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
            data.stats.map((stat, i) => (
              <Card key={i} className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {iconMap[stat.icon] ? (
                      React.createElement(iconMap[stat.icon], { className: 'w-6 h-6 text-primary' })
                    ) : (
                      <div className="w-6 h-6 bg-gray-300" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-semibold">{stat.value}</p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Ongoing Projects</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {isLoading ? (
              [...Array(2)].map((_, i) => (
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
              ))
            ) : error ? (
              <Card className="p-6 col-span-full">
                <p className="text-destructive">{error}</p>
              </Card>
            ) : (
              data.projects.map((project, i) => (
                <Card key={i} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                          ● {project.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold">Project Name - {project.name}</h3>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Progress</p>
                      {/* <Progress value={project.progress} className="h-2" /> */}
                      <p className="text-sm text-right">{project.progress}%</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{project.date}</span>
                      </div>
                      <div className="flex -space-x-2">
                        {project.teamMembers
                          .slice(0, 4)
                          .map(
                            (
                              member: { avatar: string | undefined; name: string | undefined },
                              i: Key | null | undefined
                            ) => (
                              <img
                                key={i}
                                className="h-8 w-8 rounded-full border-2 border-background"
                                src={member.avatar}
                                alt={member.name}
                              />
                            )
                          )}
                        {project.teamSize > 4 && (
                          <div className="flex items-center justify-center h-8 w-8 rounded-full border-2 border-background bg-muted text-xs font-medium">
                            +{project.teamSize - 4}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
