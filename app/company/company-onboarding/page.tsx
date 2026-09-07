// 'use client'
// import Image from 'next/image'
// import { useTheme } from 'next-themes'
// import { useState, useRef, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import Unauthorized from '@/app/unauthorized'

// // shadcn Imports
// import { Button } from '@/components/ui/button'
// import { useToast } from '@/hooks/use-toast'

// // svg imports
// import BackIcon from '@/public/company/back-icon.svg'
// import CheckIcon from '@/public/company/check-icon.svg'
// import ArrowRightIcon from '@/public/company/arrow-right-icon.svg'

// import { companyApi } from '@/lib/services/companyApi'
// import { userApi } from '@/lib/services/api'
// import { getCookie } from '@/lib/cookies'

// import CompanyProfileForm from './CompanyProfileForm/page'
// import DocumentVerificationForm from './DocumentVerificationForm/page'
// import { useApp } from '@/context/appContext'

// interface FormData {
//   organizationFromIndex: string
//   name: string
//   website: string
//   designation: string
//   businessType: string
//   industryType: string
//   projectScale: string
//   country: string
//   companyType: string
//   tin: string
//   aadharCard: string
//   panCard: string
//   companyAcNumber: string
// }

// interface Errors {
//   [key: string]: string
// }

// type UserType = 'company' | 'individual'

// const CompanyOnBoard: React.FC = () => {
//   const { theme } = useTheme()
//   const {
//     companyData: formData,
//     refreshProfile,
//     refreshCompanyFormData,
//     organizationFromActiveIndex,
//   } = useApp()
//   const [currentStep, setCurrentStep] = useState<number>(1)
//   const [userType, setUserType] = useState<UserType | null>(null)
//   const [companyName, setCompanyName] = useState('')
//   const [companyData, setCompanyData] = useState<FormData>({
//     organizationFromIndex: '',
//     name: companyName || '',
//     website: '',
//     designation: '',
//     businessType: '',
//     industryType: '',
//     projectScale: '',
//     country: '',
//     companyType: '',
//     tin: '',
//     aadharCard: '',
//     panCard: '',
//     companyAcNumber: '',
//   })
//   const [errors, setErrors] = useState<Errors>({})
//   const triggerSubmitCompanyRef = useRef<(() => boolean) | null>(null)
//   const triggerSubmitTaxRef = useRef<(() => boolean) | null>(null)
//   const [unauthorized, setUnauthorized] = useState(false)
//   const [shouldRedirect, setShouldRedirect] = useState(false)
//   const [loading, setLoading] = useState(true)
//   const { toast } = useToast()
//   const router = useRouter()

//   useEffect(() => {
//     const fetchCompanyData = async () => {
//       const token = getCookie('token')
//       if (!token) {
//         setLoading(false)
//         return
//       }
//       if (token) {
//         try {
//           const data = await userApi.getProfile(token)
//           setUserType(data?.userData?.data?.userType || null)
//           setCompanyName(data?.userData?.data?.firstName)
//           if (data?.userData?.data?.userType === 'talent') {
//             setUnauthorized(true)
//             setLoading(false)
//             return
//           }
//           if (
//             formData?.organizationOnboadCompleted !== undefined &&
//             formData?.organizationOnboadCompleted === true
//           ) {
//             setShouldRedirect(true)
//             return
//           }
//         } catch (error) {
//           console.error('Error fetching user profile:', error)
//         } finally {
//           setLoading(false)
//         }
//       }
//     }
//     fetchCompanyData()
//   }, [])

//   useEffect(() => {
//     if (shouldRedirect) {
//       router.replace('/company/company-dashboard')
//     }
//   }, [shouldRedirect, router])

