'use client'

// React Imports
import React from 'react'

// Component Imports
import RMDashboard from '@/components/rm-dashboard/dashboard'
import RMProjects from '@/components/rm-dashboard/projects'
import RMMessages from '@/components/rm-dashboard/messages'

// Context Import
import { useApp } from '@/context/appContext'

interface User {
  id: string
  fullName: string
  type: 'talent' | 'company' | 'manager' | 'interviewer' | 'relationship manager'
}
const User: User = {
  id: '1',
  fullName: 'Shashidhara Holla',
  type: 'relationship manager',
}

export default function RMDashboardPage() {
  const { activeLink } = useApp()

  const renderStepContent = () => {
    switch (activeLink) {
      case 1:
        return <RMDashboard user={User} />
      case 2:
        return <RMProjects />
      case 3:
        return <RMMessages />
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
