export const AUTH_MESSAGES = {
  LOGIN: {
    SUCCESS: { title: 'Welcome back!', description: 'You have successfully logged in.' },
    ERROR: { title: 'Error', description: 'Invalid credentials. Please try again.' },
  },
  SIGNUP: {
    VERIFICATION_REQUIRED: {
      title: 'Verification required',
      description: 'Please check your email for a verification code.',
    },
    SUCCESS: {
      title: 'Success!',
      description: 'Your account has been verified. You can now sign in.',
    },
    ERROR: { title: 'Error', description: 'Something went wrong. Please try again.' },
  },
  OTP: {
    RESEND: {
      SUCCESS: {
        title: 'Code resent',
        description: 'A new verification code has been sent to your email.',
      },
      ERROR: { title: 'Error', description: 'Failed to resend code. Please try again.' },
    },
    VERIFY: {
      ERROR: { title: 'Error', description: 'Invalid verification code. Please try again.' },
    },
  },
  RESET_PASSWORD: {
    CODE_SENT: {
      title: 'Check your email',
      description: "We've sent you a 4-digit code to verify your identity.",
    },
    CODE_RESENT: {
      title: 'Code resent',
      description: 'A new verification code has been sent to your email.',
    },
    SUCCESS: {
      title: 'Password reset successful',
      description: 'Your password has been reset. Please sign in with your new password.',
    },
    REQUEST: {
      ERROR: { title: 'Error', description: 'Failed to send reset code. Please try again.' },
    },
    VERIFY: {
      ERROR: { title: 'Error', description: 'Failed to reset password. Please try again.' },
    },
  },
  LOGOUT: {
    SUCCESS: { title: 'Signed out', description: 'You have been signed out successfully.' },
    ERROR: { title: 'Error', description: 'Failed to sign out.' },
  },
  UNAUTHORIZE: {
    ERROR: {
      title: 'Error',
      description: 'Unauthorized access, please login before accessing the content',
    },
  },
}

export const API_MESSAGES = {
  NETWORK_ERROR: {
    title: 'Connection Error',
    description: 'Unable to connect to the server. Please check your connection and try again.',
  },
  SERVER_ERROR: {
    title: 'Server Error',
    description: 'An unexpected server error occurred. Please try again later.',
  },
  SESSION_EXPIRED: {
    title: 'Session Expired',
    description: 'Your session has expired. Please sign in again.',
  },
  ACCESS_DENIED: {
    title: 'Access Denied',
    description: "You don't have permission to access this resource.",
  },
  NOT_FOUND: { title: 'Not Found', description: 'The requested resource was not found.' },
  VALIDATION_ERROR: {
    title: 'Validation Error',
    description: 'Please check your input and try again.',
  },
  UNKNOWN_ERROR: { title: 'Error', description: 'An unexpected error occurred. Please try again.' },
  INVALID_RESPONSE: { title: 'Error', description: 'Invalid response from server.' },
}

export const PROFILE_MESSAGES = {
  UPDATE: {
    SUCCESS: {
      title: 'Profile updated',
      description: 'Your profile has been updated successfully.',
    },
    ERROR: { title: 'Error', description: 'Failed to update profile.' },
  },
  LOAD: {
    ERROR: { title: 'Error', description: 'Failed to load profile data.' },
  },
  AVATAR: {
    UPLOAD: {
      SUCCESS: { title: 'Success', description: 'Profile picture updated successfully.' },
      ERROR: { title: 'Error', description: 'Failed to upload profile picture.' },
    },
    DELETE: {
      SUCCESS: { title: 'Success', description: 'Profile picture removed successfully.' },
      ERROR: { title: 'Error', description: 'Failed to remove profile picture.' },
    },
    VALIDATION: {
      SIZE: { title: 'Error', description: 'Please upload an image smaller than 5MB.' },
      TYPE: { title: 'Error', description: 'Please upload an image file.' },
    },
  },
}

export const VALIDATION_MESSAGES = {
  EMAIL: { REQUIRED: 'Please enter a valid email address' },
  PASSWORD: {
    MIN_LENGTH: 'Password must be at least 8 characters',
    UPPERCASE: 'Password must contain at least one uppercase letter',
    LOWERCASE: 'Password must contain at least one lowercase letter',
    NUMBER: 'Password must contain at least one number',
    SPECIAL: 'Password must contain at least one special character',
    MATCH: "Passwords don't match",
  },
  FIRSTNAME: {
    MIN_LENGTH: 'First name must be at least 2 characters',
    MAX_LENGTH: 'First name must be less than 50 characters',
  },
  LASTNAME: {
    MIN_LENGTH: 'Last name must be at least 1 characters',
    MAX_LENGTH: 'Last name must be less than 50 characters',
  },
  COMPANY: {
    MIN_LENGTH: 'Company name must be at least 2 characters',
    MAX_LENGTH: 'Company name must be less than 100 characters',
  },
  OTP: { LENGTH: 'Please enter a valid 4-digit code' },
}

