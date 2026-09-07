'use client'

// React Imports
import React, { useEffect, useState } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// shadcn Imports
import { Separator } from '@/components/ui/separator'

// Component Imports
import BasicDetailsForm from '@/components/talent-onbarding/basic-details'
import WorkExperienceForm from '@/components/talent-onbarding/work-experience'
import EducationForm from '@/components/talent-onbarding/education'
import AdditionalDetailsForm from '@/components/talent-onbarding/additional-details'
import Unauthorized from '@/app/unauthorized'

// Image Import
import checkIcon from '@/components/assets/talent-onboarding/check.svg'

// Config Import
import { getCookie } from '@/lib/cookies'
import { userApi } from '@/lib/services/api'
// import { Briefcase, GraduationCap, Lightbulb, User } from 'lucide-react'
import { useApp } from '@/context/appContext'

// Number of steps in Stepper
const steps = [
  { id: 1, title: 'Basic Details', icon: checkIcon, alt: 'Check Icon' },
  { id: 2, title: 'Work Experience ', icon: checkIcon, alt: 'Check Icon' },
  { id: 3, title: 'Education', icon: checkIcon, alt: 'Check Icon' },
  { id: 4, title: 'Additional Details', icon: checkIcon, alt: 'Check Icon' },
]

// const renderIcon = (index: number, selectedProfile: boolean, completedProfile: boolean) => {
//   switch (index) {
//     case 1:
//       return (
//         <User
//           size={20}
//           strokeWidth={1.5}
//           className={`${completedProfile ? 'text-[#CEC0F6]' : selectedProfile ? 'text-primary' : 'text-secondary-foreground'}`}
//         />
//       )
//     case 2:
//       return (
//         <Briefcase
//           size={20}
//           strokeWidth={1.5}
//           className={`${completedProfile ? 'text-[#CEC0F6]' : selectedProfile ? 'text-primary' : 'text-secondary-foreground'}`}
//         />
//       )
//     case 3:
//       return (
//         <GraduationCap
//           size={20}
//           strokeWidth={1.5}
//           className={`${completedProfile ? 'text-[#CEC0F6]' : selectedProfile ? 'text-primary' : 'text-secondary-foreground'}`}
//         />
//       )
//     case 4:
//       return (
//         <Lightbulb
//           size={20}
//           strokeWidth={1.0}
//           className={`${completedProfile ? 'text-[#CEC0F6]' : selectedProfile ? 'text-primary' : 'text-secondary-foreground'}`}
//         />
//       )
//     default:
//       return null
//   }
// }

export default function ProfileCreation() {
  const { talentFormData, refreshProfile, refreshTalentFormData, talentFormActiveIndex } =
    useApp()
  const [currentStep, setCurrentStep] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [unauthorized, setUnauthorized] = useState(false)
  const router = useRouter()

  const handleStepComplete = async (stepData: any) => {
    if (currentStep)
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1)
        await refreshTalentFormData()
      } else {
        await refreshProfile()
        router.replace('/talent/dashboard')
      }
  }

  const handlePrevStep = () => {
    if (currentStep && currentStep > 1) {
      setCurrentStep(prevStep => prevStep && prevStep - 1)
    }
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentStep])

