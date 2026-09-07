'use client'

// React Imports
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

// Next Imports
import Image from 'next/image'
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
import { authApi, userApi } from '@/lib/services/api'
import { AUTH_MESSAGES, VALIDATION_MESSAGES } from '@/lib/config/messages'
import { talentFormSchema, companyFormSchema } from '@/lib/validations/auth'

// lucide-react Imports
import { Eye, EyeOff, Loader2 } from 'lucide-react'

// Image Import
import TalentIcon from '@/components/assets/sign-up/talent.svg'
import CompanyIcon from '@/components/assets/sign-up/company.svg'
import IndividualIcon from '@/components/assets/sign-up/individual.svg'
import BackIcon from '@/components/assets/sign-up/back.svg'
import { getCookie } from '@/lib/cookies'

// type declaration
type SignupStep = 'form' | 'verify'
type UserType = 'talent' | 'company' | 'individual'

const otpFormSchema = z.object({
  otp: z.string().length(4, VALIDATION_MESSAGES.OTP.LENGTH),
})

const signupOptions = [
  {
    title: "I'm a Talent",
    value: 'talent',
    description: [
      'Build a professional profile that highlights your expertise.',
      'Discover remote, part-time, and full-time job opportunities.',
      'Connect with leading companies, startups, and entrepreneurs.',
      'Grow your career with access to exclusive resources and insights.',
    ],
    icon: <Image src={TalentIcon} alt="Talent Icon" />,
  },
  {
    title: "I'm a Company",
    value: 'company',
    description: [
      'Access a diverse pool of skilled professionals across industries.',
      'Hire remote, hybrid, or in-office employees with ease.',
      'Simplify recruitment with a seamless and efficient hiring process.',
      'Scale your team quickly without the hassle of traditional hiring.',
    ],
    icon: <Image src={CompanyIcon} alt="Company Icon" />,
  },
  {
    title: "I'm an Individual",
    value: 'individual',
    description: [
      'Find professionals to support your projects and business needs.',
      'Easily hire remote talent for tech, marketing, design, and more.',
      'Scale your team flexibly without long-term commitments.',
      'Connect with skilled individuals who can bring your vision to life.',
    ],
    icon: <Image src={IndividualIcon} alt="Individual Icon" />,
  },
]

const userTypes = ['talent', 'company', 'individual']

const Signup = () => {
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [step, setStep] = useState<SignupStep>('form')
  const [userType, setUserType] = useState<UserType | null>(null)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [otpValue, setOtpValue] = useState('')
  const [prevEmail, setPrevEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const formSchema =
    userType === 'talent'
      ? talentFormSchema
      : userType === 'company'
        ? companyFormSchema
        : talentFormSchema

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: userType !== 'company' ? '' : undefined,
      middleName: userType !== 'company' ? '' : undefined,
      lastName: userType !== 'company' ? '' : undefined,
      companyName: userType === 'company' ? '' : undefined,
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const otpForm = useForm<z.infer<typeof otpFormSchema>>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: '',
    },
  })

  useEffect(() => {
    form.reset()
  }, [userType])

  const { setError, clearErrors } = form

  async function checkEmailAvailability(email: string) {
    if (email === prevEmail) return
    setPrevEmail(email)

    const response = await authApi.checkEmail(email)

    if (response.success && response.exists) {
      // Email is already taken
      setError('email', {
        type: 'manual',
        message:
          'Your email is currently in use; please try a different one or log in if this is yours.',
      })
    } else {
      clearErrors('email')
    }
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
await authApi.register({
  email: data.email,
  firstName: 'firstName' in data ? data.firstName : data.companyName,
  middleName: 'middleName' in data ? data.middleName || '' : '',
  lastName: 'lastName' in data ? data.lastName : '',
  password: data.password,
  confirmPassword: data.confirmPassword,
  userType: userType as UserType,
})

// Save signup details temporarily for onboarding pre-fill
if (userType === 'talent') {
  sessionStorage.setItem(
    'signupUserData',
    JSON.stringify({
      firstName: 'firstName' in data ? data.firstName : '',
      middleName: 'middleName' in data ? data.middleName || '' : '',
      lastName: 'lastName' in data ? data.lastName : '',
      email: data.email,
    })
  )
}

setRegisteredEmail(data.email)
setStep('verify')

      toast(AUTH_MESSAGES.SIGNUP.VERIFICATION_REQUIRED)
    } catch (error: any) {
      toast({
        variant: 'destructive',
        ...AUTH_MESSAGES.SIGNUP.ERROR,
        description: error.response?.data?.message || AUTH_MESSAGES.SIGNUP.ERROR.description,
      })
    } finally {
      setIsLoading(false)
    }
  }

