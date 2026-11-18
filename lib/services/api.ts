import { API_MESSAGES } from '@/lib/config/messages'
import { getCookie, removeCookie, setCookie } from '@/lib/cookies'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

interface UserProfile {
  fullName: string
  email: string
  bio: string
  title: string
  location: string
  avatar: string | null // Allow both string (URL) and null
}

// Dummy data for development
const DUMMY_DATA: { profile: UserProfile } = {
  profile: {
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Senior Software Engineer with 5+ years of experience in full-stack development',
    title: 'Senior Software Engineer',
    location: 'San Francisco, CA',
    avatar: null,
  },
}

// Helper function to simulate API delay
const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 800))

// Helper function to handle API responses
async function handleResponse(response: Response) {
  let errorData
  try {
    errorData = await response.json()
  } catch {
    errorData = {}
  }

  if (!response.ok) {
    // Use the API's error message if available, otherwise use our default messages
    const errorMessage =
      errorData.message ||
      errorData.error ||
      (() => {
        switch (response.status) {
          case 400:
            return API_MESSAGES.VALIDATION_ERROR.description
          case 401:
            return API_MESSAGES.SESSION_EXPIRED.description
          case 403:
            return API_MESSAGES.ACCESS_DENIED.description
          case 404:
            return API_MESSAGES.NOT_FOUND.description
          case 500:
            return API_MESSAGES.SERVER_ERROR.description
          default:
            return API_MESSAGES.UNKNOWN_ERROR.description
        }
      })()

    const error = new Error(errorMessage)
    error.name = response.status.toString()
    throw error
  }

  return errorData
}

// Helper function to make API requests
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const defaultHeaders: Record<string, string> = {
    Accept: 'application/json',
  }

  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json'
  }

  const token = getCookie('token')
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  try {
    // For development: return dummy data instead of making actual API calls
    if (process.env.NODE_ENV === 'development') {
      await simulateDelay()

      switch (endpoint) {
        case '/user/profile':
          if (options.method === 'PUT') {
            const updateData = JSON.parse(options.body as string)
            DUMMY_DATA.profile = { ...DUMMY_DATA.profile, ...updateData }
            return DUMMY_DATA.profile
          }
          return DUMMY_DATA.profile

        case '/user/avatar':
          if (options.method === 'DELETE') {
            DUMMY_DATA.profile.avatar = null
            return { success: true }
          }
          if (options.method === 'POST' && options.body instanceof FormData) {
            DUMMY_DATA.profile.avatar = 'https://example.com/dummy-avatar.jpg'
            return { avatar: DUMMY_DATA.profile.avatar }
          }
          break
      }
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, config)
    if (!response.ok) {
      const errorDetails = await response.json()
      throw Error(errorDetails.message)
    }
    return await handleResponse(response)
  } catch (error) {
    if (error instanceof Error) {
      // Network or connection errors
      if (error.message === 'Failed to fetch') {
        throw new Error(API_MESSAGES.NETWORK_ERROR.description)
      }
      if (error.message === 'Invalid token.') {
        localStorage.removeItem('token')
        sessionStorage.clear()
        removeCookie('token')
        window.location.href = '/login'
      }
      // Re-throw API errors with their original message
      throw error
    }
    // Unknown errors
    throw new Error(API_MESSAGES.UNKNOWN_ERROR.description)
  }
}

