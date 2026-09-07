// 'use client'

// // React Imports
// import { createContext, useContext, useEffect, useState } from 'react'

// // Next Imports
// import { ThemeProvider } from 'next-themes'
// import { useRouter } from 'next/navigation'

// // Utility Imports
// import { getCookie } from '@/lib/cookies'
// import { companyApi } from '@/lib/services/companyApi'
// import { companyDashboardApi } from '@/lib/services/companyDashboardApi'
// import { userApi } from '@/lib/services/api'
// import { useToast } from '@/hooks/use-toast'

// // Config & Helpers
// import { PROFILE_MESSAGES } from '@/lib/config/messages'
// import { StaticImageData } from 'next/image'
// import { messages } from '@/lib/helper/dashboardData'

// interface Profile {
//   firstName: string
//   middleName: string
//   lastName: string
//   email: string
//   profilePicture: File | string | null
//   phoneNumber: string
//   role: string
//   userType: 'company' | 'talent' | 'individual' | 'interviewer' | 'relationship manager'
// }

// interface companyFormData {
//   organizationOnboadCompleted: boolean
//   organizationFromIndex: string
//   companyName: string
//   website: string
//   designation: string
//   businessType: string
//   type: string
//   projectScale: string
//   country: string
//   companyType: string
//   tin: string
//   aadharCard: string
//   panCard: string
//   companyAcNumber: string
// }

// interface TalentFormData {
//   basicDetails: boolean
//   talentOnboadCompleted: boolean
//   resume: string | File | null
//   profilePicture: File | string | null
//   fullName: string
//   firstName: string
//   middleName: string
//   lastName: string
//   email: string
//   gender: string | undefined
//   dateOfBirth: Date
//   phoneNumber: string
//   city: string
//   country: string
//   profileSummary: string
//   github: string
//   linkedin: string
//   portfolio: string
//   experience: {
//     companyName: string
//     designation: string
//     workSince: string
//     workTill: string
//     currentlyWorking: boolean
//     description: string
//   }[]
//   technicalSkills: {
//     skill: string
//     experience: string
//   }[]
//   otherSkills: string[]
//   preferences: {
//     employmentPreference: string
//     hoursPerWeek: string
//     desiredSalary: {
//       currency: string
//       price: string
//     }
//     availableHours: {
//       from: string
//       to: string
//     }
//   }
//   education: {
//     university: string
//     degree: string
//     specialization: string
//     passingOutYear: string
//   }[]
//   certification: {
//     title: string
//     issuedBy: string
//     issuedDate: string
//     uploadCertificate: string
//     website: string
//   }[]
//   languages: {
//     language: string
//     proficiency: string
//   }[]
//   projects: {
//     projectTitle: string
//     year: string
//     projectLink: string
//     technicalSkillUsed: string
//     projectDescription: string
//   }[]
//   talentFormIndex: string
// }

// type Message = {
//   id: number
//   messageRead: boolean
//   image: StaticImageData | string
//   userStatus: boolean
//   userName: string
//   userHashTag: string
//   time: string
//   message: string
// }[]

// interface AppContextType {
//   profile: Profile | null
//   setProfile: React.Dispatch<React.SetStateAction<Profile | null>>
//   companyData: companyFormData | null
//   talentFormData: TalentFormData | null
//   loading: boolean
//   formIsCompleted: boolean | undefined
//   activeLink: number
//   messageFeed: Message | undefined
//   companyId: string
//   setCompanyId: React.Dispatch<React.SetStateAction<string>>
//   isTokenAvailable: boolean
//   setIsTokenAvailable: React.Dispatch<React.SetStateAction<boolean>>
//   refreshProfile: () => Promise<void>
//   refreshCompanyFormData: () => Promise<void>
//   refreshTalentFormData: () => Promise<void>
//   updateDashboardContent: (id: number) => void
//   updateMessageContent: (id: number) => void
//   updateProfilePicture: (file: File | null) => void
//   updateProjectsList: () => Promise<void>
//   setActiveLink: React.Dispatch<React.SetStateAction<number>>
//   talentFormActiveIndex: number | null
//   organizationFromActiveIndex: number
//   activeMessage: number
// }

