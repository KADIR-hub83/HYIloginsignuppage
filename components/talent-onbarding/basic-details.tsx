'use client'

// React Imports
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

// Zod Imports
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// Shadcn Imports
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'

// Components Imports
import UserInput from '@/components/shared/userInput'
import UserSelect from '@/components/shared/userSelect'
import UserDate from '@/components/shared/userDate'
import UserSummary from '@/components/shared/userSummary'
import UserButton from '@/components/shared/userButton'
import UserImage from '@/components/shared/userImage'
import UserSocialLinkInput from '@/components/shared/userSocialLinkInput'
import UserFileUpload from '@/components/shared/userFileDropdown'
import UserPhoneInput from '@/components/shared/userPhoneInput'

// Config Imports
import { talentApi } from '@/lib/services/api'
import { talentBasicDetailsFormSchema } from '@/lib/validations/auth'
import { TALENT_ONBOARDING_MESSAGES } from '@/lib/config/messages'

// Icon Imports
import LinkedinIcon from '@/components/assets/talent-onboarding/linkedin.svg'
import GithubIcon from '@/components/assets/talent-onboarding/github.svg'
import PortfolioIcon from '@/components/assets/talent-onboarding/portfolio.svg'

// Context Imports
import { useApp } from '@/context/appContext'

