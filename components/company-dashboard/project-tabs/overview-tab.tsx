'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditCard, CircleUserRound } from 'lucide-react'
import { companyDashboardApi } from '@/lib/services/companyDashboardApi'
import { Mail, PhoneCall } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface Project {
  _id: string
  projectName: string
  industryType: string
  duration: string
  projectType: string
  projectDescription: string
  projectBudgetRange: { currency: string; budgetRangeFrom: string; budgetRangeTo: string }
}

type Overview = {
  projectBudgetRange: {
    budgetRangeFrom: string
    budgetRangeTo: string
    currency: string
  }
  projectDescription: string
}

type RelationshipManager = {
  _id: string
  email: string
  firstName: string
  profilePicture: string
  phoneNumber?: string
}

interface OverviewTabProps {
  selectedProject: Project
  setSelectedProject: (project: Project | null) => void
}

const OverviewTab: React.FC<OverviewTabProps> = ({ selectedProject, setSelectedProject }) => {
  const [overviewData, setOverviewData] = useState<Overview>({
    projectBudgetRange: {
      budgetRangeFrom: '',
      budgetRangeTo: '',
      currency: '',
    },
    projectDescription: '',
  })
  const [relationshipManagers, setRelationshipManagers] = useState<RelationshipManager[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProjectOverview = async () => {
      try {
        const projectData = await companyDashboardApi.projectOverview({
          projectId: selectedProject._id,
        })
        setOverviewData(
          projectData?.data || {
            projectBudgetRange: { budgetRangeFrom: '', budgetRangeTo: '', currency: '' },
            projectDescription: '',
          }
        )
        setRelationshipManagers(projectData?.relationshipManagers || [])
      } catch (err) {
        console.log(err)
      } finally {
        setIsLoading(false)
      }
    }
    if (selectedProject?._id) {
      fetchProjectOverview()
    }
  }, [selectedProject])

  return (
    <div className="space-y-4 mt-4">
      <div className="space-y-4 mt-4">
        <div>
          <h3 className="text-lg font-semibold">Project Description</h3>
          {isLoading ? (
            <Skeleton className="h-4 w-full mt-2" />
          ) : (
            <>
              <p className="text-gray-600 mt-2">{overviewData?.projectDescription}</p>
              <div className="border border-text-200 mt-4"></div>
            </>
          )}
        </div>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="p-6 w-full">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg animate-pulse" />
                  <div>
                    <div className="h-4 w-16 bg-muted animate-pulse rounded mb-1" />
                    <div className="h-6 w-8 bg-muted animate-pulse rounded" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <Card className="flex flex-col gap-4 justify-between p-4">
              <h4 className="text-base font-semibold flex items-center gap-2 text-text-800">
                <CreditCard className="text-primary" />
                Budget
              </h4>
              <div className="flex justify-between">
                <div>
                  <span className="text-sm text-text-600 font-medium">Minimum</span>
                  <p className="text-xl font-semibold text-text-800">
                    $ {overviewData?.projectBudgetRange.budgetRangeFrom}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-text-600 font-medium">Maximum</span>
                  <p className="text-xl font-semibold text-text-800">
                    $ {overviewData?.projectBudgetRange.budgetRangeTo}
                  </p>
                </div>
              </div>

              {relationshipManagers?.length === 0 ? (
                <div className="text-sm text-text-600">
                  Budget details will be finalized after your Relationship Manager is assigned.
                </div>
              ) : (
                <div></div>
              )}
            </Card>
            <Card className="flex flex-col justify-between gap-4 p-4">
              <h4 className="text-base font-semibold flex items-center gap-2 text-text-800">
                <CircleUserRound className="text-primary" />
                Relationship Manager
              </h4>
              {relationshipManagers.length === 0 ? (
                <>
                  <div className="text-md font-semibold text-text-900">Not Assigned Yet</div>
                  <div className="text-sm text-text-600">
                    We are in the process of assigning a Relationship Manager to you. You will be
                    notified once assigned.
                  </div>
                </>
              ) : (
                relationshipManagers.map(manager => (
                  <div key={manager._id} className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      {manager?.profilePicture && (
                        <Image
                          src={manager.profilePicture}
                          alt={'Avatar'}
                          width={40}
                          height={40}
                          className="rounded-full object-cover border border-gray-300"
                        />
                      )}
                      <div>
                        <p className="text-md font-semibold">{manager.firstName}</p>
                        <p className="text-sm text-text-600">Mon-Fri, 9 AM - 5 PM EST</p>
                      </div>
                    </div>
                    <div className="flex gap-12">
                      {manager?.email && (
                        <div className="flex gap-2 items-center font-medium">
                          <Mail size={16} color="#717680" />
                          <p className="text-sm text-text-800">{manager.email}</p>
                        </div>
                      )}
                      {manager?.phoneNumber && (
                        <div className="flex gap-2 items-center font-medium">
                          <PhoneCall size={16} color="#717680" />
                          <p className="text-sm text-text-800">{manager.phoneNumber}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </Card>
          </div>
        )}
      </div>
      <Button
        variant="ghost"
        className="mt-4 text-primary hover:text-primary"
        onClick={() => setSelectedProject(null)}
      >
        Back to Projects
      </Button>
    </div>
  )
}

export default OverviewTab
