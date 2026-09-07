import { apiRequest } from '@/lib/services/api'

export const editProfileApi = {
  getTalent: async (token: string) => {
    try {
      const response = await apiRequest(`/get-talent`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      return {
        firstName: response.firstName || '',
        lastName: response.lastName || '',
        fullName: response.fullName || '',
        gender: response.gender || '',
        dateOfBirth: response.dateOfBirth || '',
        user: response.user || '',
        profilePicture: response.profilePicture || '',
        phoneNumber: response.phoneNumber || '',
        country: response.country || '',
        city: response.city || '',
        profileSummary: response.profileSummary || '',
        resume: response.resume || '',
        technicalSkills: response.technicalSkills || '',
        otherSkills: response.otherSkills || '',
        experience: response.experience || '',
        preference: response.preference || '',
        projects: response.projects || '',
        education: response.education || '',
        certification: response.certification || '',
        languages: response.languages || '',
        socialLinks: {
          github: response.github || '',
          linkedin: response.linkedin || '',
          portfolio: response.portfolio || '',
        },
      }
    } catch (error: any) {
      throw error
    }
  },
  updateTalent: async (
    data:
      | FormData
      | {
          userName?: string
          profileSummary?: string
          country?: string
          city?: string
          profilePicture?: File | string
          resume?: File
          [key: string]: any
          technicalSkills?: {
            skill: string
            experience: string
          }[]
          otherSkills?: string[]
          languages?: {
            language: string
            proficiency: string
          }[]
          experience?: {
            companyName: string
            designation: string
            workSince: string
            workTill: string
            currentlyWorking: boolean
            description: string
          }[]
          projects?: {
            projectTitle?: string
            year?: string
            projectLink?: string
            technicalSkillUsed?: string[]
            projectDescription?: string
          }[]
          education?: {
            university?: string
            degree?: string
            specialization?: string
            passingOutYear?: string
          }[]
          certification?: {
            title?: string
            issuedBy?: string
            issuedDate?: string
            uploadCertificate?: File |string | null
            website?: string
          }[]
          files?: File[]
          preference?: {
            employmentPreference?: string
            hoursPerWeek?: string
            desiredSalary?: {
              currency?: string
              price?: string
            }
            availableHours?: {
              from?: string
              to?: string
            }
          }
          typeOfJob?: string
          github?: string
          linkedin?: string
          portfolio?: string
          userType?: string
          phoneNumber?: string
        }
  ) => {
    try {
      let formData: FormData
      if (data instanceof FormData) {
        formData = data
      } else {
        formData = new FormData()
        const {profilePicture, resume, files, ...otherData } = data
        formData.append('data', JSON.stringify(otherData))
        if (files && files.length > 0) {
          files.forEach(file => formData.append('uploadCertificate', file))
        }
        if (resume) {
          formData.append('resume', resume)
        }
        if (profilePicture) {
          formData.append('profilePicture', profilePicture)
        }
      }
      return await apiRequest('/update-talent', {
        method: 'POST',
        body: formData,
      })
    } catch (error) {
      console.error('Error updating talent:', error)
      throw error
    }
  },
  getLanguages: async (query = '') => {
    try {
      return await apiRequest(`/get-languages${query}`)
    } catch (error) {
      throw error
    }
  },
  getUniversities: async (query = '') => {
    try {
      return await apiRequest(`/get-universities${query}`)
    } catch (error) {
      throw error
    }
  },
  getDegrees: async (query = '') => {
    try {
      return await apiRequest(`/get-degrees${query}`)
    } catch (error) {
      throw error
    }
  },
  getSkills: async (query = '') => {
    try {
      return await apiRequest(`/get-skills${query}`)
    } catch (error) {
      throw error
    }
  },
}
