import * as z from 'zod'
import { VALIDATION_MESSAGES, TALENT_ONBOARDING_MESSAGES } from '@/lib/config/messages'

export const talentFormSchema = z
  .object({
    firstName: z
      .string()
      .min(2, VALIDATION_MESSAGES.FIRSTNAME.MIN_LENGTH)
      .max(50, VALIDATION_MESSAGES.FIRSTNAME.MAX_LENGTH),
    middleName: z.string().optional().or(z.literal('')),
    lastName: z
      .string()
      .min(1, VALIDATION_MESSAGES.LASTNAME.MIN_LENGTH)
      .max(50, VALIDATION_MESSAGES.LASTNAME.MAX_LENGTH),
    email: z.string().email(VALIDATION_MESSAGES.EMAIL.REQUIRED),
    password: z
      .string()
      .min(8, VALIDATION_MESSAGES.PASSWORD.MIN_LENGTH)
      .regex(/[A-Z]/, VALIDATION_MESSAGES.PASSWORD.UPPERCASE)
      .regex(/[a-z]/, VALIDATION_MESSAGES.PASSWORD.LOWERCASE)
      .regex(/[0-9]/, VALIDATION_MESSAGES.PASSWORD.NUMBER)
      .regex(/[^A-Za-z0-9]/, VALIDATION_MESSAGES.PASSWORD.SPECIAL),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: VALIDATION_MESSAGES.PASSWORD.MATCH,
    path: ['confirmPassword'],
  })

export const companyFormSchema = z
  .object({
    companyName: z
      .string()
      .min(2, VALIDATION_MESSAGES.COMPANY.MIN_LENGTH)
      .max(100, VALIDATION_MESSAGES.COMPANY.MAX_LENGTH),
    email: z.string().email(VALIDATION_MESSAGES.EMAIL.REQUIRED),
    password: z
      .string()
      .min(8, VALIDATION_MESSAGES.PASSWORD.MIN_LENGTH)
      .regex(/[A-Z]/, VALIDATION_MESSAGES.PASSWORD.UPPERCASE)
      .regex(/[a-z]/, VALIDATION_MESSAGES.PASSWORD.LOWERCASE)
      .regex(/[0-9]/, VALIDATION_MESSAGES.PASSWORD.NUMBER)
      .regex(/[^A-Za-z0-9]/, VALIDATION_MESSAGES.PASSWORD.SPECIAL),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: VALIDATION_MESSAGES.PASSWORD.MATCH,
    path: ['confirmPassword'],
  })

export const resetPasswordSchema = z.object({
  email: z.string().email(VALIDATION_MESSAGES.EMAIL.REQUIRED),
})

export const verifyOtpSchema = z
  .object({
    otp: z.string().length(4, VALIDATION_MESSAGES.OTP.LENGTH),
    password: z
      .string()
      .min(8, VALIDATION_MESSAGES.PASSWORD.MIN_LENGTH)
      .regex(/[A-Z]/, VALIDATION_MESSAGES.PASSWORD.UPPERCASE)
      .regex(/[a-z]/, VALIDATION_MESSAGES.PASSWORD.LOWERCASE)
      .regex(/[0-9]/, VALIDATION_MESSAGES.PASSWORD.NUMBER)
      .regex(/[^A-Za-z0-9]/, VALIDATION_MESSAGES.PASSWORD.SPECIAL),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: VALIDATION_MESSAGES.PASSWORD.MATCH,
    path: ['confirmPassword'],
  })

