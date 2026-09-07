'use client'

// React Imports
import React from 'react'

// Component Imports
import CompanyHeader from '@/components/navigation/company-header'
import { SidebarProvider } from '@/components/ui/sidebar'
import { CompanySidebar } from '@/components/company-onboarding/companySidebar'

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className={`min-h-screen bg-background`}>
      <CompanyHeader />
      <SidebarProvider className="w-full max-w-[1216px] mx-auto py-6 lg:py-8">
        <CompanySidebar />
        <section>{children}</section>
      </SidebarProvider>
    </main>
  )
}