// const AppContext = createContext<AppContextType | undefined>(undefined)

// export function AppProvider({ children }: { children: React.ReactNode }) {
//   const [profile, setProfile] = useState<Profile | null>(null)
//   const [companyData, setCompanyData] = useState<companyFormData | null>(null)
//   const [talentFormData, setTalentFormData] = useState<TalentFormData | null>(null)
//   const [companyId, setCompanyId] = useState<string>('')
//   const [isTokenAvailable, setIsTokenAvailable] = useState<boolean>(false)
//   const [formIsCompleted, setFormIsCompleted] = useState<boolean | undefined>(undefined)
//   const [loading, setLoading] = useState<boolean>(true)
//   const [activeLink, setActiveLink] = useState<number>(1)
//   const [messageFeed, setMessageFeed] = useState<Message | undefined>(undefined)
//   const [organizationFromActiveIndex, setOrganizationFromActiveIndex] = useState<number>(0)
//   const [talentFormActiveIndex, setTalentFormActiveIndex] = useState<number | null>(null)
//   const [activeMessage, setActiveMessage] = useState<number>(1)
//   const [projects, setProjects] = useState<any[]>([])

//   const router = useRouter()
//   const { toast } = useToast()
//   const token = getCookie('token') || ''

//   const loadProfile = async () => {
//     if (!token) {
//       setLoading(false)
//       router.replace('/login')
//       return
//     }

//     try {
//       setLoading(true)
//       const data = await userApi.getProfile(token)
//       const userType = data.userData.data.userType as 'company' | 'talent'
//       setProfile({
//         ...data.userData.data,
//         userType,
//       })

//       if (userType === 'company') {
//         setFormIsCompleted(data.userData.organizationOnboadCompleted)
//         await fetchCompanyData()
//       } else if (userType === 'talent') {
//         setFormIsCompleted(data.userData.talentOnboadCompleted)
//         await fetchTalentData()
//         setMessageFeed(messages)
//       }
//     } catch (error) {
//       toast({ variant: 'destructive', ...PROFILE_MESSAGES.LOAD.ERROR })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchCompanyData = async () => {
//     if (!token) return
//     try {
//       const data =
//         profile?.userType === 'company' || profile?.userType === 'individual'
//           ? await companyApi.getOrganization(token)
//           : undefined
//       if (data?.companyData?.company) {
//         setCompanyData(data?.companyData?.company)
//         setOrganizationFromActiveIndex(
//           Number(data?.companyData?.company?.organizationFromIndex) || 0
//         )
//         setCompanyId(data?.companyData?.company._id)
//       }
//     } catch (error) {
//       console.error('Failed to load company profile:', error)
//     } finally {
//     }
//   }

//   const fetchTalentData = async () => {
//     if (!token) return
//     try {
//       const data = profile?.userType === 'talent' ? await userApi.getTalentData(token) : undefined
//       if (data?.userData) {
//         setTalentFormData(data.userData)
//       }
//       setTalentFormActiveIndex(Number(data?.userData.talentFormIndex) || 0)
//     } catch (error) {
//       console.error('Failed to load talent data:', error)
//     }
//   }

//   const updateProfilePicture = (file: File | null) => {
//     setProfile(prev => (prev ? { ...prev, profilePicture: file } : prev))
//   }

//   useEffect(() => {
//     loadProfile()
//   }, [isTokenAvailable])

//   const updateProjectsList = async () => {
//     const updatedProjects = await companyDashboardApi.getProjectsByCompany(token)
//     setProjects(updatedProjects)
//   }

//   return (
//     <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
//       <AppContext.Provider
//         value={{
//           profile,
//           setProfile,
//           companyData,
//           talentFormData,
//           formIsCompleted,
//           loading,
//           refreshProfile: loadProfile,
//           refreshCompanyFormData: fetchCompanyData,
//           refreshTalentFormData: fetchTalentData,
//           updateProfilePicture,
//           updateProjectsList,
//           updateDashboardContent: setActiveLink,
//           updateMessageContent: setActiveLink,
//           messageFeed,
//           activeLink,
//           setActiveLink,
//           companyId,
//           setCompanyId,
//           isTokenAvailable,
//           setIsTokenAvailable,
//           talentFormActiveIndex,
//           organizationFromActiveIndex,
//           activeMessage,
//         }}
//       >
//         {children}
//       </AppContext.Provider>
//     </ThemeProvider>
//   )
// }

