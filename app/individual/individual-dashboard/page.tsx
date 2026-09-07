'use client'

// React Imports
import React from 'react'

// Component Imports
import IndividualDashboard from '@/components/individual-dashboard/dashboard'
import IndividualProjects from '@/components/individual-dashboard/projects'
import IndividualMessages from '@/components/individual-dashboard/messages'

// Context Import
import { useApp } from '@/context/appContext'

export default function IndividualDashboardPage() {
  const { activeLink } = useApp()

  const renderStepContent = () => {
    switch (activeLink) {
      case 1:
        return <IndividualDashboard />
      case 2:
        return <IndividualProjects />
      case 3:
        return <IndividualMessages />
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
