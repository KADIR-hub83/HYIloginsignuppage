'use client'

// React Imports
import { useEffect, useState } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// shadcn Imports
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

// Component Imports
import Unauthorized from '@/app/unauthorized'
import TalentHeader from '@/components/talent-dashboard/main/header'

// Sidebar Imports
import { InterviewerSidebar } from '@/components/interviewer-dashboard/interviewer-sidebar'

// Context Import
import { useApp } from '@/context/appContext'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { profile } = useApp()
  const [isLoading, setIsLoading] = useState(true)
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [unauthorized, setUnauthorized] = useState(false)
  const [isopen, setIsOpen] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchTalentData = async () => {
      if (!profile) return
      try {
        if (profile?.userType !== 'interviewer') {
          setUnauthorized(true)
          return
        }

        setIsLoading(false)
      } catch (error) {
        console.error('Failed to load user profile:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTalentData()
  }, [profile])

  if (isLoading || shouldRedirect) return

  if (unauthorized) return <Unauthorized message="" />

  return (
    <section className="layout">
      <main>
        <TalentHeader />

        <SidebarProvider className="sidebarProvider">
          <InterviewerSidebar />
          <section className="w-full flex">
            {/* <SidebarTrigger onClick={() => setIsOpen(prev => !prev)} /> */}
            {children}
          </section>
        </SidebarProvider>
      </main>
    </section>
  )
}
