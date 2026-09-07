'use client'

// React Imports
import React from 'react'

// Component Imports
import InterviewerDashboard from '@/components/interviewer-dashboard/dashboard'
import InterviewerProjects from '@/components/interviewer-dashboard/projects'
import InterviewerMessages from '@/components/interviewer-dashboard/messages'

// Context Import
import { useApp } from '@/context/appContext'

export default function IndividualDashboardPage() {
  const { activeLink } = useApp()

  const renderStepContent = () => {
    switch (activeLink) {
      case 1:
        return <InterviewerDashboard />
      case 2:
        return <InterviewerProjects />
      case 3:
        return <InterviewerMessages />
      default:
        return null
    }
  }

  return (
    <section className="w-full flex items-center">
      <div className="w-full flex flex-col">{renderStepContent()}</div>
    </section>
  )
}
