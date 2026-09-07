// 'use client'

// // React Imports
// import { createContext, useContext, useEffect, useState } from 'react'

// // Next Imports
// import { useRouter } from 'next/navigation'

// // shadcn Imports
// import { useToast } from '@/hooks/use-toast'

// // Config Import
// import { getCookie } from '@/lib/cookies'
// import { userApi } from '@/lib/services/api'
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
//   userType: string
// }

// interface talentFormData {
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

// type message = {
//   id: number
//   messageRead: boolean
//   image: StaticImageData | string
//   userStatus: boolean
//   userName: string
//   userHashTag: string
//   time: string
//   message: string
// }[]

// interface ProfileContextType {
//   profile: Profile | null
//   talentFormData: talentFormData | undefined
//   loading: boolean
//   formIsCompleted: boolean
//   talentFormActiveIndex: number | null
//   activeLink: number
//   activeMessage: number
//   messageFeed: message
//   refreshProfile: () => Promise<void>
//   refreshTalentFormData: () => Promise<void>
//   updateProfilePicture: (file: File | null) => void
//   updateDashboardContent: (id: number) => void
//   updateMessageContent: (id: number) => void
//   setIsTokenAvailable: React.Dispatch<React.SetStateAction<boolean>>
// }

// const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

// export function ProfileProvider({ children }: { children: React.ReactNode }) {
//   const [profile, setProfile] = useState<Profile | null>(null)
//   const [talentFormData, setTalentFormData] = useState<talentFormData | undefined>(undefined)
//   const [formIsCompleted, setFormIsCompleted] = useState<boolean>(false)
//   const [basicDetailsCompleted, setBasicDetailsCompleted] = useState<boolean>(false)
//   const [isTokenAvailable, setIsTokenAvailable] = useState<boolean>(false)

//   const [talentFormActiveIndex, setTalentFormActiveIndex] = useState<number | null>(null)

//   const [activeLink, setActiveLink] = useState<number>(1)

//   const [activeMessage, setActiveMessage] = useState<number>(1)
//   const [messageFeed, setMessageFeed] = useState<message>(messages)

//   const [talentFormIsLoading, setTalentFormIsLoading] = useState<boolean>(false)
//   const [loading, setLoading] = useState<boolean>(true)
//   const router = useRouter()
//   const { toast } = useToast()

//   // console.log(talentFormIsLoading)
//   const token = getCookie('token')

//   const loadProfile = async () => {
//     if (!token) {
//       setLoading(false)
//       router.replace('/login')
//       return
//     }

//     try {
//       setLoading(true)
//       const data = await userApi.getProfile(token)

//       setProfile(prev => ({
//         ...prev,
//         ...data.userData.data,
//       }))
//       setFormIsCompleted(data.userData.talentOnboadCompleted)
//       setBasicDetailsCompleted(data.userData.basicDetails)
//     } catch (error) {
//       toast({ variant: 'destructive', ...PROFILE_MESSAGES.LOAD.ERROR })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchTalentData = async () => {
//     try {
//       if (token) {
//         setTalentFormIsLoading(true)
//         const data = profile?.userType === 'talent' ? await userApi.getTalentData(token) : undefined

//         if (data?.userData)
//           setTalentFormData(prev => ({
//             ...prev,
//             ...data.userData,
//           }))

//         setTalentFormActiveIndex(Number(data?.userData.talentFormIndex) || 0)
//       }
//     } catch (error) {
//       console.error('Failed to load user profile:', error)
//     } finally {
//       setTalentFormIsLoading(false)
//     }
//   }

//   const fetchTalentDataInit = async () => {
//     try {
//       if (token) {
//         setTalentFormIsLoading(true)
//         const data =
//           basicDetailsCompleted && profile?.userType === 'talent'
//             ? await userApi.getTalentData(token)
//             : undefined

//         if (data?.userData)
//           setTalentFormData(prev => ({
//             ...prev,
//             ...data.userData,
//           }))

//         setTalentFormActiveIndex(Number(data?.userData.talentFormIndex) || 0)
//       }
//     } catch (error) {
//       console.error('Failed to load user profile:', error)
//     } finally {
//       setTalentFormIsLoading(false)
//     }
//   }

//   // Update only the profile picture in context
//   const updateProfilePicture = (file: File | null) => {
//     setProfile(prev => (prev ? { ...prev, profilePicture: file } : prev))
//   }

//   const updateDashboardContent = (id: number) => {
//     setActiveLink(id)
//   }

//   const updateMessageContent = (id: number) => {
//     setActiveMessage(id)
//   }

//   useEffect(() => {
//     loadProfile()
//   }, [isTokenAvailable])

//   useEffect(() => {
//     if (profile?.userType === 'talent') {
//       fetchTalentDataInit()
//     }
//   }, [profile?.userType])

//   // if (talentFormIsLoading) return

//   return (
//     <ProfileContext.Provider
//       value={{
//         profile,
//         talentFormData,
//         loading,
//         talentFormActiveIndex,
//         formIsCompleted,
//         activeLink,
//         activeMessage,
//         messageFeed,
//         refreshProfile: loadProfile,
//         refreshTalentFormData: fetchTalentData,
//         updateProfilePicture,
//         updateDashboardContent,
//         updateMessageContent,
//         setIsTokenAvailable,
//       }}
//     >
//       {children}
//     </ProfileContext.Provider>
//   )
// }

// export function useProfile() {
//   const context = useContext(ProfileContext)
//   if (!context) {
//     throw new Error('useProfile must be used within a ProfileProvider')
//   }
//   return context
// }
