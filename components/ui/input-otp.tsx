'use client'

import * as React from 'react'
import { OTPInput, SlotProps } from 'input-otp'
import { cn } from '@/lib/utils'
import { Minus } from 'lucide-react'

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, ...props }, ref) => (
  <OTPInput ref={ref} containerClassName={cn('flex items-center gap-2', className)} {...props} />
))
InputOTP.displayName = 'InputOTP'

const InputOTPGroup = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('otp-group', className)} {...props} />
))
InputOTPGroup.displayName = 'InputOTPGroup'

const InputOTPSlot = React.forwardRef<
  React.ElementRef<'div'>,
  SlotProps & React.ComponentPropsWithoutRef<'div'>
>(({ char, hasFakeCaret, isActive, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'otp-slot relative',
      {
        'border-primary': isActive,
      },
      className
    )}
    {...props}
  >
    {char ? (
      <div className=" w-full h-full flex items-center justify-center text-4xl animate-in fade-in-0">
        {char}
      </div>
    ) : (
      <Minus className="absolute bottom-0 right-3 h-4 w-4 text-muted-foreground" />
    )}
    {hasFakeCaret && (
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-4 w-px animate-caret-blink bg-foreground duration-500" />
      </div>
    )}
  </div>
))
InputOTPSlot.displayName = 'InputOTPSlot'

export { InputOTP, InputOTPGroup, InputOTPSlot }
