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
import { AppSidebar } from '@/components/talent-dashboard/main/app-sidebar'

// Context Import
import { useApp } from '@/context/appContext'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { profile, formIsCompleted } = useApp()
  const [isLoading, setIsLoading] = useState(true)
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [unauthorized, setUnauthorized] = useState(false)
  const [isopen, setIsOpen] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchTalentData = async () => {
      if (!profile) return
      try {
        if (profile?.userType !== 'talent') {
          setUnauthorized(true)
          return
        }

        if (formIsCompleted !== undefined && formIsCompleted === false) {
          setShouldRedirect(true)
        }

        setIsLoading(false)
      } catch (error) {
        console.error('Failed to load user profile:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTalentData()
  }, [profile, formIsCompleted])

  useEffect(() => {
    if (shouldRedirect) {
      router.replace('/talent/onboarding')
    }
  }, [shouldRedirect, router])

  if (isLoading || shouldRedirect) return

  if (unauthorized) return <Unauthorized message="" />

  return (
    <section className="layout">
      <main>
        <TalentHeader />

        <SidebarProvider className="sidebarProvider">
          <AppSidebar />
          <section className="w-full flex">
            {/* <SidebarTrigger onClick={() => setIsOpen(prev => !prev)} /> */}
            {children}
          </section>
        </SidebarProvider>
      </main>
    </section>
  )
}