useEffect(() => {
  const fetchTalentData = async () => {
    const token = getCookie('token')

    if (!token) {
      router.replace('/login')
      setLoading(false)
      return
    }

    try {
      const response = await userApi.getProfile(token)

      const profile = response.userData

      // User must be talent
      if (profile.userType !== 'talent') {
        setUnauthorized(true)
        return
      }

      // New talent user, profile not created yet
      // Allow onboarding page to stay open
      if (
        profile.profileExists === false ||
        profile.onboardingCompleted === false
      ) {
        setShouldRedirect(false)
        return
      }

      // Existing completed talent profile
      if (
        profile.profileExists === true &&
        profile.onboardingCompleted === true
      ) {
        setShouldRedirect(true)
        return
      }

      // Keep old context check as fallback
      if (talentFormData?.talentOnboadCompleted) {
        setShouldRedirect(true)
      }
    } catch (error) {
      console.error('Failed to load user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  fetchTalentData()
}, [])

  useEffect(() => {
    if (shouldRedirect) {
      router.replace('/talent/dashboard')
    }
  }, [shouldRedirect, router])

  useEffect(() => {
    if (talentFormActiveIndex !== null) {
      setCurrentStep(
        talentFormActiveIndex === 0
          ? 1
          : talentFormActiveIndex < 4
            ? talentFormActiveIndex + 1
            : talentFormActiveIndex
      )
      setLoading(false)
    }
  }, [talentFormActiveIndex])

  if (loading || shouldRedirect || currentStep === null) return null

  if (unauthorized) return <Unauthorized message="" />

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicDetailsForm
            onComplete={handleStepComplete}
            onPreviousClick={handlePrevStep}
            currentStep={currentStep}
            savedData={talentFormData}
          />
        )
      case 2:
        return (
          <WorkExperienceForm
            onComplete={handleStepComplete}
            onPreviousClick={handlePrevStep}
            currentStep={currentStep}
            savedData={talentFormData}
          />
        )
      case 3:
        return (
          <EducationForm
            onComplete={handleStepComplete}
            onPreviousClick={handlePrevStep}
            currentStep={currentStep}
            savedData={talentFormData}
          />
        )
      case 4:
        return (
          <AdditionalDetailsForm
            onComplete={handleStepComplete}
            onPreviousClick={handlePrevStep}
            currentStep={currentStep}
            savedData={talentFormData}
          />
        )
      default:
        return null
    }
  }

  return (
    <section className="w-full flex items-center justify-center">
      <div className="w-full max-w-[1216px] flex flex-col items-center px-4 sm:w-11/12 sm:px-0">
        <div className="w-full flex flex-col items-start pb-4">
          <h1 className="text-2xl font-semibold text-card-foreground pb-2">
            Complete Your Profile
          </h1>
          <p className="text-base text-muted-foreground">
            Create your profile to unlock all features and start connecting with opportunities. A
            detailed profile increases your chances of being matched with relevant projects.
          </p>
        </div>
        {/* <div className="w-full flex items-center justify-between py-10">
          {steps.map((step, index) => {
            const isActive = step.id < currentStep
            return (
              <React.Fragment key={step.id}>
                <div className="flex items-center">
                  <div
                    className={`hidden sm:flex items-center z-20 bg-background ${step.id === currentStep ? 'text-primary' : 'text-muted-foreground'}`}
                  >
                    {step.id < currentStep && (
                      <Image
                        src={checkIcon}
                        alt="Check Icon"
                        width={24}
                        height={24}
                        className="px-0.5 mx-1"
                      />
                    )}
                    <div
                      className={` text-sm font-semibold text-secondary-foreground whitespace-nowrap lg:text-base ${step.id === currentStep && 'px-5 py-3 rounded-md border border-tab-border bg-tab-bg'}  ${step.id < currentStep && ' py-3 bg-background'}`}
                    >
                      {step.title}
                    </div>
                  </div>
                  <div
                    className={`flex flex-col items-center text-center z-20 bg-background ${step.id === currentStep ? 'text-primary' : 'text-muted-foreground'} sm:hidden`}
                  >
                    <div
                      className={`w-fit h-fit flex text-secondary-foreground rounded-full p-2.5 border ${step.id === currentStep ? 'border-tab-border bg-tab-bg' : step.id > currentStep ? 'border-muted-foreground bg-muted-foreground/10' : 'border-primary bg-primary'}`}
                    >
                      {renderIcon(index + 1, step.id === currentStep, step.id < currentStep)}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-grow mx-2">
                    <Separator
                      className={`h-0.5 ${isActive ? 'bg-primary md:bg-green-600' : 'bg-gray-300'}`}
                    />
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div> */}
        <div className="w-full flex items-center">
          <div className="w-full flex flex-col p-0">{renderStepContent()}</div>
        </div>
      </div>
    </section>
  )
}
