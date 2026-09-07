'use client'

// React Imports
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

// Next Imports

// Zod Imports
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// shadcn Imports
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'

// Component Imports
import { OTPTimer } from '@/components/auth/otp-timer'

// Config Import
import { authApi } from '@/lib/services/api'
import { AUTH_MESSAGES, VALIDATION_MESSAGES } from '@/lib/config/messages'

// lucide-react Imports
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useApp } from '@/context/appContext'

// type declaration
type ResetStep = 'email' | 'verify'

interface ResetPasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// schema declaration
const resetPasswordSchema = z.object({
  email: z.string().email(VALIDATION_MESSAGES.EMAIL.REQUIRED),
})

const verifyOtpSchema = z
  .object({
    otp: z.string().length(4, VALIDATION_MESSAGES.OTP.LENGTH),
    password: z
      .string()
      .min(8, VALIDATION_MESSAGES.PASSWORD.MIN_LENGTH)
      .regex(/[A-Z]/, VALIDATION_MESSAGES.PASSWORD.UPPERCASE)
      .regex(/[a-z]/, VALIDATION_MESSAGES.PASSWORD.LOWERCASE)
      .regex(/[0-9]/, VALIDATION_MESSAGES.PASSWORD.NUMBER)
      .regex(/[^A-Za-z0-9]/, VALIDATION_MESSAGES.PASSWORD.SPECIAL),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: VALIDATION_MESSAGES.PASSWORD.MATCH,
    path: ['confirmPassword'],
  })

export function ResetPasswordDialog({ open, onOpenChange }: ResetPasswordDialogProps) {
  const { profile } = useApp()
  const [isLoading, setIsLoading] = useState(false)
  const [isResent, setIsResent] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [step, setStep] = useState<ResetStep>('email')
  const [email, setEmail] = useState('')
  const [otpValue, setOtpValue] = useState('')
  const { toast } = useToast()

  const emailForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: '' },
  })

  const verifyForm = useForm<z.infer<typeof verifyOtpSchema>>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      otp: '',
      password: '',
      confirmPassword: '',
    },
  })

  useEffect(() => {
    verifyForm.register('otp') // Register OTP field
  }, [verifyForm])

  useEffect(() => {
    if (profile) {
      emailForm.setValue('email', profile.email || '', { shouldValidate: true })
    }
  }, [profile])

  async function onEmailSubmit(data: z.infer<typeof resetPasswordSchema>) {
    try {
      setIsLoading(true)
      await authApi.requestPasswordReset(data.email)
      setEmail(data.email)
      setStep('verify')
      toast(AUTH_MESSAGES.RESET_PASSWORD.CODE_SENT)
    } catch (error: any) {
      toast({
        variant: 'destructive',
        ...AUTH_MESSAGES.RESET_PASSWORD.REQUEST.ERROR,
        description: error.message || AUTH_MESSAGES.RESET_PASSWORD.REQUEST.ERROR.description,
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function onVerifySubmit(data: z.infer<typeof verifyOtpSchema>) {
    try {
      setIsLoading(true)
      await authApi.verifyOtpAndResetPassword(email, data.otp, data.password, data.confirmPassword)
      toast(AUTH_MESSAGES.RESET_PASSWORD.SUCCESS)
      onOpenChange(false)
      setStep('email')
      emailForm.reset()
      verifyForm.reset()
      setOtpValue('')
    } catch (error: any) {
      toast({
        variant: 'destructive',
        ...AUTH_MESSAGES.RESET_PASSWORD.VERIFY.ERROR,
        description: error.message || AUTH_MESSAGES.RESET_PASSWORD.VERIFY.ERROR.description,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    try {
      setIsResent(true)
      await authApi.resendResetOtp(email)
      toast(AUTH_MESSAGES.RESET_PASSWORD.CODE_RESENT)
    } catch (error: any) {
      toast({
        variant: 'destructive',
        ...AUTH_MESSAGES.RESET_PASSWORD.REQUEST.ERROR,
        description: error.message || AUTH_MESSAGES.RESET_PASSWORD.REQUEST.ERROR.description,
      })
    } finally {
      setIsResent(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setStep('email')
    emailForm.reset()
    verifyForm.reset()
    setOtpValue('')
  }
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{step === 'email' ? 'Reset Password' : 'Verify Your Identity'}</DialogTitle>
          <DialogDescription>
            {step === 'email'
              ? "Enter your email address and we'll send you a verification code."
              : 'Enter the verification code and choose a new password.'}
          </DialogDescription>
        </DialogHeader>

        {step === 'email' ? (
          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
              <FormField
                control={emailForm.control}
                name="email"
                disabled
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your registered email address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending code...
                  </>
                ) : (
                  'Send Reset Code'
                )}
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...verifyForm}>
            <form onSubmit={verifyForm.handleSubmit(onVerifySubmit)} className="space-y-4">
              <FormField
                control={verifyForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <InputOTP
                        maxLength={4}
                        value={otpValue}
                        onChange={value => {
                          setOtpValue(value)
                          field.onChange(value)
                          verifyForm.setValue('otp', value, { shouldValidate: true })
                        }}
                        render={({ slots }) => (
                          <InputOTPGroup className="gap-2 justify-center">
                            {slots.map((slot, index) => (
                              <InputOTPSlot key={index} {...slot} className="w-10 h-12 text-lg" />
                            ))}
                          </InputOTPGroup>
                        )}
                      />
                    </FormControl>
                    <FormMessage className="text-center" />
                  </FormItem>
                )}
              />

              <OTPTimer onResend={handleResendOtp} isResending={isResent} />

              <FormField
                control={verifyForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create a new password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={verifyForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Re-enter your new password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-2">
                <Button type="submit" disabled={isLoading || isResent}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resetting password...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setStep('email')
                    verifyForm.reset()
                    setOtpValue('')
                  }}
                  type="button"
                  className="hover:bg-muted hover:text-foreground"
                >
                  Change email
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