export const authApi = {
  login: async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      const data = await apiRequest('/sign-in', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      const storage = rememberMe ? localStorage : sessionStorage
      storage.setItem('token', data.token)
      setCookie('token', data.token)

      return data
    } catch (error) {
      throw error
    }
  },

  register: async (data: {
    email: string
    firstName: string
    middleName: string
    lastName: string
    password: string
    confirmPassword: string
    userType: 'talent' | 'company' | 'individual'
  }) => {
    try {
      return await apiRequest('/sign-up', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    } catch (error) {
      throw error
    }
  },

  checkEmail: async (email: string) => {
    try {
      return await apiRequest('/check-email', {
        method: 'POST',
        body: JSON.stringify({
          email,
        }),
      })
    } catch (error) {
      throw error
    }
  },

  verifyOtp: async (email: string, otp: string) => {
    try {
      const data = await apiRequest('/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otp }),
      })

      if (data.token) {
        // localStorage.setItem('token', data.token)
        setCookie('token', data.token)
      }

      return data
    } catch (error) {
      throw error
    }
  },

  resendSignupOtp: async (email: string) => {
    try {
      return await apiRequest('/resend-otp-signup', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })
    } catch (error) {
      throw error
    }
  },

  logout: async () => {
    const token = getCookie('token')
    try {
      await apiRequest('/log-out', {
        method: 'POST',
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
    localStorage.clear()
    sessionStorage.clear()
    removeCookie('token')
  },

  requestPasswordReset: async (email: string) => {
    try {
      return await apiRequest('/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })
    } catch (error) {
      throw error
    }
  },

  resendResetOtp: async (email: string) => {
    try {
      return await apiRequest('/resend-otp-forgot', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })
    } catch (error) {
      throw error
    }
  },

  verifyOtpAndResetPassword: async (
    email: string,
    otp: string,
    password: string,
    confirmPassword: string
  ) => {
    try {
      const data = await apiRequest('/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp,
          password,
          confirmPassword,
        }),
      })

      if (data.token) {
        // localStorage.setItem('token', data.token)
        setCookie('token', data.token)
      }

      return data
    } catch (error) {
      throw error
    }
  },
}