//   const handleStepComplete = async (stepData: Partial<FormData>) => {
//     const updatedFormData = { ...companyData, ...stepData }
//     setCompanyData(updatedFormData)
//     const payload = {
//       organizationFromIndex: currentStep.toString(),
//       organizationOnboadCompleted: currentStep === 2 ? true : false,
//       type: userType as UserType,
//       companyName: userType === 'company' ? updatedFormData.name : '',
//       individualName: userType === 'individual' ? updatedFormData.name : '',
//       website: updatedFormData.website,
//       industryType: updatedFormData.industryType,
//       businessType: userType === 'company' ? updatedFormData.businessType : '',
//       designation: updatedFormData.designation,
//       projectScale: updatedFormData.projectScale,
//       country: updatedFormData.country,
//       companyType: userType === 'company' ? updatedFormData.companyType : '',
//       tin: userType === 'company' ? updatedFormData.tin : '',
//       companyAcNumber: userType === 'company' ? updatedFormData.companyAcNumber : '',
//       aadharCard: userType === 'individual' ? updatedFormData.aadharCard : '',
//       panCard: userType === 'individual' ? updatedFormData.panCard : '',
//     }
//     try {
//       await companyApi.addOrganization(payload)
//       await refreshCompanyFormData()
//       toast({
//         className: 'bg-green-600 text-white',
//         title: 'Successfully Completed, Thank You',
//       })

//       if (currentStep === 2 || organizationFromActiveIndex === 2) {
//         await refreshProfile()
//         if (userType === 'company') {
//           console.log(userType)
//           router.push('/company/company-dashboard')
//         } else {
//           router.replace('/individual/individual-dashboard')
//         }
//       }
//     } catch (error) {
//       console.error('Error:', error)
//     }
//   }

//   const renderStepContent = () => {
//     switch (currentStep) {
//       case 1:
//         return (
//           <CompanyProfileForm
//             initialData={formData}
//             onComplete={handleStepComplete}
//             triggerSubmitRef={triggerSubmitCompanyRef}
//             errors={errors}
//             setErrors={setErrors}
//             userType={userType}
//             companyName={companyName}
//             theme={theme}
//           />
//         )
//       case 2:
//         return (
//           <DocumentVerificationForm
//             initialData={formData}
//             onComplete={handleStepComplete}
//             triggerSubmitRef={triggerSubmitTaxRef}
//             errors={errors}
//             setErrors={setErrors}
//             userType={userType}
//             theme={theme}
//           />
//         )
//       default:
//         return null
//     }
//   }

//   const handleNext = () => {
//     if (currentStep === 1) {
//       if (triggerSubmitCompanyRef.current) {
//         const isCompanyValid = triggerSubmitCompanyRef.current()
//         if (isCompanyValid) {
//           setCurrentStep(2)
//         } else {
//           console.log('Company form validation failed')
//           return
//         }
//       }
//     } else if (currentStep === 2) {
//       if (triggerSubmitTaxRef.current) {
//         const isTaxValid = triggerSubmitTaxRef.current()
//         if (!isTaxValid) {
//           console.log('Tax form validation failed')
//           return
//         }
//       }
//     }
//   }

//   if (loading) return null

//   if (unauthorized) return <Unauthorized message="" />

//   return (
//     <section className="w-full flex justify-center">
//       <div className="w-full max-w-[1216px] flex flex-col px-4 sm:w-11/12 sm:px-0">
//         <div className="w-full flex flex-col items-start pb-4">
//           <h1 className="text-2xl font-semibold text-card-foreground pb-2">
//             {userType === 'company' ? 'Company Profile Creation' : 'Individual Profile Creation'}
//           </h1>
//           <p className="text-base text-muted-foreground">
//             Find Exceptional talent to elevate your company to new heights.
//           </p>
//         </div>
//         {renderStepContent()}
//         {currentStep === 1 ? (
//           <div className="max-w-4xl w-full mt-8 flex justify-end">
//             <Button onClick={handleNext} className="pr-12 pl-12">
//               Continue
//               <Image src={ArrowRightIcon} alt="Arrow Right Icon" />
//             </Button>
//           </div>
//         ) : (
//           <div className="max-w-4xl w-full mt-8 flex justify-between">
//             <Button
//               variant="ghost"
//               onClick={() => setCurrentStep(prev => Math.max(prev - 1, 0))}
//               disabled={currentStep === 1}
//               className={`${theme === 'light' ? 'hover:bg-[#FAFAFA] border border-primary rounded-full px-4 py-2' : ''}`}
//             >
//               <Image src={BackIcon} alt="Back Icon" />
//             </Button>
//             <Button onClick={handleNext} className="pr-12 pl-12">
//               Continue
//               <Image src={ArrowRightIcon} alt="Arrow Right Icon" />
//             </Button>
//           </div>
//         )}
//       </div>
//     </section>
//   )
// }

