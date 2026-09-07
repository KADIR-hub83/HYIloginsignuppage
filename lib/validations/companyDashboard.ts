import * as z from 'zod'
import { COMPANY_DASHBOARD_VALIDATION_MESSAGES } from '@/lib/config/companyMessages'
import { TALENT_ONBOARDING_MESSAGES } from '@/lib/config/messages'

export const createProjectSchema = z.object({
  projectName: z.string().min(2, COMPANY_DASHBOARD_VALIDATION_MESSAGES.CREATE_PROJECT.PROJECT_NAME),
  industryType: z
    .string()
    .min(1, COMPANY_DASHBOARD_VALIDATION_MESSAGES.CREATE_PROJECT.INDUSTRY_TYPE),
  duration: z.string().min(1, COMPANY_DASHBOARD_VALIDATION_MESSAGES.CREATE_PROJECT.DURATION),
  projectType: z.string().min(1, COMPANY_DASHBOARD_VALIDATION_MESSAGES.CREATE_PROJECT.PROJECT_TYPE),
  projectDescription: z
    .string()
    .max(2000, TALENT_ONBOARDING_MESSAGES.ADDITIONALDETAILS.DESCRIPTION.MAX_LENGTH)
    .or(z.literal('')),
  projectBudgetRange: z.object({
    currency: z.string().min(1, COMPANY_DASHBOARD_VALIDATION_MESSAGES.CREATE_PROJECT.CURRENCY),
    budgetRangeFrom: z.string().min(1, COMPANY_DASHBOARD_VALIDATION_MESSAGES.CREATE_PROJECT.REQUIRED),
    budgetRangeTo: z.string().min(1, COMPANY_DASHBOARD_VALIDATION_MESSAGES.CREATE_PROJECT.REQUIRED),
  }),
})

export const addPostRequirementSchema = z.object({
  prDesignation: z
    .string()
    .min(2, COMPANY_DASHBOARD_VALIDATION_MESSAGES.ADD_POST_REQUIREMENT.DESIGNATION),
  prWorkExperience: z
    .string()
    .min(1, COMPANY_DASHBOARD_VALIDATION_MESSAGES.ADD_POST_REQUIREMENT.WORK_EXPERIENCE),
  prNumberOfCandidates: z
    .string()
    .min(1, COMPANY_DASHBOARD_VALIDATION_MESSAGES.ADD_POST_REQUIREMENT.CANDIDATES),
  prWorkDuration: z
    .string()
    .min(1, COMPANY_DASHBOARD_VALIDATION_MESSAGES.ADD_POST_REQUIREMENT.WORK_DURATION),
  prDescription: z
    .string()
    .max(2000, TALENT_ONBOARDING_MESSAGES.ADDITIONALDETAILS.DESCRIPTION.MAX_LENGTH)
    .or(z.literal('')),
})
