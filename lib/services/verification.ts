import { apiRequest } from '@/lib/services/api'

// const VERIFICATION_API_URL = 'https://va-api.staging.hyi.ai/api/id-verification'

const VERIFICATION_API_URL = 'http://localhost:5002/api/id-verification'

export interface VerificationRequest {
  documentType: 'aadhar' | 'pan' | 'international'
  documentNumber: string
  previousVerificationId?: string
  resubmission?: boolean
  documentFile?: File | undefined
  country?: string
  documentCategory?: 'passport' | 'nationalId'
}

export interface VerificationStatus {
  status: 'pending' | 'in_progress' | 'verified' | 'rejected' | 'expired'
  submittedAt: string
  documentNumber: string
  documentType: string
  lastUpdated: string
  estimatedCompletion?: string
  verifiedAt?: string
  rejectionReason?: string
  expirationDate?: string
  notes?: string
  documentCategory?: 'passport' | 'nationalId'
  country?: string
}

export interface VerificationResponse {
  success: boolean
  message: string
  data?: {
    verificationId: string
    status: VerificationStatus
  }
  error?: string
}

export const verificationApi = {
  async submitVerification(data: VerificationRequest): Promise<VerificationResponse> {
    try {
      const cleanNumber = data.documentNumber.replace(/\s/g, '').toUpperCase()

      if (data.documentType === 'aadhar' && !/^\d{12}$/.test(cleanNumber)) {
        throw new Error('Invalid Aadhar number format')
      }
      if (data.documentType === 'pan' && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(cleanNumber)) {
        throw new Error('Invalid PAN number format')
      }

      // For international verification
      if (data.documentType === 'international') {
        if (!data.country) {
          throw new Error('Country is required for international verification')
        }
        if (!data.documentCategory) {
          throw new Error('Document category is required')
        }
        if (!data.documentFile && !cleanNumber && !data.resubmission) {
          throw new Error('Document file is required')
        }
      }

      // Prepare verification data
      const formData = new FormData()
      formData.append('documentType', data.documentType)
      formData.append('documentNumber', cleanNumber)
      formData.append('submittedAt', new Date().toISOString())

      if (data.documentFile) {
        formData.append('documentFile', data.documentFile)
      }

      if (data.country) {
        formData.append('country', data.country)
      }

      if (data.documentCategory) {
        formData.append('documentCategory', data.documentCategory)
      }

      if (data.resubmission) {
        formData.append('resubmission', 'true')
        formData.append('resubmissionTimestamp', new Date().toISOString())
        formData.append('resubmissionReason', 'User initiated re-verification')
        if (data.previousVerificationId) {
          formData.append('previousVerificationId', data.previousVerificationId)
        }
      }

      const response = await fetch(VERIFICATION_API_URL, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Verification failed: ${response.statusText}`)
      }

      const responseData = await response.json()
      return responseData
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Verification failed',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  },

  async getVerificationStatus(verificationId: string): Promise<VerificationResponse> {
    try {
      const response = await fetch(`${VERIFICATION_API_URL}/status/${verificationId}`, {
        headers: {
          Accept: 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to get status: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get verification status',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  },

  async resubmitVerification(
    verificationId: string,
    data: VerificationRequest
  ): Promise<VerificationResponse> {
    try {
      const cleanNumber = data.documentNumber.replace(/\s/g, '').toUpperCase()
      const formData = new FormData()

      formData.append('documentType', data.documentType)
      formData.append('documentNumber', cleanNumber)
      formData.append('resubmissionTimestamp', new Date().toISOString())
      formData.append('resubmissionReason', 'User initiated re-verification')
      formData.append('previousVerificationId', verificationId)

      if (data.documentFile) {
        formData.append('documentFile', data.documentFile)
      }

      if (data.country) {
        formData.append('country', data.country)
      }

      if (data.documentCategory) {
        formData.append('documentCategory', data.documentCategory)
      }

      const response = await fetch(`${VERIFICATION_API_URL}/resubmit/${verificationId}`, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Resubmission failed: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      return {
        success: false,
        message: 'Failed to resubmit verification',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  },
}
