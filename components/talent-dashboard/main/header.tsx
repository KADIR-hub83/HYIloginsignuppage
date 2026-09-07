// React Imports
import React, { useEffect } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// Component Imports
import { Logo } from '@/components/navigation/logo'
import { UserNav } from '@/components/navigation/user-nav'

// Context Import

// lucide-react Imports
import { Bell } from 'lucide-react'
import { useApp } from '@/context/appContext'

export default function TalentHeader() {
  const { profile, formIsCompleted, refreshProfile } = useApp()
  const router = useRouter()

  useEffect(() => {
    const refresh = async () => {
      await refreshProfile()
    }
    refresh()
  }, [])

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-img">
          <Logo themeSwitch dashboard={(profile ? true : false) && formIsCompleted} />
        </div>
        <div className="header-item">
          <div className="header-item-img">
            <Bell strokeWidth={2.0} className="header-item-icon" />
          </div>
          <UserNav />
        </div>
      </div>
    </header>
  )
}
