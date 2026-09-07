'use client'

// React Imports
import React from 'react'

// Component Imports
import Header from '@/components/navigation/header'

export default function TalentLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className={`min-h-screen bg-background`}>
      <Header />
      {children}
    </main>
  )
}