export const TALENT_ONBOARDING_MESSAGES = {
  AUTH: {
    BASICDETAILS: {
      SUCCESS: { title: 'Success', description: 'Profile has been updated updated successfully.' },
      ERROR: { title: 'Error', description: 'Failed to update the profile.' },
    },
    WORKDETAILS: {
      SUCCESS: { title: 'Success', description: 'Profile has been updated updated successfully.' },
      ERROR: { title: 'Error', description: 'Failed to update the profile.' },
    },
    EDUCATIONDETAILS: {
      SUCCESS: { title: 'Success', description: 'Profile has been updated updated successfully.' },
      ERROR: { title: 'Error', description: 'Failed to update the profile.' },
    },
    ADDITIONALDETAILS: {
      SUCCESS: { title: 'Success', description: 'Profile has been updated updated successfully.' },
      ERROR: { title: 'Error', description: 'Failed to update the profile.' },
    },
  },
  BASICDETAILS: {
    RESUME: {
      REQUIRED: 'Resume is required',
      SIZE: 'File size must be less than 5MB',
      INVALID: 'Only DOC and PDF files are allowed',
    },
    PROFILEIMAGE: {
      REQUIRED: 'Profile Image is required',
      SIZE: 'File size must be less than 5MB',
      INVALID: 'Only JPG, JPEG, and PNG images are allowed',
    },
    FIRSTNAME: {
      MIN_LENGTH: 'First Name must be at least 2 characters',
      MAX_LENGTH: 'First Name cannot exceed 50 characters',
    },
    LASTNAME: {
      MIN_LENGTH: 'Last Name must be at least 1 character',
      MAX_LENGTH: 'Last Name cannot exceed 50 characters',
    },
    EMAIL: { REQUIRED: 'Please enter a valid email address' },
    PHONE: {
      MIN_LENGTH: 'Phone number must be at least 10 digits',
      MAX_LENGTH: 'Phone number cannot exceed 15 digits',
      INVALID: 'Phone number can only contain numbers',
    },
    GENDER: { REQUIRED: 'Please select your gender.' },
    DOB: {
      REQUIRED: 'Please select your date of birth.',
      INVALID: 'Date of birth must be in DD/MM/YYYY format.',
    },
    COUNTRY: { REQUIRED: 'Please select your country.' },

    CITY: {
      REQUIRED: 'City is required',
    },
    SUMMARY: {
      MIN_LENGTH: 'Profile Summary must be at least 50 characters',
      MAX_LENGTH: 'Profile Summary cannot exceed 480 characters',
    },
    LINKEDIN: {
      REQUIRED: 'Enter a valid LinkedIn URL',
      INVALID: 'Invalid LinkedIn URL',
    },
    GITHUB: {
      REQUIRED: 'Enter a valid GitHub URL',
      INVALID: 'Invalid GitHub URL',
    },
    PORTFOLIO: {
      REQUIRED: 'Enter a valid portfolio URL',
    },
  },
  WORKDETAILS: {
    COMPANY_NAME: {
      REQUIRED: 'Company name is required',
    },
    DESIGNATION: { REQUIRED: 'Designation is required' },
    WORKINGSINCEYEAR: {
      REQUIRED: 'Required',
    },
    WORKINGSINCEMONTH: {
      REQUIRED: 'Required',
    },
    DESCRIPTION: {
      MIN_LENGTH: 'Profile Summary must be at least 50 characters',
      MAX_LENGTH: 'Profile Summary cannot exceed 2000 characters',
    },
    EMPLOYMENTPREFERENCE: { REQUIRED: 'Employment preference is required' },
    HOURSPERWEEK: {
      REQUIRED: 'Number of hours per week is required',
      MAX: 'Number of hours per week cannot exceed 90 hours',
    },
    CURRENCY: { REQUIRED: 'Currency is required' },
    AMOUNT: {
      REQUIRED: 'Salary amount is required',
      RESTRICTION: 'Salary must be a number',
      MAX: 'Exceeds max salary per hours',
    },
    FROM: { REQUIRED: 'Start time is required' },
    TO: { REQUIRED: 'End time is required' },
  },
  EDUCATIONDETAILS: {
    INSTITUTION: {
      REQUIRED: 'Institution name is required',
    },
    SPECIALIZATION: {
      REQUIRED: 'Field of study is required',
    },
    DEGREE: {
      REQUIRED: 'Degree is required',
    },
    DEGREE_COMPLETION: {
      REQUIRED: 'Year of pass out is required',
      INVALID: 'Degree completion date must be in DD/MM/YYYY format.',
    },
    CERTIFICATE: {
      SIZE: 'File size must be less than 5MB',
      INVALID: 'Only DOC and PDF files are allowed',
    },
    CERTIFICATELINK: {
      INVALID: 'Invalid certificate URL',
    },
  },
  ADDITIONALDETAILS: {
    LANGUAGE: {
      REQUIRED: 'Language is required',
    },
    PROFICIENCY: {
      REQUIRED: 'Proficiency is required',
    },
    DESCRIPTION: {
      MIN_LENGTH: 'Description must be at least 50 characters',
      MAX_LENGTH: 'Description cannot exceed 2000 characters',
    },
  },
}
