'use client'

// Component Imports
import Dashboard from '@/components/company-dashboard/dashboard'
import Projects from '@/components/company-dashboard/projects'
import Messages from '@/components/company-dashboard/messages'
import Interviews from '@/components/company-dashboard/interviews'
import Team from '@/components/company-dashboard/team'
import Expenses from '@/components/company-dashboard/expenses'

import { useApp } from '@/context/appContext'

export default function DashboardPage() {
  const { activeLink } = useApp()

  const renderStepContent = () => {
    switch (activeLink) {
      case 1:
        return <Dashboard />
      case 2:
        return <Projects />
      case 3:
        return <Messages />
      case 4:
        return <Interviews />
      case 5:
        return <Team />
      case 6:
        return <Expenses />
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