export default function BasicDetails({
  onComplete,
  onPreviousClick,
  currentStep,
  savedData,
}: {
  savedData: any
  currentStep: number
  onComplete: (data: any) => void
  onPreviousClick: () => void
}) {
  const { profile } = useApp()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [selectedResume, setSelectedResume] = useState<File | null>(null)
  const { toast } = useToast()

  const [signupUserData, setSignupUserData] = useState<{
  firstName: string
  middleName: string
  lastName: string
  email: string
} | null>(null)

useEffect(() => {
  try {
    const storedData = sessionStorage.getItem('signupUserData')

    if (storedData) {
      setSignupUserData(JSON.parse(storedData))
    }
  } catch (error) {
    console.error('Failed to load signup user data:', error)
  }
}, [])

  const handleImageSelect = (file: File | null) => {
    if (file !== selectedImage) {
      setSelectedImage(file)
      form.setValue('profileImage', file)
    }
  }

  const handleReumeSelect = (file: File | null) => {
    if (file !== selectedResume) {
      setSelectedResume(file)
      form.setValue('resume', file || '')
    }
  }

  const form = useForm<z.infer<typeof talentBasicDetailsFormSchema>>({
    resolver: zodResolver(talentBasicDetailsFormSchema),
    defaultValues: {
      resume: savedData?.resume instanceof File ? savedData.resume : null,
      profileImage: savedData?.profilePicture instanceof File ? savedData?.profilePicture : null,
      firstName: savedData?.firstName || '',
middleName: savedData?.middleName || '',
lastName: savedData?.lastName || '',
email: profile?.email || '',
      phoneNumber: savedData?.phoneNumber || '',
      gender: savedData?.gender || undefined,
      dateOfBirth: savedData?.dateOfBirth || '',
      country: savedData?.country || '',
      city: savedData?.city || '',
      summary: savedData?.profileSummary || '',
      linkedin: savedData?.linkedin || '',
      github: savedData?.github || '',
      portfolio: savedData?.portfolio || '',
    },
  })



useEffect(() => {
  // Priority:
  // 1. Existing talent saved data
  // 2. User profile data
  // 3. Signup session data
  //
  // Never replace an existing value with an empty string.

  const firstName =
    savedData?.firstName ||
    profile?.firstName ||
    signupUserData?.firstName ||
    ''

  const middleName =
    savedData?.middleName ||
    profile?.middleName ||
    signupUserData?.middleName ||
    ''

  const lastName =
    savedData?.lastName ||
    profile?.lastName ||
    signupUserData?.lastName ||
    ''

  const email =
    savedData?.email ||
    profile?.email ||
    signupUserData?.email ||
    ''

  if (firstName) {
    form.setValue('firstName', firstName, {
      shouldValidate: true,
    })
  }

  if (middleName) {
    form.setValue('middleName', middleName, {
      shouldValidate: true,
    })
  }

  if (lastName) {
    form.setValue('lastName', lastName, {
      shouldValidate: true,
    })
  }

  if (email) {
    form.setValue('email', email, {
      shouldValidate: true,
    })
  }
}, [profile, savedData, signupUserData, form])

  async function onSubmit(data: z.infer<typeof talentBasicDetailsFormSchema>) {
    const Index = Number(savedData?.talentFormIndex)
      ? Number(savedData?.talentFormIndex) <= 1
        ? '1'
        : savedData?.talentFormIndex
      : '1'
    try {
      setIsLoading(true)
      const res = await talentApi.basicInfo({
        talentFormIndex: Index,
        resume: data.resume,
        profilePicture: data.profileImage || null,
        firstName: data.firstName,
        middleName: data.middleName || '',
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        country: data.country,
        city: data.city,
        summary: data.summary?.trim() || '',
        linkedin: data.linkedin || '',
        github: data.github || '',
        portfolio: data.portfolio || '',
      })

      toast({
        variant: 'default',
        ...TALENT_ONBOARDING_MESSAGES.AUTH.BASICDETAILS.SUCCESS,
        description: TALENT_ONBOARDING_MESSAGES.AUTH.BASICDETAILS.SUCCESS.description,
        // className: 'w-fit fixed top-[72px] right-0',
      })
      if (res.success) {
  // Signup pre-fill is no longer needed.
  // From now on backend/talent data is source of truth.
  sessionStorage.removeItem('signupUserData')

  onComplete(data)
}
    } catch (error: any) {
      toast({
        variant: 'destructive',
        ...TALENT_ONBOARDING_MESSAGES.AUTH.BASICDETAILS.ERROR,
        description:
          error.response?.data?.message ||
          TALENT_ONBOARDING_MESSAGES.AUTH.BASICDETAILS.ERROR.description,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <Card className="w-full flex flex-col items-center justify-center gap-10">
            <CardContent className="w-full flex flex-col items-center text-card-foreground p-6 gap-5">
              <div className="w-full">
                <UserFileUpload
                  form={form}
                  label="Resume"
                  name="resume"
                  onFileSelect={handleReumeSelect}
                  mandatory
                  savedFile={
                    savedData?.resume instanceof File
                      ? URL.createObjectURL(savedData?.resume)
                      : savedData?.resume
                  }
                />
              </div>
            </CardContent>
          </Card>
          <Card className="w-full flex flex-col items-center justify-center gap-10">
            {/* -------------Personal Information------------- */}
            <CardContent className="w-full flex flex-col items-center text-card-foreground p-6 gap-2">
              <section className="w-full flex justify-between pb-4">
                <h2 className="text-lg font-semibold text-card-foreground">Basic Details</h2>
              </section>
              <section className="w-full flex flex-col items-center justify-center gap-2 md:flex-row md:gap-14">
                <div>
                  <UserImage
                    form={form}
                    name="profileImage"
                    onImageSelect={handleImageSelect}
                    savedImage={
                      savedData?.profilePicture instanceof File
                        ? URL.createObjectURL(savedData?.profilePicture)
                        : savedData?.profilePicture
                    }
                  />
                </div>
                <div className="w-full flex flex-col gap-2">
                  <UserInput
                    form={form}
                    label="First Name"
                    name="firstName"
                    placeholder="Enter first name"
                    mandatory
                  />
                  <div className="w-full flex gap-6">
                    <UserInput
                      form={form}
                      label="Middle Name"
                      name="middleName"
                      placeholder="Enter middle name"
                    />
                    <UserInput
                      form={form}
                      label="Last Name"
                      name="lastName"
                      placeholder="Enter last name"
                      mandatory
                    />
                  </div>
                </div>
              </section>
              <section className="w-full flex flex-col items-center justify-center gap-2">
                <div className="w-full flex flex-col gap-2 md:flex-row md:gap-6">
                  <UserInput
                    form={form}
                    label="Email"
                    name="email"
                    placeholder="Enter email address"
                    mandatory
                    isDisabled
                  />
                  <UserPhoneInput
                    form={form}
                    label="Phone"
                    name="phoneNumber"
                    placeholder="Enter phone number"
                    mandatory
                  />
                </div>
                <div className="w-full flex flex-col gap-2 md:flex-row md:gap-6">
                  <UserSelect
                    form={form}
                    label="Gender"
                    placeholder="Select Gender"
                    name="gender"
                    hasDropdownValues
                    dropdownValue={['Male', 'Female', 'Prefer not to say']}
                    mandatory
                  />

                  <UserDate
                    form={form}
                    label="Date of Birth"
                    name="dateOfBirth"
                    placeholder="DD/MM/YYYY"
                    mandatory
                    savedDate={savedData?.dateOfBirth}
                  />
                </div>
                <div className="w-full flex">
                  <UserSummary
                    form={form}
                    label="Profile Summary"
                    name="summary"
                    placeholder="Describe your Experience, Skills, and Future career goals."
                    mandatory
                  />
                </div>
                <div className="w-full flex flex-col gap-2 md:flex-row md:gap-6">
                  <UserSelect
                    form={form}
                    label="Country"
                    placeholder="Select Country"
                    name="country"
                    searchPlaceholder="Enter Country"
                    emptyPlaceholder="No country found"
                    getDropdown={talentApi.getCountry}
                    mandatory
                  />

                  <UserSelect
                    form={form}
                    label="City"
                    name="city"
                    placeholder="Enter City"
                    searchPlaceholder="Enter City"
                    emptyPlaceholder="No city found"
                    getDropdown={talentApi.getCity}
                    mandatory
                  />
                </div>
              </section>
            </CardContent>
          </Card>
          <Card className="w-full flex flex-col items-center justify-center gap-10">
            <CardContent className="w-full flex flex-col items-center text-card-foreground p-6 gap-6">
              <section className="w-full flex justify-between">
                <h3 className="text-lg font-semibold text-card-foreground">Social Links</h3>
              </section>
              <div className="w-full flex flex-col gap-2">
                <UserSocialLinkInput
                  form={form}
                  label=""
                  name="linkedin"
                  placeholder="LinkedIn URL"
                  icon={LinkedinIcon}
                />
                <UserSocialLinkInput
                  form={form}
                  label=""
                  name="github"
                  placeholder="GitHub URL"
                  icon={GithubIcon}
                />
                <UserSocialLinkInput
                  form={form}
                  label=""
                  name="portfolio"
                  placeholder="Portfolio URL"
                  icon={PortfolioIcon}
                />
              </div>
            </CardContent>
          </Card>
          <div className="flex float-right pt-7 md:pb-10">
            {currentStep !== 1 && (
              <Button onClick={onPreviousClick} disabled={currentStep === 1} variant="outline">
                Previous
              </Button>
            )}
            <div className="w-fit">
              <UserButton type="submit" buttonText="updating" isLoading={isLoading} isFormButton>
                Continue
              </UserButton>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