export const talentBasicDetailsFormSchema = z.object({
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
  profileImage: z
    .instanceof(File)
    .refine(
      file => file.size <= 5 * 1024 * 1024,
      TALENT_ONBOARDING_MESSAGES.BASICDETAILS.PROFILEIMAGE.SIZE
    )
    .refine(
      file => ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type),
      TALENT_ONBOARDING_MESSAGES.BASICDETAILS.PROFILEIMAGE.INVALID
    )
    .optional()
    .nullable(),
  firstName: z
    .string()
    .min(2, TALENT_ONBOARDING_MESSAGES.BASICDETAILS.FIRSTNAME.MIN_LENGTH)
    .max(20, TALENT_ONBOARDING_MESSAGES.BASICDETAILS.FIRSTNAME.MAX_LENGTH),
  middleName: z.string().optional().or(z.literal('')),
  lastName: z
    .string()
    .min(1, TALENT_ONBOARDING_MESSAGES.BASICDETAILS.LASTNAME.MIN_LENGTH)
    .max(20, TALENT_ONBOARDING_MESSAGES.BASICDETAILS.LASTNAME.MAX_LENGTH),
  email: z.string().email(TALENT_ONBOARDING_MESSAGES.BASICDETAILS.EMAIL.REQUIRED),
  phoneNumber: z
    .string()
    .min(10, TALENT_ONBOARDING_MESSAGES.BASICDETAILS.PHONE.MIN_LENGTH)
    .max(15, TALENT_ONBOARDING_MESSAGES.BASICDETAILS.PHONE.MAX_LENGTH)
    .regex(/^\+?[1-9]\d{9,14}$/, TALENT_ONBOARDING_MESSAGES.BASICDETAILS.PHONE.INVALID),
  gender: z.string().min(1, TALENT_ONBOARDING_MESSAGES.BASICDETAILS.GENDER.REQUIRED),
  dateOfBirth: z
    .string()
    .min(10, TALENT_ONBOARDING_MESSAGES.BASICDETAILS.DOB.REQUIRED)
    .regex(
      /^\d{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$/,
      TALENT_ONBOARDING_MESSAGES.BASICDETAILS.DOB.INVALID
    ),
  country: z.string().min(2, TALENT_ONBOARDING_MESSAGES.BASICDETAILS.COUNTRY.REQUIRED),
  city: z.string().min(2, TALENT_ONBOARDING_MESSAGES.BASICDETAILS.CITY.REQUIRED),
  summary: z
    .string()
    .min(50, TALENT_ONBOARDING_MESSAGES.BASICDETAILS.SUMMARY.MIN_LENGTH)
    .max(480, TALENT_ONBOARDING_MESSAGES.BASICDETAILS.SUMMARY.MAX_LENGTH),
  linkedin: z
    .string()
    .url(TALENT_ONBOARDING_MESSAGES.BASICDETAILS.LINKEDIN.REQUIRED)
    .regex(
      /^https?:\/\/(www\.)?linkedin\.com\/.*$/,
      TALENT_ONBOARDING_MESSAGES.BASICDETAILS.LINKEDIN.INVALID
    )
    .optional()
    .or(z.literal('')),

  github: z
    .string()
    .url(TALENT_ONBOARDING_MESSAGES.BASICDETAILS.GITHUB.REQUIRED)
    .regex(
      /^https?:\/\/(www\.)?github\.com\/.*$/,
      TALENT_ONBOARDING_MESSAGES.BASICDETAILS.GITHUB.INVALID
    )
    .optional()
    .or(z.literal('')),

  portfolio: z
    .string()
    .url(TALENT_ONBOARDING_MESSAGES.BASICDETAILS.PORTFOLIO.REQUIRED)
    .optional()
    .transform(value => value ?? '')
    .optional()
    .or(z.literal('')),
})

export const talentWorkExperienceFormSchema = z
  .object({
    companyName: z.string().min(1, TALENT_ONBOARDING_MESSAGES.WORKDETAILS.COMPANY_NAME.REQUIRED),
    designation: z.string().min(1, TALENT_ONBOARDING_MESSAGES.WORKDETAILS.DESIGNATION.REQUIRED),
    workingSinceYear: z
      .string()
      .min(4, TALENT_ONBOARDING_MESSAGES.WORKDETAILS.WORKINGSINCEYEAR.REQUIRED),
    workingSinceMonth: z
      .string()
      .min(1, TALENT_ONBOARDING_MESSAGES.WORKDETAILS.WORKINGSINCEMONTH.REQUIRED),
    workingTillYear: z.string().optional(), // Can be empty, but validation will check it later
    workingTillMonth: z.string().optional(),
    description: z
      .string()
      .min(50, TALENT_ONBOARDING_MESSAGES.WORKDETAILS.DESCRIPTION.MIN_LENGTH)
      .max(2000, TALENT_ONBOARDING_MESSAGES.WORKDETAILS.DESCRIPTION.MAX_LENGTH),
    currentlyWorking: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (!data.currentlyWorking) {
      if (!data.workingTillYear || data.workingTillYear.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: TALENT_ONBOARDING_MESSAGES.WORKDETAILS.WORKINGSINCEYEAR.REQUIRED,
          path: ['workingTillYear'],
        })
      }
      if (!data.workingTillMonth || data.workingTillMonth.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: TALENT_ONBOARDING_MESSAGES.WORKDETAILS.WORKINGSINCEMONTH.REQUIRED,
          path: ['workingTillMonth'],
        })
      }
    }
  })

