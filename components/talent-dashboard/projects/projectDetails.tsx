'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import Image, { StaticImageData } from 'next/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  FileText,
  Mail,
  MessageSquareText,
  PhoneCall,
  TableOfContents,
  UsersRound,
} from 'lucide-react'

import companylogo from '@/components/assets/talent-dashboard/companyLogo_3.png'
import { Separator } from '@/components/ui/separator'
import { Card } from '@/components/ui/card'
import { userApi } from '@/lib/services/api'
import { getCookie } from '@/lib/cookies'

interface ProjectDetailsProps {
  projectId: string | string[]
  companyLogo: string | StaticImageData
  project: any
}

interface TeamDetailsProps {
  projectId: string
  fullName: string
  profilePicture: string | StaticImageData
  designation: string
}

export default function ProjectDetails({ companyLogo, projectId, project }: ProjectDetailsProps) {
  const [teamMembers, setTeamMembers] = useState<TeamDetailsProps[]>()

  useEffect(() => {
    async function fetchTeam() {
      const token = getCookie('token')
      if (token) {
        const response = await userApi.getProjectTeamDetail(projectId)
        setTeamMembers(response.userData)
      }
    }
    fetchTeam()
  }, [])
  const index = project?.relationshipManagers[0]?.firstName ? 0 : 1
  return (
    <section className="w-full flex flex-col container mx-auto p-6 gap-5">
      <section className="w-full flex">
        <Breadcrumb>
          <BreadcrumbList className="sm:gap-1.5">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/talent/projects">Projects</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{project?.data?.projectName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </section>
      <section className="w-full flex items-center gap-4">
        {companyLogo !== '' ? (
          <div className="w-fit h-fit flex rounded-full">
            <Image src={companyLogo} alt="Company Logo" className="w-12 h-12" />
          </div>
        ) : (
          <div className="w-fit h-fit flex rounded-full">
            <Image src={companylogo} alt="Company Logo" className="w-12 h-12" />
          </div>
        )}
        <div className="w-fit flex flex-col">
          <h1 className="text-2xl font-semibold text-text-900">{project?.data?.projectName}</h1>
          <span className="text-base font-medium text-text-600">{project?.data?.industryType}</span>
        </div>
      </section>
      <section>
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
          <TabsContent value="overview" className="flex flex-col mt-5 gap-2.5">
            <section className="w-full flex flex-col gap-3">
              <h2 className="text-lg font-semibold text-text-800">Project Description</h2>
              <p className="text-base font-medium text-text-600">
                {project?.data?.projectDescription}
              </p>
            </section>
            <Separator className="mt-2.5" />
            <section className="w-full h-fit flex gap-2.5">
              <Card className="w-full flex flex-col p-5 gap-3">
                <h3 className="text-base font-medium text-text-600">Budget</h3>
                <div className="w-full flex gap-10">
                  <div className="w-full flex flex-col">
                    <h4 className="text-sm font-medium text-text-600">Minimum</h4>
                    <p className="flex text-xl font-semibold text-text-800 gap-1">
                      <span>
                        {project?.data?.projectBudgetRange?.currency === 'USD' ? '$' : '#'}
                      </span>
                      {project?.data?.projectBudgetRange?.budgetRangeFrom}
                    </p>
                  </div>
                  <div className="w-full flex flex-col">
                    <h4 className="text-sm font-medium text-text-600">Maximum</h4>
                    <p className="flex text-xl font-semibold text-text-800 gap-1">
                      <span>
                        {project?.data?.projectBudgetRange?.currency === 'USD' ? '$' : '#'}
                      </span>
                      {project?.data?.projectBudgetRange?.budgetRangeTo}
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="w-full h-fit flex flex-col p-5 gap-3">
                <h3 className="text-base font-medium text-text-600">Relationship Manager</h3>
                <div className="w-full flex flex-col gap-5">
                  <div className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {project?.relationshipManagers?.profilePicture ? (
                        <div className="w-fit h-fit">
                          <Image
                            src={project?.relationshipManagers[index]?.profilePicture}
                            alt="Profile picture"
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        </div>
                      ) : (
                        <div
                          className={`h-10 w-10 flex items-center justify-center rounded-full bg-green-500 border-2 border-background`}
                        >
                          <span className="text-sm">
                            {project?.relationshipManagers[index]?.firstName
                              .split(' ')
                              .map((word: string) => word.charAt(0).toUpperCase())
                              .join('')}
                          </span>
                        </div>
                      )}
                      <div className="flex flex-col">
                        <h4 className="text-base font-semibold text-text-900">
                          {project?.relationshipManagers[index]?.firstName}
                        </h4>
                        <p className="text-sm font-normal text-text-600">
                          Mon-Fri, 9 AM - 5 PM EST
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <button className="text-sm font-semibold text-text-700 border border-text-300 rounded-lg px-4 py-2.5">
                        Request
                      </button>
                      <button className="flex items-center text-sm font-semibold text-text-700 border border-text-300 rounded-lg px-4 py-2.5 gap-1">
                        <MessageSquareText strokeWidth={2.0} className="w-5 h-5 text-text-400" />
                        Chat
                      </button>
                    </div>
                  </div>
                  <div className="w-full flex flex-col gap-1">
                    <h4 className="text-sm font-medium text-text-600">Contact Information</h4>
                    <div className="w-full flex">
                      <p className="w-full flex items-center text-sm font-medium text-text-800 gap-1.5">
                        <Mail strokeWidth={2.0} className="w-4 h-4 text-text-400" />
                        {project?.relationshipManagers[index]?.email}
                      </p>
                      <p className="w-full flex items-center text-sm font-medium text-text-800 gap-1.5">
                        <PhoneCall strokeWidth={2.0} className="w-4 h-4 text-text-400" />
                        {project?.relationshipManagers[index]?.phoneNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </section>
            <Separator />
            <section>
              <h3 className="text-base font-medium text-text-600">Documents</h3>
              <div></div>
            </section>
          </TabsContent>
          <TabsContent value="team" className="flex flex-col mt-5 gap-2.5">
            <section className="w-full flex flex-col px-5 gap-4">
              <h3 className="text-lg font-semibold text-text-800">Team Members</h3>
              <div className={`grid grid-cols-3 gap-x-3 gap-y-4`}>
                {teamMembers?.map((member, index) => (
                  <div key={index} className="flex items-center gap-3">
                    {member?.profilePicture ? (
                      <div className="w-fit h-fit">
                        <Image
                          src={member.profilePicture}
                          alt="Profile picture"
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className={`h-10 w-10 flex items-center justify-center rounded-full bg-green-500 border-2 border-background`}
                      >
                        <span className="text-sm">
                          {member?.fullName
                            .split(' ')
                            .map((word: string) => word.charAt(0).toUpperCase())
                            .join('')}
                        </span>
                      </div>
                    )}
                    <div className="flex flex-col">
                      <h4 className="text-base font-semibold text-text-900">{member?.fullName}</h4>
                      <p className="text-sm font-normal text-text-600">{member?.designation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </section>
    </section>
  )
}
