'use client'

// React Imports
import React, { useState } from 'react'

// Component Imports
import Header from '@/components/navigation/header'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { TalentSidebar } from '@/components/talent-onbarding/talentSidebar'

export default function TalentLayout({ children }: { children: React.ReactNode }) {
  const [isopen, setIsOpen] = useState(true)
  return (
    <main className={`min-h-screen bg-background`}>
      <Header />
      <SidebarProvider className="w-full max-w-[1216px] mx-auto py-6 lg:py-8">
        <TalentSidebar />
        <section>
          {/* <SidebarTrigger onClick={() => setIsOpen(prev => !prev)} /> */}
          {children}
        </section>
      </SidebarProvider>
    </main>
  )
}
