export const COMPANY_VALIDATION_MESSAGES = {
  COMPANY: {
    NAME_MIN: 'Company name must be at least 2 characters',
    WEBSITE: 'Invalid website URL',
    DESIGNATION: 'Designation is required',
    INDUSTRY_TYPE: 'Industry Type is required',
    PROJECT_SCALE: 'Project Scale is required',
    BUSINESS_TYPE: 'Business Type is required for companies',
  },
  VERIFICATION: {
    COUNTRY: 'Country is required',
    PAN: 'PAN Number must be in a valid format (e.g., ABCDE1234F)',
    TIN: 'TIN must be a numeric value between 8 and 20 digits',
    AADHAR: 'Aadhar Card must be exactly 12 digits',
    COMPANY_TYPE: 'Company type is required for a company',
  },
  ADD: {
    SUCCESS: { title: 'Successfully Completed, Thank You' },
  },
}

export const COMPANY_DASHBOARD_VALIDATION_MESSAGES = {
  CREATE_PROJECT: {
    PROJECT_NAME: 'Project name must be at least 2 characters',
    INDUSTRY_TYPE: 'Industry type is required',
    PROJECT_TYPE: 'Project type is required',
    DURATION: 'Duration is required',
    CURRENCY: 'Currency is required',
    REQUIRED: 'Required'
  },
  ADD_POST_REQUIREMENT: {
    DESIGNATION: 'Designation is required',
    WORK_EXPERIENCE: 'Experience is required',
    CANDIDATES: 'Candidates count is required',
    WORK_DURATION: 'Duration is required'
  }
}
