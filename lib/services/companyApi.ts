// import { apiRequest } from '@/lib/services/api'

// export const companyApi = {
//   addOrganization: async (data: {
//     organizationFromIndex: string
//     type: 'company' | 'individual'
//     companyName: string
//     website: string
//     industryType: string
//     businessType: string
//     designation: string
//     projectScale: string
//     country: string
//     companyType: string
//     tin: string
//     companyAcNumber: string
//     individualName: string
//     aadharCard: string
//     panCard: string
//     organizationOnboadCompleted: boolean
//   }) => {
//     try {
//       return await apiRequest('/add-company', {
//         method: 'POST',
//         body: JSON.stringify(data),
//       })
//     } catch (error) {
//       throw error
//     }
//   },
//   getOrganization : async (token: string) => {
//       try {
//         const response = await apiRequest(`/add-company`, {
//           method: 'GET',
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         })
  
//         if (!response || typeof response !== 'object') {
//           throw new Error('Invalid Company data received')
//         }
  
//         return {
//           companyData: response,
//         }
//       }  catch (error) {
//         throw error
//       }
//     },
//   getCountries: async (query = '') => {
//     try {
//       return await apiRequest(`/get-countries${query}`)
//     } catch (error) {
//       throw error
//     }
//   },
//   getCities: async (query = '') => {
//     try {
//       return await apiRequest(`/get-cities${query}`)
//     } catch (error) {
//       throw error
//     }
//   },
//   getDesignations: async (query = '') => {
//     try {
//       return await apiRequest(`/get-designations${query}`)
//     } catch (error) {
//       throw error
//     }
//   },
// }


























import { apiRequest } from '@/lib/services/api'

export interface OrganizationPayload {
  organizationFromIndex: string

  type:
    | 'company'
    | 'individual'

  companyName: string
  individualName: string

  website: string

  industryType: string
  businessType: string

  designation: string
  projectScale: string

  country: string
  companyType: string

  tin: string
  companyAcNumber: string

  aadharCard: string
  panCard: string

  organizationOnboadCompleted: boolean
}

export const companyApi = {
  /*
  |--------------------------------------------------------------------------
  | Create/update organization
  |--------------------------------------------------------------------------
  */

  addOrganization: async (
    data: OrganizationPayload,
  ) => {
    return apiRequest(
      '/add-company',
      {
        method: 'POST',

        body:
          JSON.stringify(
            data,
          ),
      },
    )
  },

  /*
  |--------------------------------------------------------------------------
  | Current logged-in company
  |--------------------------------------------------------------------------
  */

  getOrganization:
    async (
      token: string,
    ) => {
      const response =
        await apiRequest(
          '/get-company',
          {
            method: 'GET',

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          },
        )

      const company =
        response?.company ||
        response?.data ||
        response

      if (
        !company ||
        typeof company !==
          'object'
      ) {
        throw new Error(
          'Invalid company profile response',
        )
      }

      return {
        companyData:
          company,
      }
    },

  /*
  |--------------------------------------------------------------------------
  | Countries
  |--------------------------------------------------------------------------
  */

  getCountries:
    async (
      query = '',
    ) => {
      return apiRequest(
        `/get-countries${query}`,
      )
    },

  /*
  |--------------------------------------------------------------------------
  | Cities
  |--------------------------------------------------------------------------
  */

  getCities:
    async (
      query = '',
    ) => {
      return apiRequest(
        `/get-cities${query}`,
      )
    },

  /*
  |--------------------------------------------------------------------------
  | Designations
  |--------------------------------------------------------------------------
  */

  getDesignations:
    async (
      query = '',
    ) => {
      return apiRequest(
        `/get-designations${query}`,
      )
    },
}