// export function useApp() {
//   const context = useContext(AppContext)
//   if (!context) throw new Error('useApp must be used within an AppProvider')
//   return context
// }




'use client'

// React Imports
import { createContext, useContext, useEffect, useState } from 'react'

// Next Imports
import { ThemeProvider } from 'next-themes'
import { useRouter } from 'next/navigation'

// Utility Imports
import { getCookie } from '@/lib/cookies'
import { companyApi } from '@/lib/services/companyApi'
import { companyDashboardApi } from '@/lib/services/companyDashboardApi'
import { userApi } from '@/lib/services/api'
import { useToast } from '@/hooks/use-toast'

// Config & Helpers
import { PROFILE_MESSAGES } from '@/lib/config/messages'
import { StaticImageData } from 'next/image'
import { messages } from '@/lib/helper/dashboardData'

type UserType =
  | 'company'
  | 'talent'
  | 'individual'
  | 'interviewer'
  | 'relationship manager'

interface Profile {
  _id?: string
  firstName?: string
  middleName?: string
  lastName?: string
  fullName?: string
  email: string
  profilePicture?: File | string | null
  phoneNumber?: string
  role?: string
  userType: UserType

  // New backend fields
  profileExists?: boolean
  onboardingCompleted?: boolean

  // Old backend fields support
  talentOnboadCompleted?: boolean
  organizationOnboadCompleted?: boolean
}

interface companyFormData {
  organizationOnboadCompleted: boolean
  organizationFromIndex: string
  companyName: string
  website: string
  designation: string
  businessType: string
  type: string
  projectScale: string
  country: string
  companyType: string
  tin: string
  aadharCard: string
  panCard: string
  companyAcNumber: string
}

interface TalentFormData {
  basicDetails: boolean
  talentOnboadCompleted: boolean
  resume: string | File | null
  profilePicture: File | string | null
  fullName: string
  firstName: string
  middleName: string
  lastName: string
  email: string
  gender: string | undefined
  dateOfBirth: Date
  phoneNumber: string
  city: string
  country: string
  profileSummary: string
  github: string
  linkedin: string
  portfolio: string
  experience: {
    companyName: string
    designation: string
    workSince: string
    workTill: string
    currentlyWorking: boolean
    description: string
  }[]
  technicalSkills: {
    skill: string
    experience: string
  }[]
  otherSkills: string[]
  preferences: {
    employmentPreference: string
    hoursPerWeek: string
    desiredSalary: {
      currency: string
      price: string
    }
    availableHours: {
      from: string
      to: string
    }
  }
  education: {
    university: string
    degree: string
    specialization: string
    passingOutYear: string
  }[]
  certification: {
    title: string
    issuedBy: string
    issuedDate: string
    uploadCertificate: string
    website: string
  }[]
  languages: {
    language: string
    proficiency: string
  }[]
  projects: {
    projectTitle: string
    year: string
    projectLink: string
    technicalSkillUsed: string
    projectDescription: string
  }[]
  talentFormIndex: string
}

type Message = {
  id: number
  messageRead: boolean
  image: StaticImageData | string
  userStatus: boolean
  userName: string
  userHashTag: string
  time: string
  message: string
}[]

interface AppContextType {
  profile: Profile | null
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>

  companyData: companyFormData | null
  talentFormData: TalentFormData | null

  loading: boolean
  formIsCompleted: boolean | undefined

  activeLink: number
  messageFeed: Message | undefined

  companyId: string
  setCompanyId: React.Dispatch<React.SetStateAction<string>>

  isTokenAvailable: boolean
  setIsTokenAvailable: React.Dispatch<React.SetStateAction<boolean>>

  refreshProfile: () => Promise<void>
  refreshCompanyFormData: () => Promise<void>
  refreshTalentFormData: () => Promise<void>