// export default CompanyOnBoard



































'use client'

import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import Unauthorized from '@/app/unauthorized'

import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

import BackIcon from '@/public/company/back-icon.svg'
import ArrowRightIcon from '@/public/company/arrow-right-icon.svg'

import { companyApi } from '@/lib/services/companyApi'
import { userApi } from '@/lib/services/api'
import { getCookie } from '@/lib/cookies'

import CompanyProfileForm from './CompanyProfileForm/page'
import DocumentVerificationForm from './DocumentVerificationForm/page'

import { useApp } from '@/context/appContext'

type UserType = 'company' | 'individual'

interface CompanyOnboardingFormData {
  organizationFromIndex: string

  organizationOnboadCompleted?: boolean
  organizationOnboardCompleted?: boolean
  onboardingCompleted?: boolean

  name: string

  companyName?: string
  individualName?: string

  website: string
  designation: string
  businessType: string
  industryType: string
  projectScale: string

  country: string
  companyType: string
  tin: string
  companyAcNumber: string

  aadharCard: string
  panCard: string
}

interface FormErrors {
  [key: string]: string
}

const EMPTY_FORM_DATA: CompanyOnboardingFormData = {
  organizationFromIndex: '1',

  organizationOnboadCompleted: false,
  organizationOnboardCompleted: false,
  onboardingCompleted: false,

  name: '',

  companyName: '',
  individualName: '',

  website: '',
  designation: '',
  businessType: '',
  industryType: '',
  projectScale: '',

  country: '',
  companyType: '',
  tin: '',
  companyAcNumber: '',

  aadharCard: '',
  panCard: '',
}

const normalizeBoolean = (...values: unknown[]) =>
  values.some(value => value === true)

const getSafeString = (...values: unknown[]) => {
  const value = values.find(
    item =>
      typeof item === 'string' &&
      item.trim().length > 0,
  )

  return typeof value === 'string'
    ? value
    : ''
}

