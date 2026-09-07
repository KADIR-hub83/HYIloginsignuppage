'use client'

// React Imports
import { useEffect, useState } from 'react'

// shadcn Imports
import { Button } from '@/components/ui/button'

// lucide-react Imports
import { Loader2 } from 'lucide-react'

// type declaration
interface OTPTimerProps {
  onResend: () => Promise<void>
  isResending: boolean
}

export function OTPTimer({ onResend, isResending }: OTPTimerProps) {
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes in seconds
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else {
      setCanResend(true)
    }
  }, [timeLeft])

  const handleResend = async () => {
    await onResend()
    setTimeLeft(120)
    setCanResend(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="text-sm text-center text-muted-foreground">
      {!canResend ? (
        <>
          Resend code in <span className="font-medium">{formatTime(timeLeft)}</span>
        </>
      ) : (
        <Button
          variant="link"
          className="p-0 h-auto font-normal"
          onClick={handleResend}
          disabled={isResending}
        >
          {isResending ? (
            <>
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              Sending...
            </>
          ) : (
            'Resend code'
          )}
        </Button>
      )}
    </div>
  )
}