  updateDashboardContent: (id: number) => void
  updateMessageContent: (id: number) => void

  updateProfilePicture: (file: File | null) => void
  updateProjectsList: () => Promise<void>

  setActiveLink: React.Dispatch<React.SetStateAction<number>>

  talentFormActiveIndex: number | null
  organizationFromActiveIndex: number
  activeMessage: number
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [profile, setProfile] = useState<Profile | null>(null)

  const [companyData, setCompanyData] =
    useState<companyFormData | null>(null)

  const [talentFormData, setTalentFormData] =
    useState<TalentFormData | null>(null)

  const [companyId, setCompanyId] = useState<string>('')

  const [isTokenAvailable, setIsTokenAvailable] =
    useState<boolean>(false)

  const [formIsCompleted, setFormIsCompleted] =
    useState<boolean | undefined>(undefined)

  const [loading, setLoading] = useState<boolean>(true)

  const [activeLink, setActiveLink] = useState<number>(1)

  const [messageFeed, setMessageFeed] =
    useState<Message | undefined>(undefined)

  const [organizationFromActiveIndex, setOrganizationFromActiveIndex] =
    useState<number>(0)

  const [talentFormActiveIndex, setTalentFormActiveIndex] =
    useState<number | null>(null)

  const [activeMessage, setActiveMessage] = useState<number>(1)

  const [projects, setProjects] = useState<any[]>([])

  const router = useRouter()
  const { toast } = useToast()

  // =========================================================
  // FETCH COMPANY DATA
  // =========================================================

  const fetchCompanyData = async (
    userTypeOverride?: UserType
  ) => {
    const token = getCookie('token')

    if (!token) return

    try {
      const currentUserType =
        userTypeOverride || profile?.userType

      if (
        currentUserType !== 'company' &&
        currentUserType !== 'individual'
      ) {
        return
      }

      const data = await companyApi.getOrganization(token)

      if (data?.companyData?.company) {
        setCompanyData(data.companyData.company)

        setOrganizationFromActiveIndex(
          Number(
            data.companyData.company.organizationFromIndex
          ) || 0
        )

        setCompanyId(
          data.companyData.company._id || ''
        )
      }
    } catch (error) {
      console.error(
        'Failed to load company profile:',
        error
      )
    }
  }

  // =========================================================
  // FETCH TALENT DATA
  // =========================================================

  const fetchTalentData = async (
    userTypeOverride?: UserType
  ) => {
    const token = getCookie('token')

    if (!token) return

    try {
      const currentUserType =
        userTypeOverride || profile?.userType

      if (currentUserType !== 'talent') {
        return
      }

      const data = await userApi.getTalentData(token)

      if (data?.userData) {
        setTalentFormData(data.userData)

        setTalentFormActiveIndex(
          Number(
            data?.userData?.talentFormIndex
          ) || 0
        )
      }
    } catch (error) {
      console.error(
        'Failed to load talent data:',
        error
      )
    }
  }

