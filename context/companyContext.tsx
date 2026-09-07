// 'use client'

// // React Imports
// import { createContext, useContext, useEffect, useState } from 'react'

// // Next Imports
// import { useRouter } from 'next/navigation'
// import { getCookie } from '@/lib/cookies'
// import { companyApi } from '@/lib/services/companyApi'
// import { userApi } from '@/lib/services/api'

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

// interface CompanyContextType {
//   profile: Profile | null
//   setProfile: React.Dispatch<React.SetStateAction<Profile | null>>
//   formData: companyFormData | null
//   loading: boolean
//   formIsCompleted: boolean
//   organizationFromActiveIndex: number
//   activeLink: number
//   setActiveLink: React.Dispatch<React.SetStateAction<number>>
//   companyId: string
//   setCompanyId: React.Dispatch<React.SetStateAction<string>>
//   refreshProfile: () => Promise<void>
//   refreshCompanyFormData: () => Promise<void>
//   updateDashboardContent: (id: number) => void
// }

// const CompanyContext = createContext<CompanyContextType | undefined>(undefined)

// export function CompanyProvider({ children }: { children: React.ReactNode }) {
//   const [profile, setProfile] = useState<Profile | null>(null)
//   const [formData, setFormData] = useState<companyFormData | null>(null)
//   const [formIsCompleted, setFormIsCompleted] = useState<boolean>(false)
//   const [organizationFromActiveIndex, setOrganizationFromActiveIndex] = useState<number>(0)
//   const [loading, setLoading] = useState<boolean>(true)
//   const [activeLink, setActiveLink] = useState<number>(1)
//   const [companyId, setCompanyId] = useState<string>('')
//   const router = useRouter()

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
//       setFormIsCompleted(data.userData.organizationOnboadCompleted)
//     } catch (error) {
//       throw error
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchCompanyData = async () => {
//     const token = getCookie('token')
//     if (!token) {
//       setLoading(false)
//       router.replace('/login')
//       return
//     }
//     try {
//       const data =
//         profile?.userType === 'company' || profile?.userType === 'individual'
//           ? await companyApi.getOrganization(token)
//           : undefined
//       if (data?.companyData?.company) {
//         setFormData(data?.companyData?.company)
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

//   useEffect(() => {
//     loadProfile()
//   }, [token])

//   useEffect(() => {
//     if (profile?.userType) {
//       fetchCompanyData()
//     }
//   }, [profile?.userType])

//   const updateDashboardContent = (id: number) => {
//     setActiveLink(id)
//   }

//   if (loading) return

//   return (
//     <CompanyContext.Provider
//       value={{
//         profile,
//         setProfile,
//         formData,
//         loading,
//         organizationFromActiveIndex,
//         formIsCompleted,
//         activeLink,
//         setActiveLink,
//         companyId,
//         setCompanyId,
//         refreshProfile: loadProfile,
//         refreshCompanyFormData: fetchCompanyData,
//         updateDashboardContent,
//       }}
//     >
//       {children}
//     </CompanyContext.Provider>
//   )
// }

// export function useCompany() {
//   const context = useContext(CompanyContext)
//   if (!context) {
//     throw new Error('useCompany must be used within a CompanyProvider')
//   }
//   return context
// }