async function onVerifySubmit(data: z.infer<typeof otpFormSchema>) {
  if (isLoading) return

  try {
    setIsLoading(true)

    const response = await authApi.verifyOtp(
      registeredEmail,
      data.otp
    )

    console.log('OTP VERIFY RESPONSE:', response)
    console.log('USER TYPE:', userType)

    toast(AUTH_MESSAGES.SIGNUP.SUCCESS)

    if (userType === 'talent') {
      window.location.href = '/talent/onboarding'
      return
    }

    if (userType === 'company') {
      window.location.href = '/company/company-onboarding'
      return
    }

    if (userType === 'individual') {
      window.location.href = '/company/company-onboarding'
      return
    }
  } catch (error: any) {
    console.error('OTP verification error:', error)

    toast({
      variant: 'destructive',
      ...AUTH_MESSAGES.OTP.VERIFY.ERROR,
      description:
        error?.message ||
        AUTH_MESSAGES.OTP.VERIFY.ERROR.description,
    })
  } finally {
    setIsLoading(false)
  }
}

  async function handleResendOtp() {
    try {
      setIsLoading(true)
      await authApi.resendSignupOtp(registeredEmail)
      toast(AUTH_MESSAGES.OTP.RESEND.SUCCESS)
    } catch (error: any) {
      toast({
        variant: 'destructive',
        ...AUTH_MESSAGES.OTP.RESEND.ERROR,
        description: error.response?.data?.message || AUTH_MESSAGES.OTP.RESEND.ERROR.description,
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const fetchTalentData = async () => {
      const token = getCookie('token')

      if (token) {
        try {
          setLoading(true)
          const data = await userApi.getProfile(token)

          if (data.userData.data.userType === 'talent') {
            router.replace('/talent/onboarding')
          } else {
            router.replace('/company/company-onboarding')
          }

          setLoading(false)
        } catch (error) {
          console.error('Failed to load user profile:', error)
        } finally {
          setLoading(false)
        }
      }
    }
    fetchTalentData()
  }, [router])

  if (loading) return

  return (
    <div className="flex flex-col justify-center items-center bg-background min-h-screen">
      {!userType ? (
        <div className="flex flex-col">
          <h2 className="flex justify-center text-3xl font-semibold mb-12">
            Connecting Visionaries with Opportunities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
            {signupOptions.map((option, index) => (
              <Card
                key={index}
                className={`bg-white shadow-md rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                  userType === option.value ? 'border-primary' : 'border-transparent'
                }`}
              >
                <div className="flex items-center justify-center bg-tab-bg py-6">{option.icon}</div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-primary pb-2">{option.title}</h3>
                  <ul className="text-gray-600 font-medium text-sm mt-2 space-y-2 list-disc list-outside pl-5">
                    {option.description.map((text, i) => (
                      <li key={i}>{text}</li>
                    ))}
                  </ul>
                  <Button
                    className="w-full mt-4"
                    onClick={() => setUserType(option.value as UserType)}
                  >
                    Get started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-12 flex flex-start">
            <Link href="/login">
              <Button variant="ghost" className="text-base text-[#252B37]">
                <Image src={BackIcon} alt="Back Icon" className="mr-1" />
                Back to Signin
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="min-h-screen w-full flex flex-col bg-background">
          <div className="flex-1 flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/2 lg:h-screen lg:sticky lg:top-0">
              <div className="relative h-full">
                <div className="absolute inset-0">
                  <img
                    src="/signup_heroImg.webp"
                    alt="Team collaboration"
                    className="w-full h-full object-cover"
                    loading="eager"
                    fetchPriority="high"
                  />
                </div>
              </div>
            </div>
            <div className="w-full h-auto flex flex-col items-center justify-center pt-14 lg:w-1/2 lg:pt-0">
              <div className="relative flex flex-row-reverse px-8">
                <div className="max-w-md mx-auto ">
                  <Card>
                    <CardHeader className="space-y-1">
                      <CardTitle className="text-2xl font-bold text-center">
                        {step === 'form' ? 'Create an account with HYI.AI' : 'Verify your email'}
                      </CardTitle>
                      <CardDescription className="text-center">
                        {step === 'form' ? (
                          <>
                            <span className="text-sm font-medium">{`${userType?.charAt(0).toUpperCase()}${userType?.slice(1)} Signup`}</span>
                            <span
                              className="text-primary cursor-pointer ml-2 underline"
                              onClick={() => setUserType(null)}
                            >
                              {`Switch to ${userTypes.filter(type => type !== userType).join(' or ')}`}
                            </span>
                          </>
                        ) : (
                          'Enter the 4-digit code sent to your email'
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {step === 'form' ? (
                        <Form {...form}>
                          <form
                            onSubmit={e => {
                              e.preventDefault()
                              form.handleSubmit(onSubmit)(e)
                            }}
                            className="space-y-6"
                          >
                            <div className="space-y-4">
                              <FormField
                                control={form.control}
                                name={userType === 'company' ? 'companyName' : 'firstName'}
                                render={({ field }) => (
                                  <FormItem className="space-y-1">
                                    <FormLabel>
                                      {userType === 'talent' || userType === 'individual'
                                        ? 'First Name'
                                        : 'Company Name'}
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder={
                                          userType === 'talent' || userType === 'individual'
                                            ? 'Enter your first name'
                                            : 'Enter your company name'
                                        }
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                  </FormItem>
                                )}
                              />
                              {(userType === 'talent' || userType === 'individual') && (
                                <FormField
                                  control={form.control}
                                  name="middleName"
                                  render={({ field }) => (
                                    <FormItem className="space-y-1">
                                      <FormLabel>{'Middle Name'}</FormLabel>
                                      <FormControl>
                                        <Input placeholder={'Enter your middle name'} {...field} />
                                      </FormControl>
                                      <FormMessage className="text-xs" />
                                    </FormItem>
                                  )}
                                />
                              )}
                              {(userType === 'talent' || userType === 'individual') && (
                                <FormField
                                  control={form.control}
                                  name="lastName"
                                  render={({ field }) => (
                                    <FormItem className="space-y-1">
                                      <FormLabel>{'Last Name'}</FormLabel>
                                      <FormControl>
                                        <Input placeholder={'Enter your last name'} {...field} />
                                      </FormControl>
                                      <FormMessage className="text-xs" />
                                    </FormItem>
                                  )}
                                />
                              )}
                              <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem className="space-y-1">
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="email"
                                        placeholder={
                                          userType === 'talent' || userType === 'individual'
                                            ? 'Enter your email address'
                                            : 'Enter your work email address'
                                        }
                                        {...field}
                                        onBlur={() => checkEmailAvailability(field.value)}
                                      />
                                    </FormControl>

                                    <FormMessage className="text-xs" />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                  <FormItem className="space-y-1">
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Input
                                          type={showPassword ? 'text' : 'password'}
                                          placeholder="Create a strong password"
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
                                    <FormMessage className="text-xs" />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                  <FormItem className="space-y-1">
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Input
                                          type={showConfirmPassword ? 'text' : 'password'}
                                          placeholder="Re-enter your password"
                                          {...field}
                                        />
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                          onClick={() =>
                                            setShowConfirmPassword(!showConfirmPassword)
                                          }
                                        >
                                          {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                          ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                          )}
                                        </Button>
                                      </div>
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <Button className="w-full" type="submit" disabled={isLoading}>
                              {isLoading ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Creating account...
                                </>
                              ) : (
                                'Get Started'
                              )}
                            </Button>
                          </form>
                        </Form>
                      ) : (
                        <Form {...otpForm}>
                          <form
                            onSubmit={otpForm.handleSubmit(onVerifySubmit)}
                            className="space-y-6"
                          >
                            <FormField
                              control={otpForm.control}
                              name="otp"
                              render={({ field }) => (
                                <FormItem className=" flex flex-col items-center space-y-1">
                                  <FormLabel className="pb-1.5">Verification Code</FormLabel>
                                  <FormControl>
                                    <InputOTP
                                      maxLength={4}
                                      value={otpValue}
                                      onChange={value => {
                                        setOtpValue(value)
                                        field.onChange(value)
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
                                  <FormMessage className="text-xs text-center" />
                                </FormItem>
                              )}
                            />
                            <OTPTimer onResend={handleResendOtp} isResending={isLoading} />
                            <Button className="w-full" type="submit" disabled={isLoading}>
                              {isLoading ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Verifying...
                                </>
                              ) : (
                                'Verify Account'
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              className="w-full hover:bg-muted hover:text-foreground"
                              onClick={() => {
                                setStep('form')
                                otpForm.reset()
                              }}
                              type="button"
                            >
                              Back to Sign Up
                            </Button>
                          </form>
                        </Form>
                      )}
                    </CardContent>
                    <CardFooter className="flex flex-wrap items-center justify-center gap-2">
                      <div className="text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link
                          href="/login"
                          className="text-primary underline-offset-4 hover:underline"
                        >
                          Sign in
                        </Link>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              </div>
              <AuthFooter />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Signup