export const preferencesSchema = z.object({
  employmentPreference: z
    .string()
    .min(1, TALENT_ONBOARDING_MESSAGES.WORKDETAILS.EMPLOYMENTPREFERENCE.REQUIRED),
  hoursPerWeek: z.preprocess(
    val => Number(val),
    z
      .number({ message: 'Invalid hoursPerWeek' })
      .min(1, TALENT_ONBOARDING_MESSAGES.WORKDETAILS.HOURSPERWEEK.REQUIRED)
      .max(90, TALENT_ONBOARDING_MESSAGES.WORKDETAILS.HOURSPERWEEK.MAX)
  ),
  desiredSalary: z.object({
    currency: z.string().min(1, TALENT_ONBOARDING_MESSAGES.WORKDETAILS.CURRENCY.REQUIRED),
    price: z.preprocess(
      val => Number(val),
      z
        .number({ message: 'Invalid price' })
        .min(1, TALENT_ONBOARDING_MESSAGES.WORKDETAILS.AMOUNT.REQUIRED)
        .max(5000, TALENT_ONBOARDING_MESSAGES.WORKDETAILS.AMOUNT.MAX)
    ),
  }),
  availableHours: z.object({
    from: z.string().min(1, TALENT_ONBOARDING_MESSAGES.WORKDETAILS.FROM.REQUIRED),
    to: z.string().min(1, TALENT_ONBOARDING_MESSAGES.WORKDETAILS.TO.REQUIRED),
  }),
})

export const talentEducationFormSchema = z.object({
  university: z.string().min(1, TALENT_ONBOARDING_MESSAGES.EDUCATIONDETAILS.INSTITUTION.REQUIRED),
  degree: z.string().min(1, TALENT_ONBOARDING_MESSAGES.EDUCATIONDETAILS.DEGREE.REQUIRED),
  specialization: z
    .string()
    .min(1, TALENT_ONBOARDING_MESSAGES.EDUCATIONDETAILS.SPECIALIZATION.REQUIRED),
  passingOutYear: z
    .string()
    .min(1, TALENT_ONBOARDING_MESSAGES.EDUCATIONDETAILS.DEGREE_COMPLETION.REQUIRED),
})
export const talentCertificationFormSchema = z.object({
  title: z.string().optional().or(z.literal('')),
  issuedBy: z.string().optional().or(z.literal('')),
  issuedDate: z.string().optional().or(z.literal('')),
  uploadCertificate: z.union([
    z
      .instanceof(File)
      .refine(
        file => file.size <= 5 * 1024 * 1024,
        TALENT_ONBOARDING_MESSAGES.EDUCATIONDETAILS.CERTIFICATE.SIZE
      )
      .refine(
        file =>
          [
            'application/msword',
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          ].includes(file.type),
        TALENT_ONBOARDING_MESSAGES.EDUCATIONDETAILS.CERTIFICATE.INVALID
      ),
    z.null(),
    z.string().optional().or(z.literal('')),
  ]),
  certificateLink: z
    .string()
    .regex(
      /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/,
      TALENT_ONBOARDING_MESSAGES.EDUCATIONDETAILS.CERTIFICATELINK.INVALID
    )
    .optional()
    .or(z.literal('')),
})

export const talentLanguagesFormSchema = z.object({
  language: z.string().min(2, TALENT_ONBOARDING_MESSAGES.ADDITIONALDETAILS.LANGUAGE.REQUIRED),
  proficiency: z.string().min(2, TALENT_ONBOARDING_MESSAGES.ADDITIONALDETAILS.PROFICIENCY.REQUIRED),
})

export const talentProjectsFormSchema = z.object({
  title: z.string().optional().or(z.literal('')),
  year: z.string().optional().or(z.literal('')),
  projectLink: z.string().optional().or(z.literal('')),
  technicalSkillUsed: z.preprocess(
    val => (typeof val === 'string' ? val.split(',').map(skill => skill.trim()) : []),
    z.array(z.string()).optional()
  ),

  description: z
    .string()
    .max(2000, TALENT_ONBOARDING_MESSAGES.ADDITIONALDETAILS.DESCRIPTION.MAX_LENGTH)
    .optional()
    .or(z.literal('')),
})
