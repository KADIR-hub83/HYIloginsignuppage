'use client'

// React Imports
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'

// Next Imports
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Google-recaptcha Imports
// import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

// Zod Imports
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// shadcn Imports
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
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

// Config Import
import { getCookie } from '@/lib/cookies'
import { authApi, userApi } from '@/lib/services/api'
import { AUTH_MESSAGES, VALIDATION_MESSAGES } from '@/lib/config/messages'

// lucide-react Imports
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useApp } from '@/context/appContext'

// schema declaration
const loginSchema = z.object({
  email: z.string().email(VALIDATION_MESSAGES.EMAIL.REQUIRED),
  password: z.string().min(8, VALIDATION_MESSAGES.PASSWORD.MIN_LENGTH),
  rememberMe: z.boolean().default(false),
})

export default function LoginPage() {
  // const { executeRecaptcha } = useGoogleReCaptcha()
  const { toast } = useToast()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [Loading, setLoading] = useState(false)
  const { setProfile, setIsTokenAvailable } = useApp()

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  useEffect(() => {
    const token = getCookie('token')
    const redirection = async () => {
      if (token) {
        const data = await userApi.getProfile(token)

        const profile = data.userData

if (profile.userType === 'talent') {
  setLoading(true)

  if (profile.profileExists === false) {
    router.replace('/talent/onboarding')
  } else {
    router.replace('/talent/dashboard')
  }

  setLoading(false)
} else if (profile.userType === 'company') {
  setLoading(true)
  router.replace('/company/company-dashboard')
  setLoading(false)
} else if (profile.userType === 'individual') {
  setLoading(true)
  router.replace('/individual/individual-dashboard')
  setLoading(false)
} else if (profile.userType === 'interviewer') {
  setLoading(true)
  router.replace('/interviewer/interviewer-dashboard')
  setLoading(false)
} else if (profile.userType === 'relationship manager') {
  setLoading(true)
  router.replace('/relationship-manager/rm-dashboard')
  setLoading(false)
}
}
    }

    redirection()
  }, [])

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    // if (!executeRecaptcha) {
    //   return
    // }

    // const token = await executeRecaptcha('form_submit')
    try {
      // const BASE_URL = process.env.NEXT_PUBLIC_API_URL
      // const response = await fetch(`${BASE_URL}/verify-recaptcha`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token }),
      // })

      // if (!response.ok) {
      //   throw new Error(`Server error: ${response.status} please try again later!`)
      // }

      // const res = await response.json()
      // console.log(res)
      // if (res.success) {
      //   setIsLoading(true)

      //   await authApi.login(data.email, data.password, 'talent', data.rememberMe)

      //   toast(AUTH_MESSAGES.LOGIN.SUCCESS)

      //   router.push('/talent/dashboard')
      // } else {
      //   throw new Error('reCaptcha verification failed')
      // }

      setIsLoading(true)

      const response = await authApi.login(data.email, data.password, data.rememberMe)
      const userResponse = await userApi.getProfile(response.token)
      setProfile(prev => ({
        ...prev,
        ...userResponse.userData.data,
      }))
      if (response.userType) {
        setIsTokenAvailable(true)
      }
      if (response.talentOnboadCompleted) {
        router.replace('/talent/dashboard')
        return
      } else if (response.organizationOnboadCompleted) {
        if (response.userType === 'company') {
          router.replace('/company/company-dashboard')
        } else {
          router.replace('/individual/individual-dashboard')
        }
        return
      } else {
        if (response.userType === 'talent') {
          router.replace('/talent/onboarding')
        } else if (response.userType === 'relationship manager') {
          router.replace('/relationship-manager/rm-dashboard')
        } else if (response.userType === 'interviewer') {
          router.replace('/interviewer/interviewer-dashboard')
        } else {
          router.replace('/company/company-onboarding')
        }
      }

      toast(AUTH_MESSAGES.LOGIN.SUCCESS)
    } catch (error: any) {
      console.log(error)
      if (error.message.includes('Invalid password')) {
        form.setError('password', {
          type: 'manual',
          message: 'Invalid password. Please check your password and try again',
        })
      } else {
        toast({
          variant: 'destructive',
          ...AUTH_MESSAGES.LOGIN.ERROR,
          description: error.message || AUTH_MESSAGES.LOGIN.ERROR.description,
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  // if (Loading) return

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/login_heroImg.webp"
              alt="Office workspace"
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
                <h1 className="text-4xl font-bold tracking-tight text-white mb-4">Welcome Back</h1>
                <p className="text-xl text-white/90">
                  Sign in to your account to continue your professional journey and explore new
                  opportunities.
                </p>
              </div>
            </div>
          </div> */}
        </div>

        <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center relative">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
              <CardDescription className="text-center">
                Enter your email and password to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter your email address" {...field} />
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
                                placeholder="Enter your password"
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
                  </div>

                  <div className="flex items-center justify-between">
                    <FormField
                      control={form.control}
                      name="rememberMe"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">Remember me</FormLabel>
                        </FormItem>
                      )}
                    />
                    <Link href="/reset-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>

                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-center gap-2">
              <div className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
                  Sign up
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
