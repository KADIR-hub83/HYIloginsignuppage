// React Imports
import React, { useEffect } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// Component Imports
import { Logo } from '@/components/navigation/logo'
import { UserNav } from '@/components/navigation/user-nav'

// Context Import
import { useApp } from '@/context/appContext'

export default function Header() {
  const { profile, formIsCompleted, refreshProfile } = useApp()
  const router = useRouter()

  useEffect(() => {
    const refresh = async () => {
      await refreshProfile()
    }
    refresh()
  }, [])

  return (
    <header
      className={`w-full border-b sticky top-0 bg-background/95  supports-[backdrop-filter]:bg-background z-30`}
    >
      <div className={`w-full max-w-[1216px] container mx-auto px-2 py-4 flex items-center`}>
        <div className={`w-full flex items-center gap-8 pl-4`}>
          <Logo themeSwitch dashboard={(profile ? true : false) && formIsCompleted} />
        </div>
        <div className="w-fit flex items-center gap-4">
          <div className="flex items-center gap-4">
            <UserNav />
          </div>
        </div>
      </div>
    </header>
  )
}