  // =========================================================
  // LOAD PROFILE
  // =========================================================

const loadProfile = async () => {
  const token = getCookie('token')

  if (!token) {
    setLoading(false)
    router.replace('/login')
    return
  }

  try {
    setLoading(true)

    const data = await userApi.getProfile(token)

    const profileData =
      data?.userData

    console.log(
      'PROFILE DATA:',
      profileData,
    )

    if (!profileData) {
      throw new Error(
        'Profile response is empty',
      )
    }

    if (!profileData.userType) {
      throw new Error(
        'User type missing from profile response',
      )
    }

    const userType =
      profileData.userType as UserType

    /*
    |--------------------------------------------------------------------------
    | Normalize onboarding completion
    |--------------------------------------------------------------------------
    */

    const onboardingCompleted =
      userType === 'company' ||
      userType === 'individual'
        ? (
            profileData?.organizationOnboadCompleted === true ||
            profileData?.organizationOnboardCompleted === true ||
            profileData?.onboardingCompleted === true
          )
        : userType === 'talent'
          ? (
              profileData?.talentOnboadCompleted === true ||
              profileData?.onboardingCompleted === true
            )
          : true

    /*
    |--------------------------------------------------------------------------
    | Save normalized profile
    |--------------------------------------------------------------------------
    */

    setProfile({
      ...profileData,
      userType,
      onboardingCompleted,
    })

    /*
    |--------------------------------------------------------------------------
    | NEW USER / PROFILE NOT CREATED
    |--------------------------------------------------------------------------
    */

    if (
      profileData.profileExists === false
    ) {
      setFormIsCompleted(false)

      if (
        userType === 'talent'
      ) {
        setTalentFormActiveIndex(0)
        setTalentFormData(null)
      }

      if (
        userType === 'company' ||
        userType === 'individual'
      ) {
        setOrganizationFromActiveIndex(0)
        setCompanyData(null)
      }

      return
    }

    /*
    |--------------------------------------------------------------------------
    | TALENT
    |--------------------------------------------------------------------------
    */

    if (
      userType === 'talent'
    ) {
      setFormIsCompleted(
        onboardingCompleted,
      )

      await fetchTalentData(
        'talent',
      )

      setMessageFeed(
        messages,
      )

      return
    }

    /*
    |--------------------------------------------------------------------------
    | COMPANY / INDIVIDUAL
    |--------------------------------------------------------------------------
    */

    if (
      userType === 'company' ||
      userType === 'individual'
    ) {
      setFormIsCompleted(
        onboardingCompleted,
      )

      /*
       * Don't destroy company profile state
       * if backend already returned the company data.
       */
      if (
        profileData.profileExists === true
      ) {
        setCompanyData(
          profileData,
        )

        setOrganizationFromActiveIndex(
          Number(
            profileData?.organizationFromIndex,
          ) || 0,
        )
      }

      /*
       * Only call separate company endpoint
       * if your app still needs extra company data.
       */
      try {
        await fetchCompanyData(
          userType,
        )
      } catch (error) {
        console.warn(
          'Company detail refresh skipped:',
          error,
        )
      }

      return
    }

    /*
    |--------------------------------------------------------------------------
    | OTHER USER TYPES
    |--------------------------------------------------------------------------
    */

    setFormIsCompleted(true)
  } catch (error) {
    console.error(
      'LOAD PROFILE ERROR:',
      error,
    )

    toast({
      variant: 'destructive',
      ...PROFILE_MESSAGES.LOAD.ERROR,
    })
  } finally {
    setLoading(false)
  }
}

  // =========================================================
  // UPDATE PROFILE PICTURE
  // =========================================================

  const updateProfilePicture = (
    file: File | null
  ) => {
    setProfile(prev =>
      prev
        ? {
            ...prev,
            profilePicture: file,
          }
        : prev
    )
  }

  // =========================================================
  // LOAD PROFILE WHEN TOKEN STATE CHANGES
  // =========================================================

  useEffect(() => {
    loadProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTokenAvailable])

  // =========================================================
  // PROJECTS
  // =========================================================

  const updateProjectsList = async () => {
    const token = getCookie('token')

    if (!token) return

    try {
      const updatedProjects =
        await companyDashboardApi.getProjectsByCompany(
          token
        )

      setProjects(updatedProjects)
    } catch (error) {
      console.error(
        'Failed to update projects:',
        error
      )
    }
  }

  // =========================================================
  // CONTEXT
  // =========================================================

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
    >
      <AppContext.Provider
        value={{
          profile,
          setProfile,

          companyData,
          talentFormData,

          formIsCompleted,
          loading,

          refreshProfile: loadProfile,

          refreshCompanyFormData:
            fetchCompanyData,

          refreshTalentFormData:
            fetchTalentData,

          updateProfilePicture,
          updateProjectsList,

          updateDashboardContent:
            setActiveLink,

          updateMessageContent:
            setActiveMessage,

          messageFeed,

          activeLink,
          setActiveLink,

          companyId,
          setCompanyId,

          isTokenAvailable,
          setIsTokenAvailable,

          talentFormActiveIndex,
          organizationFromActiveIndex,
          activeMessage,
        }}
      >
        {children}
      </AppContext.Provider>
    </ThemeProvider>
  )
}

export function useApp() {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error(
      'useApp must be used within an AppProvider'
    )
  }

  return context
}