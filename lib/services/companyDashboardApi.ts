// import { apiRequest } from '@/lib/services/api'

// export const companyDashboardApi = {
//   createProject: async (data: {
//     projectName: string
//     industryType: string
//     duration: string
//     projectType: string
//     projectDescription: string
//     projectBudgetRange: { currency: string; budgetRangeFrom: string; budgetRangeTo: string }
//   }) => {
//     try {
//       return await apiRequest('/create-project', { method: 'POST', body: JSON.stringify(data) })
//     } catch (error) {
//       throw error
//     }
//   },
//   updateProject: async (data: {
//     projectId: string
//     projectName: string
//     industryType: string
//     duration: string
//     projectType: string
//     projectDescription: string
//     projectBudgetRange: { currency: string; budgetRangeFrom: string; budgetRangeTo: string }
//   }) => {
//     try {
//       return await apiRequest('/update-unassigned-project', {
//         method: 'POST',
//         body: JSON.stringify(data),
//       })
//     } catch (error) {
//       throw error
//     }
//   },
//   deleteProject: async (data: { projectId: string }) => {
//     try {
//       return await apiRequest('/delete-unassigned-project', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data),
//       })
//     } catch (error) {
//       throw error
//     }
//   },
//   getProjectsByCompany: async (token: string) => {
//     try {
//       const response = await apiRequest(`/get-projects-by-company`, {
//         method: 'GET',
//         headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
//       })
//       return response
//     } catch (error) {
//       throw error
//     }
//   },
//   addPostRequirement: async (data: {
//     projectId: string
//     postRequirement: {
//       prDesignation: string
//       prWorkExperience: string
//       prNumberOfCandidates: string
//       prWorkDuration: string
//       prTechnicalSkills: string[]
//       prDescription: string
//     }[]
//   }) => {
//     try {
//       return await apiRequest('/add-post-requirement', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data),
//       })
//     } catch (error) {
//       throw error
//     }
//   },
//   deletePostRequirement: async (data: { projectId: string; postRequirementId: string }) => {
//     try {
//       return await apiRequest('/delete-post-requirement', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data),
//       })
//     } catch (error) {
//       throw error
//     }
//   },
//   listOfPostRequirements: async (data: { projectId: string }) => {
//     try {
//       return await apiRequest('/list-of-post-requirements', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data),
//       })
//     } catch (error) {
//       throw error
//     }
//   },
//   projectDashboardStatus: async (data: { companyId: string }) => {
//     try {
//       return await apiRequest('/project-dashboard-status', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data),
//       })
//     } catch (error) {
//       throw error
//     }
//   },
//   companyDashboardStatus: async () => {
//     try {
//       return await apiRequest('/company-dashboard-status', {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' },
//       })
//     } catch (error) {
//       throw error
//     }
//   },
//   projectOverview: async (data: { projectId: string }) => {
//     try {
//       return await apiRequest('/project-overview', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data),
//       })
//     } catch (error) {
//       throw error
//     }
//   },
//   shortlistedCandidateViewProfile: async (data: { userId: string }) => {
//     try {
//       return await apiRequest('/shortlisted-candidate-view-profile', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data),
//       })
//     } catch (error) {
//       throw error
//     }
//   },
// }





import { apiRequest } from '@/lib/services/api'

export const companyDashboardApi = {
  createProject: async (data: {
    projectName: string
    industryType: string
    duration: string
    projectType: string
    projectDescription: string
    projectBudgetRange: {
      currency: string
      budgetRangeFrom: string
      budgetRangeTo: string
    }
  }) => {
    return apiRequest('/create-project', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  updateProject: async (data: {
    projectId: string
    projectName: string
    industryType: string
    duration: string
    projectType: string
    projectDescription: string
    projectBudgetRange: {
      currency: string
      budgetRangeFrom: string
      budgetRangeTo: string
    }
  }) => {
    return apiRequest('/update-unassigned-project', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  deleteProject: async (data: {
    projectId: string
  }) => {
    return apiRequest('/delete-unassigned-project', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  getProjectsByCompany: async (token?: string) => {
    const headers: Record<string, string> = {}

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await apiRequest(
      '/get-projects-by-company',
      {
        method: 'GET',
        headers,
      },
    )

    return response
  },

  addPostRequirement: async (data: {
    projectId: string
    postRequirement: {
      prDesignation: string
      prWorkExperience: string
      prNumberOfCandidates: string
      prWorkDuration: string
      prTechnicalSkills: string[]
      prDescription: string
    }[]
  }) => {
    return apiRequest('/add-post-requirement', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  deletePostRequirement: async (data: {
    projectId: string
    postRequirementId: string
  }) => {
    return apiRequest('/delete-post-requirement', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  listOfPostRequirements: async (data: {
    projectId: string
  }) => {
    return apiRequest('/list-of-post-requirements', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  projectDashboardStatus: async (data: {
    companyId: string
  }) => {
    return apiRequest('/project-dashboard-status', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  companyDashboardStatus: async () => {
    return apiRequest('/company-dashboard-status', {
      method: 'GET',
    })
  },

  projectOverview: async (data: {
    projectId: string
  }) => {
    return apiRequest('/project-overview', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  shortlistedCandidateViewProfile: async (data: {
    userId: string
  }) => {
    return apiRequest(
      '/shortlisted-candidate-view-profile',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
    )
  },
}