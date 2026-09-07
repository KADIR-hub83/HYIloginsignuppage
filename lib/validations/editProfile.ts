import * as z from 'zod'
import { EDIT_PROFILE_MESSAGES } from '@/lib/config/editProfileMessages'
import { TALENT_ONBOARDING_MESSAGES } from '../config/messages'

export const experienceSchema = z.object({
  companyName: z.string().min(2, EDIT_PROFILE_MESSAGES.EXPERIENCE.COMPANY_NAME),
  designation: z.string().min(1, EDIT_PROFILE_MESSAGES.EXPERIENCE.DESIGNATION),
})

export const languageSchema = z.object({
  language: z.string().min(1, EDIT_PROFILE_MESSAGES.LANGUAGES.LANGUAGE),
  proficiency: z.string().min(1, EDIT_PROFILE_MESSAGES.LANGUAGES.PROFICIENCY),
})

export const educationSchema = z.object({
  university: z.string().min(1, EDIT_PROFILE_MESSAGES.EDUCATION.INSTITUTION),
  degree: z.string().min(1, EDIT_PROFILE_MESSAGES.EDUCATION.DEGREE),
  specialization: z.string().min(1, EDIT_PROFILE_MESSAGES.EDUCATION.SPECIALIZATION),
  passingOutYear: z.string().min(1, EDIT_PROFILE_MESSAGES.EDUCATION.DEGREE_COMPLETION),
})

export const socialLinkSchema = z.object({
  linkedin: z
    .string()
    .url(EDIT_PROFILE_MESSAGES.SOCIALLINKS.LINKEDIN)
    .regex(/^https?:\/\/(www\.)?linkedin\.com\/.*$/, 'Invalid LinkedIn URL')
    .optional()
    .or(z.literal('')),
  github: z
    .string()
    .url(EDIT_PROFILE_MESSAGES.SOCIALLINKS.GITHUB)
    .regex(/^https?:\/\/(www\.)?github\.com\/.*$/, 'Invalid GitHub URL')
    .optional()
    .or(z.literal('')),
  portfolio: z
    .string()
    .url(EDIT_PROFILE_MESSAGES.SOCIALLINKS.PORTFOLIO)
    .optional()
    .transform(value => value ?? '')
    .optional()
    .or(z.literal('')),
})

export const projectSchema = z.object({
  projectTitle: z.string().min(1, EDIT_PROFILE_MESSAGES.PROJECT.PROJECT_TITLE),
  year: z.string().optional().or(z.literal('')),
  projectLink: z.string().optional().or(z.literal('')),
  projectDescription: z
    .string()
    .max(2000, TALENT_ONBOARDING_MESSAGES.ADDITIONALDETAILS.DESCRIPTION.MAX_LENGTH)
    .optional()
    .or(z.literal('')),
})

export const summarySchema = z.object({
  profileSummary: z
    .string()
    .min(50, TALENT_ONBOARDING_MESSAGES.BASICDETAILS.SUMMARY.MIN_LENGTH)
    .max(480, TALENT_ONBOARDING_MESSAGES.BASICDETAILS.SUMMARY.MAX_LENGTH),
})

export const basicDetailsSchema = z.object({
  firstName: z
    .string()
    .min(2, TALENT_ONBOARDING_MESSAGES.BASICDETAILS.FIRSTNAME.MIN_LENGTH)
    .max(20, TALENT_ONBOARDING_MESSAGES.BASICDETAILS.FIRSTNAME.MAX_LENGTH),
  lastName: z
    .string()
    .min(1, TALENT_ONBOARDING_MESSAGES.BASICDETAILS.LASTNAME.MIN_LENGTH)
    .max(20, TALENT_ONBOARDING_MESSAGES.BASICDETAILS.LASTNAME.MAX_LENGTH),
  country: z.string().min(2, TALENT_ONBOARDING_MESSAGES.BASICDETAILS.COUNTRY.REQUIRED),
  city: z.string().min(2, TALENT_ONBOARDING_MESSAGES.BASICDETAILS.CITY.REQUIRED),
  preference: z.object({
    employmentPreference: z
      .string()
      .min(1, TALENT_ONBOARDING_MESSAGES.WORKDETAILS.EMPLOYMENTPREFERENCE.REQUIRED),
    hoursPerWeek: z.preprocess(
      val => Number(val),
      z
        .number({ message: 'Invalid hoursPerWeek' })
        .min(1, TALENT_ONBOARDING_MESSAGES.WORKDETAILS.HOURSPERWEEK.REQUIRED)
    ),
    desiredSalary: z.object({
      currency: z.string().min(1, TALENT_ONBOARDING_MESSAGES.WORKDETAILS.CURRENCY.REQUIRED),
      price: z.preprocess(
        val => Number(val),
        z
          .number({ message: 'Invalid price' })
          .min(1, TALENT_ONBOARDING_MESSAGES.WORKDETAILS.AMOUNT.REQUIRED)
      ),
    }),
    availableHours: z.object({
      from: z.string().min(1, TALENT_ONBOARDING_MESSAGES.WORKDETAILS.FROM.REQUIRED),
      to: z.string().min(1, TALENT_ONBOARDING_MESSAGES.WORKDETAILS.TO.REQUIRED),
    }),
  }),
})

export const certificationSchema = z.object({
  title: z.string().min(1, 'Certificate title is required'),
  issuedBy: z.string().optional().or(z.literal('')),
  issuedDate: z.string().optional().or(z.literal('')),
  uploadCertificate: z.union([
    z.array(
      z
        .instanceof(File)
        .refine(
          file => file.size <= 5 * 1024 * 1024, // Max 5MB file size
          'File size must be less than 5MB'
        )
        .refine(
          file =>
            [
              'application/pdf',
              'application/msword',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ].includes(file.type),
          'Only DOC and PDF files are allowed'
        )
    ),
    z.string().optional().or(z.literal('')),
    z.null(),
  ]),
  website: z.string().optional().or(z.literal('')),
})

export const resumeSchema = z.object({
  resume: z.union([
      z
        .instanceof(File, { message: TALENT_ONBOARDING_MESSAGES.BASICDETAILS.RESUME.REQUIRED })
        .refine(
          file => file.size <= 5 * 1024 * 1024,
          TALENT_ONBOARDING_MESSAGES.BASICDETAILS.RESUME.SIZE
        )
        .refine(
          file =>
            [
              'application/msword',
              'application/pdf',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ].includes(file.type),
          TALENT_ONBOARDING_MESSAGES.BASICDETAILS.RESUME.INVALID
        ),
      z.string(),
    ]),
})
