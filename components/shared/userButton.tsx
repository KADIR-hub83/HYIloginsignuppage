'use client'

// React Imports
import { useEffect, useState } from 'react'
import React, { ReactNode } from 'react'

// shadcn Imports
import { Button } from '@/components/ui/button'

// lucide-react Imports
import { ChevronRight } from 'lucide-react'

interface UserButtonProps {
  type: 'button' | 'submit' | 'reset'
  reverse?: boolean
  children: ReactNode
  isLoading?: boolean
  onSubmit?: boolean
  isFormButton?: boolean
  buttonText?: string
  loadingButtonText?: string
}

export default function UserButton({
  type = 'submit',
  reverse = false,
  children,
  isLoading = false,
  onSubmit = false,
  isFormButton = false,
  buttonText = 'Processing',
}: UserButtonProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null
  return (
    <Button
      disabled={isLoading || onSubmit}
      type={type}
      className={`w-full flex items-center text-base py-2.5 ${reverse && 'bg-background gap-3 hover:bg-card'} ${isLoading && 'hover:'}`}
    >
      {!reverse ? (
        <div className="flex items-center gap-0.5">
          {isLoading ? buttonText : children}
          {!isLoading && isFormButton && (
            <div className="w-5 h-5 flex items-center justify-center">
              <ChevronRight size={20} />
            </div>
          )}
          {isLoading && (
            <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin ml-1"></div>
          )}
        </div>
      ) : (
        <>
          <div className="w-5 h-5 flex items-center justify-center">
            <ChevronRight size={20} />
          </div>
          {children}
        </>
      )}
    </Button>
  )
}