export const talentApi = {
  basicInfo: async (data: {
    talentFormIndex: string
    resume: string | File
    profilePicture: File | null
    firstName: string
    middleName: string
    lastName: string
    email: string
    phoneNumber: string
    gender: string
    dateOfBirth: string
    country: string
    city: string
    summary: string
    linkedin: string
    github: string
    portfolio: string
  }) => {
    try {
      const formData = new FormData()

      // Append all form fields to FormData
      formData.append('talentFormIndex', data.talentFormIndex)
      formData.append('firstName', data.firstName)
      formData.append('middleName', data.middleName)
      formData.append('lastName', data.lastName)
      formData.append('phoneNumber', data.phoneNumber)
      formData.append('gender', data.gender)
      formData.append('dateOfBirth', data.dateOfBirth)
      formData.append('country', data.country)
      formData.append('city', data.city)
      formData.append('profileSummary', data.summary)
      formData.append('github', data.github)
      formData.append('linkedin', data.linkedin)
      formData.append('portfolio', data.portfolio)

      // Append profileImage if it exists
      if (data.profilePicture) {
        formData.append('profilePicture', data.profilePicture)
      } else {
        formData.append('removeProfilePicture', 'true')
      }
      if (data.resume) {
        formData.append('resume', data.resume)
      }

      return await apiRequest('/add-talent', {
        method: 'POST',
        body: formData,
      })
    } catch (error) {
      throw error
    }
  },

  workExp: async (data: {
    talentFormIndex: string
    experience: {
      companyName: string
      designation: string
      workSince: string
      workTill: string
      currentlyWorking: boolean
      description: string
      totalYearsOfExperience: number
    }[]

    technicalSkills: {
      skill: string
      experience: string
    }[]

    otherSkills: []
    preference: {
      employmentPreference: string
      hoursPerWeek: number
      desiredSalary: {
        currency: string
        price: number
      }
      availableHours: {
        from: string
        to: string
      }
    }
  }) => {
    try {
      return await apiRequest('/add-talent', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    } catch (error) {
      throw error
    }
  },

  education: async (data: {
    talentFormIndex: string
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
      uploadCertificate: string | File | null
      website: string
    }[]
  }) => {
    try {
      const formData = new FormData()
      formData.append('talentFormIndex', data.talentFormIndex)

      // Append each education field separately
      data.education.forEach((edu, index) => {
        formData.append(`education[${index}][university]`, edu.university)
        formData.append(`education[${index}][degree]`, edu.degree)
        formData.append(`education[${index}][specialization]`, edu.specialization)
        formData.append(`education[${index}][passingOutYear]`, edu.passingOutYear)
      })

      // Append each certification field separately
      data.certification.forEach((cert, index) => {
        formData.append(`certification[${index}][title]`, cert.title)
        formData.append(`certification[${index}][issuedBy]`, cert.issuedBy)
        formData.append(`certification[${index}][issuedDate]`, cert.issuedDate)
        formData.append(`certification[${index}][website]`, cert.website)

        if (typeof cert.uploadCertificate === 'string') {
          formData.append(`certification[${index}][uploadCertificate]`, cert.uploadCertificate)
        }
      })

      data.certification.forEach(cert => {
        if (cert.uploadCertificate instanceof File) {
          formData.append(`uploadCertificate`, cert.uploadCertificate)
        }
      })

      // // Debugging output
      // const formObject: Record<string, any> = {}
      // formData.forEach((value, key) => {
      //   formObject[key] = value
      // })
      // console.log(formObject)

      return await apiRequest('/add-talent', {
        method: 'POST',
        body: formData,
      })
    } catch (error) {
      throw error
    }
  },

  additionalDetails: async (data: {
    talentOnboadCompleted: boolean
    talentFormIndex: string
    languages: {
      language: string
      proficiency: string
    }[]

    projects: {
      projectTitle: string | ''
      year: string | ''
      projectLink: string | ''
      technicalSkillUsed: string[]
      projectDescription: string | ''
    }[]
  }) => {
    try {
      return await apiRequest('/add-talent', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    } catch (error) {
      throw error
    }
  },

  getDesignation: async (designation: string) => {
    try {
      const response = await apiRequest(`/get-designations?q=${designation}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response || typeof response !== 'object') {
        throw new Error('Invalid city received')
      }

      return {
        data: response.data,
      }
    } catch (error: any) {
      if (error.message.includes(API_MESSAGES.SESSION_EXPIRED.description)) {
        localStorage.clear()
        sessionStorage.clear()
      }

      console.error('Cities loading error:', {
        message: error.message,
        timestamp: new Date().toISOString(),
      })

      throw error
    }
  },

  getSkills: async (skill: string) => {
    try {
      const response = await apiRequest(`/get-skills?q=${skill}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response || typeof response !== 'object') {
        throw new Error('Invalid city received')
      }

      return {
        data: response.data,
      }
    } catch (error: any) {
      if (error.message.includes(API_MESSAGES.SESSION_EXPIRED.description)) {
        localStorage.clear()
        sessionStorage.clear()
      }

      console.error('Cities loading error:', {
        message: error.message,
        timestamp: new Date().toISOString(),
      })

      throw error
    }
  },

  getCity: async (city: string) => {
    try {
      const response = await apiRequest(`/get-cities?q=${city}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response || typeof response !== 'object') {
        throw new Error('Invalid city received')
      }

      return {
        data: response.data,
      }
    } catch (error: any) {
      if (error.message.includes(API_MESSAGES.SESSION_EXPIRED.description)) {
        localStorage.clear()
        sessionStorage.clear()
      }

      console.error('Cities loading error:', {
        message: error.message,
        timestamp: new Date().toISOString(),
      })

      throw error
    }
  },

  getCountry: async (country: string) => {
    try {
      const response = await apiRequest(`/get-countries?q=${country}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response || typeof response !== 'object') {
        throw new Error('Invalid country received')
      }

      return {
        data: response.data,
      }
    } catch (error: any) {
      if (error.message.includes(API_MESSAGES.SESSION_EXPIRED.description)) {
        localStorage.clear()
        sessionStorage.clear()
      }

      console.error('Countries loading error:', {
        message: error.message,
        timestamp: new Date().toISOString(),
      })

      throw error
    }
  },

  getUniversity: async (university: string) => {
    try {
      const response = await apiRequest(`/get-universities?q=${university}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response || typeof response !== 'object') {
        throw new Error('Invalid country received')
      }

      return {
        data: response.data,
      }
    } catch (error: any) {
      if (error.message.includes(API_MESSAGES.SESSION_EXPIRED.description)) {
        localStorage.clear()
        sessionStorage.clear()
      }

      console.error('Countries loading error:', {
        message: error.message,
        timestamp: new Date().toISOString(),
      })

      throw error
    }
  },

  getDegree: async (degree: string) => {
    try {
      const response = await apiRequest(`/get-degrees?q=${degree}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response || typeof response !== 'object') {
        throw new Error('Invalid country received')
      }

      return {
        data: response.data,
      }
    } catch (error: any) {
      if (error.message.includes(API_MESSAGES.SESSION_EXPIRED.description)) {
        localStorage.clear()
        sessionStorage.clear()
      }

      console.error('Countries loading error:', {
        message: error.message,
        timestamp: new Date().toISOString(),
      })

      throw error
    }
  },
  getLanguages: async (language: string) => {
    try {
      const response = await apiRequest(`/get-languages?q=${language}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response || typeof response !== 'object') {
        throw new Error('Invalid country received')
      }

      return {
        data: response.data,
      }
    } catch (error: any) {
      if (error.message.includes(API_MESSAGES.SESSION_EXPIRED.description)) {
        localStorage.clear()
        sessionStorage.clear()
      }

      console.error('Countries loading error:', {
        message: error.message,
        timestamp: new Date().toISOString(),
      })

      throw error
    }
  },
  getSkill: async (skill: string) => {
    try {
      const response = await apiRequest(`/get-skills?q=${skill}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response || typeof response !== 'object') {
        throw new Error('Invalid country received')
      }

      return {
        data: response.data,
      }
    } catch (error: any) {
      if (error.message.includes(API_MESSAGES.SESSION_EXPIRED.description)) {
        localStorage.clear()
        sessionStorage.clear()
      }

      console.error('Countries loading error:', {
        message: error.message,
        timestamp: new Date().toISOString(),
      })

      throw error
    }
  },
}

export const userApi = {
 getProfile: async (token: string) => {
  try {
    const response = await apiRequest('/get-user-data', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response || typeof response !== 'object') {
      throw new Error('Invalid profile data received')
    }

    /*
     * Backend now returns:
     *
     * {
     *   success: true,
     *   userData: {
     *      userType: 'company',
     *      ...
     *   }
     * }
     *
     * Normalize it so the whole frontend always receives:
     *
     * {
     *   userData: {
     *      userType: 'company',
     *      ...
     *   }
     * }
     */

    const profileData =
      response?.userData?.data ||
      response?.userData ||
      response?.data ||
      response

    if (!profileData || typeof profileData !== 'object') {
      throw new Error('Profile data is missing from response')
    }

    return {
      userData: profileData,
    }
  } catch (error: any) {
    if (
      error?.message?.includes(
        API_MESSAGES.SESSION_EXPIRED.description,
      )
    ) {
      localStorage.clear()
      sessionStorage.clear()
    }

    console.error('Profile loading error:', {
      message: error?.message || 'Unknown error',
      timestamp: new Date().toISOString(),
    })

    throw error
  }
},

getTalentData: async (token: string) => {
  try {
    const response = await apiRequest(`/get-talent`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response?.userData) {
      throw new Error('Invalid talent data received')
    }

    return {
      userData: response.userData,
    }
  } catch (error: any) {
    console.error('Talent profile loading error:', {
      message: error.message,
      timestamp: new Date().toISOString(),
    })

    throw error
  }
},

getTalentDashboardData: async (token: string) => {
  try {
    const response = await apiRequest(`/talent-dashboard-overview`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response?.data) {
      throw new Error('Invalid talent dashboard data received')
    }

    return {
      userData: response.data,
    }
  } catch (error: any) {
    console.error('Dashboard loading error:', {
      message: error.message,
      timestamp: new Date().toISOString(),
    })

    throw error
  }
},

  getProjectDetail: async (projectsId: string | string[]) => {
    try {
      const response = await apiRequest(`/talent-dashboard-project-overview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId: projectsId }),
      })

      if (!response || typeof response !== 'object') {
        throw new Error('Invalid talent data received')
      }

      return {
        userData: response,
      }
    } catch (error: any) {
      if (error.message.includes(API_MESSAGES.SESSION_EXPIRED.description)) {
        localStorage.clear()
        sessionStorage.clear()
        // window.location.href = '/login'
      }

      console.error('Profile loading error:', {
        message: error.message,
        timestamp: new Date().toISOString(),
      })

      throw error
    }
  },

  getProjectTeamDetail: async (projectsId: string | string[]) => {
    try {
      const response = await apiRequest(`/talent-dashboard-get-project-team`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId: projectsId }),
      })

      if (!response || typeof response !== 'object') {
        throw new Error('Invalid talent data received')
      }

      return {
        userData: response.projectActiveTeam,
      }
    } catch (error: any) {
      if (error.message.includes(API_MESSAGES.SESSION_EXPIRED.description)) {
        localStorage.clear()
        sessionStorage.clear()
        // window.location.href = '/login'
      }

      console.error('Profile loading error:', {
        message: error.message,
        timestamp: new Date().toISOString(),
      })

      throw error
    }
  },

  getTalentProjectData: async (token: string) => {
    try {
      const response = await apiRequest(`/talent-dashboard-get-projects`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response || typeof response !== 'object') {
        throw new Error('Invalid talent data received')
      }

      return {
        userData: response,
      }
    } catch (error: any) {
      if (error.message.includes(API_MESSAGES.SESSION_EXPIRED.description)) {
        localStorage.clear()
        sessionStorage.clear()
        window.location.href = '/login'
      }

      console.error('Profile loading error:', {
        message: error.message,
        timestamp: new Date().toISOString(),
      })

      throw error
    }
  },


updateProfile: async (
  userId: string,
  data: {
    firstName: string
    middleName: string
    lastName: string
    email: string
    profilePicture: string | File | null
  }
) => {
  try {
    if (!userId) {
      throw new Error('User ID is missing. Please login again.')
    }

    const formData = new FormData()

    formData.append('firstName', data.firstName)
    formData.append('middleName', data.middleName || '')
    formData.append('lastName', data.lastName)
    formData.append('email', data.email)

    // Upload a new profile picture only when a File is selected.
    if (data.profilePicture instanceof File) {
      formData.append('profilePicture', data.profilePicture)
    } else if (data.profilePicture === null) {
      formData.append('removeProfilePicture', 'true')
    }

    return await apiRequest(`/update-user/${encodeURIComponent(userId)}`, {
      method: 'POST',
      body: formData,
    })
  } catch (error) {
    console.error('Profile update error:', error)
    throw error
  }
},



uploadAvatar: async (userId: string, file: File | null) => {
  try {
    if (!userId) {
      throw new Error('User ID is missing. Please login again.')
    }

    const formData = new FormData()

    if (file instanceof File) {
      formData.append('profilePicture', file)
    } else {
      formData.append('removeProfilePicture', 'true')
    }

    return await apiRequest(
      `/update-user/${encodeURIComponent(userId)}`,
      {
        method: 'POST',
        body: formData,
      }
    )
  } catch (error) {
    console.error('Avatar upload error:', error)
    throw error
  }
},



deleteAvatar: async (userId: string) => {
  try {
    if (!userId) {
      throw new Error('User ID is missing. Please login again.')
    }

    const formData = new FormData()
    formData.append('removeProfilePicture', 'true')

    return await apiRequest(
      `/update-user/${encodeURIComponent(userId)}`,
      {
        method: 'POST',
        body: formData,
      }
    )
  } catch (error) {
    console.error('Avatar deletion error:', error)
    throw error
  }
},
}
