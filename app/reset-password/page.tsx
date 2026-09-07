'use client'

// React Imports
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

// Next Imports
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Zod Imports
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// shadcn Imports
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { AuthFooter } from '@/components/auth/auth-footer'
import { OTPTimer } from '@/components/auth/otp-timer'

// Config Import
import { authApi } from '@/lib/services/api'
import { resetPasswordSchema, verifyOtpSchema } from '@/lib/validations/auth'
import { AUTH_MESSAGES } from '@/lib/config/messages'

// lucide-react Imports
import { Eye, EyeOff, Loader2 } from 'lucide-react'

// type declaration
type ResetStep = 'email' | 'verify'

export default function ResetPassword() {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isResent, setIsResent] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [step, setStep] = useState<ResetStep>('email')
  const [email, setEmail] = useState('')
  const [otpValue, setOtpValue] = useState('')

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
      router.push('/login')
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="forgot_heroImg.webp"
              alt="Workspace with laptop"
              className="w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
            />
            {/* <div className="absolute inset-0 bg-gradient-to-b from-[#000] via-[#000]/50 to-[#000]/80" /> */}
          </div>
          {/* <div className="relative p-8 flex flex-col h-full">
            <Logo />
            <div className="flex-1 flex items-center">
              <div className="max-w-md">
                <h1 className="text-4xl font-bold tracking-tight text-white mb-4">
                  Reset Your Password
                </h1>
                <p className="text-xl text-white/90">
                  {step === 'email'
                    ? "Don't worry, it happens to the best of us. Enter your email and we'll help you reset your password."
                    : 'Check your email for the verification code and create a new password.'}
                </p>
              </div>
            </div>
          </div> */}
        </div>

        <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center relative">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
              <CardDescription className="text-center">
                {step === 'email'
                  ? 'Enter your email to receive reset instructions'
                  : 'Enter the verification code and new password'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {step === 'email' ? (
                <Form {...emailForm}>
                  <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                    <FormField
                      control={emailForm.control}
                      name="email"
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
                          <FormLabel className="pb-1.5">Verification Code</FormLabel>
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
                                    <InputOTPSlot
                                      key={index}
                                      {...slot}
                                      className="w-10 h-12 text-lg"
                                    />
                                  ))}
                                </InputOTPGroup>
                              )}
                            />
                          </FormControl>
                          <FormMessage />
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
                      <Button type="submit" disabled={isLoading}>
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
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-center gap-2">
              <div className="text-sm text-muted-foreground">
                Remember your password?{' '}
                <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>

          <AuthFooter />
        </div>
      </div>
    </div>
  )
}