const CompanyOnBoard = () => {
  const { theme } = useTheme()

  const router = useRouter()

  const { toast } = useToast()

  const {
    companyData: contextCompanyData,
    refreshProfile,
    refreshCompanyFormData,
  } = useApp()

  const [currentStep, setCurrentStep] =
    useState(1)

  const [userType, setUserType] =
    useState<UserType | null>(null)

  const [companyName, setCompanyName] =
    useState('')

  const [companyData, setCompanyData] =
    useState<CompanyOnboardingFormData>(
      EMPTY_FORM_DATA,
    )

  const [errors, setErrors] =
    useState<FormErrors>({})

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [unauthorized, setUnauthorized] =
    useState(false)

  const [redirecting, setRedirecting] =
    useState(false)

  const triggerSubmitCompanyRef =
    useRef<(() => boolean) | null>(null)

  const triggerSubmitVerificationRef =
    useRef<(() => boolean) | null>(null)

  /*
  |--------------------------------------------------------------------------
  | Redirect helper
  |--------------------------------------------------------------------------
  */

  const redirectToDashboard =
    useCallback(
      (type: UserType) => {
        setRedirecting(true)

        const target =
          type === 'individual'
            ? '/individual/individual-dashboard'
            : '/company/company-dashboard'

        /*
         * Hard replace intentionally used here.
         *
         * After onboarding we want the complete app,
         * AppContext and server components to reload
         * with the newly completed profile.
         */
        window.location.replace(target)
      },
      [],
    )

  /*
  |--------------------------------------------------------------------------
  | Initial profile load
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let active = true

    const loadOnboarding = async () => {
      const token = getCookie('token')

      if (!token) {
        router.replace('/login')
        return
      }

      try {
        setLoading(true)

        const response =
          await userApi.getProfile(token)

        /*
         * userApi.getProfile() should return:
         *
         * {
         *   userData: {
         *      userType,
         *      ...
         *   }
         * }
         */
        const profile =
          response?.userData

        if (!profile) {
          throw new Error(
            'Company account profile was not returned',
          )
        }

        if (
          profile.userType === 'talent'
        ) {
          if (active) {
            setUnauthorized(true)
          }

          return
        }

        const resolvedUserType: UserType =
          profile.userType === 'individual'
            ? 'individual'
            : 'company'

        /*
         * Context company data may contain more
         * onboarding-specific fields than account
         * profile response.
         */
        const source =
          contextCompanyData || {}

        const completed =
          normalizeBoolean(
            source?.organizationOnboadCompleted,
            source?.organizationOnboardCompleted,
            source?.onboardingCompleted,

            profile?.organizationOnboadCompleted,
            profile?.organizationOnboardCompleted,
            profile?.onboardingCompleted,
          )

        const resolvedName =
          getSafeString(
            source?.companyName,
            source?.individualName,

            profile?.companyName,
            profile?.individualName,

            profile?.fullName,
            profile?.firstName,
          )

        const normalizedData: CompanyOnboardingFormData =
          {
            organizationFromIndex:
              String(
                source?.organizationFromIndex ??
                  profile?.organizationFromIndex ??
                  '1',
              ),

            organizationOnboadCompleted:
              completed,

            organizationOnboardCompleted:
              completed,

            onboardingCompleted:
              completed,

            name:
              resolvedName,

            companyName:
              getSafeString(
                source?.companyName,
                profile?.companyName,
              ),

            individualName:
              getSafeString(
                source?.individualName,
                profile?.individualName,
              ),

            website:
              getSafeString(
                source?.website,
                profile?.website,
              ),

            designation:
              getSafeString(
                source?.designation,
                profile?.designation,
              ),

            businessType:
              getSafeString(
                source?.businessType,
                profile?.businessType,
              ),

            industryType:
              getSafeString(
                source?.industryType,
                profile?.industryType,
              ),

            projectScale:
              getSafeString(
                source?.projectScale,
                profile?.projectScale,
              ),

            country:
              getSafeString(
                source?.country,
                profile?.country,
              ),

            companyType:
              getSafeString(
                source?.companyType,
                profile?.companyType,
              ),

            tin:
              getSafeString(
                source?.tin,
                profile?.tin,
              ),

            companyAcNumber:
              getSafeString(
                source?.companyAcNumber,
                profile?.companyAcNumber,
              ),

            aadharCard:
              getSafeString(
                source?.aadharCard,
                profile?.aadharCard,
              ),

            panCard:
              getSafeString(
                source?.panCard,
                profile?.panCard,
              ),
          }

        if (!active) {
          return
        }

        setUserType(
          resolvedUserType,
        )

        setCompanyName(
          resolvedName,
        )

        setCompanyData(
          normalizedData,
        )

        console.log(
          'COMPANY PROFILE:',
          profile,
        )

        console.log(
          'COMPANY ONBOARDING DATA:',
          normalizedData,
        )

        console.log(
          'COMPANY ONBOARDING COMPLETED:',
          completed,
        )

        /*
         * Already completed.
         */
        if (completed) {
          redirectToDashboard(
            resolvedUserType,
          )

          return
        }

        /*
         * Resume saved onboarding step.
         */
        const storedStep =
          Number(
            normalizedData.organizationFromIndex,
          )

        if (
          Number.isFinite(storedStep) &&
          storedStep >= 1 &&
          storedStep <= 2
        ) {
          setCurrentStep(
            storedStep,
          )
        } else {
          setCurrentStep(1)
        }
      } catch (error) {
        console.error(
          'LOAD COMPANY ONBOARDING ERROR:',
          error,
        )

        toast({
          variant: 'destructive',
          title:
            'Unable to load company profile',
          description:
            error instanceof Error
              ? error.message
              : 'Please try again.',
        })
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadOnboarding()

    return () => {
      active = false
    }
  }, [
    contextCompanyData,
    redirectToDashboard,
    router,
    toast,
  ])

  /*
  |--------------------------------------------------------------------------
  | Persist onboarding step
  |--------------------------------------------------------------------------
  */

  const handleStepComplete =
    useCallback(
      async (
        stepData: Partial<CompanyOnboardingFormData>,
      ) => {
        if (!userType) {
          toast({
            variant: 'destructive',
            title:
              'Account type unavailable',
            description:
              'Please refresh the page and try again.',
          })

          return
        }

        if (saving) {
          return
        }

        const updatedFormData = {
          ...companyData,
          ...stepData,
        }

        const isFinalStep =
          currentStep === 2

        const payload = {
          organizationFromIndex:
            currentStep.toString(),

          organizationOnboadCompleted:
            isFinalStep,

          type:
            userType,

          companyName:
            userType === 'company'
              ? updatedFormData.name.trim()
              : '',

          individualName:
            userType === 'individual'
              ? updatedFormData.name.trim()
              : '',

          website:
            updatedFormData.website.trim(),

          industryType:
            updatedFormData.industryType.trim(),

          businessType:
            userType === 'company'
              ? updatedFormData.businessType.trim()
              : '',

          designation:
            updatedFormData.designation.trim(),

          projectScale:
            updatedFormData.projectScale.trim(),

          country:
            updatedFormData.country.trim(),

          companyType:
            userType === 'company'
              ? updatedFormData.companyType.trim()
              : '',

          tin:
            userType === 'company'
              ? updatedFormData.tin.trim()
              : '',

          companyAcNumber:
            userType === 'company'
              ? updatedFormData.companyAcNumber.trim()
              : '',

          aadharCard:
            userType === 'individual'
              ? updatedFormData.aadharCard.trim()
              : '',

          panCard:
            userType === 'individual'
              ? updatedFormData.panCard.trim()
              : '',
        }

        try {
          setSaving(true)

          console.log(
            'COMPANY ONBOARDING PAYLOAD:',
            payload,
          )

          await companyApi.addOrganization(
            payload,
          )

          setCompanyData(
            updatedFormData,
          )

          /*
           * STEP 1 successfully saved.
           */
          if (!isFinalStep) {
            setCurrentStep(2)

            toast({
              className:
                'bg-green-600 text-white',
              title:
                'Company information saved',
            })

            /*
             * Refresh context after step change.
             * Do not block UI transition.
             */
            void refreshCompanyFormData()

            return
          }

          /*
           * FINAL STEP.
           */

          toast({
            className:
              'bg-green-600 text-white',
            title:
              'Onboarding completed successfully',
          })

          /*
           * Refresh context/Profile before leaving.
           */
          await Promise.allSettled([
            refreshCompanyFormData(),
            refreshProfile(),
          ])

          redirectToDashboard(
            userType,
          )
        } catch (error) {
          console.error(
            'COMPANY ONBOARDING SAVE ERROR:',
            error,
          )

          toast({
            variant: 'destructive',
            title:
              'Failed to save profile',
            description:
              error instanceof Error
                ? error.message
                : 'Please try again.',
          })
        } finally {
          setSaving(false)
        }
      },
      [
        companyData,
        currentStep,
        redirectToDashboard,
        refreshCompanyFormData,
        refreshProfile,
        saving,
        toast,
        userType,
      ],
    )

  /*
  |--------------------------------------------------------------------------
  | Next button
  |--------------------------------------------------------------------------
  */

  const handleNext = () => {
    if (saving) {
      return
    }

    if (currentStep === 1) {
      const submit =
        triggerSubmitCompanyRef.current

      if (!submit) {
        console.error(
          'Company profile submit handler is not registered',
        )

        return
      }

      /*
       * IMPORTANT:
       *
       * Do NOT call setCurrentStep(2) here.
       *
       * CompanyProfileForm.handleSubmit()
       * calls handleStepComplete().
       *
       * handleStepComplete changes step only
       * AFTER backend save succeeds.
       */
      submit()

      return
    }

    if (currentStep === 2) {
      const submit =
        triggerSubmitVerificationRef.current

      if (!submit) {
        console.error(
          'Verification submit handler is not registered',
        )

        return
      }

      submit()
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Previous
  |--------------------------------------------------------------------------
  */

  const handlePrevious = () => {
    if (
      saving ||
      currentStep <= 1
    ) {
      return
    }

    setErrors({})

    setCurrentStep(
      step =>
        Math.max(
          step - 1,
          1,
        ),
    )
  }

  /*
  |--------------------------------------------------------------------------
  | Render step
  |--------------------------------------------------------------------------
  */

  const renderStepContent = () => {
    if (!userType) {
      return null
    }

    if (currentStep === 1) {
      return (
        <CompanyProfileForm
          initialData={companyData}
          onComplete={
            handleStepComplete
          }
          triggerSubmitRef={
            triggerSubmitCompanyRef
          }
          errors={errors}
          setErrors={setErrors}
          userType={userType}
          companyName={companyName}
          theme={theme}
        />
      )
    }

    return (
      <DocumentVerificationForm
        initialData={companyData}
        onComplete={
          handleStepComplete
        }
        triggerSubmitRef={
          triggerSubmitVerificationRef
        }
        errors={errors}
        setErrors={setErrors}
        userType={userType}
        theme={theme}
      />
    )
  }

  /*
  |--------------------------------------------------------------------------
  | Guards
  |--------------------------------------------------------------------------
  */

  if (
    loading ||
    redirecting
  ) {
    return null
  }

  if (unauthorized) {
    return (
      <Unauthorized message="" />
    )
  }

  if (!userType) {
    return null
  }

  return (
    <section className="w-full flex justify-center">
      <div className="w-full max-w-[1216px] flex flex-col px-4 sm:w-11/12 sm:px-0">
        <div className="w-full flex flex-col items-start pb-4">
          <h1 className="text-2xl font-semibold text-card-foreground pb-2">
            {userType === 'company'
              ? 'Company Profile Creation'
              : 'Individual Profile Creation'}
          </h1>

          <p className="text-base text-muted-foreground">
            Complete your profile to
            access all platform
            features and connect with
            the right talent.
          </p>
        </div>

        {renderStepContent()}

        <div
          className={`max-w-4xl w-full mt-8 flex ${
            currentStep === 1
              ? 'justify-end'
              : 'justify-between'
          }`}
        >
          {currentStep > 1 && (
            <Button
              type="button"
              variant="ghost"
              onClick={
                handlePrevious
              }
              disabled={saving}
              className={
                theme === 'light'
                  ? 'hover:bg-[#FAFAFA] border border-primary rounded-full px-4 py-2'
                  : 'border border-primary rounded-full px-4 py-2'
              }
            >
              <Image
                src={BackIcon}
                alt="Previous step"
              />
            </Button>
          )}

          <Button
            type="button"
            onClick={handleNext}
            disabled={saving}
            className="px-12"
          >
            {saving
              ? 'Saving...'
              : currentStep === 2
                ? 'Complete'
                : 'Continue'}

            {!saving && (
              <Image
                src={ArrowRightIcon}
                alt=""
              />
            )}
          </Button>
        </div>
      </div>
    </section>
  )
}

export default CompanyOnBoard