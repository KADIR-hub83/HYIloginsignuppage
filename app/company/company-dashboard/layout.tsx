'use client'

// React Imports
import { useEffect, useState } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// shadcn Imports
import { SidebarProvider } from '@/components/ui/sidebar'

// Component Imports
import Unauthorized from '@/app/unauthorized'
import CompanyHeader from '@/components/company-dashboard/header'

// Sidebar Imports
import { CompanyAppSidebar } from '@/components/company-dashboard/app-sidebar'

// Context Import
import { useApp } from '@/context/appContext'

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  const { profile, formIsCompleted } = useApp()
  const [isLoading, setIsLoading] = useState(true)
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [unauthorized, setUnauthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!profile) return
      try {
        if (profile?.userType !== 'company') {
          setUnauthorized(true)
          return
        }
        if (formIsCompleted !== undefined && formIsCompleted === false) {
          setShouldRedirect(true)
        }
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to load company profile:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCompanyData()
  }, [profile])

  useEffect(() => {
    if (shouldRedirect) {
      router.replace('/company/company-onboarding')
    }
  }, [shouldRedirect, router])

  if (isLoading || shouldRedirect) return

  if (unauthorized) return <Unauthorized message="" />

  return (
    <section className="layout">
      <main>
        <CompanyHeader />
        <SidebarProvider className="sidebarProvider">
          <CompanyAppSidebar />
          <section className="w-full flex">
            {/* <SidebarTrigger onClick={() => setIsOpen(prev => !prev)} /> */}
            {children}
          </section>
        </SidebarProvider>
      </main>
    </section>
  )
}
