import * as z from 'zod'
import { COMPANY_VALIDATION_MESSAGES } from '@/lib/config/companyMessages'

export const companyOnboardSchema = z
  .object({
    name: z.string().min(2, COMPANY_VALIDATION_MESSAGES.COMPANY.NAME_MIN),
    website: z.string().url(COMPANY_VALIDATION_MESSAGES.COMPANY.WEBSITE),
    designation: z.string().min(2, COMPANY_VALIDATION_MESSAGES.COMPANY.DESIGNATION),
    businessType: z.string().optional(),
    industryType: z.string().min(1, COMPANY_VALIDATION_MESSAGES.COMPANY.INDUSTRY_TYPE),
    projectScale: z.string().min(1, COMPANY_VALIDATION_MESSAGES.COMPANY.PROJECT_SCALE),
    userType: z.enum(['company', 'individual']).optional(),
  })
  .refine(
    data => {
      if (data.userType === 'company') {
        return data.businessType && data.businessType.trim().length > 0
      }
      return true
    },
    {
      message: COMPANY_VALIDATION_MESSAGES.COMPANY.BUSINESS_TYPE,
      path: ['businessType'],
    }
  )

export const companyVerificationSchema = z
  .object({
    country: z.string().min(1, COMPANY_VALIDATION_MESSAGES.VERIFICATION.COUNTRY),
    userType: z.enum(['company', 'individual']).optional(),
    companyType: z.string().optional(),
    companyAcNumber: z.string().optional(),
    panCard: z.string().optional(),
    tin: z.string().optional(),
    aadharCard: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.userType === 'company') {
      if (!data.companyType) {
        ctx.addIssue({
          path: ['companyType'],
          code: z.ZodIssueCode.custom,
          message: COMPANY_VALIDATION_MESSAGES.VERIFICATION.COMPANY_TYPE,
        })
      }
      if (!/^\d{8,20}$/.test(data.tin || '')) {
        ctx.addIssue({
          path: ['tin'],
          code: z.ZodIssueCode.custom,
          message: COMPANY_VALIDATION_MESSAGES.VERIFICATION.TIN,
        })
      }
      if (!/^[A-Za-z0-9]+$/.test(data.companyAcNumber || '')) {
        ctx.addIssue({
          path: ['companyAcNumber'],
          code: z.ZodIssueCode.custom,
          message: COMPANY_VALIDATION_MESSAGES.VERIFICATION.PAN,
        })
      }
    } else if (data.userType === 'individual') {
      if (!/^\d{12}$/.test(data.aadharCard || '')) {
        ctx.addIssue({
          path: ['aadharCard'],
          code: z.ZodIssueCode.custom,
          message: COMPANY_VALIDATION_MESSAGES.VERIFICATION.AADHAR,
        })
      }
      if (!/^[A-Za-z0-9]+$/.test(data.panCard || '')) {
        ctx.addIssue({
          path: ['panCard'],
          code: z.ZodIssueCode.custom,
          message: COMPANY_VALIDATION_MESSAGES.VERIFICATION.PAN,
        })
      }
    }
  })
